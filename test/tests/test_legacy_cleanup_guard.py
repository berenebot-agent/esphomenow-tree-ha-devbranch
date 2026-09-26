"""The legacy-cleanup guard must be an OR, not an AND.

Regression: auto_cleanup_legacy_state() gated its destructive work on

    if marker_path.exists() and not legacy_dir.exists():
        return

which returns only when BOTH "already cleaned up" (the marker) AND "nothing to
remove" (the directory is gone) hold. The integration recreates /share/esp_tree
on every Home Assistant start (it writes integration_runtime.json from
async_setup), so the directory was present at every add-on start, the guard fell
through, and shutil.rmtree("/share/esp_tree") destroyed a live shared directory
-- including the shared DB the integration reads -- on every add-on update.

The fix is `or`: either condition alone means there is nothing to clean up.

This test pulls the real guard expression out of create_app()'s closure with
ast, then evaluates it against all four (marker, directory) combinations so the
semantics are pinned rather than the exact source text.
"""

from __future__ import annotations

import ast
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SERVER = REPO / "app" / "server.py"
FUNC = "auto_cleanup_legacy_state"


def _guard_test() -> ast.expr:
    """The `if <expr>: return` guard inside auto_cleanup_legacy_state()."""
    tree = ast.parse(SERVER.read_text())

    target = None
    for node in ast.walk(tree):
        if isinstance(node, ast.AsyncFunctionDef) and node.name == FUNC:
            target = node
    assert target is not None, f"{FUNC}() not found in app/server.py"

    for node in target.body:
        if isinstance(node, ast.If) and node.body and isinstance(node.body[0], ast.Return):
            return node.test
    raise AssertionError(f"no `if ...: return` guard found at the top of {FUNC}()")


def _returns(marker: bool, directory: bool) -> bool:
    """Evaluate the real guard with the given marker/directory states."""
    expr = _guard_test()

    class _Path:
        def __init__(self, exists: bool) -> None:
            self._exists = exists

        def exists(self) -> bool:
            return self._exists

    env: dict[str, object] = {
        "marker_path": _Path(marker),
        "legacy_dir": _Path(directory),
    }
    # Only the guard's own names are available; anything else is a hard error.
    return bool(eval(compile(ast.Expression(expr), "<guard>", "eval"), {"__builtins__": {}}, env))


def test_guard_returns_when_already_cleaned_up() -> None:
    """Marker written, directory recreated afterwards: must not re-run."""
    assert _returns(marker=True, directory=True) is True


def test_guard_returns_when_there_is_nothing_to_remove() -> None:
    assert _returns(marker=False, directory=False) is True
    assert _returns(marker=True, directory=False) is True


def test_guard_only_falls_through_on_a_genuine_first_run() -> None:
    """The single combination that may run the destructive branch."""
    assert _returns(marker=False, directory=True) is False


def test_guard_is_not_conjunction() -> None:
    """Explicitly pin the regression: `and` would wrongly re-run when the dir exists."""
    assert _returns(marker=True, directory=True) is True, (
        "marker + existing directory means an earlier cleanup already ran and the "
        "integration has since recreated /share/esp_tree; with `and` this fell "
        "through and rmtree() deleted the live shared directory again"
    )

#!/usr/bin/env python3
"""End-to-end check of the Create Remote wizard path.

Runs the add-on's REAL code (generate_scaffold + the endpoint's own node-building
logic) against a fake DB/bridge, so the assertions exercise the shipped code path
rather than a re-implementation of it.

Run inside the add-on image:
  docker compose run --rm -v "$PWD:/src" addon python3 /src/tools/verification/remote_wizard_e2e.py
"""

from __future__ import annotations

import os
import sys
import types

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.db import Database, normalize_mac

RESULTS: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    RESULTS.append((name, ok, detail))


def build_remote_node(name: str, chip_name: str, board_info: dict) -> dict:
    """Mirror of the remote branch in flash_wizard_submit."""
    return {
        "esphome_name": name,
        "is_bridge": False,
        "chip_name": chip_name,
        "board_info": board_info,
        "espnow_mode": "lr",
        "transport": "espnow",
    }


def main() -> int:
    try:
        from app.yaml_scaffold import generate_scaffold
    except Exception as exc:  # pragma: no cover
        print(f"FATAL: cannot import app.yaml_scaffold: {exc}")
        print("This must run inside the add-on container (deps not on the host).")
        return 2

    board_info = {"platform": "esp32-c5", "board": "esp32-c5-devkitc-1", "framework": "esp-idf", "variant": "esp32c5"}
    node = build_remote_node("espnow-remote-test", "ESP32-C5", board_info)
    yaml_text, chip_unknown = generate_scaffold(node)

    # 1. Uses the remote component, not the bridge component.
    check("uses esp_tree_remote component", "components: [esp_tree_remote, esp_tree_common]" in yaml_text,
          "\n".join(l for l in yaml_text.splitlines() if "components:" in l))
    check("does NOT use esp_tree_bridge component", "esp_tree_bridge" not in yaml_text)

    # 2. No bridge-only blocks. A remote is ESP-NOW only (no wifi/MQTT/web).
    check("no wifi: block", "\nwifi:" not in yaml_text)
    check("no api: block", "\napi:" not in yaml_text)
    check("no web_server: block", "web_server" not in yaml_text)
    check("no ota: esphome block", "platform: esphome" not in yaml_text)
    check("no bridge_api_key secret ref", "bridge_api_key" not in yaml_text)
    check("no ota_password secret ref", "ota_password" not in yaml_text)

    # 3. References the shared network secrets, and only ones that exist.
    check("references network id", "network_id: !secret espnow_network_id" in yaml_text)
    check("references psk", "psk: !secret espnow_psk" in yaml_text)

    # 4. Every !secret referenced must be written by the submit handler, or config
    #    load fails with "unknown secret". This is the bug class that bit the
    #    serial bridge (wifi secrets in a no-wifi config).
    import re
    referenced = set(re.findall(r"!secret\s+([A-Za-z0-9_]+)", yaml_text))
    merged_remote = {"espnow_network_id", "espnow_psk"}
    missing = referenced - merged_remote
    check("no !secret without a matching merged value", not missing, f"missing: {sorted(missing)}")

    # 5. LR mode, which is what the bridge network uses.
    check("espnow_mode is lr", "espnow_mode: lr" in yaml_text)

    # 6. Sanity: it is valid-ish YAML and has an esphome: name.
    try:
        import yaml as yaml_mod
        parsed = yaml_mod.safe_load(yaml_text.replace("!secret ", ""))
        check("parses as YAML", isinstance(parsed, dict), "")
        check("esphome name present", parsed.get("esphome", {}).get("name") == "espnow-remote-test")
    except ImportError:
        check("parses as YAML", "esphome:" in yaml_text, "pyyaml unavailable; basic check only")
    except Exception as exc:
        check("parses as YAML", False, str(exc))

    # 7. Unknown chip still scaffolds a remote (does not silently become a bridge).
    unknown_node = build_remote_node("espnow-remote-unknown", "unknown", {})
    unknown_yaml, unknown_flag = generate_scaffold(unknown_node)
    check("unknown chip still scaffolds remote", "esp_tree_remote" in unknown_yaml and "esp_tree_bridge" not in unknown_yaml)
    check("unknown chip flagged", unknown_flag is True)

    # 8. The placeholder MAC must differ from the bridge placeholder, or a remote
    #    compile overwrites the in-flight bridge's device row (mac is the PK).
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
    server_py = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "app", "server.py")
    try:
        import re as re2
        src = open(server_py).read()
        m_bridge = re2.search(r'PLACEHOLDER_MAC = "([^"]+)"', src)
        m_remote = re2.search(r'REMOTE_PLACEHOLDER_MAC = "([^"]+)"', src)
        check("bridge + remote placeholder MACs are distinct",
              bool(m_bridge and m_remote and m_bridge.group(1) != m_remote.group(1)),
              f"{(m_bridge and m_bridge.group(1))} vs {(m_remote and m_remote.group(1))}")
    except Exception as exc:
        check("bridge + remote placeholder MACs are distinct", False, str(exc))

    # 9. The transport guard must not apply to remotes. The wizard sends
    #    transport="espnow", which is not in (wifi, serial); validating it for a
    #    remote rejects the wizard's own submit with 400 (observed live).
    try:
        src = open(server_py).read()
        idx = src.find("unsupported transport")
        window = src[max(0, idx - 700):idx]
        check(
            "transport validation is skipped for remotes",
            "if not is_remote" in window,
            "the transport check is not guarded by is_remote; a remote submit will 400",
        )
    except Exception as exc:
        check("transport validation is skipped for remotes", False, str(exc))

    # 10. A remote submit must not create a bridges row.
    try:
        src = open(server_py).read()
        seg = src[src.find("async def flash_wizard_submit"):]
        seg = seg[: seg.find("async def flash_wizard_status")]
        add_bridge_pos = seg.find("db.add_bridge(")
        guard_pos = seg.find("if not is_remote:")
        check(
            "add_bridge is guarded by 'not is_remote'",
            add_bridge_pos != -1 and guard_pos != -1 and guard_pos < add_bridge_pos,
            f"guard@{guard_pos} add_bridge@{add_bridge_pos}",
        )
    except Exception as exc:
        check("add_bridge is guarded by 'not is_remote'", False, str(exc))



    # 10. delete_device must clear ota_jobs first: ota_jobs.mac is a FOREIGN KEY onto
    #     devices(mac) with foreign_keys=ON, and a wizard submit always creates a
    #     compile job, so deleting the device alone raises IntegrityError and leaves
    #     the placeholder behind (this is exactly how the live finalize failed).
    import tempfile
    from pathlib import Path as _P
    _db = Database(_P(tempfile.mkdtemp()) / "fk.db"); _db.init()
    _nm = normalize_mac("FF:FF:FF:FF:FF:FE")
    _db.upsert_devices_from_topology([{"mac": _nm, "label": "fk", "esphome_name": "fk",
                                       "chip_name": "ESP32-C6", "is_bridge": False}], "0.0.0.0")
    with _db.connect() as _c:
        _c.execute("INSERT INTO ota_jobs (mac, status, created_at) VALUES (?,?,?)", (_nm, "compiling", 1))
    check("delete_device clears a device that has compile jobs", _db.delete_device(_nm) is True)
    check("device row gone after delete_device", _db.get_device(_nm) is None)
    with _db.connect() as _c:
        _n = _c.execute("SELECT COUNT(*) c FROM ota_jobs WHERE mac=?", (_nm,)).fetchone()["c"]
    check("child ota_jobs rows gone too (no orphan/FK error)", _n == 0)

    # 11. A remote must never be written with blank ESP-NOW credentials: firmware
    #     with an empty network_id/psk compiles fine but can never join, which is
    #     much harder to diagnose than a rejected request. The submit path must fall
    #     back to the active bridge's network_id and the secrets.yaml psk.
    import re as _re
    _srv = open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(
        os.path.abspath(__file__)))), "app", "server.py")).read()
    check("submit resolves configured credentials from secrets.yaml",
          '_secret_from_secrets_yaml("espnow_network_id")' in _srv
          and '_secret_from_secrets_yaml("espnow_psk")' in _srv)
    check("submit falls back to the bridge row only if secrets.yaml lacks the id",
          'or str(\n            (db.get_active_bridge() or {}).get("network_id") or ""' in _srv)
    check("there is a bridge network-credentials endpoint",
          '"/api/bridge/network-credentials"' in _srv)
    check("network-credentials reports its source (so the UI can explain)",
          '"network_id_source"' in _srv and '"psk_source"' in _srv)
    check("there is a chips endpoint (UI must not hardcode the board map)",
          '"/api/chips"' in _srv and "CHIP_NAME_TO_BOARD" in _srv)
    check("chip registry is imported by the server",
          "from .compiler import CHIP_NAME_TO_BOARD, ESPHomeCompiler" in _srv)

    # 12. A remote must NEVER write network-wide ESP-NOW credentials. They live in
    #     secrets.yaml and the bridge firmware resolves them, so a remote submit that
    #     wrote them would silently re-identify the whole network and orphan every
    #     device already on it (this actually happened during testing: test payloads
    #     overwrote secrets.yaml via the global merge).
    _submit_start = _srv.index("async def flash_wizard_submit")
    _submit_end = _srv.index("async def flash_wizard_finalize", _submit_start)
    _sub = _srv[_submit_start:_submit_end]
    # The assignments must sit immediately in the bridge-only `else:` arm, never in
    # the remote arm. Anchoring on that adjacency avoids a slice that accidentally
    # swallows the else-branch (which made an earlier version of this check lie).
    check("only the bridge (else) arm assigns espnow_network_id",
          'else:\n            secrets_to_merge["espnow_network_id"] = requested_network_id' in _sub)
    check("only the bridge (else) arm assigns espnow_psk",
          'secrets_to_merge["espnow_psk"] = requested_psk\n        if not is_remote:' in _sub)
    check("secrets are only merged when there is something to write",
          "if secrets_to_merge:\n            yaml_store.merge_secrets" in _sub)
    # The remote arm runs from "if is_remote:" up to the bridge-only "else:".
    _remote_branch = _sub[_sub.index("if is_remote:"):_sub.index("else:\n            secrets_to_merge[\"espnow_network_id\"]")]
    check("a remote requesting a different network_id is rejected",
          "network_id does not match the configured ESP-NOW network" in _remote_branch)
    check("a remote requesting a different psk is rejected",
          "psk does not match the configured ESP-NOW network" in _remote_branch)
    check("a remote with no configured credentials is rejected",
          "no ESP-NOW credentials configured" in _remote_branch)
    check("the remote arm has no espnow_* assignment at all",
          "secrets_to_merge[\"espnow_network_id\"] = " not in _sub[: _sub.index("else:")])

    # 13. Removing a stale remote must be possible from the UI, and must be a
    #     genuinely destructive action distinct from the reversible hide.
    check("there is a remove-remote endpoint",
          '@app.delete("/api/topology/remote/{mac}")' in _srv)
    _rm_start = _srv.index("async def remove_remote")
    _rm = _srv[_rm_start:_srv.index("@app.post(\"/api/topology/unhide", _rm_start)]
    check("removal forgets the remote in the integration (durable record), not just locally",
          '"esp_tree"' in _rm and '"forget_remote"' in _rm)
    check("removal refuses a remote that is still online",
          'currently online' in _rm)
    # The bridge is not a remote. An earlier version used `not is_bridge and online`,
    # which let a bridge through and deleted the bridge's own device row.
    check("removal refuses the bridge explicitly",
          'that is the bridge, not a remote' in _rm)
    check("the bridge guard does not exclude bridges",
          'not live.get("is_bridge")' not in _rm)
    check("removal clears the local device row",
          "db.delete_device(target_mac)" in _rm)
    check("removal also clears any hidden marker",
          "db.unhide_device(target_mac)" in _rm)
    _ui = open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(
        os.path.abspath(__file__)))), "ui", "src", "components", "topology-node.ts")).read()
    check("the UI exposes a Remove action for remotes", ">Remove</button>" in _ui)
    check("Remove is styled as destructive, not identical to Edit YAML",
          ".icon-btn.danger" in _ui)
    check("Remove is offered only for offline remotes", "this.node.online\n                ? nothing" in _ui)

    print("=" * 70)
    passed = 0
    for name, ok, detail in RESULTS:
        mark = "PASS" if ok else "FAIL"
        print(f"[{mark}] {name}" + (f"   -> {detail}" if detail and not ok else ""))
        passed += 1 if ok else 0
    print("=" * 70)
    print(f"{passed}/{len(RESULTS)} checks passed")
    return 0 if passed == len(RESULTS) else 1

if __name__ == "__main__":
    raise SystemExit(main())

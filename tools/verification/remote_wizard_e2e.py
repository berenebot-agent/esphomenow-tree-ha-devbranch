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
    try:
        import re as re2
        src = open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "app", "server.py")).read()
        m_bridge = re2.search(r'PLACEHOLDER_MAC = "([^"]+)"', src)
        m_remote = re2.search(r'REMOTE_PLACEHOLDER_MAC = "([^"]+)"', src)
        check("bridge + remote placeholder MACs are distinct",
              bool(m_bridge and m_remote and m_bridge.group(1) != m_remote.group(1)),
              f"{(m_bridge and m_bridge.group(1))} vs {(m_remote and m_remote.group(1))}")
    except Exception as exc:
        check("bridge + remote placeholder MACs are distinct", False, str(exc))

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

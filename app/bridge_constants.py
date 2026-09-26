from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from .bridge_v2_client import BridgeV2Client

API_VERSION = 2
CLIENT_KIND = "ha_integration"
PROTOCOL = "esp-tree-pb"

# Synthetic device/bridge MACs used while a flash-wizard provisioning is in flight.
# The wizard must write a devices row before the real MAC is known, and `devices.mac`
# is the primary key, so the bridge and a remote need separate reserved values or a
# remote compile would overwrite the bridge's row and vice versa.
PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FF"
REMOTE_PLACEHOLDER_MAC = "FF:FF:FF:FF:FF:FE"

BACKOFF_DELAYS = [1, 2, 5, 10]

FrameHandler = Callable[["BridgeV2Client", Any, bytes], Awaitable[None]]
ConnectionHandler = Callable[["BridgeV2Client", bool], Awaitable[None]]

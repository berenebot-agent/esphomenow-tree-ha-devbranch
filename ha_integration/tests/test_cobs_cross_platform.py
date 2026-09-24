"""Cross-platform COBS and protobuf round-trip tests for serial transport.

Verifies that Python's cobs package can encode/decode correctly,
and that protobuf Envelope messages can be COBS-framed and round-tripped.
"""
import pytest
from cobs import cobs

# Import protobuf if available; skip tests if not
try:
    from app.protobuf import esp_tree_runtime_pb2 as pb
    HAS_PROTOBUF = True
except ImportError:
    HAS_PROTOBUF = False


class TestCobsRoundTrip:
    def test_empty_round_trip(self):
        """Empty data round-trips correctly."""
        data = b""
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        assert decoded == data

    def test_simple_data_round_trip(self):
        """Simple byte data round-trips."""
        data = b"\x01\x02\x03\x04\x05"
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        assert decoded == data

    def test_data_with_zeroes(self):
        """Data with embedded zero bytes round-trips."""
        data = b"\x01\x00\x02\x00\x00\x03"
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        assert decoded == data

    def test_long_data_round_trip(self):
        """Long data (10KB) with zeroes round-trips."""
        data = bytes(10000)
        for i in range(50, 10000, 100):
            data = data[:i] + bytes([i % 256]) + data[i+1:]
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        assert decoded == data

    def test_all_zeroes(self):
        """All-zero data round-trips (worst case COBS expansion)."""
        data = b"\x00" * 100
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        assert decoded == data

    def test_decode_error_on_invalid(self):
        """cobs.decode raises on genuinely malformed input.

        Empty input is NOT an error: it is a valid COBS frame that decodes to
        empty, so asserting a raise on b"" fails against every cobs release. Use
        input that actually violates the encoding: a length code claiming more
        bytes than remain.
        """
        with pytest.raises(cobs.DecodeError):
            cobs.decode(b"\x05\x01\x02")


@pytest.mark.skipif(not HAS_PROTOBUF, reason="protobuf not available")
class TestCobsProtobuf:
    def test_heartbeat_envelope_round_trip(self):
        """Protobuf Envelope with heartbeat COBS round-trips."""
        envelope = pb.Envelope()
        envelope.heartbeat.uptime_ms = 12345
        data = envelope.SerializeToString()
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        result = pb.Envelope()
        result.ParseFromString(decoded)
        assert result.heartbeat.uptime_ms == 12345

    def test_auth_response_round_trip(self):
        """Auth response envelope COBS round-trips."""
        envelope = pb.Envelope()
        envelope.auth_response.client_nonce = b"\x01" * 16
        envelope.auth_response.hmac_sha256 = b"\xaa" * 32
        data = envelope.SerializeToString()
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        result = pb.Envelope()
        result.ParseFromString(decoded)
        assert result.auth_response.client_nonce == b"\x01" * 16
        assert result.auth_response.hmac_sha256 == b"\xaa" * 32

    def test_client_hello_round_trip(self):
        """ClientHello envelope COBS round-trips."""
        envelope = pb.Envelope()
        envelope.client_hello.client_kind = "addon"
        data = envelope.SerializeToString()
        encoded = cobs.encode(data)
        decoded = cobs.decode(encoded)
        result = pb.Envelope()
        result.ParseFromString(decoded)
        assert result.client_hello.client_kind == "addon"

    def test_large_topology_envelope(self):
        """Large topology envelope COBS round-trips."""
        envelope = pb.Envelope()
        envelope.topology_changed.reason = "remote_joined"
        envelope.topology_changed.mac = b"\xbb" * 6
        data = envelope.SerializeToString()
        encoded = cobs.encode(data)
        assert len(encoded) < 66000
        decoded = cobs.decode(encoded)
        result = pb.Envelope()
        result.ParseFromString(decoded)
        assert result.topology_changed.reason == "remote_joined"
# Standalone Test Build

Run the ESP Tree add-on UI locally without Home Assistant.

## Quick Start

```bash
# 1. Build the Docker image
./build.sh

# 2. Configure your bridge
cp .env.example .env
# Edit .env with your bridge IP, port, transport (ws), and API key

# 3. Run
./start.sh

# 4. Open http://localhost:8099
```

## Files

| File | Purpose |
|------|---------|
| `Dockerfile.standalone` | Builds the standalone image |
| `build.sh` | Build script |
| `start.sh` | Run script (reads `.env`) |
| `.env.example` | Template for configuration |
| `.gitignore` | Ignores `.env` |

## Configuration

Edit `.env` in this directory:

```
BRIDGE_HOST=192.168.1.50   # Your bridge IP
BRIDGE_PORT=80             # Bridge port
BRIDGE_TRANSPORT=ws        # http or ws
BRIDGE_API_KEY=            # API key if configured on bridge
```

Or pass via environment variables:

```bash
BRIDGE_HOST=192.168.1.50 ./start.sh
```

## Data Persistence

All data (SQLite DB, firmware uploads, device configs, PlatformIO cache) is stored in:
```
/home/ben/projects/cache/ha-tree-addon-cache/
```

This is mapped to `/data` inside the container. Data persists across container restarts.

## Stopping

Press `Ctrl+C` in the terminal running the container. Use `--rm` flag so container is removed on exit.

## Without Docker

If you prefer not to use Docker:

```bash
cd ../esp-tree-ha
pip install -r requirements.txt
export BRIDGE_HOST=192.168.1.50 BRIDGE_TRANSPORT=ws ESP_TREE_DATA_DIR=/tmp/esp_tree
python -m app.main --port 8099

# In another terminal:
cd ui && npm run dev
```
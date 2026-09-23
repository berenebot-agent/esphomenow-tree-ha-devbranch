ARG BUILD_ARCH=amd64
FROM ghcr.io/home-assistant/${BUILD_ARCH}-base-debian:bookworm

ARG BUILD_ARCH
ARG GIT_HASH=unknown
ARG GIT_DATE=unknown
ARG BUILD_VERSION=0.1.272
ENV GIT_HASH=${GIT_HASH} GIT_DATE=${GIT_DATE}

LABEL \
  io.hass.version=${BUILD_VERSION} \
  io.hass.type=app \
  io.hass.arch=${BUILD_ARCH} \
  org.opencontainers.image.title="ESP Tree" \
  org.opencontainers.image.description="Home Assistant add-on for ESP-NOW topology and OTA" \
  org.opencontainers.image.source="https://github.com/berenebot-agent/esptree-dev"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV PYTHONUNBUFFERED=1 \
    APP_DIR=/opt/esp-tree \
    ESP_TREE_DATA_DIR=/data

WORKDIR ${APP_DIR}

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        curl \
        git \
        libffi-dev \
        libssl-dev \
        python3 \
        python3-dev \
        python3-pip \
        python3-venv \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

COPY requirements-compile.txt ./
COPY rootfs/ /
COPY device_code/components/ /opt/esp-tree/components/
COPY ha_integration/ /opt/esp-tree/ha_integration/
COPY app/ ./app/
COPY ui/package*.json ./ui/
COPY ui/dist/ ./ui/dist/

RUN chmod +x /etc/cont-init.d/00-prepare.sh \
    && chmod +x /etc/services.d/esp-tree/run
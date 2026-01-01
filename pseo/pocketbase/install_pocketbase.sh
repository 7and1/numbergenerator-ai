#!/usr/bin/env bash
set -euo pipefail

PB_DIR="${PB_DIR:-/opt/number-pb}"
PB_VERSION="${PB_VERSION:-0.22.8}"
PB_PORT="${PB_PORT:-8090}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root (or via sudo)."
  exit 1
fi

mkdir -p "$PB_DIR"
cd "$PB_DIR"

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64) PB_ARCH="amd64" ;;
  aarch64|arm64) PB_ARCH="arm64" ;;
  *)
    echo "Unsupported arch: $ARCH"
    exit 1
    ;;
esac

ZIP="pocketbase_${PB_VERSION}_linux_${PB_ARCH}.zip"
URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/${ZIP}"

echo "Downloading PocketBase v${PB_VERSION} (${PB_ARCH}) to ${PB_DIR}..."
rm -f "$ZIP"
curl -fsSL -o "$ZIP" "$URL"

rm -f pocketbase
unzip -o "$ZIP" pocketbase
chmod +x pocketbase

echo "PocketBase installed: ${PB_DIR}/pocketbase"
echo "Start manually: ${PB_DIR}/pocketbase serve --http=0.0.0.0:${PB_PORT}"


#!/usr/bin/env bash
set -e

echo "=== Installing DevFlow Local Service ==="

# 1. Build frontend static bundle
echo "[1/4] Building frontend dist bundle..."
cd "$(dirname "$0")/../frontend"
npm run build
cd ..

# 2. Install user systemd unit
echo "[2/4] Installing systemd user service..."
mkdir -p ~/.config/systemd/user
cp backend/devflow-api.service ~/.config/systemd/user/devflow-api.service

# 3. Reload & Enable systemd service
echo "[3/4] Enabling & starting devflow-api.service..."
systemctl --user daemon-reload
systemctl --user enable devflow-api.service
systemctl --user restart devflow-api.service

# 4. Enable loginctl linger for boot startup
echo "[4/4] Enabling user linger for boot startup..."
loginctl enable-linger "$USER" || true

echo "=== DevFlow Service Installed Successfully ==="
echo "Status check: ./scripts/status.sh"
echo "View logs:    ./scripts/logs.sh"

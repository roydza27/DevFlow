#!/usr/bin/env bash
set -e

echo "=== Uninstalling DevFlow Service ==="
systemctl --user stop devflow-api.service || true
systemctl --user disable devflow-api.service || true
rm -f ~/.config/systemd/user/devflow-api.service
systemctl --user daemon-reload
echo "DevFlow background service uninstalled."

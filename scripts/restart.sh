#!/usr/bin/env bash
echo "=== Restarting DevFlow API Service ==="
systemctl --user restart devflow-api.service
systemctl --user status devflow-api.service --no-pager

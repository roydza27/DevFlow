#!/usr/bin/env bash
echo "=== DevFlow Service Logs (Press Ctrl+C to exit) ==="
journalctl --user -u devflow-api.service -f -n 50

#!/usr/bin/env bash
echo "=== DevFlow Service Status ==="
systemctl --user status devflow-api.service --no-pager
echo ""
echo "=== API Endpoint Check ==="
curl -i http://localhost:3001/api/stats || echo "Failed reaching API service"

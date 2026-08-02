#!/usr/bin/env bash
set -u

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() { echo -e "  [${GREEN}PASS${NC}] $1"; }
fail() { echo -e "  [${RED}FAIL${NC}] $1"; }

echo "=== DevFlow Production Health & Diagnostics Doctor ==="
echo ""

# 1. Check systemd Express API service running
if systemctl --user is-active --quiet devflow-api.service; then
  pass "devflow-api.service is active and running (Express REST API)"
else
  fail "devflow-api.service is not running"
fi

# 2. Check systemd Caddy service running
if systemctl --user is-active --quiet devflow-caddy.service; then
  pass "devflow-caddy.service is active and running (Caddy Web Server)"
else
  fail "devflow-caddy.service is not running"
fi

# 3. Check SQLite DB existence
DB_PATH="$HOME/.config/devflow/devflow.db"
if [ -f "$DB_PATH" ]; then
  pass "SQLite database exists at $DB_PATH"
else
  fail "SQLite database not found at $DB_PATH"
fi

# 4. Check SQLite accessibility
if sqlite3 "$DB_PATH" "SELECT count(*) FROM projects;" >/dev/null 2>&1; then
  pass "SQLite database is accessible and queryable"
else
  fail "SQLite database failed query check"
fi

# 5. Check API HTTP endpoint via direct port 3001
STATS_RESP=$(curl -s http://localhost:3001/api/stats || true)
if [[ "$STATS_RESP" == *"dbSizeBytes"* ]]; then
  pass "Express API service responding on http://localhost:3001/api/stats"
else
  fail "Express API service not responding on http://localhost:3001/api/stats"
fi

# 6. Check Frontend dist build
DIST_INDEX="$(dirname "$0")/../frontend/dist/index.html"
if [ -f "$DIST_INDEX" ]; then
  pass "Frontend production build dist/index.html exists"
else
  fail "Frontend production build missing (run devflow build)"
fi

# 7. Check user linger
LINGER_STATE=$(loginctl show-user "$USER" 2>/dev/null | grep "Linger=yes" || true)
if [ -n "$LINGER_STATE" ]; then
  pass "loginctl linger is enabled for user $USER"
else
  fail "loginctl linger disabled (run loginctl enable-linger $USER)"
fi

# 8. Check Caddy static web serving on port 80
UI_HTML=$(curl -s http://devflow.localhost/ || true)
if [[ "$UI_HTML" == *"DevFlow"* ]]; then
  pass "Caddy serves frontend static UI on http://devflow.localhost (port 80)"
else
  fail "Caddy static UI not responding on http://devflow.localhost"
fi

# 9. Check Caddy API proxy forwarding on port 80
PROXY_RESP=$(curl -s http://devflow.localhost/api/stats || true)
if [[ "$PROXY_RESP" == *"dbSizeBytes"* ]]; then
  pass "Caddy correctly reverse-proxies /api/* requests to Express backend"
else
  fail "Caddy reverse-proxy failed forwarding /api/*"
fi


# 10. Check workspace data directory
DATA_DIR="$HOME/.config/devflow"
if [ -d "$DATA_DIR" ]; then
  pass "App data directory exists ($DATA_DIR)"
else
  fail "App data directory missing ($DATA_DIR)"
fi

echo ""
echo "=== Diagnostic Complete ==="

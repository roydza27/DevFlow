#!/usr/bin/env bash
set -e

read -p "Are you sure you want to reset the DevFlow SQLite database? (y/N) " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Cancelled."
  exit 0
fi

echo "Stopping devflow-api service..."
systemctl --user stop devflow-api.service || true

echo "Removing SQLite database files..."
rm -f ~/.config/devflow/devflow.db ~/.config/devflow/devflow.db-wal ~/.config/devflow/devflow.db-shm

echo "Restarting devflow-api service..."
systemctl --user start devflow-api.service
echo "Database reset complete. Schema re-initialized."

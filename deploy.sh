#!/bin/bash

echo "Pulling latest changes"
git pull origin main
echo "Pulled latest changes"

# Check if .env exist before loading
if [ -f "./judge0-apigateway/.env" ]; then
    echo "Loading judge0 api-gateway env variables"
    set -a
    source ./judge0-apigateway/.env
    set +a
    echo "Loaded judge0 api-gateway env variables"
else
    echo "MISSING judge0 api-gateway env variables"
fi

echo "Restarting judge0 api-gateway"
sudo systemctl restart judge0-apigateway
echo "Restarted judge0 api-gateway"

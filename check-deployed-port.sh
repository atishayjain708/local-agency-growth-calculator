#!/bin/bash

# Check which port the calculator is currently deployed on

VPS_USER="ubuntu"
VPS_HOST="137.74.43.93"
SSH_KEY="$HOME/.ssh/ovh_hyperke"

ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" << 'ENDSSH'
    cd /var/www/calculator
    
    echo "=== Current Deployment Info ==="
    
    if [ -f ".deployed_port" ]; then
        DEPLOYED_PORT=$(cat .deployed_port)
        echo "Deployed port (from file): $DEPLOYED_PORT"
    else
        echo "No .deployed_port file found"
    fi
    
    echo ""
    echo "=== PM2 Configuration ==="
    if [ -f "ecosystem.config.js" ]; then
        PORT_FROM_CONFIG=$(grep -o "PORT: [0-9]*" ecosystem.config.js | awk '{print $2}')
        echo "Port in ecosystem.config.js: $PORT_FROM_CONFIG"
    fi
    
    echo ""
    echo "=== Nginx Configuration ==="
    if [ -f "/etc/nginx/sites-available/calculator" ]; then
        PORT_FROM_NGINX=$(grep -o "localhost:[0-9]*" /etc/nginx/sites-available/calculator | head -1 | cut -d: -f2)
        echo "Port in Nginx config: $PORT_FROM_NGINX"
    fi
    
    echo ""
    echo "=== PM2 Process Status ==="
    pm2 status calculator 2>/dev/null || echo "Calculator not running in PM2"
    
    echo ""
    echo "=== Testing Port ==="
    if [ ! -z "$PORT_FROM_CONFIG" ]; then
        echo "Testing port $PORT_FROM_CONFIG..."
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT_FROM_CONFIG || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Port $PORT_FROM_CONFIG is responding"
        else
            echo "⚠️  Port $PORT_FROM_CONFIG returned HTTP $HTTP_CODE"
        fi
    fi
ENDSSH


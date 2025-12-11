#!/bin/bash

# Smart deployment script that automatically finds a free port
# This ensures we never conflict with existing services

set -e

echo "🚀 Deploying calculator with automatic port detection..."

# Configuration
VPS_USER="ubuntu"
VPS_HOST="137.74.43.93"
SSH_KEY="$HOME/.ssh/ovh_hyperke"
REMOTE_DIR="/var/www/calculator"
PORT_RANGE_START=3001
PORT_RANGE_END=3010

# Step 1: Build locally first
echo ""
echo "=== Step 1: Building locally ==="
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed!"
    exit 1
fi

echo "✅ Local build successful"

# Step 2: Upload files
echo ""
echo "=== Step 2: Uploading files to VPS ==="
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'terminals' \
    --exclude '*.md' \
    --exclude 'PUSH_TO_GITHUB.md' \
    --exclude 'GITHUB_SETUP.md' \
    --exclude 'TESTING_GUIDE.md' \
    --exclude 'BUILD_SUMMARY.md' \
    --exclude 'IMPLEMENTATION_PLAN.md' \
    --exclude 'DEPLOY_NOW.md' \
    --exclude 'VPS_DEPLOYMENT_GUIDE.md' \
    --exclude 'DEPLOY_PUBLIC_URL.md' \
    -e "ssh -i $SSH_KEY" \
    ./ $VPS_USER@$VPS_HOST:$REMOTE_DIR/

echo "✅ Files uploaded"

# Step 3: Find free port and deploy
echo ""
echo "=== Step 3: Finding free port and deploying ==="
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" << ENDSSH
    set -e
    
    cd /var/www/calculator
    
    # Function to find free port
    find_free_port() {
        local start=\$1
        local end=\$2
        
        for port in \$(seq \$start \$end); do
            if ! sudo lsof -i :\$port > /dev/null 2>&1; then
                echo \$port
                return 0
            fi
        done
        
        echo ""
        return 1
    }
    
    # Find free port
    echo "Scanning ports $PORT_RANGE_START-$PORT_RANGE_END for available port..."
    FREE_PORT=\$(find_free_port $PORT_RANGE_START $PORT_RANGE_END)
    
    if [ -z "\$FREE_PORT" ]; then
        echo "❌ No free ports found in range $PORT_RANGE_START-$PORT_RANGE_END"
        echo "Please free up a port or expand the range"
        exit 1
    fi
    
    echo "✅ Found free port: \$FREE_PORT"
    
    # Store port in a file for reference
    echo \$FREE_PORT > .deployed_port
    
    echo ""
    echo "=== Installing dependencies ==="
    npm install
    
    echo ""
    echo "=== Building application ==="
    rm -rf .next
    npm run build
    
    if [ ! -d ".next" ]; then
        echo "❌ Build failed"
        exit 1
    fi
    
    echo ""
    echo "=== Stopping old process ==="
    pm2 stop calculator 2>/dev/null || true
    pm2 delete calculator 2>/dev/null || true
    
    echo ""
    echo "=== Creating ecosystem.config.js with port \$FREE_PORT ==="
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'calculator',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/calculator',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: \$FREE_PORT,
      HOSTNAME: '0.0.0.0'
    },
    error_file: '/var/www/calculator/logs/err.log',
    out_file: '/var/www/calculator/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
EOF
    
    echo ""
    echo "=== Updating package.json ==="
    sed -i 's/"start": "next start"/"start": "next start -H 0.0.0.0"/' package.json
    
    echo ""
    echo "=== Updating Nginx config to use port \$FREE_PORT ==="
    # Backup current nginx config
    sudo cp /etc/nginx/sites-available/calculator /etc/nginx/sites-available/calculator.backup.\$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    # Update nginx config
    sudo sed -i "s/localhost:[0-9]*/localhost:\$FREE_PORT/g" /etc/nginx/sites-available/calculator
    
    # Test nginx config
    sudo nginx -t
    
    echo ""
    echo "=== Creating logs directory ==="
    mkdir -p logs
    
    echo ""
    echo "=== Starting with PM2 ==="
    pm2 start ecosystem.config.js
    pm2 save
    
    echo ""
    echo "=== Waiting 10 seconds for startup ==="
    sleep 10
    
    echo ""
    echo "=== PM2 Status ==="
    pm2 status
    
    echo ""
    echo "=== Testing localhost:\$FREE_PORT ==="
    HTTP_CODE=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:\$FREE_PORT || echo "000")
    if [ "\$HTTP_CODE" = "200" ]; then
        echo "✅ App is responding on port \$FREE_PORT!"
    else
        echo "⚠️  Got HTTP \$HTTP_CODE"
        pm2 logs calculator --lines 10 --nostream
    fi
    
    echo ""
    echo "=== Reloading Nginx ==="
    sudo systemctl reload nginx
    
    echo ""
    echo "=== Testing from outside (via Nginx) ==="
    curl -I http://localhost 2>&1 | head -5
    
    echo ""
    echo "=========================================="
    echo "✅ Deployment complete!"
    echo "   Port used: \$FREE_PORT"
    echo "   Public URL: http://137.74.43.93"
    echo "=========================================="
ENDSSH

echo ""
echo "🎉 Deployment complete with automatic port detection!"


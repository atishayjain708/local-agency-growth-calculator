#!/bin/bash

# Deployment script for Local Agency Growth Calculator
# Usage: ./deploy-to-vps.sh

set -e

echo "🚀 Starting deployment to VPS..."

# Configuration
VPS_USER="ubuntu"
VPS_HOST="137.74.43.93"
SSH_KEY="$HOME/.ssh/ovh_hyperke"
REMOTE_DIR="/var/www/calculator"
LOCAL_DIR="."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Building application locally first...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Local build failed! Fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"

echo -e "${BLUE}📤 Syncing files to VPS...${NC}"
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'terminals' \
    --exclude '*.md' \
    -e "ssh -i $SSH_KEY" \
    $LOCAL_DIR/ $VPS_USER@$VPS_HOST:$REMOTE_DIR/

echo -e "${BLUE}🔧 Installing dependencies and building on VPS...${NC}"
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST << 'ENDSSH'
cd /var/www/calculator

echo "📦 Installing npm packages..."
npm install --production

echo "🏗️ Building application..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 restart calculator || pm2 start ecosystem.config.js

echo "💾 Saving PM2 configuration..."
pm2 save

echo "📊 Current status:"
pm2 status
ENDSSH

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}🌐 Your application should be live at: http://137.74.43.93${NC}"
echo -e "${BLUE}📊 View logs: ssh -i $SSH_KEY $VPS_USER@$VPS_HOST 'pm2 logs calculator'${NC}"


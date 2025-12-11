#!/bin/bash

# Setup public URL with SSL for your calculator
# Usage: ./setup-public-url.sh yourdomain.com

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if domain provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Domain name required${NC}"
    echo ""
    echo "Usage: ./setup-public-url.sh yourdomain.com"
    echo ""
    echo "Example:"
    echo "  ./setup-public-url.sh calculator.example.com"
    exit 1
fi

DOMAIN=$1
VPS_USER="ubuntu"
VPS_HOST="137.74.43.93"
SSH_KEY="$HOME/.ssh/ovh_hyperke"

echo -e "${BLUE}🌐 Setting up public URL: ${DOMAIN}${NC}"
echo ""

# Step 1: Verify DNS
echo -e "${BLUE}Step 1: Verifying DNS configuration...${NC}"
DNS_IP=$(dig +short $DOMAIN | tail -1)

if [ "$DNS_IP" = "137.74.43.93" ]; then
    echo -e "${GREEN}✅ DNS correctly points to 137.74.43.93${NC}"
else
    echo -e "${YELLOW}⚠️  DNS does not point to 137.74.43.93${NC}"
    echo "   Current IP: $DNS_IP"
    echo "   Expected: 137.74.43.93"
    echo ""
    echo "Please configure your DNS first:"
    echo "  1. Go to your domain registrar"
    echo "  2. Add an A record: $DOMAIN → 137.74.43.93"
    echo "  3. Wait 5-30 minutes for propagation"
    echo "  4. Run this script again"
    exit 1
fi

# Step 2: Install Certbot on VPS
echo ""
echo -e "${BLUE}Step 2: Installing Certbot on VPS...${NC}"
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" << ENDSSH
    if ! command -v certbot &> /dev/null; then
        echo "Installing Certbot..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
        echo "✅ Certbot installed"
    else
        echo "✅ Certbot already installed"
    fi
ENDSSH

# Step 3: Update Nginx config
echo ""
echo -e "${BLUE}Step 3: Updating Nginx configuration...${NC}"
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" << ENDSSH
    cd /var/www/calculator
    
    # Backup current config
    sudo cp /etc/nginx/sites-available/calculator /etc/nginx/sites-available/calculator.backup
    
    # Update server_name in nginx.conf
    sudo sed -i "s/server_name.*/server_name $DOMAIN www.$DOMAIN;/g" /etc/nginx/sites-available/calculator
    
    # Test Nginx config
    sudo nginx -t
    
    if [ \$? -eq 0 ]; then
        sudo systemctl reload nginx
        echo "✅ Nginx configuration updated"
    else
        echo "❌ Nginx configuration error"
        exit 1
    fi
ENDSSH

# Step 4: Get SSL certificate
echo ""
echo -e "${BLUE}Step 4: Obtaining SSL certificate...${NC}"
echo -e "${YELLOW}This will prompt you for:${NC}"
echo "  - Email address (for renewal notices)"
echo "  - Agreement to terms"
echo "  - Redirect HTTP to HTTPS (recommended: Yes)"
echo ""

ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" << ENDSSH
    # Get certificate
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --redirect
    
    if [ \$? -eq 0 ]; then
        echo "✅ SSL certificate obtained"
    else
        echo "❌ Failed to obtain certificate"
        echo "You may need to run manually:"
        echo "  sudo certbot --nginx -d $DOMAIN"
        exit 1
    fi
ENDSSH

# Step 5: Verify
echo ""
echo -e "${BLUE}Step 5: Verifying setup...${NC}"

# Test HTTP redirect
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo -e "${GREEN}✅ HTTP redirects to HTTPS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP redirect may not be working (status: $HTTP_STATUS)${NC}"
fi

# Test HTTPS
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "$HTTPS_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ HTTPS is working${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS may not be working (status: $HTTPS_STATUS)${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}===================================================${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}===================================================${NC}"
echo ""
echo -e "Your calculator is now live at:"
echo -e "${BLUE}🌐 https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Visit https://$DOMAIN in your browser"
echo "  2. Test the calculator"
echo "  3. Update Calendly URL in public/config/global-config.json"
echo ""
echo -e "${YELLOW}SSL Certificate:${NC}"
echo "  - Auto-renews every 90 days"
echo "  - Check status: ssh $VPS_USER@$VPS_HOST 'sudo certbot certificates'"
echo "  - Test renewal: ssh $VPS_USER@$VPS_HOST 'sudo certbot renew --dry-run'"
echo ""


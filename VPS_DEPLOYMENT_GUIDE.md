# VPS Deployment Guide - Local Agency Growth Calculator

## 🚀 Quick Start

Your SSH key is set up at: `~/.ssh/ovh_hyperke`

### Connect to VPS

```bash
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93
```

**Note:** Your SSH key is encrypted. You'll be prompted for the passphrase.

---

## 📋 Deployment Steps

### Step 1: Connect to Your VPS

```bash
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93
```

### Step 2: Install Required Software

Once connected, run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Verify installations
node --version
npm --version
nginx -v
pm2 --version
```

### Step 3: Set Up Application Directory

```bash
# Create app directory
sudo mkdir -p /var/www/calculator
sudo chown -R ubuntu:ubuntu /var/www/calculator

# Navigate to directory
cd /var/www/calculator
```

### Step 4: Upload Your Application

**Option A: Using rsync (Recommended)**

From your local machine (new terminal):

```bash
cd /Users/atishayx/ALL-CURSOR-AI/hyperke-seo-agency-walkthrough

# Sync files to VPS
rsync -avz --exclude 'node_modules' --exclude '.next' \
  -e "ssh -i ~/.ssh/ovh_hyperke" \
  ./ ubuntu@137.74.43.93:/var/www/calculator/
```

**Option B: Using Git**

On the VPS:

```bash
cd /var/www/calculator
git clone YOUR_REPO_URL .
```

### Step 5: Install Dependencies and Build

On the VPS:

```bash
cd /var/www/calculator

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 6: Configure PM2

Create PM2 ecosystem file:

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'calculator',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/calculator',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions printed
```

### Step 7: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/calculator
```

Paste this configuration (replace `your-domain.com` with your actual domain or use IP):

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or 137.74.43.93

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

Save and exit (Ctrl+X, Y, Enter).

Enable the site:

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/calculator /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 9: Verify Deployment

Visit: `http://137.74.43.93` or `http://your-domain.com`

You should see your calculator running!

---

## 🔄 Update/Redeploy Process

When you make changes:

**From your local machine:**

```bash
# Build locally first to catch errors
npm run build

# Sync changes to VPS
rsync -avz --exclude 'node_modules' --exclude '.next' \
  -e "ssh -i ~/.ssh/ovh_hyperke" \
  ./ ubuntu@137.74.43.93:/var/www/calculator/

# Connect to VPS
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93

# On VPS:
cd /var/www/calculator
npm install  # if package.json changed
npm run build
pm2 restart calculator
```

---

## 🔒 Optional: Set Up SSL (HTTPS)

### Using Let's Encrypt (Free)

On the VPS:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure Nginx for HTTPS
```

---

## 📊 Monitoring Commands

```bash
# View application logs
pm2 logs calculator

# Check application status
pm2 status

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart calculator

# Stop application
pm2 stop calculator

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

## 🛠️ Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs calculator --lines 100

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart calculator
```

### Nginx errors

```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Can't connect via SSH

```bash
# From local machine, verify key permissions
ls -la ~/.ssh/ovh_hyperke  # should be -rw-------

# Try verbose SSH for debugging
ssh -vvv -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93
```

### Build fails

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Build again
npm run build
```

---

## 🚀 Performance Optimization

### Enable Gzip Compression

Edit Nginx config:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

### Set Up Swap (if low on RAM)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📁 Important File Locations

- **Application:** `/var/www/calculator`
- **Nginx Config:** `/etc/nginx/sites-available/calculator`
- **PM2 Config:** `/var/www/calculator/ecosystem.config.js`
- **Nginx Logs:** `/var/log/nginx/`
- **Application Logs:** `pm2 logs calculator`

---

## 🔐 Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Change default SSH port (optional):**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Change Port 22 to something else
   sudo systemctl restart sshd
   ```

3. **Set up automatic security updates:**
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure --priority=low unattended-upgrades
   ```

4. **Disable root login:**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl restart sshd
   ```

---

## 🎯 Quick Deployment Script

Create this file on your VPS for easy redeployment:

```bash
nano /var/www/calculator/deploy.sh
```

```bash
#!/bin/bash
set -e

echo "🚀 Deploying calculator..."

cd /var/www/calculator

echo "📥 Pulling latest changes..."
# If using git:
# git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart calculator

echo "✅ Deployment complete!"
pm2 status
```

Make it executable:

```bash
chmod +x /var/www/calculator/deploy.sh
```

Run it:

```bash
./deploy.sh
```

---

## 📞 Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs calculator`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify services are running:
   - `pm2 status`
   - `sudo systemctl status nginx`

---

## ✅ Deployment Checklist

- [ ] SSH key configured and working
- [ ] Node.js installed (v18+)
- [ ] Nginx installed and configured
- [ ] PM2 installed and running
- [ ] Application files uploaded
- [ ] Dependencies installed
- [ ] Production build created
- [ ] PM2 process started
- [ ] Nginx configured as reverse proxy
- [ ] Firewall configured
- [ ] SSL certificate installed (optional but recommended)
- [ ] Domain pointed to server IP (if using domain)
- [ ] Calendly URL updated in config
- [ ] Tested in browser

---

**Your VPS IP:** 137.74.43.93  
**SSH Command:** `ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93`  
**Application will run on:** Port 3000 (proxied through Nginx on port 80/443)

Good luck with your deployment! 🚀


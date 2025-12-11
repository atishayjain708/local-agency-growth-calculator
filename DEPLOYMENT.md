# 🚀 Deployment Guide

Simple guide to deploy the calculator locally and on VPS without conflicts.

---

## 📱 Local Development

### Start Local Server

```bash
npm install
npm run dev
```

Visit: **http://localhost:3000**

### Stop Local Server

Press `Ctrl + C` in the terminal, or:

```bash
lsof -ti:3000 | xargs kill
```

---

## 🌐 VPS Deployment

### Deploy to VPS (Recommended)

**This automatically finds a free port and deploys:**

```bash
./deploy-with-auto-port.sh
```

**What it does:**
1. ✅ Builds locally first (catches errors)
2. ✅ Uploads files to VPS
3. ✅ Scans ports 3001-3010 for availability
4. ✅ Picks first free port automatically
5. ✅ Updates all configs (PM2, Nginx)
6. ✅ Builds and starts the app
7. ✅ Tests everything

**Result:** Calculator live at **http://137.74.43.93**

**Time:** ~3-5 minutes

---

### Check Current Deployment

**See which port is in use:**

```bash
./check-deployed-port.sh
```

**Shows:**
- Current port number
- PM2 status
- Nginx configuration
- If app is responding

---

## 🔍 How It Prevents Conflicts

### Automatic Port Detection

The deployment script:
1. **Scans ports 3001-3010** for availability
2. **Uses `lsof`** to check if port is in use
3. **Picks first free port** automatically
4. **Never uses port 3000** (reserved for your other tools)

### Port Range

Default range: **3001-3010**

To change, edit `deploy-with-auto-port.sh`:

```bash
PORT_RANGE_START=3001  # Change this
PORT_RANGE_END=3010    # Change this
```

---

## 🔄 Update/Redeploy

**When you make changes:**

```bash
./deploy-with-auto-port.sh
```

The script will:
- Reuse the same port if it's still free
- Find a new port if the old one is taken
- Update everything automatically

---

## 🌍 Set Up Public URL (Optional)

**After deployment, add a domain:**

```bash
./setup-public-url.sh yourdomain.com
```

**Requirements:**
- Domain DNS pointing to `137.74.43.93`
- Wait 5-30 minutes for DNS propagation

**This will:**
- Get free SSL certificate (Let's Encrypt)
- Configure HTTPS
- Update Nginx

---

## 📊 Quick Reference

| Task | Command |
|------|---------|
| **Run locally** | `npm run dev` |
| **Deploy to VPS** | `./deploy-with-auto-port.sh` |
| **Check deployment** | `./check-deployed-port.sh` |
| **Add domain/SSL** | `./setup-public-url.sh domain.com` |
| **View logs** | `ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93 "pm2 logs calculator"` |
| **Restart app** | `ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93 "pm2 restart calculator"` |

---

## ✅ Safety Features

### No Conflicts Guaranteed

- ✅ **Never uses port 3000** (your other tools)
- ✅ **Scans before using** any port
- ✅ **Updates configs automatically**
- ✅ **Tests before finishing**

### Port Tracking

- Saves port to `.deployed_port` file
- Easy to check which port is in use
- Prevents accidental conflicts

---

## 🐛 Troubleshooting

### Deployment Fails

```bash
# Check what went wrong
./check-deployed-port.sh

# View PM2 logs
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93 "pm2 logs calculator --lines 50"
```

### Port Conflict (Shouldn't Happen)

If somehow a port conflict occurs:

```bash
# The script will automatically find a new port
./deploy-with-auto-port.sh
```

### App Not Responding

```bash
# Check PM2 status
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93 "pm2 status"

# Restart
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93 "pm2 restart calculator"

# Check Nginx
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93 "sudo nginx -t && sudo systemctl reload nginx"
```

---

## 📝 Summary

**Local:**
```bash
npm run dev
```

**VPS:**
```bash
./deploy-with-auto-port.sh
```

**That's it!** The script handles everything safely. 🎉


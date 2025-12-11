# 🔌 Automatic Port Management Guide

## Problem Solved

Previously, we hardcoded ports which could conflict with other services. Now we automatically find free ports!

---

## 🚀 Recommended: Use Auto-Port Deployment

**For all future deployments, use:**

```bash
./deploy-with-auto-port.sh
```

This script:
1. ✅ Scans ports 3001-3010 for availability
2. ✅ Picks the first free port
3. ✅ Updates all configs automatically
4. ✅ Saves the port to `.deployed_port` file
5. ✅ Never conflicts with existing services

---

## 📋 How It Works

### Port Scanning
- Scans range: **3001-3010** (configurable)
- Uses `lsof` to check if port is in use
- Picks first available port

### Automatic Updates
- Updates `ecosystem.config.js` with chosen port
- Updates `nginx.conf` to proxy to chosen port
- Updates PM2 environment variables
- All done automatically!

### Port Tracking
- Saves chosen port to `.deployed_port` file
- Easy to check which port is in use
- Prevents conflicts on redeployments

---

## 🛠️ Available Scripts

### 1. `deploy-with-auto-port.sh` ⭐ (Recommended)
**Smart deployment with automatic port detection**

```bash
./deploy-with-auto-port.sh
```

**Features:**
- Finds free port automatically
- Updates all configs
- Deploys and starts the app
- Tests everything

---

### 2. `check-deployed-port.sh`
**Check which port is currently in use**

```bash
./check-deployed-port.sh
```

**Shows:**
- Port from `.deployed_port` file
- Port in PM2 config
- Port in Nginx config
- PM2 process status
- Tests if port is responding

---

### 3. `find-free-port.sh`
**Standalone port finder (for other scripts)**

```bash
# Find free port in default range (3001-3010)
./find-free-port.sh

# Find free port in custom range
./find-free-port.sh 4000 4010
```

**Returns:** First free port number, or exits with error if none found

---

## ⚙️ Configuration

### Change Port Range

Edit `deploy-with-auto-port.sh`:

```bash
PORT_RANGE_START=3001  # Change this
PORT_RANGE_END=3010    # Change this
```

### Exclude Specific Ports

If you want to avoid certain ports, modify the `find_free_port` function:

```bash
find_free_port() {
    local start=$1
    local end=$2
    local exclude_ports=(3005 3007)  # Ports to skip
    
    for port in $(seq $start $end); do
        # Skip excluded ports
        if [[ " ${exclude_ports[@]} " =~ " ${port} " ]]; then
            continue
        fi
        
        if ! sudo lsof -i :$port > /dev/null 2>&1; then
            echo $port
            return 0
        fi
    done
    
    echo ""
    return 1
}
```

---

## 📝 Workflow

### First Deployment
```bash
./deploy-with-auto-port.sh
# Finds port 3001 (first free)
# Deploys to 3001
# Saves to .deployed_port
```

### Future Deployments
```bash
./deploy-with-auto-port.sh
# Checks .deployed_port
# If port still free, reuses it
# If port taken, finds new one
```

### Check Current Port
```bash
./check-deployed-port.sh
# Shows: Port 3001 is in use
```

---

## 🔍 Troubleshooting

### "No free ports found"
**Solution:** Expand the port range or free up a port

```bash
# Edit deploy-with-auto-port.sh
PORT_RANGE_START=3001
PORT_RANGE_END=3020  # Expanded range
```

### Port conflict after deployment
**Solution:** The script should handle this, but if it happens:

```bash
# Check what's using the port
ssh -i ~/.ssh/ovh_hyperke ubuntu@137.74.43.93 "sudo lsof -i :PORT_NUMBER"

# Redeploy (will find new port)
./deploy-with-auto-port.sh
```

### Want to use specific port
**Solution:** Manually set it in ecosystem.config.js and nginx.conf, or modify the script to prefer a specific port first.

---

## 🎯 Best Practices

1. **Always use `deploy-with-auto-port.sh`** for deployments
2. **Check port before manual changes**: `./check-deployed-port.sh`
3. **Document port ranges** if you have multiple apps
4. **Use different ranges** for different app types:
   - Calculators: 3001-3010
   - APIs: 4001-4010
   - Dashboards: 5001-5010

---

## 📊 Port Allocation Strategy

### Recommended Port Ranges

| App Type | Port Range | Example |
|----------|------------|---------|
| Calculators/Tools | 3001-3010 | 3001, 3002, 3003 |
| APIs | 4001-4010 | 4001, 4002, 4003 |
| Dashboards | 5001-5010 | 5001, 5002, 5003 |
| Admin Tools | 6001-6010 | 6001, 6002, 6003 |

### Reserved Ports (Don't Use)
- **3000**: Your other tools (as you mentioned)
- **80**: HTTP (Nginx)
- **443**: HTTPS (Nginx)
- **22**: SSH
- **5432**: PostgreSQL (if used)
- **6379**: Redis (if used)

---

## 🔄 Migration from Fixed Port

If you have existing deployments with fixed ports:

1. **Check current port:**
   ```bash
   ./check-deployed-port.sh
   ```

2. **Redeploy with auto-port:**
   ```bash
   ./deploy-with-auto-port.sh
   ```
   This will find a free port and migrate everything.

---

## ✅ Benefits

- ✅ **No conflicts**: Always finds free port
- ✅ **Automatic**: No manual port management
- ✅ **Flexible**: Easy to change ranges
- ✅ **Trackable**: Knows which port is in use
- ✅ **Safe**: Never breaks existing services

---

## 🚀 Quick Start

**For future deployments, just run:**

```bash
./deploy-with-auto-port.sh
```

That's it! The script handles everything automatically. 🎉


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
    },
    error_file: '/var/www/calculator/logs/err.log',
    out_file: '/var/www/calculator/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}


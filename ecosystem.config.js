module.exports = {
  apps: [{
    name: 'nestjs-boilerplate-api',
    script: 'npm',
    args: 'run start:prod',  // or whatever your production script is
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
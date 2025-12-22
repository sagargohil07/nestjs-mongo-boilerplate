# Backend Setup Guide

This guide will walk you through the process of setting up the CryptoBuddy backend on a server. It includes system setup, Docker & PostgreSQL setup, Node.js and NPM configuration, project setup, and more.

## 🔧 System Setup

1. Update system packages:
    ```bash
    sudo apt update
    sudo apt upgrade -y
    ```

2. Install dependencies:
    ```bash
    sudo apt install -y nodejs
    sudo apt install -y docker.io docker-compose
    sudo apt install nginx -y
    sudo apt install certbot python3-certbot-nginx -y
    ```

## 🐳 Docker & PostgreSQL Setup

1. Start Docker service:
    ```bash
    sudo systemctl start docker
    ```

2. Add your user to the Docker group:
    ```bash
    sudo usermod -aG docker $USER
    ```

3. Check Docker version:
    ```bash
    docker --version
    ```

4. Run PostgreSQL container:
    ```bash
    sudo docker run -d --name <NAME> \
      -e POSTGRES_USER=<name> \
      -e POSTGRES_PASSWORD=<name> \
      -e POSTGRES_DB=<name> \
      -p 5432:5432 \
      -v /data:/var/lib/postgresql/data \
      postgres:alpine
    ```

5. Access PostgreSQL in Docker:
    ```bash
    sudo docker exec -it <Name> psql -U <name> -d <name>
    ```

6. Check running containers:
    ```bash
    docker ps
    ```

## 🧵 Swapfile Creation

1. Create swapfile:
    ```bash
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    ```

2. Add swapfile to fstab:
    ```bash
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    ```

3. Check memory:
    ```bash
    free -m
    ```

## 🌐 SSH & Git Setup

1. Generate SSH key:
    ```bash
    ssh-keygen -t ed25519 -C "your_email@example.com"
    ```

2. Display the public key:
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```

3. Test SSH connection to GitHub:
    ```bash
    ssh -T git@github.com
    ```

4. Clone the <repo-name> backend repo:
    ```bash
    git clone git@github.com:sagargohil07/<repo-name>.git
    ```

5. Pull latest changes:
    ```bash
    git pull --ff origin main
    ```

6. Reset repository to the latest commit:
    ```bash
    git reset --hard HEAD && git clean -fd
    ```

## 📦 Node.js & NPM Setup

1. Install Node.js LTS:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    ```

2. Check versions:
    ```bash
    node -v
    npm -v
    ```

3. Install or update npm:
    ```bash
    npm install -g npm
    sudo apt install npm
    ```

4. Install project dependencies:
    ```bash
    npm i
    ```

5. Install PM2 to manage the application:
    ```bash
    npm install -g pm2
    ```

6. Start the application using PM2:
    ```bash
    pm2 start dist/main.js --name crypto-buddy
    ```

7. PM2 commands:
    ```bash
    pm2 stop all
    pm2 restart all
    pm2 logs
    pm2 flush
    ```

## 📁 Project Setup

1. Navigate to the project folder:
    ```bash
    cd Project-Name-Backend/
    ```

2. Install project dependencies:
    ```bash
    npm install
    ```

3. Run database migrations:
    ```bash
    npm run migrate
    ```

4. Start development server:
    ```bash
    npm run dev
    ```

## 🛠 Sequelize CLI

1. Install Sequelize CLI:
    ```bash
    npm install --save-dev sequelize-cli
    ```

2. Initialize Sequelize CLI:
    ```bash
    npx sequelize-cli init
    ```

3. Run migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```

4. Undo migrations:
    ```bash
    npx sequelize-cli db:migrate:undo:all
    ```

5. Run specific migrations with custom config:
    ```bash
    npx sequelize-cli db:migrate --config sequelize-cli-config.js
    ```

## 🌍 NGINX & HTTPS (Certbot)

1. Create NGINX config for your app:
    ```bash
    sudo nano /etc/nginx/sites-available/project-name
    ```

2. Enable the site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/project-name /etc/nginx/sites-enabled/
    ```

3. Test NGINX configuration:
    ```bash
    sudo nginx -t
    ```

4. Restart NGINX:
    ```bash
    sudo systemctl restart nginx
    ```

5. Set up HTTPS using Certbot:
    ```bash
    sudo certbot --nginx -d website.com -d www.website.com
    ```

6. Test Certbot renewal:
    ```bash
    sudo certbot renew --dry-run
    ```

## 📄 HTML Hosting

1. Create HTML directory:
    ```bash
    sudo mkdir -p /var/www/website-name/html
    ```

2. Add HTML files:
    ```bash
    sudo nano /var/www/website-name/html/index.html
    sudo nano /var/www/website-name/html/privacy-policy.html
    ```

3. Set appropriate permissions:
    ```bash
    sudo chmod -R 755 /var/www/website-name
    ```

## 🔁 WebSocket Testing

1. Install WebSocket client:
    ```bash
    npm install -g wscat
    ```

2. Test WebSocket connection:
    ```bash
    wscat -c wss://website-name.com/socket.io/?EIO=4&transport=websocket
    ```

---

### Happy Coding! 🎉

For more information, check out the official documentation or reach out to the project maintainers.

🔧 System Setup
bash
CopyEdit
sudo apt update
sudo apt upgrade -y
sudo apt install -y nodejs
sudo apt install -y docker.io docker-compose
sudo apt install nginx -y
sudo apt install certbot python3-certbot-nginx -y

🐳 Docker & PostgreSQL
bash
CopyEdit
sudo systemctl start docker
sudo usermod -aG docker $USER
docker --version
sudo docker run -d --name CryptoBuddy \
  -e POSTGRES_USER=cryptobuddy \
  -e POSTGRES_PASSWORD=cryptobuddy \
  -e POSTGRES_DB=cryptobuddy \
  -p 5432:5432 \
  -v /data:/var/lib/postgresql/data \
  postgres:alpine
sudo docker exec -it CryptoBuddy psql -U cryptobuddy -d cryptobuddy
docker ps


🧵 Swapfile Creation
bash
CopyEdit
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -m
🌐 SSH & Git Setup
bash
CopyEdit
ssh-keygen -t ed25519 -C "sagarkgohil123@gmail.com"
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com
git clone git@github.com:sagargohil07/Crypto-Buddy-Backend.git
git pull --ff origin main
git reset --hard HEAD && git clean -fd


📦 Node.js & NPM Setup
bash
CopyEdit
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
node -v
npm -v
npm install -g npm
sudo apt install npm
npm i
npm install -g pm2
pm2 start dist/main.js --name crypto-buddy
pm2 stop all
pm2 restart all
pm2 logs
pm2 flush


📁 Project Setup
bash
CopyEdit
cd Crypto-Buddy-Backend/
npm install
npm run migrate
npm run dev


🛠 Sequelize CLI
bash
CopyEdit
npm install --save-dev sequelize-cli
npx sequelize-cli init
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate --config sequelize-cli-config.js


🌍 NGINX & HTTPS (Certbot)
bash
CopyEdit
sudo nano /etc/nginx/sites-available/cryptobuddyapp
sudo ln -s /etc/nginx/sites-available/cryptobuddyapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d cryptobuddyapp.com -d www.cryptobuddyapp.com
sudo certbot renew --dry-run


📄 HTML Hosting
bash
CopyEdit
sudo mkdir -p /var/www/cryptobuddyapp/html
sudo nano /var/www/cryptobuddyapp/html/index.html
sudo nano /var/www/cryptobuddyapp/html/privacy-policy.html
sudo chmod -R 755 /var/www/cryptobuddyapp


🔁 WebSocket Testing
bash
CopyEdit
npm install -g wscat
wscat -c wss://cryptobuddyapp.com/socket.io/?EIO=4&transport=websocket



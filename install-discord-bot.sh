#!/bin/bash
set -e

# Get latest release version tag (without 'v' prefix)
LATEST_VERSION=$(curl -s https://api.github.com/repos/ppconde/minecraft-server-discord-bot/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')

echo "Latest version detected: $LATEST_VERSION"

DEB_URL="https://github.com/ppconde/minecraft-server-discord-bot/releases/download/v${LATEST_VERSION}/discord-bot_${LATEST_VERSION}_arm64.deb"

echo "Installing nvm..."
if [ ! -d "$HOME/.nvm" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/main/install.sh | bash
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node.js 24..."
nvm install 24
nvm use 24

echo "Enabling Corepack for pnpm..."
corepack enable

echo "Downloading Discord Bot v${LATEST_VERSION}..."
curl -L -o discord-bot.deb "$DEB_URL"

echo "Installing Discord Bot package..."
sudo dpkg -i discord-bot.deb || sudo apt-get install -f -y

rm discord-bot.deb

echo "Setting up systemd service..."

SERVICE_FILE="/etc/systemd/system/discord-bot.service"
sudo tee "$SERVICE_FILE" > /dev/null << EOF
[Unit]
Description=Discord Bot Service
After=network.target

[Service]
Type=simple
User=$USER
Environment=NODE_ENV=production
WorkingDirectory=/opt/discord-bot
ExecStart=$NVM_DIR/versions/node/v24.*/bin/node /opt/discord-bot/dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable discord-bot
sudo systemctl start discord-bot

echo "Discord Bot v${LATEST_VERSION} installed and service started!"

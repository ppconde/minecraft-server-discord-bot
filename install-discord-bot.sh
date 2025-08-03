#!/bin/bash
set -e

# Get latest release version tag (without 'v' prefix)
LATEST_VERSION=$(curl -s https://api.github.com/repos/ppconde/minecraft-server-discord-bot/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')

echo "Latest version detected: $LATEST_VERSION"

DEB_URL="https://github.com/ppconde/minecraft-server-discord-bot/releases/download/v${LATEST_VERSION}/discord-bot_${LATEST_VERSION}_arm64.deb"

echo "Installing Bun runtime..."

if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash

  # Add Bun to current shell session PATH
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

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
User=root
Environment=NODE_ENV=production
WorkingDirectory=/opt/discord-bot
Environment=PATH=/root/.bun/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=/root/.bun/bin/bun run /opt/discord-bot/src/index.ts
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable discord-bot
sudo systemctl restart discord-bot

echo "Discord Bot v${LATEST_VERSION} installed and service started!"

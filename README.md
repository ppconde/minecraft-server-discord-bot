# Minecraft Server Discord Bot

A Discord bot to monitor and interact with your Minecraft server, designed to run on Raspberry Pi (Debian Bookworm arm64).

---

## Features

- Monitor Minecraft server status
- Runs as a systemd service for easy management

---

## Requirements

- Raspberry Pi running Debian 12 (Bookworm) ARM64 or compatible Linux
- Node.js v24 (managed via `nvm`)
- `pnpm` package manager (enabled via Corepack)

---

## Installation

### 1. Run the install script (recommended)

The easiest way to install and configure everything is by running the install script:

```bash
sudo curl -sSL https://raw.githubusercontent.com/ppconde/minecraft-server-discord-bot/main/install-discord-bot.sh | bash
```

## Enable and start the service

```bash
sudo systemctl enable discord-bot
sudo systemctl start discord-bot
```

## Configuration

Place your Discord bot token and any other secrets in /opt/discord-bot/.env

You can use /opt/discord-bot/.env.example as a template

After editing .env, restart the service:

```bash
sudo systemctl restart discord-bot
```

## Managing the Bot

Check the status of the bot:

```bash
sudo systemctl status discord-bot
```

Start the bot:

```bash
sudo systemctl start discord-bot
```

Stop the bot:

```bash
sudo systemctl stop discord-bot
```

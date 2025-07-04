#!/bin/bash
set -e

VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="discord-bot_${VERSION}_arm64"

# Clean previous build
rm -rf "$PACKAGE_NAME"
rm -f "${PACKAGE_NAME}.deb"

# Create folder structure
mkdir -p "$PACKAGE_NAME/DEBIAN"
mkdir -p "$PACKAGE_NAME/opt/discord-bot"

# Copy control and postinst
cp debian/control "$PACKAGE_NAME/DEBIAN/"
cp debian/postinst "$PACKAGE_NAME/DEBIAN/"

# Ensure postinst is executable
chmod +x "$PACKAGE_NAME/DEBIAN/postinst"

# Copy bot files to /opt/discord-bot
cp -r dist package.json pnpm-lock.yaml .env.example "$PACKAGE_NAME/opt/discord-bot/"

# Build the .deb package
dpkg-deb --build "$PACKAGE_NAME"

echo "✅ Package built: ${PACKAGE_NAME}.deb"

import "dotenv/config";
import { Events } from "discord.js";
import { client } from "./client.ts";
import { CHECK_INTERVAL } from "./config/bot.config.ts";
import {
  SERVER_ADDRESS,
  CHANNEL_ID,
  DISCORD_TOKEN,
} from "./config/env.config.ts";
import { sendDiscordMessage } from "./services/messenger.service.ts";
import { fetchMinecraftStatus } from "./services/minecraft-status.service.ts";

let lastPlayers = new Set<string>();

async function checkAndUpdate() {
  const status = await fetchMinecraftStatus(SERVER_ADDRESS);
  if (!status || !status.online) {
    lastPlayers.clear();
    await sendDiscordMessage(
      CHANNEL_ID,
      "⚠️ Minecraft server is offline or unreachable."
    );
    return;
  }

  const playersOnline = status.players.online;
  const playersMax = status.players.max;
  const playersList = status.players.list || [];

  const currentPlayers = new Set<string>(
    playersList.map((p: { name: string }) => p.name)
  );
  const newPlayers = [...currentPlayers].filter((p) => !lastPlayers.has(p));

  if (newPlayers.length > 0) {
    const joined = newPlayers.join(", ");
    const msg = `🎉 Player(s) joined: ${joined}\nOnline: ${playersOnline}/${playersMax}`;
    await sendDiscordMessage(CHANNEL_ID, msg);
  }

  lastPlayers = currentPlayers;
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user?.tag}!`);
  await checkAndUpdate();
  setInterval(checkAndUpdate, CHECK_INTERVAL);
});

client.login(DISCORD_TOKEN);

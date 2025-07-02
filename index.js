require("dotenv").config();
const fetch = require("node-fetch"); // npm i node-fetch@2
const { Client, GatewayIntentBits, Events } = require("discord.js");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const MINECRAFT_SERVER =
  process.env.MINECRAFT_SERVER || "minecraft.ppconde.com";

const CHECK_INTERVAL = 5000; // 5 seconds

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

let lastPlayers = new Set();

async function fetchMinecraftStatus(server) {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${server}`);
    if (!res.ok) throw new Error(`Status fetch failed: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch Minecraft status:", err.message);
    return null;
  }
}

async function sendDiscordMessage(channelId, content) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) throw new Error("Channel not found");
    await channel.send(content);
  } catch (err) {
    console.error("Failed to send Discord message:", err.message);
  }
}

async function checkAndUpdate() {
  const status = await fetchMinecraftStatus(MINECRAFT_SERVER);

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

  const currentPlayers = new Set(playersList.map((p) => p.name));

  // Detect new players
  const newPlayers = [...currentPlayers].filter((p) => !lastPlayers.has(p));

  if (newPlayers.length > 0) {
    const joined = newPlayers.join(", ");
    const msg = `🎉 Player(s) joined: ${joined}\nOnline: ${playersOnline}/${playersMax}`;
    await sendDiscordMessage(CHANNEL_ID, msg);
  }

  lastPlayers = currentPlayers;
}

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await checkAndUpdate(); // Initial check
  setInterval(checkAndUpdate, CHECK_INTERVAL);
});

client.login(DISCORD_TOKEN);

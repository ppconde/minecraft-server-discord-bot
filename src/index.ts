import "dotenv/config";
import { Client, GatewayIntentBits, Events, TextChannel } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
const CHANNEL_ID = process.env.CHANNEL_ID!;
const SERVER_ADDRESS = process.env.SERVER_ADDRESS!;
const CHECK_INTERVAL = 5000;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

let lastPlayers = new Set<string>();

async function fetchMinecraftStatus(server: string): Promise<any | null> {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${server}`);
    if (!res.ok) throw new Error(`Status fetch failed: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    const e = err as Error;
    console.error("❌ Failed to fetch Minecraft status:", e.message);
    return null;
  }
}

async function sendDiscordMessage(
  channelId: string,
  content: string
): Promise<void> {
  try {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    if (!channel?.isTextBased()) throw new Error("Channel is not text-based");
    await channel.send(content);
  } catch (err) {
    const e = err as Error;
    console.error("❌ Failed to send Discord message:", e.message);
  }
}

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

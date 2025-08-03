import { Events } from "discord.js";
import { client } from "./client";
import { CHECK_INTERVAL } from "./config/bot.config";
import { CHANNEL_ID, DISCORD_TOKEN, SERVER_ADDRESS } from "./config/env.config";
import { sendDiscordEmbed } from "./services/messenger.service";
import { fetchMinecraftStatus } from "./services/minecraft-status.service";
import { getRandomEmoji } from "./utils/emoji.utils";

let previousPlayers: string[] = [];
let lastOfflineAlertTime: number | null = null;
const OFFLINE_ALERT_COOLDOWN = 30 * 60 * 1000; // 30 minutes

async function checkAndUpdate() {
	try {
		console.log("🔄 Checking Minecraft server status...");
		const status = await fetchMinecraftStatus(SERVER_ADDRESS);

		if (!status?.online) {
			console.log("❌ Minecraft server is offline.");
			previousPlayers = [];

			const now = Date.now();
			const timeSinceLastAlert = lastOfflineAlertTime ? now - lastOfflineAlertTime : Infinity;

			if (timeSinceLastAlert > OFFLINE_ALERT_COOLDOWN) {
				await sendDiscordEmbed(CHANNEL_ID, {
					online: false,
					title: "⛏️ Status Update",
					description: "The Minecraft server is currently offline",
					footer: SERVER_ADDRESS,
				});
				lastOfflineAlertTime = now;
				console.log("📢 Sent offline alert");
			} else {
				console.log(
					`⏱️ Skipping offline alert (cooldown: ${Math.ceil(
						(OFFLINE_ALERT_COOLDOWN - timeSinceLastAlert) / 1000,
					)}s left)`,
				);
			}

			return;
		}

		// Reset cooldown once server is back online
		lastOfflineAlertTime = null;

		const currentPlayers = status.players.list.map((p) => p.name_clean);
		const newPlayers = currentPlayers.filter((name) => !previousPlayers.includes(name));

		if (newPlayers.length > 0) {
			const message = `Welcome ${newPlayers.map((name) => `**${name}**`).join(", ")} to the server!`;

			const currentPlayersDisplay =
				currentPlayers.length > 0
					? currentPlayers.map((name) => `${getRandomEmoji()} ${name}`).join("\n")
					: "No players online";

			await sendDiscordEmbed(CHANNEL_ID, {
				online: status.online,
				title: "⛏️ Status Update",
				description: message,
				fields: [
					{
						name: "Current Players",
						value: currentPlayersDisplay,
						inline: false,
					},
				],
				footer: SERVER_ADDRESS,
			});

			console.log("📢 Notified new players:", newPlayers);
		} else {
			console.log("✅ No new players.");
		}

		previousPlayers = currentPlayers;
	} catch (err) {
		console.error("❌ Error checking Minecraft server status:", err);
	}
}

function startStatusLoop() {
	setInterval(checkAndUpdate, CHECK_INTERVAL);
}

client.once(Events.ClientReady, () => {
	console.log(`✅ Logged in as ${client.user?.tag}!`);
	checkAndUpdate(); // run immediately once
	startStatusLoop();
});

client.login(DISCORD_TOKEN);

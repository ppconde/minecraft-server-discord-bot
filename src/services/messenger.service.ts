import { EmbedBuilder, type TextChannel } from "discord.js";
import { client } from "../client";
import { MEDIA_CONFIG } from "../config/media.config";

export async function sendDiscordMessage(channelId: string, content: string): Promise<void> {
	try {
		const channel = (await client.channels.fetch(channelId)) as TextChannel;
		if (!channel?.isTextBased()) throw new Error("Channel is not text-based");
		await channel.send(content);
	} catch (err) {
		const e = err as Error;
		console.error("❌ Failed to send Discord message:", e.message);
	}
}

export async function sendDiscordEmbed(
	channelId: string,
	options: {
		online?: boolean;
		title?: string;
		description?: string;
		color?: number;
		fields?: { name: string; value: string; inline?: boolean }[];
		footer?: string;
	},
): Promise<void> {
	try {
		const channel = (await client.channels.fetch(channelId)) as TextChannel;
		if (!channel?.isTextBased()) throw new Error("Channel is not text-based");

		const embed = new EmbedBuilder();

		if (options.title) embed.setTitle(options.title);
		if (options.description) embed.setDescription(options.description);
		if (options.fields) embed.addFields(options.fields);
		if (options.footer) embed.setFooter({ text: options.footer });
		if (options.online) {
			embed.setThumbnail(MEDIA_CONFIG.ONLINE_URL);
			embed.setColor(0x00ff00);
		}
		if (options.online === false) {
			embed.setThumbnail(MEDIA_CONFIG.OFFLINE_URL);
			embed.setColor(0xff0000);
		}

		await channel.send({ embeds: [embed] });
	} catch (err) {
		const e = err as Error;
		console.error("❌ Failed to send Discord embed:", e.message);
	}
}

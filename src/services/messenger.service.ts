import { TextChannel } from "discord.js";
import { client } from "../client";

export async function sendDiscordMessage(
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

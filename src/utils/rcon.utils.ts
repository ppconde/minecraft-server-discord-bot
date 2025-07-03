import { Rcon } from "rcon-client";
import { SERVER_ADDRESS, RCON_PORT, RCON_PASSWORD } from "../config/env.config";

type RconCallback<T> = (rcon: Rcon) => Promise<T>;

export async function withRconConnection<T>(
  callback: RconCallback<T>
): Promise<T | null> {
  const rcon = new Rcon({
    host: SERVER_ADDRESS!,
    port: Number(RCON_PORT!),
    password: RCON_PASSWORD!,
  });

  try {
    await rcon.connect();
    return await callback(rcon);
  } catch (error) {
    console.error("❌ RCON error:", (error as Error).message);
    return null;
  } finally {
    try {
      await rcon.end();
    } catch (err) {
      console.error(
        "⚠️ Failed to close RCON connection:",
        (err as Error).message
      );
    }
  }
}

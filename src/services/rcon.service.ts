import { withRconConnection } from "../utils/rcon.utils";

export async function getOnlinePlayers() {
  return await withRconConnection(async (rcon) => {
    const response = await rcon.send("list");
    const playerList = response.split(":")[1]?.trim();
    return playerList ? playerList.split(",").map((p) => p.trim()) : [];
  });
}

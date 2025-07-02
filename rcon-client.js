require("dotenv").config();
const { Rcon } = require("rcon-client");

async function getOnlinePlayers() {
  const rcon = new Rcon({
    host: process.env.SERVER_ADDRESS,
    port: Number(process.env.RCON_PORT),
    password: process.env.RCON_PASSWORD,
  });

  await rcon.connect();

  try {
    const response = await rcon.send("list");
    console.log("Raw RCON 'list' response:", response);

    const playerListPart = response.split(":")[1]?.trim();
    const players = playerListPart
      ? playerListPart.split(",").map((p) => p.trim())
      : [];

    console.log("Online players:", players);

    await rcon.end();
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    await rcon.end();
    return [];
  }
}

getOnlinePlayers();

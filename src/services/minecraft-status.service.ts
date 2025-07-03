export async function fetchMinecraftStatus(
  server: string
): Promise<any | null> {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${server}`);
    if (!res.ok) throw new Error(`Status fetch failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    const e = err as Error;
    console.error("❌ Failed to fetch Minecraft status:", e.message);
    return null;
  }
}

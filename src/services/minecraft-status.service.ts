export type MinecraftServerStatus = {
  online: boolean;
  host: string;
  port: number;
  ip_address: string;
  eula_blocked: boolean;
  retrieved_at: number;
  expires_at: number;
  srv_record: string | null;
  version: {
    name_raw: string;
    name_clean: string;
    name_html: string;
    protocol: number;
  };
  players: {
    online: number;
    max: number;
    list: Array<{
      uuid: string;
      name_raw: string;
      name_clean: string;
      name_html: string;
    }>;
  };
  motd: {
    raw: string;
    clean: string;
    html: string;
  };
  icon: string | null;
  mods: Array<unknown>;
  software: string | null;
  plugins: Array<unknown>;
};

export async function fetchMinecraftStatus(
  server: string
): Promise<MinecraftServerStatus | null> {
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

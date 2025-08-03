function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required but was not provided.`);
    }
    return value;
}

export const DISCORD_TOKEN = requireEnv('DISCORD_TOKEN');
export const CHANNEL_ID = requireEnv('CHANNEL_ID');
export const SERVER_ADDRESS = requireEnv('SERVER_ADDRESS');
export const RCON_PORT = Number(requireEnv('RCON_PORT'));
export const RCON_PASSWORD = requireEnv('RCON_PASSWORD');

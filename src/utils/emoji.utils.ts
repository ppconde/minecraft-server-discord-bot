const mcEmojis = ["🪓", "🧱", "🪣", "🗺️", "🧭", "🏹", "🧨", "🐷", "🦊", "🎮", "💎", "🪨", "⛏️", "🧊", "💀", "🥩", "⚡"];

export function getRandomEmoji() {
	return mcEmojis[Math.floor(Math.random() * mcEmojis.length)];
}

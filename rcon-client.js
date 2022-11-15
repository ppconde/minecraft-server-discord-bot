const util = require('minecraft-server-util');
const client = new util.RCON();
const password = 'm"Tk"kf{5~#p?cE5';

client.on('message', (message) => {
    console.log('mensagem: ', message);
});

module.exports = {
    init: async function() {
        await client.connect('89.152.236.43', 25551);
        await client.login(password);
        const players = await getWhitelistedPlayers();
        console.log('msg: ', players);
        // await client.close();
    }
}

async function getWhitelistedPlayers() {
    const msg = await client.execute('whitelist list');
    return msg.split('whitelisted players: ')[1].split(', ')
}


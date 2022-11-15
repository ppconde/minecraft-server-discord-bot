const { Client, MessageEmbed, Intents } = require('discord.js');
const { queryFull } = require('minecraft-server-util');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const token = 'OTM1MjU0NjI5MDQ0ODU0ODI0.Ye79vw.YnHPZSfl36E_vuEKxgF-JlU6DMI';
const PREFIX = '!'
const basePath = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/';
const onlineUrl = basePath + '7/7e/Sitting_Baby_Fox.png/revision/latest?cb=20190213180035';
const offlineUrl = basePath + 'e/e6/Sleeping_Baby_Fox.png/revision/latest?cb=20190218183612';

const options = {
    timeout: 10_000, // timeout in milliseconds
    enableSRV: true // SRV record lookup
};

const CHANNEL_ID = 949356247948337212;

const UPDATE_TIME = 20_000;

const getServerStatusMessage = async (ip, port) => {
    const richMessage = new MessageEmbed().setTimestamp(new Date());

    return queryFull(ip, port, options).then(async (result) => {
        const { players, motd } = { ...result };
        richMessage
            .setColor('#00FF00')
            .setThumbnail(onlineUrl)
            .setTitle(`${motd.clean} is online`)
            .addFields(
                { name: 'Online Players', value: `${players.online}`, inline: true },
                { name: 'Max Players', value: `${players.max}`, inline: true },
            );

        if (players.list?.length) {
            richMessage.setDescription(`**Currently playing: **\n ${players.list.reduce((acc, p) => `${acc + p}\n`, '')}`);
        }

        return richMessage;

    }).catch(async (error) => {
        return richMessage
            .setColor('#8B0000')
            .setThumbnail(offlineUrl)
            .setTitle(`Server is offline or couldn\'t be reached`)
            .addField('Error message: ', `${error.message}`);
    });
}

getExistingEmbeded = async (obj) => {
    console.log('aqui: ', obj)
    // return (obj?.channels?.fetch(CHANNEL_ID) || obj).then((response) => {
    //     return response.messages.fetch(({ limit: 20 })).then((msgs) => {
    //         console.log('emb: ', msgs);
    //         return msgs.find((msg) => msg.embeds.length && msg.author.bot);
    //     })?.embeds?.[0];
    // })
}

updateMessage = async () => {
    const { ip, port, msgRef } = getInfo();
    const richMessage = await getServerStatusMessage(ip, port);
    msgRef.edit({ embeds: [richMessage] });
}

setInfo = (info) => {
    const { ip, port, msgRef } = info;
    this.ip = ip || this.ip;
    this.port = port || this.port;
    this.msgRef = msgRef || this.msgRef;
}

getInfo = () => {
    return {
        ip: this.ip,
        port: this.port,
        msgRef: this.msgRef,
    }
}

bot.on('ready', async (client) => {
    console.log('Bot has come online.');
    const channel = await client.channels.fetch(CHANNEL_ID).catch((e) => console.log('Error: ', e));
    
    console.log('rich: ', client )
    const richMessage = await getExistingEmbeded(channel);
    // const msgRef = await channel.send({ embeds: [richMessage] });

    // setInfo({ ip, port, msgRef });

    // if (msgRef) {
    //     updateMessage();
    // }
    // channel.messages.fetch(({ limit: 20 })).then((response) => {
    //     console.log('aqui: ', response);
    // });
    
    //find channel
    // find text channel

});

bot.on('messageCreate', async (message) => {
    let args = message.content.substring(PREFIX.length).split(' ')

    switch (args[0]) {
        case 'mc': {
            if (!args[1]) return message.channel.send('You must type a minecraft server ip');
            const ip = args[1];
            const port = args[2]?.match(/\d+/) ? Number(args[2]) : 25570;

            const richMessage = await getExistingEmbeded(message) || await getServerStatusMessage(ip, port, message);
            const msgRef = await message.channel.send({ embeds: [richMessage] });

            setInfo({ ip, port, msgRef });

            if (msgRef) {
                updateMessage();
            }
            break
        }
    }

});

bot.on('messageUpdate', async (oldMessage) => {
    if (oldMessage.author.bot) {
        setInfo({ msgRef: oldMessage })
        setTimeout(() => updateMessage(), UPDATE_TIME);
    }
});

// bot.on('message', (message) => {
//     message.channel.messages.fetch({ limit: 1 }).then((response) => {
//         console.log('repsonse: ', response);
//     });
// });

bot.login(token)
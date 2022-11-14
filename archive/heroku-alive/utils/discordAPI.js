const axios = require('axios').default;
require('dotenv').config();
const botToken = process.env.BOT;
const logChannel = process.env.CHANNEL;

const discord = axios.create({
    baseURL: 'https://discord.com/api/v9',
    headers: {
        Authorization: `Bot ${botToken}`,
    },
});

/**
 * Sends Message to discord
 * @param {Boolean} dscBotEnable
 * @param {Object} quota
 */
const sendHerokuSwapLog = async (dscBotEnable, quota) => {
    await discord.post(`/channels/${logChannel}/messages`, {
        embeds: [
            {
                title: 'Heroku Account Swapper',
                color: 16705372,
                fields: [
                    {
                        name: 'ACTIVE BOT',
                        value: dscBotEnable ? '`DSC`' : '`MBCET`',
                    },
                    {
                        name: 'DSC',
                        value: `\`${quota.dsc} hrs\``,
                        inline: true,
                    },
                    {
                        name: 'MBCET',
                        value: `\`${quota.mbcet} hrs\``,
                        inline: true,
                    },
                ],
            },
        ],
    });
};

/**
 * Sends Error Message To Discord
 * @param {Error} error
 */
const sendErrorLog = async (error) => {
    await discord.post(`/channels/${logChannel}/messages`, {
        embeds: [
            {
                title: 'Failed Heroku Account Swapper',
                color: 15158332,
                description: [`\`${error.message}\``, `\`${error.stack}\``].join('\n'),
            },
        ],
    });
};

module.exports = {
    sendHerokuSwapLog,
    sendErrorLog,
};

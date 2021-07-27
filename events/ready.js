const { reactionDataArray, removeReactionRole } = require('../firebase/firebase_handler');
const { PREFIX } = require('../utils/constants');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'ready',

    /** @param {Discord.Client} client */
    execute(client) {
        const guilds = client.guilds.cache.map((guild) => guild.name);
        if (PREFIX === '!') logger.debug('PRODUCTION_MODE');
        else logger.debug('DEVELOPMENT_MODE');
        logger.info('Master Oogway Is Ready!');
        logger.info(`PREFIX: ${PREFIX}`);
        logger.info('Handling Guilds:', guilds.join(', '));

        reactionDataArray.forEach(async (reaction) => {
            const guild = client.guilds.cache.find((e) => e.id === reaction.guild_id);
            const channel = guild.channels.cache.find((e) => e.id === reaction.channel_id);
            try {
                await channel.messages.fetch(reaction.id);
            } catch (error) {
                await removeReactionRole(reaction.id);
            }
        });
    },
};

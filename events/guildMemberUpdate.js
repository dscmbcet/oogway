const Discord = require('discord.js');
const { updateUser } = require('../firebase/firebase_handler');

module.exports = {
    name: 'guildMemberUpdate',

    /**
     * @param {Discord.GuildMember | Discord.PartialUser} user
     * @param {Discord.GuildMember | Discord.PartialUser} newUser
     * */
    async execute(user, newUser) {
        if (newUser.partial) await newUser.fetch();
        if (newUser.bot) return;

        try {
            await updateUser(newUser);
        } catch (e) {}
    },
};

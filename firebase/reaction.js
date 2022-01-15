const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { dbFirebase } = require('.');
const { checkDate } = require('../utils/functions');
const { logger } = require('../utils/logger');

/** @typedef {import('../models/FirebaseReaction').FirebaseReaction} FirebaseReaction */

/** @type {FirebaseReaction[]} */
exports.reactionDataArray = [];

/**
 * Reactions added to this function are handled in ../events/messageReactionAdd.js
 * @param {Discord.MessageEmbed} reactionMessage
 * @param {FirebaseReaction} parsedData
 * @param {string} type
 */
exports.addReactionRole = async (reactionMessage, parsedData, type) => {
    const colRef = dbFirebase.collection('reaction-roles');
    const data = {
        id: reactionMessage.id,
        type,
        guild_id: reactionMessage.guild.id,
        channel_name: `${reactionMessage.channel.parent.name}:${reactionMessage.channel.name}`,
        channel_id: reactionMessage.channel.id,
        timestamp: reactionMessage.createdAt.toISOString(),
        data: parsedData,
    };
    colRef.doc(reactionMessage.id).create(data);
};

/**
 * @param {string} reaction_message
 */
exports.removeReactionRole = async (reactionMessageId) => {
    const colRef = dbFirebase.collection('reaction-roles');
    await colRef.doc(reactionMessageId).delete();
};

/**
 * @param {Discord.Client} client
 */
exports.listenForReactionRoles = async (client) => {
    logger.firebase('Listening for reaction roles');
    dbFirebase.collection('reaction-roles').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
            /** @type {FirebaseReaction} */
            const data = change.doc.data();
            if (change.type === 'added') {
                if (checkDate(data.timestamp)) {
                    logger.firebase(`New reaction role:${data.id} @type: ${data.type} @Channel: ${data.channel_name}`);
                    const guild = client.guilds.cache.find((e) => e.id === data.guild_id);
                    const channel = guild.channels.cache.find((e) => e.id === data.channel_id);
                    try {
                        await channel.messages.fetch(data.id);
                    } catch (error) {
                        await this.removeReactionRole(data.id);
                    }
                }
                this.reactionDataArray.push(data);
            }
            if (change.type === 'removed') {
                logger.firebase(`Removed reaction role:${data.id} @type: ${data.type} @Channel: ${data.channel_name}`);
                const deleteIndex = this.reactionDataArray.findIndex((e) => e.id === data.id);
                if (deleteIndex !== -1) this.reactionDataArray.splice(deleteIndex);
            }
        });
    });
};

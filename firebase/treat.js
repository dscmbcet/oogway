const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { dbFirebase } = require('.');
const { checkDate } = require('../utils/functions');
const { logger } = require('../utils/logger');

/** @typedef {import('../models/FirebaseTreat').FirebaseTreat} FirebaseTreat */

/** @type {FirebaseTreat[]} */
exports.treatDataArray = [];

/**
 * @param {Discord.Message} message
 * @param {Discord.User} user
 * @param {string} description
 */
exports.addToTreatList = async (message, user, description) => {
    const colRef = dbFirebase.collection('treat-list');
    colRef.doc(message.id).create({
        id: message.id,
        guild_id: message.guild.id,
        user_id: user.id,
        user_name: user.tag,
        description,
        timestamp: message.createdAt.toISOString(),
    });
};

/** @param {string} messageid */
exports.removeFromTreatList = async (messageid) => {
    const colRef = dbFirebase.collection('treat-list');
    await colRef.doc(messageid).delete();
};

exports.listenForTreat = async () => {
    logger.firebase('Listening for treats');
    dbFirebase.collection('treat-list').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
            /** @type {FirebaseTreat} */
            const data = change.doc.data();
            if (change.type === 'added') {
                if (checkDate(data.timestamp)) {
                    logger.firebase(`New treat: ${data.user_name} , Reason: ${data.description}`);
                }
                this.treatDataArray.push(data);
            }
            if (change.type === 'removed') {
                logger.firebase(`Removed treat: ${data.user_name} , Reason: ${data.description}`);
                const deleteIndex = this.treatDataArray.findIndex((e) => e.id === data.id);
                if (deleteIndex !== -1) this.treatDataArray.splice(deleteIndex);
            }
        });
    });
};

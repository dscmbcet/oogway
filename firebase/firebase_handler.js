const admin = require('firebase-admin');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const serviceAccount = require('./firebase-config.json');
const { logger } = require('../utils/logger');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * @typedef {import('../utils/models/FirebaseReaction').FirebaseReaction} FirebaseReaction
 * @typedef {import('../utils/models/FirebaseTreat').FirebaseTreat} FirebaseTreat
 */

/** @type {FirebaseReaction[]} */
exports.reactionDataArray = [];

/** @type {FirebaseTreat[]} */
exports.treatDataArray = [];

logger.firebase('Initializing');

/**
 * Reactions added to this function are handled in ../events/messageReactionAdd.js
 * @param {Discord.MessageEmbed} reactionMessage
 * @param {FirebaseReaction} parsedData
 * @param {string} type
 */
exports.addReactionRole = async (reactionMessage, parsedData, type) => {
    const colRef = db.collection('reaction-roles');
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
    const colRef = db.collection('reaction-roles');
    await colRef.doc(reactionMessageId).delete();
};

/**
 * @param {Discord.Message} message
 * @param {Discord.User} user
 * @param {string} description
 */
exports.addToTreatList = async (message, user, description) => {
    const colRef = db.collection('treat-list');
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
    const colRef = db.collection('treat-list');
    await colRef.doc(messageid).delete();
};

/**
 * Checks whether given timestamp is older than today
 * @param {string} timestamp
 * @returns {boolean}
 */
function checkDate(timestamp) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return new Date(timestamp) > date;
}

exports.listenForReactionRoles = async () => {
    db.collection('reaction-roles').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
            /** @type {FirebaseReaction} */
            const data = change.doc.data();
            if (change.type === 'added') {
                if (checkDate(data.timestamp)) {
                    logger.firebase(`New reaction role:${data.id} @type: ${data.type} @Channel: ${data.channel_name}`);
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

exports.listenForTreat = async () => {
    db.collection('treat-list').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
            /** @type {FirebaseTreat} */
            const data = change.doc.data();
            if (change.type === 'added') {
                if (checkDate(data.timestamp)) logger.firebase(`New treat: ${data.user_name} , Reason: ${data.description}`);
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

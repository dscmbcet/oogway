const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { dbFirebase } = require('.');
const { checkDate } = require('../utils/functions');
const { logger } = require('../utils/logger');

/** @typedef {import('../models/FirebaseShowCase').FirebaseShowCase} FirebaseShowCase */

/** @type {FirebaseShowCase[]} */
exports.showCaseDataArray = [];

/**
 * @param {Discord.Message} message
 * @param {string} topic
 * @param {string} id
 * @param {string[]} channels
 */
exports.addToShowCaseList = async (message, topic, id, channels) => {
    const colRef = dbFirebase.collection('showcase-list');
    colRef.doc(id).create({
        id,
        topic,
        channels,
        guild_id: message.guild.id,
        timestamp: new Date().toISOString(),
    });
};

/** @param {string} id */
exports.removeFromShowCaseList = async (id) => {
    const colRef = dbFirebase.collection('showcase-list');
    await colRef.doc(id).delete();
};

/**
 * @param {Discord.Client} client
 */
exports.listenForShowCase = async (client) => {
    logger.firebase('Listening for showcase');
    dbFirebase.collection('showcase-list').onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
            /** @type {FirebaseShowCase} */
            const data = change.doc.data();
            if (change.type === 'added') {
                if (checkDate(data.timestamp)) {
                    logger.firebase(`New showcase: ${data.id} , Topic: ${data.topic}`);
                }
                const guild = client.guilds.cache.get(data.guild_id);
                if (!guild.channels.cache.get(data.channels[0])) this.removeShowCaseList(data.id);
                this.showCaseDataArray.push(data);
            }
            if (change.type === 'removed') {
                logger.firebase(`Removed showcase: ${data.id} , Topic: ${data.topic}`);
                const deleteIndex = this.showCaseDataArray.findIndex((e) => e.id === data.id);
                if (deleteIndex !== -1) this.showCaseDataArray.splice(deleteIndex);

                const guild = client.guilds.cache.get(data.guild_id);
                data.channels.forEach((channel) => {
                    guild.channels.cache.get(channel)?.delete();
                });
            }
        });
    });
};

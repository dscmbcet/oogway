const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { dbRealtimeDatabase } = require('.');
const { logger } = require('../utils/logger');

/** @typedef {import('../models/SpamLink').SpamLink} SpamLink */

/** @type {SpamLink[]} */
exports.firebaseSpamLinkArray = [];

/**
 * Adds spam link to spamLinks
 * @param {string} link
 * @returns {Promise<boolean>} success/failed
 */
exports.addSpamLink = async (link) => {
    const value = this.firebaseSpamLinkArray.find((e) => e.link === link);
    if (value) return false;
    try {
        dbRealtimeDatabase.ref('spamlinks').push().set({ link });
        return true;
    } catch (error) {
        console.error(`Firebase Realtime: ${error}`);
        return false;
    }
};

/**
 * Removes spam link to spamLinks
 * @param {string} link
 * @returns {Promise<boolean>} success/failed
 */
exports.removeSpamLink = async (link) => {
    const value = this.firebaseSpamLinkArray.find((e) => e.link === link);
    if (!value) return false;
    try {
        await dbRealtimeDatabase.ref(`spamlinks/${value.id}`).remove();
        return true;
    } catch (error) {
        console.error(`Firebase Realtime: ${error}`);
        return false;
    }
};

exports.listenForSpamLinkChanges = async () => {
    logger.firebase('Listening for Spam Link changes');

    dbRealtimeDatabase.ref('spamlinks').on('child_added', (dataSnapshot) => {
        /** @type {SpamLink} */
        const data = dataSnapshot.val();
        this.firebaseSpamLinkArray.push({ ...data, id: dataSnapshot.key });
        // logger.firebase(`Added ${data.link} to spamlink Array`);
    });

    dbRealtimeDatabase.ref('spamlinks').on('child_removed', (dataSnapshot) => {
        /** @type {SpamLink} */
        const data = dataSnapshot.val();
        const index = this.firebaseSpamLinkArray.findIndex((e) => e.link === data.link);
        this.firebaseSpamLinkArray.splice(index, 1);
        // logger.firebase(`Deleted ${data.link} in spamlink Array`);
    });
};

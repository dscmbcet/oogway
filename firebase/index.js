const admin = require('firebase-admin');
require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
const { logger } = require('../utils/logger');
const { addOffenceSheet } = require('../excel');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://master-oogway-bot-default-rtdb.firebaseio.com/',
});

const dbFirebase = admin.firestore();
const dbRealtimeDatabase = admin.database();

/**
 * @typedef {import('../utils/models/FirebaseReaction').FirebaseReaction} FirebaseReaction
 * @typedef {import('../utils/models/FirebaseTreat').FirebaseTreat} FirebaseTreat
 * @typedef {import('../utils/models/FirebaseUser').FirebaseUser} FirebaseUser
 * @typedef {import('../utils/models/SpamLink').SpamLink} SpamLink
 */

/** @type {FirebaseReaction[]} */
exports.reactionDataArray = [];

/** @type {FirebaseTreat[]} */
exports.treatDataArray = [];

/** @type {SpamLink[]} */
exports.firebaseSpamLinkArray = [];

logger.firebase('Initializing');

/** @param {Discord.GuildMember} user  */
const parseUser = (user) => {
    const roleArray = user.roles.cache.map((e) => ({ roleName: e.name, roleID: e.id }));

    return {
        id: user.id,
        name: user.nickname ? user.nickname : user.displayName,
        email: 'Not Provided',
        branch: 'Not Provided',
        college: 'Not Provided',
        year: 0,
        discordID: user.user.tag,
        roles: roleArray,
        banned: { status: false, reason: '' },
        kicked: { status: false, reason: '' },
        verificationCode: '',
        verified: false,
        verifiedEmail: false,
    };
};

// BAN/KICK USER FUNCTIONS ----------------------

/**
 * Adds user to blacklist sheet
 * @param {Discord.GuildMember} user
 * @param {Discord.GuildAuditLogsEntry} banned
 * @param {Discord.GuildAuditLogsEntry} kicked
 */
exports.updateBanOrKickMember = async (user, banned, kicked, status) => {
    const colRef = dbFirebase.collection('users');
    let data = await this.getMember(user);
    if (banned) {
        data = { ...data, banned: { status, reason: banned.reason } };
    }
    if (kicked) {
        data = { ...data, kicked: { status, reason: kicked.reason } };
    }

    if (data.newUser) {
        try {
            await colRef.doc(user.id).create(data);
        } catch (error) {}

        if (banned && banned.reason !== '') logger.firebase(`Added ${user.user.tag} to banned: ${banned.reason}`);
        if (kicked && kicked.reason !== '') logger.firebase(`Added ${user.user.tag} to kicked: ${kicked.reason}`);
    } else {
        try {
            await colRef.doc(user.id).update(data);
        } catch (error) {}

        if (banned && banned.reason !== '') logger.firebase(`Updated ${user.user.tag} to banned: ${banned.reason}`);
        if (kicked && kicked.reason !== '') logger.firebase(`Updated ${user.user.tag} to kicked: ${kicked.reason}`);
    }

    addOffenceSheet(data, banned, kicked);
};

// BAN/KICK USER FUNCTIONS : END ----------------------

// USER FUNCTIONS ----------------------

/**
 * Updates roles of given user
 * @param {Discord.GuildMember} user
 */
exports.updateUser = async (user) => {
    const colRef = dbFirebase.collection('users');
    let data = await this.getMember(user);

    if (data.newUser) {
        try {
            await colRef.doc(user.id).create(data);
        } catch (error) {}
        logger.firebase(`Added ${user.user.tag}`);
    } else {
        const roleArray = user.roles.cache.map((e) => ({ roleName: e.name, roleID: e.id }));
        data = {
            name: user.nickname ? user.nickname : data.name,
            discordID: user.user.tag,
            roles: roleArray,
        };
        try {
            await colRef.doc(user.id).update(data);
        } catch (error) {}
        logger.firebase(`Updated ${user.user.tag}`);
    }
};

/**
 * Gets a member data
 * @param {Discord.GuildMember} user
 * @returns {Promise<FirebaseUser>} user
 */
exports.getMember = async (user) => {
    const colRef = dbFirebase.collection('users');
    let data = (await colRef.doc(user.id).get()).data();
    if (!data) {
        data = parseUser(user);
        data = { ...data, newUser: true };
        try {
            await colRef.doc(user.id).create(data);
        } catch (error) {}
    } else {
        data.newUser = false;
    }
    return data;
};

/**
 * Gets all member data
 * @returns {Promise<FirebaseUser[]>} user
 */
exports.getAllMember = async () => {
    const colRef = await dbFirebase.collection('users').get();
    const data = colRef.docs.map((doc) => doc.data());
    return data;
};

/**
 * Adds a new member to firebase
 * @param {Discord.GuildMember} user
 * @param {string} name
 * @param {string} email
 * @param {number} verificationCode
 * @param {string} branch
 * @param {number} year
 * @param {boolean} verifiedEmail
 * @param {boolean} verified
 */
exports.addNewMember = async ({ user, name, email, verificationCode, branch, year, college, verifiedEmail, verified }) => {
    let data = this.getMember(user);
    const colRef = dbFirebase.collection('users');

    if (name) data = { ...data, name };
    if (email) data = { ...data, email };
    if (verificationCode) data = { ...data, verificationCode };
    if (branch) data = { ...data, branch };
    if (year) data = { ...data, year };
    if (college) data = { ...data, college };
    if (verifiedEmail !== undefined) data = { ...data, verifiedEmail };
    if (verified !== undefined) {
        data = { ...data, newUser: false, verified };
    }
    try {
        await colRef.doc(user.id).update(data);
    } catch (error) {}
};

// USER FUNCTIONS : END ----------------------

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

// Spam Handlers

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
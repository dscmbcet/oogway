const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { dbFirebase } = require('.');
const { logger } = require('../utils/logger');

/** @typedef {import('../models/FirebaseUser').FirebaseUser} FirebaseUser */

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

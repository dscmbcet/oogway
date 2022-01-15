const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { dbFirebase } = require('.');
const { getMember } = require('./member');
const { addOffenceSheet } = require('../excel');
const { logger } = require('../utils/logger');

/**
 * Adds user to blacklist sheet
 * @param {Discord.GuildMember} user
 * @param {Discord.GuildAuditLogsEntry} banned
 * @param {Discord.GuildAuditLogsEntry} kicked
 */
exports.updateBanOrKickMember = async (user, banned, kicked, status) => {
    const colRef = dbFirebase.collection('users');
    let data = await getMember(user);
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

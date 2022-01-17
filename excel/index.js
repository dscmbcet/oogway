const { google } = require('googleapis');
const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { SPREADSHEET_ID, CREDENTIALS } = require('../utils/constants');

const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

// ----------- Sheet helper functions ----------

/**
 * @typedef {import('../types/FirebaseUser').FirebaseUser} FirebaseUser
 * @typedef {import('../types/LeaderBoardUser').LeaderBoardUser} LeaderBoardUser
 */

/**
 * Initializes GoogleSheet
 * @returns {Promise<any[][]>}
 */
async function getSheetValuesByName(rangeName) {
    const client = await auth.getClient();
    const googlesheets = google.sheets({ version: 'v4', auth: client });
    const {
        data: { values },
    } = await googlesheets.spreadsheets.values.get({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range: rangeName,
    });

    return values;
}

/**
 * Adds values to given range
 * @param {string} range
 * @param {any[][]} values
 */
async function appendToSheet(range, values) {
    const client = await auth.getClient();
    const googlesheets = google.sheets({ version: 'v4', auth: client });
    await googlesheets.spreadsheets.values.append({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values,
        },
    });
}

/**
 * Adds values to given range
 * @param {string} range
 * @param {any[][]} values
 */
async function updateSheet(range, values) {
    const client = await auth.getClient();
    const googlesheets = google.sheets({ version: 'v4', auth: client });
    await googlesheets.spreadsheets.values.update({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            majorDimension: 'ROWS',
            range,
            values,
        },
    });
}

/**
 * Clear and then adds values to given range
 * @param {string} range
 * @param {any[][]} values
 */
async function clearAndUpdateSheet(range, values) {
    const client = await auth.getClient();
    const googlesheets = google.sheets({ version: 'v4', auth: client });
    await googlesheets.spreadsheets.values.clear({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range,
    });
    await updateSheet(range, values);
}

// ----------- Sheet helper functions : END ----------

/**
 * Adds offensive emoji message data to blacklist sheet
 * @param {FirebaseUser} user
 * @param {Discord.GuildAuditLogsEntry} banned
 * @param {Discord.GuildAuditLogsEntry} kicked
 */
async function addOffenceSheet(user, banned, kicked) {
    const values = [new Date().toISOString(), user.id, user.discordID, user.name, user.email, user.verified ? 'TRUE' : 'FALSE'];
    if (banned && banned.reason !== '') await appendToSheet('Blacklist!A:H', [[...values, 'BAN', banned.reason]]);
    if (kicked && kicked.reason !== '') await appendToSheet('Blacklist!A:H', [[...values, 'KICK', kicked.reason]]);
}

/**
 * Updates the data of user to sheet 'Database' and adds everyone in 'Old Database'
 * @param {any[][]} data
 */
async function updateDatabase(data) {
    await clearAndUpdateSheet('Database!A1:ZA', data);
}

module.exports = {
    addOffenceSheet,
    getSheetValuesByName,
    clearAndUpdateSheet,
    updateDatabase,
    appendToSheet,
};

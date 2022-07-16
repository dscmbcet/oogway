require('dotenv').config();
const nodemailer = require('nodemailer');
const { WEB_CREDENTIALS, EMAIL_TOKEN } = require('./constants');
const { htmlParser } = require('./html_parser');
const { logger } = require('./logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 5,
    maxMessages: 30,
    rateDelta: 60000,
    rateLimit: 500,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: WEB_CREDENTIALS.client_id,
        clientSecret: WEB_CREDENTIALS.client_secret,
        user: process.env.GOOGLE_USER,
        refreshToken: EMAIL_TOKEN.refresh_token,
        accessToken: EMAIL_TOKEN.access_token,
        expires: EMAIL_TOKEN.expires_in,
    },
});

/**
 * Sends a  mail
 * @param {string} email
 * @param {string} verificationCode
 */
async function sendMail(email, verificationCode) {
    logger.info(`Sending mail to ${email}`);
    const html = htmlParser().replace('<#verificationCode>', verificationCode);

    const mailOptions = {
        from: `"GDSC MBCET BOT" <${process.env.GOOGLE_USER}>`,
        to: email,
        subject: 'Verification For GDSC MBCET Discord Server',
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Mail has been sent to ${email}`);
        return true;
    } catch (e) {
        logger.error(`IMPORTANT: Error Occured While Sending ERROR Mail: ${e.message} | ${e?.stack}`);
        return false;
    }
}

module.exports = { sendMail };

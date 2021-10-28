require('dotenv').config();
const fs = require('fs');
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
 * @param {String} email
 * @param {Array} verificationCode
 */
async function sendMail(email, verificationCode) {
    logger.info(`Sending mail to ${email}`);
    const html = htmlParser().replace('<#verificationCode>', verificationCode);

    return new Promise(
        (resolve) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            transporter.sendMail(
                {
                    from: `"GDSC MBCET BOT" <${process.env.GOOGLE_USER}>`,
                    to: email,
                    subject: 'Verification For GDSC MBCET Discord Server',
                    html,
                },
                (e) => {
                    if (e) {
                        logger.error(`IMPORTANT: Error Occured While Sending ERROR Mail: ${e.message}`);
                        resolve(false);
                    } else {
                        logger.info(`Mail has been sent to ${email}`);
                        resolve(true);
                    }
                }
            )
        // eslint-disable-next-line function-paren-newline
    );
}

module.exports = { sendMail };

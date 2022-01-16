/* eslint-disable max-len */
module.exports = {
    PREFIX: JSON.parse(process.env.CONFIG).prefix,
    TEST_SERVER_ID: '853868805473173534',
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
    CREDENTIALS: JSON.parse(process.env.CREDENTIALS),
    EMAIL_TOKEN: JSON.parse(process.env.EMAIL_TOKEN),
    WEB_CREDENTIALS: JSON.parse(process.env.WEB_CREDENTIALS).web,
    TESTER_ID: process.env.TESTER_ID,

    COLORS: {
        red: 0xff0000,
        green: 0x00ff00,
        yellow: 0xffff00,
        orange: 0xffa500,
        purple: 0x6a0dad,
        cyan: 0x00ffff,
    },

    EMAIL_REGEX:
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    API_URL: {
        joke: 'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,racist,sexist,explicit',
        quotes: 'https://api.quotable.io/random',
    },

    TEAM_EMOJIS: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍'],

    REACTION_TYPE: {
        TEAM: 'TEAM',
        ANNOYMOUS: 'ANNOYMOUS',
        TREAT: 'TREAT',
    },

    TIMEZONE: 'Asia/Kolkata',
};

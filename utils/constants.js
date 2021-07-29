/* eslint-disable max-len */
require('dotenv').config();
module.exports = {
    PREFIX: JSON.parse(process.env.CONFIG).prefix,
    TEST_SERVER_ID: '853868805473173534',

    COLORS: {
        red: 0xff0000,
        green: 0x00ff00,
        yellow: 0xffff00,
        orange: 0xffa500,
        purple: 0x6a0dad,
        cyan: 0x00ffff,
    },

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
};

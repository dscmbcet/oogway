require('dotenv').config();
module.exports = {
    prefix: JSON.parse(process.env.CONFIG).prefix,
    test_server_id: '853868805473173534',

    colors: {
        red: 0xff0000,
        green: 0x00ff00,
        yellow: 0xffff00,
        orange: 0xffa500,
        purple: 0x6a0dad,
        cyan: 0x00ffff,
    },

    API_URL: {
        joke: 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single',
        quotes: 'https://api.quotable.io/random',
    },

    team_emojis: [
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣',
        '6️⃣',
        '7️⃣',
        '8️⃣',
        '9️⃣',
        '🔟',
        '❤️',
        '🧡',
        '💛',
        '💚',
        '💙',
        '💜',
        '🤎',
        '🖤',
        '🤍',
    ],

    REACTION_TYPE: {
        TEAM: 'TEAM',
        ANNOYMOUS: 'ANNOYMOUS',
    },
};
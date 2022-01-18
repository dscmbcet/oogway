const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const TicTacToe = require('discord-tictactoe');
const { PREFIX } = require('../utils/constants');

module.exports = {
    name: 'ttt',
    usage: `${PREFIX}ttt [@OpponentUsername]`,
    description: 'Play Tic Tac Toe',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const game = new TicTacToe({ language: 'en' });
        game.handleMessage(message);
    },
};

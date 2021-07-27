const fs = require('fs');
const { logger } = require('./logger');

async function generate() {
    const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));
    const infoArr = commandFiles.map((file) => {
        const command = require(`../commands/${file}`);
        return {
            name: command.name,
            usage: `\`${command.usage === undefined ? '-' : command.usage}\``,
            description: `${command.description === undefined ? '-' : command.description}`,
        };
    });

    infoArr.sort();
    const dataCommands = ['## Commands'];
    infoArr.forEach((command) => {
        dataCommands.push(`\n#### ${command.name}`);
        dataCommands.push(`\n- Usage: ${command.usage.replace('~', '!')}`);
        dataCommands.push(`- Description: ${command.description}`);
    });

    fs.readFile('README.md', 'utf8', (err, data) => {
        if (err) return logger.log(err);
        const regex = /(?<=<!-- COMMANDS:START - DO NOT DELETE -->\r\n)[\S\s]*(?=<!-- COMMANDS:END - DO NOT DELETE -->)/g;
        const match = data.match(regex);
        if (!match) return logger.error('No Match Found');

        const result = data.replace(regex, `\r\n${dataCommands.join('\r\n')}\r\n\r\n`);

        fs.writeFileSync('README.md', result);
    });

    logger.log('Updated README.md commands');
}

(async () => {
    await generate();
})();

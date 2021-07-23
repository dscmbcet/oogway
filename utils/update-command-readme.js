const fs = require("fs");

async function generate() {
    const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
    let infoArr = commandFiles.map((file) => {
        const command = require(`../commands/${file}`);
        return {
            name: command.name,
            usage: `\`${command.usage === undefined ? "-" : command.usage}\``,
            description: `${command.description === undefined ? "-" : command.description}`,
        };
    });

    infoArr.sort();
    let dataCommands = ['## Commands'];
    for (const command of infoArr) {
        dataCommands.push(`\n#### ${command.name}`);
        dataCommands.push(`\n- Usage: ${command.usage}`)
        dataCommands.push(`- Description: ${command.description}`)
    }

    fs.readFile('README.md', 'utf8', function (err, data) {
        if (err) return console.log(err);
        const regex = /(?<=<!-- COMMANDS:START - DO NOT DELETE -->\r\n)[\S\s]*(?=<!-- COMMANDS:END - DO NOT DELETE -->)/g;
        const match = data.match(regex);
        if (!match) return console.error('No Match Found');

        const result = data.replace(regex, '\r\n' + dataCommands.join('\r\n') + '\r\n\r\n');

        fs.writeFileSync('README.md', result);
    });

    console.log('Updated README.md commands');
}

; (async () => {
    await generate();
})()

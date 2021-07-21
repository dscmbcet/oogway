const fs = require("fs");
async function generate() {
    const commandFiles = fs
        .readdirSync("./commands/")
        .filter((file) => file.endsWith(".js"));
    let infoArr = commandFiles.map((file) => {
        const command = require(`../commands/${file}`);
        return {
            name: command.name,
            usage: `\`${command.usage === undefined ? "-" : command.usage}\``,
            description: `${command.description === undefined ? "-" : command.description}`,
        };
    });

    infoArr.sort();
    let data = ['## Commands'];
    for (const command of infoArr) {
        data.push(`\n#### ${command.name}`);
        data.push(`\n- Usage: ${command.usage}`)
        data.push(`- Description: ${command.description}`)
    }
    fs.writeFileSync('commands.md', data.join('\n'));
    console.log('Generated commands.md');
}


; (async () => {
    await generate();
})()

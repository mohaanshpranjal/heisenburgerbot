const fs = require('fs');
const path = require('path');
const { Collection } = require("discord.js");

function parseCommands(includeTest = false) {
    commands = new Collection();

    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles)
    {
        // extracting commands from the files
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            if (!includeTest && command.data.testCommand) {continue;}
            commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    return commands
}

async function deployCommands(client, message, deployGlobal = false) {
    const commandlist = client.commands.map(cmd => cmd.data.toJSON());

    if (deployGlobal) {
        await client.application.commands.set(commandlist);
    } else {
        // set guild commands (for testing)
        await message.guild.commands.set(commandlist);
    }
}

module.exports = {
    parseCommands,
    deployCommands
};
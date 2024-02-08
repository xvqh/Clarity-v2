// async initSlashCommands(): Promise<void> {
//     const subFolders = fs.readdirSync(`./source/slashCmds`)
//     for (const category of subFolders) {
//         const commandsFiles = fs.readdirSync(`./source/slashCmds/${category}`).filter(file => file.endsWith('.js'))
//         for (const commandFile of commandsFiles) {
//             const command = await import(`../../slashCmds/${category}/${commandFile}`);

//             command.category = category
//             command.commandFile = commandFile
//             this.slashCommands.set(command.name, command)
//         }
//     }
// }
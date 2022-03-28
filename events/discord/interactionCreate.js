module.exports = (client, interaction) => {
  if (interaction.isCommand()) {
    const command = client.interactions.get(interaction.commandName);

    if (!command)
      return interaction.reply({
        content: ":x: Something Went Wrong | Perhaps command not registered?",
        ephemeral: true,
      });

    let suspend = false;

    if (suspend == true) {
      return interaction.reply({
        content: `Maintenance mode is on!\nThe bot is currently under maintenance and isn't usable as of now!`,
        ephemeral: true,
      });
    } else if (suspend == false) {
      command.run(client, interaction);
    }
  }
};

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "randomcolor",
  description: "Sends a random color's hex code",
  run: async (client, interaction) => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const hexembed = new MessageEmbed()
      .setColor(`#${randomColor}`)
      .setTitle("Here's a random color")
      .setDescription("The embed's color is your preview!")
      .addField("**Hex code: **", `#${randomColor}`)
      .setTimestamp()
      .setFooter(`${interaction.user.username}`, interaction.user.avatarURL());
    interaction.reply({
      embeds: [hexembed],
    });
  },
};

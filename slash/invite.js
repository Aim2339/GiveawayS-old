const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "invite",
  description: "➕ Invite the bot to your server!",
  run: async (client, interaction) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(`Invite ${client.user.username}`)
        .setStyle("LINK")
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`
        )
    );
    let invite = new MessageEmbed()
      .setAuthor(`Invite ${client.user.username} `, client.user.avatarURL())
      .setTitle("Invite Link!")
      .setDescription(
        `Invite ${client.user} to your server & enjoy seamless giveaways with advanced features totally for free!`
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(
        `Requested by ${interaction.user.username} | GiveawaySforLife`,
        interaction.user.displayAvatarURL()
      );
    interaction.reply({ embeds: [invite], components: [row] });
  },
};

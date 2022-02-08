const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "faq",
  description: "🗣 Frequently Asked Questions of GiveawayS!",
  run: async (client, interaction) => {
    const faembed = new MessageEmbed()
      .setTitle(`FAQ's of ${client.user.username}`)
      .setColor("RANDOM")
      .addFields(
        {
          name: "1. If the bot goes down suddenly will my giveaway be ended when the bot comes back online?",
          value: `Yes! the bot has a well-defined storage system and will end at the set time only.`,
          inline: false,
        },
        {
          name: "2. How can I trust the bot, its not even verified?",
          value: `I can prove it to you, the bot is open-source and you can check the code for each and every command here: https://github.com/Aim2339/GiveawayS`,
          inline: false,
        },
        {
          name: "3. Who do I contact if I face any difficulty with the bot?",
          value: `Currently the bot doesnt have a support server, you can contact me using the feedback command and also through DM's: **Aim#2339**!`,
          inline: false,
        },
        {
          name: "4. What are Interaction failed and Invalid interaction application command errors?",
          value: `The interaction failed error means the bot is either down/problems on your end...Invalid interaction application command means that the specific command you are trying to use has been updated by the dev...Both should be fixed in a couple of mins!`,
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter(
        `Requested by ${interaction.user.username} | GiveawaysforLife`,
        interaction.user.displayAvatarURL()
      );
    interaction.reply({
      embeds: [faembed],
    });
  },
};

const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor("RANDOM")
      .setTitle(
        ":white_check_mark: Entry Approved! | You have a chance to win!!"
      )
      .setDescription(
        `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been approved!`
      );

    let denied = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor("RANDOM")
      .setTitle(":x: Entry Denied | Databse Entry Not Found & Returned!")
      .setDescription(
        `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been denied, please review the requirements to the giveaway properly.`
      );

    let client = messageReaction.message.client;
    if (reactor.user.bot) return;
    if (giveaway.extraData) {
      if (
        giveaway.extraData.role !== "null" &&
        !reactor.roles.cache.get(giveaway.extraData.role)
      ) {
        messageReaction.users.remove(reactor.user);
        return reactor
          .send({
            embeds: [denied],
          })
          .catch((e) => {});
      }

      return reactor
        .send({
          embeds: [approved],
        })
        .catch((e) => {});
    } else {
      return reactor
        .send({
          embeds: [approved],
        })
        .catch((e) => {});
    }
  },
};

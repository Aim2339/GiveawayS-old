const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms");
module.exports = {
  name: "create",
  description: "🎉 Create a giveaway",

  options: [
    {
      name: "duration",
      description:
        "How long the giveaway should last for. Example values: 1m, 1h, 1d",
      type: "STRING",
      required: true,
    },
    {
      name: "winners",
      description: "How many winners the giveaway should have",
      type: "INTEGER",
      required: true,
    },
    {
      name: "prize",
      description: "What the prize of the giveaway should be",
      type: "STRING",
      required: true,
    },
    {
      name: "channel",
      description: "The channel to start the giveaway in",
      type: "CHANNEL",
      required: true,
    },
    {
      name: "pingrole",
      description: "The role to ping when starting the giveaway",
      type: "ROLE",
      required: false,
    },
    {
      name: "bonusrole",
      description: "Role which would recieve bonus entries",
      type: "ROLE",
      required: false,
    },
    {
      name: "bonusamount",
      description: "The amount of bonus entries the role will recieve",
      type: "INTEGER",
      required: false,
    },
    {
      name: "reqrole",
      description: "Role you want to add as giveaway joining requirement",
      type: "ROLE",
      required: false,
    },
    {
      name: "note",
      description:
        "Anything you wanna type (can include requirements/how to claim)",
      type: "STRING",
      required: false,
    },
  ],

  run: async (client, interaction) => {
    // If the member doesn't have enough permissions
    if (
      !interaction.member.permissions.has("MANAGE_MESSAGES") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          ":x: You need to have the manage messages permissions to start giveaways.",
        ephemeral: true,
      });
    }

    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayDuration = interaction.options.getString("duration");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");
    const giveawayPing = interaction.options.getRole("pingrole");
    const bonusRole = interaction.options.getRole("bonusrole");
    const bonusEntries = interaction.options.getInteger("bonusamount");
    const giveawayNote = interaction.options.getString("note");
    let rolereq = interaction.options.getRole("reqrole");

    const logChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "giveaway-log"
    );

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: ":x: Please select a text channel!",
        ephemeral: true,
      });
    }
    if (isNaN(ms(giveawayDuration))) {
      return interaction.reply({
        content: ":x: Please select a valid duration!",
        ephemeral: true,
      });
    }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content:
          ":x: Please select a valid winner count! greater or equal to one.",
      });
    }
    if (giveawayChannel.isThread()) {
      module.exports = (client) => {
        client.on("threadCreate", (thread) => {
          try {
            thread.join();
          } catch (e) {
            console.log(e);
          }
        });
      };
    }
    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: You must specify how many bonus entries would ${bonusRole} recieve!`,
          ephemeral: true,
        });
      }
    }

    if (bonusRole && rolereq) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> **${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!\nOnly members having ${rolereq} are allowed to participate in this giveaway!`;
    }
    if (!bonusRole && rolereq) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> Only members having ${rolereq} are allowed to participate in this giveaway!`;
    }
    if (bonusRole && !rolereq) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> **${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!`;
    }
    if (!bonusRole && !rolereq) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**`;
    }

    const nembed = new MessageEmbed()
      .setTitle("Note from the host")
      .setColor("RANDOM")
      .setTimestamp()
      .addFields({
        name: `Note from ${interaction.user.username}!`,
        value: `>>> ${giveawayNote}`,
      })
      .setFooter(
        `Note from ${interaction.user.username} | GiveawaysforLife`,
        interaction.user.displayAvatarURL()
      );

    let msg = await interaction.reply({
      content: `**Is everything correct?**\n>>> >>> - Channel: ${giveawayChannel}\n>>> - Duration: ${giveawayDuration}\n>>> - Winners: ${giveawayWinnerCount}\n>>> - Prize: ${giveawayPrize}\n>>> - Role to ping: ${giveawayPing}\n>>> - Bonus role: ${bonusRole}\n>>> - Bonus amount: ${bonusEntries}\n>>> - Requirement role: ${rolereq}\n>>> - Note: ${giveawayNote}`,
      ephemeral: false,
      fetchReply: true,
    });
    await msg.react("✅").then(() => msg.react("❌"));
    const filter = (reaction, user) => {
      return (
        ["✅", "❌"].includes(reaction.emoji.name) &&
        user.id === interaction.user.id
      );
    };

    msg
      .awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "✅") {
          interaction.editReply(`Giveaway has started in ${giveawayChannel}`);
          client.giveawaysManager.start(giveawayChannel, {
            // The giveaway duration
            duration: ms(giveawayDuration),
            // The giveaway prize
            prize: giveawayPrize,
            // The giveaway winner count
            winnerCount: parseInt(giveawayWinnerCount),
            // The giveaway host
            hostedBy: `<@!${interaction.user.id}>`,
            // BonusEntries If Provided
            bonusEntries: [
              {
                // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
                bonus: new Function(
                  "member",
                  `return member.roles.cache.some((r) => r.name === \'${bonusRole?.name}\') ? ${bonusEntries} : null`
                ),
                cumulative: false,
              },
            ],
            messages,
            extraData: {
              role: rolereq == null ? "null" : rolereq.id,
            },
          });
          msg.reactions.removeAll();

          if (logChannel) {
            logChannel.send(
              `**Giveaway started!**\n>>> ${interaction.user.username} started a giveaway of **${giveawayPrize}** in ${giveawayChannel}!`
            );
          } else {
            return;
          }

          if (giveawayNote && giveawayPing) {
            giveawayChannel.send({ embeds: [nembed] });
            giveawayChannel.send(`${giveawayPing}`);
          }
          if (giveawayNote && !giveawayPing) {
            giveawayChannel.send({ embeds: [nembed] });
          }
          if (!giveawayNote && giveawayPing) {
            giveawayChannel.send(`${giveawayPing}`);
          }
          if (!giveawayNote && !giveawayPing) {
            return;
          }
        } else {
          interaction.editReply(":x: Giveaway was cancelled");
          msg.reactions.removeAll();
        }
      })
      .catch((collected) => {
        interaction.editReply(
          ":x: You took time to reply, giveaway was canceled!"
        );
        msg.reactions.removeAll();
      });
  },
};

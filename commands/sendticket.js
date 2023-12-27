const {Permissions, MessageActionRow, MessageButton} = require("discord.js");
const Discord = require("discord.js");
const config = require("../config/config.json");
exports.run = (client, message, args) => {
    console.log('get command')
    if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        message.delete();
        const embed = config.Embeds.sendticket;
        const convert = new Discord.MessageEmbed(embed);
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('exp_ticket_create')
                    .setLabel(config.Buttons.sendticket.text)
                    .setStyle(config.Buttons.sendticket.color)
            )
        message.channel.send({embeds: [convert], components: [row]});
    } else {
        message.channel.send(config.Messages["message-no-perms"]);
    }
}
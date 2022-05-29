const {Permissions, MessageActionRow, MessageButton} = require("discord.js");
const Discord = require("discord.js");
const config = require("../config/config.json");
exports.run = (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id == config.roles.teamrole)) return message.channel.send(config.Messages["message-no-perms"]);
    let user = message.mentions.members.first();
    if (user == null) return message.channel.send(config.Messages["no-member-add"]);
    const embed = config.Embeds.add;
    const convert = new Discord.MessageEmbed(embed)
        .setDescription(embed.description.replace("{0}", user.user.username));
    ;
    if (message.channel.name.startsWith("ticket-")) {
        message.channel.permissionOverwrites.create(user.id, {
            VIEW_CHANNEL: false, SEND_MESSAGES: false, READ_MESSAGE_HISTORY: false
        })
        message.channel.send({embeds: [convert]})
    }
}
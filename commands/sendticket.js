const {Permissions} = require("discord.js");
const config = require("../config/config.json");
exports.run = (client, message, args) => {
    if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        message.channel.send(config.Messages["message-no-perms"]);
    } else {
        message.channel.send(config.Messages["message-no-perms"]);
    }
}
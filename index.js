const Discord = require("discord.js")
const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', 'GUILD_SCHEDULED_EVENTS'],
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'GUILD_SCHEDULED_EVENT'],
});
const config = require("./config/config.json");
const ticket = require("./manager/TicketManger");
const {MessageActionRow, MessageButton} = require("discord.js");

client.on("ready", () => {
    console.log("[]----------------------[]" + "\nTicketBot has been successfully launched!" + "\nDiscord: https://discord.gg/V8q2MT7gbm" + "\nAuthor: Exceptionpilot (EXP-Development)" + "\n[]----------------------[]");
    client.user.setActivity(config.Activity.status, {type: config.Activity.type})
    client.user.setPresence({status: config.Activity.onlinestatus})
    ticket.reloadStorage();
})

client.on("stop")


client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.channel.name.includes("ticket-")) {
        const ticketid = message.channel.name.split("ticket-")[1];
        const ticketClass = ticket.getStorage().tickets.find(t => t.ticketId == ticketid);
        if (ticketClass != null) {
            ticketClass.transcript.push({"member": message.author.username, "message": message.content});
            ticket.saveStorage();
        }
    }
    if (message.content.indexOf(config.Prefix) !== 0) return;
    const args = message.content.slice(config.Prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (config.ActiveCommands.toString().toLowerCase().includes(command)) {
        try {
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(client, message, args);
        } catch (err) {
            console.log(err)
        }
    }
});

client.on("interactionCreate", button => {
    if (button.isButton()) {
        if (button.customId == "exp_ticket_close") {
            const user = button.user;
            const ticketid = button.message.channel.name.split("ticket-")[1];
            const ticketClass = ticket.getStorage().tickets.find(t => t.ticketId == ticketid);
            if (ticketClass != null) {
                if (!ticketClass.open) return;
                const embed = config.Embeds.closed;
                const convert = new Discord.MessageEmbed(embed);
                button.message.channel.send({embeds: [convert]});

                setTimeout(() => {
                    button.message.channel.delete();
                }, 10 * 1000);
                ticketClass.open = false;
                ticket.saveStorage();
            }
            button.reply({
                content: config.Messages["ticket-close"],
                ephemeral: true
            })
        }
        if (button.customId == "exp_ticket_create") {
            const user = button.user;
            if (ticket.getTicketFromUser(user.id) == null) {
                if (!user.bot) {
                    button.guild.channels.create(`ticket-${ticket.getTicketName(ticket.addTicket({
                        "owner": user.id, "open": true, "transcript": []
                    }))}`, {
                        type: 'text',
                        parent: config.category.tickets,
                        permissionOverwrites: [
                            {
                                allow: "VIEW_CHANNEL",
                                id: user.id
                            },
                            {
                                allow: "VIEW_CHANNEL",
                                id: config.roles.teamrole
                            }
                        ]
                    }).then(ch => {
                        const embed = config.Embeds.openticket;
                        const convert = new Discord.MessageEmbed(embed);
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('exp_ticket_close')
                                    .setLabel(config.Buttons.closeticket.text)
                                    .setStyle(config.Buttons.closeticket.color)
                            );
                        ch.send(`<@${config.roles.teamrole}>`).then(msg => {
                            msg.delete({timeout: 1000})
                        }).catch(console.error);
                        ch.send(`<@${user.id}>`).then(msg => {
                            msg.delete({timeout: 1000})
                        }).catch(console.error);
                        ch.send({embeds: [convert], components: [row]})
                    }).catch(err => console.log(err));
                    button.reply({
                        content: config.Messages["ticket-open"],
                        ephemeral: true
                    })
                }
            } else {
                button.reply({
                    content: config.Messages["ticket-arleadyhas"],
                    ephemeral: true
                })
            }
        }
    }
})

client.login(config.Token).then(() => null)
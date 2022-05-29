const fs = require("fs");
let storage = {"ticketId": 0, "tickets": []};
module.exports = {
    getTicketName: function (counter) {
        return counter;
    }, addTicket: function (ticket) {
        storage.ticketId++;
        ticket.ticketId = storage.ticketId;
        storage.tickets.push(ticket);
        this.saveStorage();
        return storage.ticketId;
    }, getTicketFromUser: function (userid) {
        return storage.tickets.find(ticket => ticket.owner == userid && ticket.open == true);
    }, reloadStorage: function () {
        let data = fs.readFileSync('./storage/tickets.json', 'utf8');
        if (data != "") {
            storage = JSON.parse(data)
        } else {
            this.saveStorage()
        }
    }, saveStorage: function () {
        fs.writeFile('./storage/tickets.json', JSON.stringify(storage, null, 4), function (err) {
            if (err) console.log("error", err)
        });
    }, getStorage: function () {
        this.reloadStorage();
        return storage;
    }
}
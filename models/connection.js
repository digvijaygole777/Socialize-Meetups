var mongoose = require('mongoose');

module.exports = class Connection {
    constructor(connectionId, connectionTopic, connectionName, connectionDetails, date, time, address, userId) {

        this.connectionId = connectionId;
        this.connectionTopic = connectionTopic;
        this.connectionName = connectionName;
        this.connectionDetails = connectionDetails;
        this.date = date;
        this.time = time;
        this.address = address;
        this.userId = userId;
    }

}

module.exports.connectionSchema = new mongoose.Schema({
    connectionId: { type: Number, required: true },
    connectionTopic: String,
    connectionName: String,
    connectionDetails: String,
    date: String,
    time: String,
    address: String,
    userId: { type: Number, required: true }
}, {
    versionKey: false
});
var mongoose = require('mongoose')
const conObj = require('../models/connection');
const Connection = require('../models/connection.js');
var ConnectionModel = mongoose.model("Conections", Connection.connectionSchema, 'Conections');

//get connection by topics
var getConnectionTypes = function(connections) {
    return new Promise((resolve, reject) => {
        ConnectionModel.find({}).then(data => {

            var connectionTypes = []
            var scanned = [];
            for (let i = 0; i < data.length; i++) {
                if (scanned[data[i].connectionTopic]) continue;
                scanned[data[i].connectionTopic] = true;
                connectionTypes.push(data[i].connectionTopic);
            }
            resolve(connectionTypes);
        }).catch(err => { return reject(err); })
    })
}

//get all connections
var getConnections = function(connections) {
    return new Promise((resolve, reject) => {
        connections.find({}).then(data => {
            let connectionsModel = [];

            for (let i = 0; i < data.length; i++) {
                connectionsModel.push(new conObj(data[i].connectionId, data[i].connectionTopic, data[i].connectionName, data[i].hostedBy, data[i].connectionDetails,
                    data[i].location, data[i].date, data[i].time, data.userId));
            }
            resolve(connectionsModel);
        }).catch(err => { return reject(err); })
    })
};

//get single connection with its id
var getConnection = function(connectionId, connections) {

    return new Promise((resolve, reject) => {
        connections.findOne({ connectionId: connectionId }).then(data => {

            let connection = new conObj(data.connectionId, data.connectionTopic, data.connectionName, data.connectionDetails,
                data.date, data.time, data.address, data.userId);
            resolve(connection);
        }).catch(err => { return reject(err); })
    })
};

//get newly created connections
var getUserCreatedConnections = function(userId, connections) {

    return new Promise((resolve, reject) => {
        connections.find({ userId: userId }).then(data => {
            let connectionsModel = [];
            for (let i = 0; i < data.length; i++) {
                connectionsModel.push(new conObj(data[i].connectionId, data[i].connectionName, data[i].connectionTopic, data[i].connectionDetails,
                    data[i].date, data[i].time, data[i].location, data.userId));
            }
            resolve(connectionsModel);
        }).catch(err => { return reject(err); })
    })
};

//check if the connections exist
var doesConnectionExist = function(connectionId, connections) {
    return new Promise((resolve, reject) => {
        connections.find({ connectionId: connectionId }).then(data => {
            resolve(data.length > 0);
        }).catch(err => { return reject(err); })
    })
};

module.exports = {

    doesConnectionExist: doesConnectionExist,
    getUserCreatedConnections: getUserCreatedConnections,
    getConnection: getConnection,
    getConnections: getConnections,
    getConnectionTypes: getConnectionTypes

};
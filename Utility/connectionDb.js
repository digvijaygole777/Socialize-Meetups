var database = require('./connectionData');
var Connection = require('../model/connection');

module.exports.getConnectionTypes = function() {
    var connections = database.connections;
    connectionTypes = [], scanned = [];
    for (var i = 0; i < connections.length; i++) {
        if (scanned[connections[i].connType]) continue;
        scanned[connections[i].connType] = true;
        connectionTypes.push(connections[i].connType);
    }
    return connectionTypes;
}


module.exports.getConnections = function() {
    var connections = database.connections;
    connectionsModel = [];
    for (var i = 0; i < connections.length; i++) {
        connectionsModel.push(new Connection(connections[i].connId, connections[i].connName, connections[i].details,
            connections[i].date, connections[i].time, connections[i].venue));
    }
    return connectionsModel;
};


module.exports.getConnection = function(connId) {
    var connections = database.connections;
    for (var i = 0; i < connections.length; i++) {
        if (connections[i].connId === connId) {
            return new Connection(connections[i].connId, connections[i].connName, connections[i].details,
                connections[i].date, connections[i].time, connections[i].venue);
        }
    }
};


module.exports.doesConnectionExist = function(connId) {
    var connections = database.connections;
    for (var i = 0; i < connections.length; i++) {
        if (connections[i].connId === connId) {
            return true;
        }
    }
    return false;
};
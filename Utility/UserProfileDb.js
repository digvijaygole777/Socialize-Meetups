//function to add a festival to user profile
module.exports.addRSVP = function(userId, connectionId, rsvp, userConnectionModel) {
    return new Promise((resolve, reject) => {
        userConnectionModel.create({ userId: userId, connectionId: connectionId, rsvp: rsvp }).then(function() {
            resolve()
        }).catch(err => { return reject(err); })

    });
};

//function to update a festival (i.e. rsvp) in user profile
module.exports.updateRSVP = function(userId, connectionId, newRSVP, userConnectionModel) {
    return new Promise((resolve, reject) => {
        userConnectionModel.updateOne({ $and: [{ userId: userId }, { connectionId: connectionId }] }, { $set: { rsvp: newRSVP } }, function(err, data) {
            resolve(data);
        }).catch(err => { return reject(err); });
    })
};


//function to check if a event is present for the provided user
module.exports.doesUserConnectionExist = function(userId, connectionId, userConnectionModel) {
    return new Promise((resolve, reject) => {
        userConnectionModel.find({ $and: [{ userId: userId }, { connectionId: connectionId }] }).then(data => {
            resolve(data.length > 0);
        }).catch(err => { return reject(err); })
    });
};

module.exports.getUserProfile = function(userId, userConnections, connections) {
    return new Promise((resolve, reject) => {
        userConnections.find({ userId: userId }).then(async data => {
            let itemList = [];
            const connectionsData = require('./connectionsData');
            const UserConnection = require('../models/userConnection');
            for (let i = 0; i < data.length; i++) {
                let connection = await connectionsData.getConnection(data[i].connectionId, connections);
                let userConnection = new UserConnection(connection, data[i].rsvp);
                itemList.push(userConnection);
            }
            resolve(itemList);
        }).catch(err => { return reject(err); })
    })
}

//function to add a event to database
module.exports.addConnection = function(connection, connectionModel) {
    return new Promise((resolve, reject) => {
        connectionModel.create({
            connectionId: connection.connectionId,
            connectionName: connection.connectionName,
            connectionTopic: connection.connectionTopic,
            hostedBy: connection.hostedBy,
            connectionDetails: connection.connectionDetails,
            location: connection.location,
            date: connection.date,
            time: connection.time,
            userId: connection.userId,
        }).then(function() {
            resolve()
        }).catch(err => { return reject(err); })
    });
};


//function to delete a event from user profile
module.exports.removeUserConnection = function(userId, connectionId, userConnectionModel) {
    return new Promise((resolve, reject) => {
        userConnectionModel.deleteOne({ $and: [{ userId: userId }, { connectionId: connectionId }] }, function(err, data) {
            resolve();
        }).catch(err => { return reject(err); });
    });
};
const UserConnection = require('./userConnection');
const conndb = require('../Utility/connectionsData');


class UserProfile {
    constructor(userId) {
        this.userId = userId;
        this.connections = [];
    }

}

module.exports = UserProfile;
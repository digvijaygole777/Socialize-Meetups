var userObj = require('./../models/User');

//get all the users
var getUsers = function(userCollection) {
    return new Promise((resolve, reject) => {
        userCollection.find({}).then(data => {

            let usersModel = [];
            for (let i = 0; i < data.length; i++) {
                usersModel.push(new userObj(data[i].userId, data[i].userFirstName, data[i].userLastName, data[i].userEmail, data[i].password, data[i].addressfield,
                    data[i].userCity, data[i].userState, data[i].userZipCode));
            }

            resolve(usersModel);
        }).catch(err => { return reject(err); })
    })
};

//get a single user
var getUser = function(userId, Users) {

    return new Promise((resolve, reject) => {
        Users.find({ userEmail: userId }).then(data => {

            resolve(new userObj(data[0].userId, data[0].userFirstName, data[0].userLastName, data[0].userEmail, data[0].password, data[0].addressfield,
                data[0].userCity, data[0].userState, data[0].userZipCode));
        }).catch(err => { return reject(err); })
    })
};

module.exports = {
    // userData: userData,
    getUsers: getUsers,
    getUser: getUser
};
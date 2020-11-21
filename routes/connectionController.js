const express = require('express');
var connectionDB = require('../Utility/connectionsData');
var userConnectionDB = require('../Utility/userProfileDB.js');
var userConnection = require('../models/userConnection');
const Connection = require('../models/connection.js');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

const { check, validationResult } = require('express-validator');

const route = express.Router();
var mongoose = require('mongoose');
//connect to database
mongoose.connect("mongodb://localhost:27017/Events", { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));

var ConnectionModel = mongoose.model("Conections", Connection.connectionSchema, 'Conections');
var UserConnectionModel = mongoose.model("UserConnection", userConnection.userConnectionSchema, 'UserConnections');

route.get('/', async function(req, res) {
    var connectionTypes = await connectionDB.getConnectionTypes(ConnectionModel);
    var connections = await connectionDB.getConnections(ConnectionModel);

    res.render('connections', {
        session: req.session.theUser,
        data: connections,
        categories: connectionTypes,
    });

})


//connection list route
route.get('/connection', async function(req, res) {
    if (await connectionDB.doesConnectionExist(req.query.id, ConnectionModel)) {
        var connection = await connectionDB.getConnection(req.query.id, ConnectionModel);

        res.render('connection', { object: connection, session: req.session.theUser });
    } else {
        res.redirect('/connections');
    }

})

//new connection post route
route.post('/newConnection', urlEncodedParser, jsonParser,
    check('topic').custom((value, { req }) => {
        var letters = /^[a-zA-Z ]+$/;
        if (!value.match(letters)) {
            throw new Error('Connection topic can contain only alphabets and spaces.');
        }
        return true;
    }),

    check('name').custom((value, { req }) => {
        var letters = /^[a-zA-Z ]+$/;
        if (!value.match(letters)) {
            throw new Error('Connection name can contain only alphabets and spaces .');
        }
        return true;
    }),
    check('description').custom((value, { req }) => {
        var letters = /^[a-zA-Z .]+$/;
        if (!value.match(letters)) {
            throw new Error('description can contain only alphabets and spaces and fullstop');
        }
        return true;
    }),

    check('time').custom((value, { req }) => {
        var today = new Date();
        entered_date = new Date(value);
        if (today.getTime() > entered_date.getTime()) {
            throw new Error('Can only enter future time');

        }
        return true;
    }),
    check('where').custom((value, { req }) => {
        var letters = /^[a-zA-Z 0-9]+$/;
        if (!value.match(letters)) {
            throw new Error('location can take only alphabets numbers and spaces ');
        }
        return true;
    }),

    async function(req, res) {

        const errors = validationResult(req)
        if (errors.array().length != 0) {

            res.render('newConnection', { session: req.session.theUser, err: errors.array() });

        } else {
            if (!req.session.theUser) {
                res.redirect('/login');

            } else {
                console.log(req.body)
                var topic = req.body.topic;
                var name = req.body.name;
                var description = req.body.description;
                var where = req.body.where;
                var when = new Date(req.body.when)
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                var eventDate = days[when.getDay()] + ", " + months[when.getMonth()] + " " + when.getDate();
                var time = "6PM"

                var userId = req.session.theUser.userId;
                var Connection = require('../models/connection.js');

                var events = await connectionDB.getConnections(ConnectionModel);
                var newConnection = new Connection(events.length + 1, topic, name, description,
                    eventDate, time, where, userId);
                await userConnectionDB.addConnection(newConnection, ConnectionModel);
                await userConnectionDB.addRSVP(userId, newConnection.connectionId, "Yes", UserConnectionModel);
                req.session.userProfile = await userConnectionDB.getUserProfile(userId, UserConnectionModel, ConnectionModel);
                res.redirect('/userprofile');

            }
        }

    });


//connection update route
route.post('/update', urlEncodedParser, jsonParser, async function(req, res) {
    if (!req.session.theUser) {
        res.redirect('/');
    } else {
        var currentUser = req.session.theUser;

        //Execute this block when a user tries to add or update RSVP for an event
        if (req.body.action === 'maybe' || req.body.action === 'yes' || req.body.action === 'no') {
            var connection = await connectionDB.getConnection(req.body.connectionId, ConnectionModel);
            //  var userProfile = new UserProfile(req.session.theUser.userId, req.session.userProfile);
            var updateRSVP = 'No';
            if (req.body.action === 'maybe') {
                updateRSVP = 'Maybe';
            } else if (req.body.action === 'yes') {
                updateRSVP = 'Yes';
            }
            if (await userConnectionDB.doesUserConnectionExist(currentUser.userId, connection.connectionId, UserConnectionModel)) {
                //call update user profile
                await userConnectionDB.updateRSVP(currentUser.userId, connection.connectionId, updateRSVP, UserConnectionModel);
            } else {
                await userConnectionDB.addRSVP(currentUser.userId, connection.connectionId, updateRSVP, UserConnectionModel);
            }

            req.session.userProfile = await userConnectionDB.getUserProfile(currentUser.userId, UserConnectionModel, ConnectionModel);
            res.redirect('/userprofile');
        } else if (req.body.action === 'delete') { //Execute this block when a user tries to delete an event from user profile
            await userConnectionDB.removeUserConnection(currentUser.userId, req.body.connectionId, UserConnectionModel);
            req.session.userProfile = await userConnectionDB.getUserProfile(currentUser.userId, UserConnectionModel, ConnectionModel);
            res.redirect('/userprofile');
        }
    }
});

//newConnection route
route.get('/newConnection', function(req, res) {
    res.render('newConnection', { session: req.session.theUser, err: '' });

})

module.exports = route;
module.exports.ConnectionModel = ConnectionModel;
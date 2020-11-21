const express = require('express');
const bodyParser = require('body-parser');

const condb = require('../Utility/connectionsData');
const userdb = require('../Utility/userDB');
const userObj = require('../models/user');
var userprofileObj = require('../models/userProfile');
var userConnection = require('./../models/userConnection');
var userConnectionDB = require('../Utility/userProfileDB.js');

const { check, validationResult } = require('express-validator');


var userdetails;
const Connection = require('../models/connection.js');

const route = express.Router();
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });


const User = require('../models/user.js');
const connectionController = require('./connectionController.js');

var ConnectionModel = connectionController.ConnectionModel;


var mongoose = require('mongoose');
//connect to database
mongoose.connect("mongodb://localhost:27017/Events", { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));

var UserModel = mongoose.model("User", userObj.userSchema, 'Users');
var UserConnectionModel = mongoose.model("UserConnection", userConnection.userConnectionSchema, 'UserConnections');


route.get('/', async function(req, res) {

    if (!req.session.theUser) {
        //get users from database
        var users = await userdb.getUsers(UserModel);
        console.log(users)
        var loggedInUser;

        for (var i = 0; i < users.length; i++) {
            if (users[i].userEmail === req.body.userEmaildAddress && users[i].password === req.body.userPassword) {
                console.log('Login success')
                loggedInUser = users[i];
                req.session.theUser = users[i];
                console.log(loggedInUser)
                break;
            } else if (i == users.length - 1) {
                res.redirect('login')
            }
        }
        req.session.userProfile = await userConnectionDB.getUserProfile(req.session.theUser.userId, UserConnectionModel, ConnectionModel);
    }
    res.render('savedConnections', { connection: req.session.userProfile, session: req.session.theUser });
});

//
route.post('/',
    urlEncodedParser, jsonParser,
    //start new connection validation 
    check('userEmaildAddress').custom(async(value, { req }) => {

        var user = await userdb.getUser(value, UserModel);
        if (user == null) {
            throw new Error('Invalid user ID');
        }
        if (user.password != req.body.userPassword) {
            throw new Error('Invalid password');
        }
        return true;
    }), async function(req, res) {


        const errors = validationResult(req);
        if (errors.array().length != 0) {
            res.render('login', { session: req.session.theUser, errors: errors.array() });

        } else {

            if (!req.session.theUser) {
                //get users from database
                var users = await userdb.getUsers(UserModel);
                console.log(users)
                var loggedInUser;

                for (var i = 0; i < users.length; i++) {
                    if (users[i].userEmail === req.body.userEmaildAddress && users[i].password === req.body.userPassword) {
                        console.log('Login success')
                        loggedInUser = users[i];
                        req.session.theUser = users[i];
                        console.log(loggedInUser)
                        break;
                    } else if (i == users.length - 1) {
                        res.redirect('login')
                    }
                }
                req.session.userProfile = await userConnectionDB.getUserProfile(req.session.theUser.userId, UserConnectionModel, ConnectionModel);
            }
            res.render('savedConnections', { connection: req.session.userProfile, session: req.session.theUser });
        }
    });

//rsvp route
route.get('/rsvp', async function(req, res) {
    if (Object.keys(req.query)[0] === 'connectionId') {
        var connectionId = req.query.connectionId;
        conns = userdetails.addConnection(connectionId, req.query.rsvp);
        req.session.theUser.userdetails = userdetails;
        res.redirect('/userprofile');
    }
});

//update route
route.get('/update', async function(req, res) {
    if (Object.keys(req.query)[0] === 'connectionId') {
        var id = req.query.connectionId;
        res.redirect('/connections/connection?connectionId=' + id);
    }
})


//delete route
route.get('/delete', async function(req, res) {
    if (req.session.theUser) {

        userdetails.removeConnection(req.query.id);
        req.session.theUser.userdetails = userdetails;
        res.redirect('/userprofile');

    }
});


route.get('/logout', async function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            res.negotiate(err)
        }
        userprofileObj.connections = [];
        res.redirect('/');
    })
})

module.exports = route;
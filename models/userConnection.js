 var mongoose = require('mongoose');

 module.exports = class UserConnection {
     constructor(connection, rsvp) {
         this.connection = connection;
         this.rsvp = rsvp;
     }
 }

 module.exports.userConnectionSchema = new mongoose.Schema({
     userId: { type: Number, required: true },
     connectionId: { type: String, required: true },
     rsvp: String
 }, {
     versionKey: false
 });
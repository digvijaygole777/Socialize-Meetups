var express = require('express');
var app = express();

app.use('/assets', express.static('./assets'));
app.set('view engine', 'ejs');

const session = require('express-session');
app.use(session({ secret: 'session' }));

const userController = require('./routes/userController');
const connectionController = require('./routes/connectionController');
const controller = require('./routes/controller.js');

app.use('/userprofile', userController);
app.use('/connections', connectionController);
app.use('/', controller);

app.listen(3000, function() {
    console.log('server listening to port 3000');
});
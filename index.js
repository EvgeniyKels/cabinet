//---MODULES---
const express = require('express');
const port = process.argv[2] || 5000;
const application = express();
const cors = require('cors');
const morgan = require('morgan');
// inner modules
const clients = require('./routs/clients');
const users = require('./routs/users');
const materials = require('./routs/materials');
const prep = require('./additional');
const conf = require('config');
const connectToDb = require('./database').connect;
application.use(cors());
//logging
const devlogStream = prep.createLogDir;
const prodlogStream = prep.createProdLogDir;
/** set NODE_ENV=production  чтобы установить NODE_ENV*/
const configLogStream = process.env.NODE_ENV === 'production' ? prodlogStream : devlogStream;
const morganFunction = process.env.NODE_ENV === 'production' ? prodConfFunc : devConfFunc;
application.use(prep.assignId);
morgan.token('my_token', function (req, res) { //create my own token for logging
    req.my_token = 'Request received';
    return `${req.my_token} = ${res.statusCode} ===`
});
function prodConfFunc(tokens, req, res) {
    return [
        tokens.my_token(req, res),
        tokens.method(req, res),
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}
function devConfFunc(tokens, req, res){
    return [
        tokens.my_token(req, res),
        tokens.date(req, res),
        tokens.url(req, res),
        tokens.method(req, res),
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}
application.use(morgan(morganFunction, {stream : configLogStream}));
//routing
application.use(express.json());
application.use('/clients', clients); //set routs
application.use('/users', users); //set routs
application.use('/materials', clients); //set routs

application.listen(port, () => console.log(`listening port ${port}`));
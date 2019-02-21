//---MODULES---
const express = require('express');
const port = process.argv[2] || 3500;
const application = express();
const cors = require('cors');
const morgan = require('morgan');
// inner modules
const clients = require('./routs/clients');
const materials = require('./routs/materials');
const prep = require('./additional');
application.use(cors());
//logging
const logStream = prep.createLogDir;
application.use(prep.assignId);
morgan.token('my_token', function (req, res) { //create my own token for logging
    req.my_token = 'Request received';
    return `${req.my_token} = ${res.statusCode} ===`
});
application.use(morgan((tokens, req, res) => { //todo ма зэ токенс
    return [
        tokens.my_token(req, res),
        tokens.date(req, res),
        tokens.url(req, res),
        tokens.method(req, res),
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}, {stream : logStream}));
//configuration

//routing
application.use(express.json());
application.use('/clients', clients); //set routs
application.use('/materials', clients); //set routs

application.listen(port, () => console.log(`listening port ${port}`));
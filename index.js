//---MODULES---
const express = require('express');
const port = process.argv[2] || 3500;
const application = express();
const cors = require('cors');
// inner modules
const clients = require('./routs/clients');
const materials = require('./routs/materials');
//logging


//routing
application.use(cors());
application.use(express.json());
application.use('/clients', clients); //set routs
application.use('/materials', clients); //set routs

application.listen(port, () => console.log(`listening port ${port}`));
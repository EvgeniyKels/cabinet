//---MODULES---
const express = require('express');
const constants = require('../const_var');
//go
const router = express.Router();
//testing
const dataBase = {};

//create new CLIENT
router.post('/', (req, res) => {
    const client = req.body;
    if (client.name in dataBase) {
        res.send(constants.CLIENT_EXISTS);
        return;
    }
    dataBase[client.name] = client;
    res.send(constants.CLIENT_ADDED);
});

//get user by id
// http://localhost:5000/clients?name=Masha  '/'    const name = req.query.name;
//
router.get('/:name', (req, res) => {
    const name = req.params.name;
    if (!(name in dataBase)){
        res.send(constants.CLIENT_NOT_EXISTS);
        return;
    }
    res.send(dataBase[name])
});

//get all users
router.get('/', (req, res) => {
    res.send(dataBase);
});

//update user bu id
router.put('/:name', (req, res) => {
    const name = req.params.name;
    const body = req.body;
    if (!(name in dataBase)){
        res.send(constants.CLIENT_NOT_EXISTS);
        return;
    }
    const dataBaseElement = dataBase[name];
    Object.entries(body).forEach((el) => {
        dataBaseElement[el[0]] = el[1];
    });
    res.send(dataBaseElement);
});

//remove user from db
router.delete('/', (req, res) => {
    const name = req.query.name;
    if (!(name in dataBase)){
        res.send(constants.CLIENT_NOT_EXISTS);
        return;
    }
    res.send(delete dataBase[name])
});

module.exports = router;
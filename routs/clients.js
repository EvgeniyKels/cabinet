//---MODULES---
const express = require('express');
const constants = require('../const_var');
const router = express.Router();
const dataBase = require('../database');
const ModelClients = dataBase.modelClients;

const Joi = require('joi');
const validate=require('../validators/validator');
const schema = {
    name:Joi.string().required(),
    birthDate:Joi.string().required(),
    workIn:Joi.string().required()
};
const updateSchema = {
    workIn:Joi.string()
};

//create new CLIENT
router.post('/', async(req, res) => {
    if (validate(req, res, schema)){
        const clientTab = new ModelClients(req.body);
        try {
            let client = await clientTab.save();
            res.send(constants.CLIENT_ADDED);
        } catch (e) {
            res.status(400).send(constants.CLIENT_NOT_ADDED); //todo проверить статус
        }
    }
});

//get user by id
// http://localhost:5000/clients?name=Masha  '/'    const name = req.query.name;
//
router.get('/:name', async(req, res) => {
    const name = req.params.name;
    try {
        const find = await ModelClients.find({name: name});
        let obj = {};
        find.forEach((el) => {
           const clientName = el.name;
           obj[clientName] = el
        });
        res.send(obj)
    } catch (e) {
        res.send(e)
    }
});

//get all users
router.get('/', async(req, res) => {
    try {
        const find = await ModelClients.find();
        let obj = {};
        find.forEach((el) => {
            const clientName = el.name;
            obj[clientName] = el
        });
        res.send(obj)
    } catch (e) {
        res.send(e)
    }
});

//update user bu id
router.put('/:name', async (req, res) => {
    if (validate(req, res, updateSchema)){
        const name = req.params.name;
        try {
            const client = await ModelClients.find({name : name});
            if (client.length === 0) {
                res.status(400).send(constants.CLIENT_NOT_EXISTS)
                return
            }
            const clientElement = client[0];
                Object.entries(req.body).forEach((el) => {
                    const key = el[0];
                    clientElement[key] = el[1]; //todo set И провреить функциональность с несколькими запросами
                });
            await clientElement.save();
            res.send(constants.CLIENT_UPDATED);
        } catch (e) {
            res.status(400).send(constants.CLIENT_NOT_UPDATED); //todo проверить статус
        }
    }
});

//remove user from db
router.delete('/', async(req, res) => {
    const name = req.query.name;
    try {
        const query = await ModelClients.deleteOne({name: name});
        res.send(constants.CLIENT_DELETED)
    } catch (e) {
        res.sendStatus(400).send(constants.CLIENT_NOT_DELETED); //todo проверить статус
    }
});

module.exports = router;
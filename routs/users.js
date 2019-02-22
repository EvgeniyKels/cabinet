const express = require('express');
const constants = require('../const_var');
const router = express.Router();
const dataBase = require('../database');
const UserModel = dataBase.modelUsers;

const Joi = require('joi');
const validate=require('../validators/validator');
const schema = {
    name:Joi.string().required(),
    password:Joi.string().required(),
    roles:Joi.array().items(Joi.string().valid('admin','user')).max(3).required()
};
const updateSchema = {
    password:Joi.string(),
    roles:Joi.array().items(Joi.string().valid('admin','user')).max(3)
};

router.post('/', async(req, res) => {
    if (validate(req, res, schema)){
        const userTab = new UserModel(req.body);
        try {
            let client = await userTab.save();
            res.send(constants.USER_ADDED);
        } catch (e) {
            res.status(400).send(constants.USER_NOT_ADDED); //todo проверить статус
        }
    }
});

router.get('/:name', async(req, res) => {
    const name = req.params.name;
    try {
        const find = await UserModel.find({name: name});
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

router.get('/', async(req, res) => {
    try {
        const find = await UserModel.find();
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

router.put('/:name', async (req, res) => {
    if (validate(req, res, updateSchema)){
        const name = req.params.name;
        try {
            const client = await UserModel.find({name : name});
            if (client.length === 0) {
                res.status(400).send(constants.USER_NOT_EXISTS)
                return
            }
            const clientElement = client[0];
            Object.entries(req.body).forEach((el) => {
                const key = el[0];
                clientElement[key] = el[1]; //todo set И провреить функциональность с несколькими запросами
            });
            await clientElement.save();
            res.send(constants.USER_UPDATED);
        } catch (e) {
            res.status(400).send(constants.USER_NOT_UPDATED); //todo проверить статус
        }
    }
});

router.delete('/', async(req, res) => {
    const name = req.query.name;
    try {
        const query = await UserModel.deleteOne({name: name});
        res.send(constants.USER_DELETED)
    } catch (e) {
        res.sendStatus(400).send(constants.USER_NOT_DELETED); //todo проверить статус
    }
});

module.exports = router;
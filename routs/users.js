const express = require('express');
const constants = require('../const_var');
const router = express.Router();
const dataBase = require('../database');
const UserModel = dataBase.modelUsers;
const hash = require('../hasher');
const secret = 'secret'; //todo должен быть в файлах конфигурации

const jwt = require('jsonwebtoken');

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
const loginSchema = {
    name:Joi.string().required(),
    password:Joi.string().required()
};

router.post('/signup', async(req, res) => {
    if (validate(req, res, schema)){
        const user = req.body;
        const hashUser = await hash.hashFunc(user);
        if (!hashUser) {
            res.send(constants.BAD_PASSWORD);
            return
        }
        const userTab = new UserModel(hashUser);
        try {
            let client = await userTab.save();
            res.send(constants.USER_ADDED);
        } catch (e) {
            res.status(400).send(constants.USER_NOT_ADDED); //todo проверить статус
        }
    }
});
//todo как делать тесты 1,50 - 2,50 https://www.youtube.com/watch?v=_BSag4ABBMY&list=PLvTBThJr861y60LQrUGpJNPu3Nt2EeQsP&index=3
router.post("/login", async (req, res) => {
    if (validate(req, res, loginSchema)) {
        try {
            let user = await UserModel.findOne({name: req.body.name});
            await hash.compar(req.body.password, user.password);
            if (!user || !(await hash.compar(req.body.password, user.password))) { //todo
                res.status(401).send('user is not authorised');
            } else {
                res.send(jwt.sign({_id:user._id, roles: user.roles}, secret));//то что мы подписываем
            }
        } catch (e) {
            res.send(e)
        }
    }
});

// router.get('/:name', async(req, res) => {
//     const name = req.params.name;
//     try {
//         const find = await UserModel.find({name: name});
//         let obj = {};
//         find.forEach((el) => {
//             const clientName = el.name;
//             obj[clientName] = el
//         });
//         res.send(obj)
//     } catch (e) {
//         res.send(e)
//     }
// });

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
        const body = req.body;
        const name = req.params.name;
        try {
            const client = await UserModel.find({name : name});
            if (client.length === 0) {
                res.status(400).send(constants.USER_NOT_EXISTS);
                return
            }
            const clientElement = client[0];
            if('password' in body) {
                const hashUser = await hash.hashFunc(body);
                if (!hashUser) {
                    res.send(constants.BAD_PASSWORD);
                    return
                }
            }
            Object.entries(body).forEach((el) => {
                const key = el[0];
                clientElement[key] = el[1]; //todo set И провреить функциональность с несколькими запросами
            });
            await clientElement.save();
            res.send(constants.USER_UPDATED);
        } catch (e) {
            console.log(e);
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
const jsonwebtoken = require('jsonwebtoken');
const config = require('config');
const secret = 'secret'; //todo должен быть в файлах конфигурации

module.exports.token = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).send('not authorized user')
    } else {
        try {
            req.user = jsonwebtoken.verify(token, secret);
            next();
        } catch (e) {
            res.status(401).send('invalid token')
        }
    }
}

module.exports.rollechecker = function (requireRole, user) {
    return user.roles.find((i) => i === requireRole);
}
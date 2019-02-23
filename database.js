const mongoose = require('mongoose');
const config = require('config');
const dbUsername = config.get('db.username');
const dbPassword = config.get('db.password');  //set pass=12345.com
const hostnamePort = config.get('db.hostname');
const dbname = config.get('db.name');
if (dbPassword.length === 0 || !dbPassword) {
    console.error('password did not set');
    process.exit(1)
}
let uri = `mongodb://${dbUsername}:${dbPassword}@${hostnamePort}/${dbname}`;
async function connect() {
    try {
        const newVar = await mongoose.connect(uri, {useNewUrlParser: true});
    } catch (e) {
        console.error(e.errmsg);
        return
    }
    uri = `mongodb://${dbUsername}:*************@${hostnamePort}/$******`;
    console.log(`connected ${uri} succesfully`)
}

const clientMongoSchema = mongoose.Schema({
    name: {type: String, index: true, unique: true},
    birthDate: String,
    workIn: String,
});

const userMongoSchema = mongoose.Schema({
    name: {type: String, index: true, unique: true},
    password: String,
    roles: [String]
});

const modelClients = mongoose.model("Clients", clientMongoSchema);
const modelUsers = mongoose.model("Users", userMongoSchema);

module.exports.connect = connect();
module.exports.modelClients = modelClients;
module.exports.modelUsers = modelUsers;

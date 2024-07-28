const initialOptions = {};
const pgp = require('pg-promise')(initialOptions);

const server = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
}

const db = pgp(server);
module.exports = db;
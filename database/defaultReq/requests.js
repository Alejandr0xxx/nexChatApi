const db = require('../config');
const jwt = require('jsonwebtoken');

// Function to req an object by its id
function reqByEmail(table, email, callback) {
    const query = `SELECT * FROM ${table} WHERE email = $1`;
    db.oneOrNone(query, [email])
        .then(res => {
            callback(null, res)
        })
        .catch(err => {
            console.log(`An error has occurred:\n${err}`);
            callback(err)
        })
};

// Function to add a new object
function addNewValues(table, dataObject, callback) {
    const keys = Object.keys(dataObject);
    const values = keys.join(', ')
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const query = `INSERT INTO ${table} (${values}) VALUES (${placeholders}) RETURNING *`
    db.any(query, Object.values(dataObject))
        .then(res => {
            callback(null, res);
            console.log(res);
        })
        .catch(err => {
            console.log(`An error has occurred:\n${err}`);
            callback(err);
        })
}

// Function to update an object
function updSomeValues(table, user_id, newData, callback) {
    console.log('TEST UPD')
    const keys = Object.keys(newData);
    const placeholders = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = `UPDATE ${table} SET ${placeholders} WHERE user_id = $${keys.length + 1}`;
    console.log(keys);
    console.log(placeholders);
    console.log(query);
    db.oneOrNone(query, [...Object.values(newData), user_id])
        .then(res => {
            callback(null, res)
        })
        .catch(err => {
            console.log(`An error has occurred:\n${err}`);
            callback(err);
        })
}


//Fuction to create a token
function createToken(user_id) {
    const secret = process.env.SECRET_KEY;
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 86400,
        data: user_id
    }, secret)
    return token;
}

module.exports = {
    reqByEmail,
    addNewValues,
    updSomeValues,
    createToken
};
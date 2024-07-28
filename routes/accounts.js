var express = require('express');
const { reqByEmail, addNewValues, updSomeValues, createToken } = require('../database/defaultReq/requests');
const bcrypt = require('bcrypt')
var router = express.Router();

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  reqById('accounts', id, (err, account) => {
    if (err) {
      return next(err);
    }
    console.log(account);
    res.send(account);
  })
});

// POST register a newAcount
router.post('/register', function (req, res, next) {
  const data = req.body;
  const noHashPass = req.body.password;
  bcrypt.hash(noHashPass, 12, (err, hashedPass) => {
    if (err) return next(err);
    const dataWithHas = {
      username: data.username,
      email: data.email,
      password: hashedPass,
    }
    addNewValues('accounts', dataWithHas, (err, newAcount) => {
      if (err) return next(err);
      const token = createToken(newAcount.user_id)
      res.send({ token: token });
    })
  })
})

//POST login
router.post('/login', function (req, res, next) {
  const email = req.body.email;
  const noHashPass = req.body.password;
  reqByEmail('accounts', email, (err, account) => {
    if (err) return next(err);
    if (!account) return res.status(404).send('Account not found!');
    bcrypt.compare(noHashPass, account.password, (err, result) => {
      console.log(result);
      if (err) return next(err);
      if (!result) return res.status(401).send('Incorrect passowrd');
      const token = createToken(account.user_id)
      res.send({ token: token })
    })
  })
})

// PUT update an account
router.put('/:id', function (req, res, next) {
  console.log('PUT WORKING');
  const idParams = req.params.id;
  const newData = req.body;
  console.log(idParams, newData, 'Put wokring!')
  if (Number(idParams) !== Number(newData.user_id)) return res.statusCode(400).send('IDs do not match!')
  updSomeValues('accounts', idParams, newData, (err, accountUpdated) => {
    console.log(accountUpdated)
    if (err) return next(err);
    res.send(accountUpdated);
  })
})

module.exports = router;

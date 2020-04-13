const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");

const express = require("express");
const router = new express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


// use bcrypt here before passing it into the user method?
// also take the opportunity to validate that we have all the parameters we need

  router.post("/register", async function(req, res, next) {
    try {
      const {username, password, first_name, last_name, phone} = req.body;
      
      const hashedPassword = await bcrypt.hash(
        password, BCRYPT_WORK_FACTOR);
      
      User.register(username, hashedPassword, first_name, last_name, phone);

      let payload = {username};
      let token = jwt.sign(payload, SECRET_KEY);

      return res.json(token);
    } catch (err) {
      return next(err)
    }
  })



 module.exports = router;
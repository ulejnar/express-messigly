const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");

const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = ("../expressError");

const BAD_REQUEST = 400;


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

  router.post('/login', async function(req, res, next) {
    try {
      const {username, password} = req.body;
      let isValidUser = await User.authenticate(username, password);

    if (isValidUser) {
      let payload = {username};
      let token = jwt.sign(payload, SECRET_KEY);

      await User.updateLoginTimestamp(username);

      return res.json(token);
    }
    
    throw new ExpressError("Invalid username/password", BAD_REQUEST)

    } catch(err) {
      return next(err);
    }
  })


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

 // Do we need to throw an error here if they don't pass in valid parameters (e.g. unique username, missing parameters)?

  router.post("/register", async function(req, res, next) {
    try {
      const {username, password, first_name, last_name, phone} = req.body;
      
      const hashedPassword = await bcrypt.hash(
        password, BCRYPT_WORK_FACTOR);
      
      await User.register(username, hashedPassword, first_name, last_name, phone);

      let payload = {username};
      let token = jwt.sign(payload, SECRET_KEY);

      return res.json(token);
    } catch (err) {
      return next(err)
    }
  })



 module.exports = router;


 /// first token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNqYnJvb2tzIiwiaWF0IjoxNTg2ODEzNzQwfQ.lfENx8nFo7w3eW8-4cCAFL2oyS2e0Z9hCPKWBvNaymg"

// token upon login: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNqYnJvb2tzIiwiaWF0IjoxNTg2ODcxMDc2fQ.aDEAXpg_T5wTJr3sM9xUySZ-bSXH2P0m80VZJN-ODuI"
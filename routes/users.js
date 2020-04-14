const express = require("express");
const router = new express.Router();
const ExpressError = ("../expressError");
const db = require("../db")
const User = require("../models/user");
const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let users = await User.all()
    if (users.length === 0) {
      throw new ExpressError("No registered users", 404);
    }

    return res.json({users: users})

  } catch(err) {
    return next(err)
  }
})
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


 module.exports = router;

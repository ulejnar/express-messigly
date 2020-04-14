const express = require("express");
const router = new express.Router();
const ExpressError = ("../expressError");
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      let users = await User.all()
      if (users.length === 0) throw new ExpressError("No registered users", 404);

      return res.json({ users: users })

    } catch (err) {
      return next(err)
    }
  })


/** GET /:username - get detail of user.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


router.get('/:username',
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let username = req.params.username;
      let user = await User.get(username);

      return res.json({user});

    } catch (err) {
      return next (err);
    }
  })


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to',
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let username = req.params.username;
      let messages = await User.messagesTo(username);

      return res.json({messages});

    } catch (err) {
      return next (err);
    }
  })


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


router.get('/:username/from',
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let username = req.params.username;
      let messages = await User.messagesFrom(username);

      return res.json({messages});

    } catch (err) {
      return next (err);
    }
  })


module.exports = router;

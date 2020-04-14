const express = require("express");
const router = new express.Router();
const ExpressError = ("../expressError");
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async function (req, res, next) {
  try {
    let message = await Message.get(req.params.id);
    console.log("message ", message.from_user.username)

    if (req.user.username === message.from_user.username || req.user.username === message.to_user.username) {

      return res.json({ message });
    } else {

      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {

    return next(err);
  }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const { to_username, body } = req.body;
    console.log("req.user.username:", req.user.username)
    console.log("to_username:", to_username)
    console.log("body:", body)
    let message = await Message.create(req.user.username, to_username, body)
    return res.json({ message })

  } catch (err) {
    return next(err)
  }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async function (req, res, next) {
  try {
    let message = await Message.get(req.params.id)
    console.log("message ", message)

    if (req.user.username === message.to_user.username) {
      const readMessage = await Message.markRead(req.params.id)
      return res.json({ "message": readMessage })
    } else {

      return next({ status: 401, message: "Unauthorized" });
    }

  } catch (err) {

    return next(err);
  }
})

module.exports = router;


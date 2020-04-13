/** User class for message.ly */

const db = require("../db");
const ExpressError = require("../expressError");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../config");
const moment = require("moment");
const jwt = require("jsonwebtoken");

/** User of the site. */


// const result = await db.query(
//   `INSERT INTO messages (
//         from_username,
//         to_username,
//         body,
//         sent_at)
//       VALUES ($1, $2, $3, current_timestamp)
//       RETURNING id, from_username, to_username, body, sent_at`,
//   [from_username, to_username, body]);

// return result.rows[0];
// }



class User {
  
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  

  /** QUESTIONS */
  // WHY DO'T WE NEED TO RETURN RESULT.ROWS IF WE DON'T END UP USING IN THE ROUTE?
  // WHY DON'T WE NEED TO THROW AN ERROR HERE IF THEY DON'T PASS IN VALID PARAMETERS (E.G. NON UNIQUE USERNAME, OR MISSING NULLABLE=FALSE PARAMETERS)

  static async register(username, password, first_name, last_name, phone) { 
    
    const result = await db.query(
      `INSERT INTO users (
        username, 
        password, 
        first_name, 
        last_name, 
        phone,
        join_at,
        last_login_at)
        VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
        RETURNING username, password, first_name, last_name, phone`, 
        [username, password, first_name, last_name, phone]);
  
        return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  // QUESTIONS
  // Why was password listed as a parameter here if we don't need to pass it into anything? 
  // (Since we do bcrypt compare logic inside the view function in auth.js)

  static async authenticate(username, password) {

    const result = await db.query(`
      SELECT password 
      FROM users 
      WHERE username = $1`,
      [username]);
    
    const user = result.rows[0];

    return (await bcrypt.compare(password, user.password));
  }


  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    await db.query(`
        UPDATE users
        SET last_login_at = current_timestamp
        WHERE username = $1`,
        [username]);
  }


  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */
  
  static async all() { }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authController = require("../controller/authController");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./utils/database.db");
const dotenv = require("dotenv");
const { getMovies, getMovie } = require("../helper/fetchMovieData");
const { check, validationResult } = require("express-validator");
dotenv.config();

// api/buy
router.use(morgan("dev")).post("/buy", authController, async (req, res) => {
  console.log(req.body);
  const movie = await getMovie(db, req.body.id);

  console.log(movie);

  // Check if the request body is empty
  if (Object.keys(req.body).length === 0) {
    res.status(400).send("No request parameters provided");
    return;
  }

  // Check if the date is valid
  if (!Date.parse(req.body.date)) {
    res.status(400).send("Invalid date provided");
    return;
  }

  res.status(200).send(movie);
});

// api/login
router
  .use(morgan("dev"))
  .post(
    "/login",
    [
      check("email", "Please include a valid email!").isEmail(),
      check("password", "Password is required!").exists(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      console.log("🚀 ~ file: index.js:57 ~ password:", password);

      // hash pass

      db.get(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [email, password],
        async (err, user) => {
          if (err) {
            console.log("🚀 ~ file: index.js:68 ~ err.message:", err.message);
            res.status(500).send("Server error");
          } else {
            // jwt

            // const isPasswordMatch = await bcrypt.compare(password, user.password);
            // if (!isPasswordMatch) {
            //   return res
            //     .status(400)
            //     .json({ errors: [{ msg: "Invalid Credentials!" }] });
            // }

            const payload = {
              user: {
                username: user.username,
                id: user.id,
              },
            };

            jwt.sign(
              payload,
              process.env.TOKEN_SECRET,
              { expiresIn: 360000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );

            // res.redirect("/");
          }
        }
      );
    }
  );

// api/register
router
  .use(morgan("dev"))
  .post(
    "/register",
    [
      check("email", "Please include a valid email!").isEmail(),
      check("password", "Password is required!").exists(),
      check("address", "Address is required!").exists(),
      check("username", "Username is required!").exists(),
      check("name", "Name is required!").exists(),
      check("credit_card", "Credit card is required!").exists(),
    ],
    (req, res) => {
      //validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userData = req.body;
      console.log("🚀 ~ file: index.js:112 ~ router.use ~ userData:", userData);
      const { email, password } = req.body;

      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
          console.log("🚀 ~ file: index.js:68 ~ err.message:", err.message);
          res.status(500).json({ msg: "Server error" });
        }

        if (user) {
          res.status(400).json({ msg: "Email already exists" });
        }
      });

      db.run(
        `INSERT INTO users (name, email, username, password, address, credit_card, order_history) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.name,
          userData.email,
          userData.username,
          userData.password,
          userData.address,
          userData.credit_card,
          userData.order_history,
        ],
        (err) => {
          if (err) {
            console.error(err.message);
            res.status(500).send("Error inserting user data into the database");
          } else {
            db.get(
              `SELECT * FROM users WHERE email = ? AND password = ?`,
              [email, password],
              async (err, user) => {
                if (err) {
                  console.log(
                    "🚀 ~ file: index.js:68 ~ err.message:",
                    err.message
                  );
                  res.status(500).send("Server error");
                } else {
                  // jwt

                  // const isPasswordMatch = await bcrypt.compare(password, user.password);
                  // if (!isPasswordMatch) {
                  //   return res
                  //     .status(400)
                  //     .json({ errors: [{ msg: "Invalid Credentials!" }] });
                  // }

                  const payload = {
                    user: {
                      username: user.username,
                      id: user.id,
                    },
                  };

                  jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { expiresIn: 360000 },
                    (err, token) => {
                      if (err) throw err;
                      res.json({ token });
                    }
                  );

                  res.redirect("/");
                }
              }
            );
          }
        }
      );

      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Database connection closed");
      });
    }
  );

// api/logout
router.use(morgan("dev")).get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

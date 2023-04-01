const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const authController = require("../controller/authController");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./utils/database.db");
const dotenv = require("dotenv");

dotenv.config();

/* GET home page. */
router.use(morgan("dev")).get("/", authController, function (req, res) {
  const user = req.user;

  db.all("SELECT * FROM movies", (err, movies) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("home", {
        title: "Home Page",
        movies: movies,
        user: user.username,
      });
    }
  });
});

// login page
router.use(morgan("dev")).get("/login", (req, res) => {
  res.render("login", { title: "Login Page", user: "" });
});

// api/login
router.post(
  "/api/login",
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

    // hash pass

    db.get(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password],
      async (err, user) => {
        if (err) {
          console.error(err.message);
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

router.get("/api/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

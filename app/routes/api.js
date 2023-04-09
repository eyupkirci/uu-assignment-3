const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authController = require("../controller/authController");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./utils/database.db");
const dotenv = require("dotenv");
const { getMovie, getOrderHistory } = require("../helper/fetchMovieData");

const { updateUserOrderHostory } = require("../helper/updateDatabase");
const { check, validationResult } = require("express-validator");
dotenv.config();

// api/user
router.use(morgan("dev")).get("/user", authController, async (req, res) => {
  const user = req.user;
  if (user == {}) {
    res.json({
      user: {},
    });
  } else {
    res.json({
      user: user,
    });
  }
});

// api/buy
router.use(morgan("dev")).post("/buy", authController, async (req, res) => {
  const movie = await getMovie(db, req.body.id);

  // Validate the incoming data
  if (!req.user.id || !movie.id || !req.body.date || !req.body.isCompleted) {
    res.status(400).send("Missing required fields");
    return;
  }

  // insert order into orders table
  db.run(
    `INSERT INTO orders (user_id, movie_id, date, is_completed)
                 VALUES (?, ?, ?, ?)`,
    [req.user.id, movie.id, req.body.date, req.body.isCompleted],
    (err) => {
      if (err) {
        console.log(
          "🚀 ~ file: api.js:38 ~ router.use ~ err.message:",
          err.message
        );
        res.status(500).send("Internal server error");
        return;
      }
    }
  );

  //update users table order_history column
  updateUserOrderHostory(db, req.user.id);

  // get the order_history of a particular user.
  const order_history = await getOrderHistory(db, req.user.id);

  res.status(201).send({ msg: "Successfully done", movies: order_history });
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
          } else if (user == undefined) {
            res.status(400).send([{ msg: "No such user" }]);
          } else {
            console.log("🚀 ~ file: api.js:77 ~ user:", user);

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

            // creates json web token
            jwt.sign(
              payload,
              process.env.TOKEN_SECRET,
              { expiresIn: 360000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      );
    }
  );

//api/movies/:id
router.use(morgan("dev")).get("/movies/:id", authController, (req, res) => {
  const id = req.params.id;

  // Query the database to retrieve the movie with the specified ID
  db.get("SELECT * FROM movies WHERE id = ?", [id], (err, movie) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    } else if (!movie) {
      res.status(404).send("Movie not found");
    } else {
      res.json({
        data: movie,
      });
    }
  });
});

router.use(morgan("dev")).get("/movies", (req, res) => {
  // Query the database to retrieve the movies

  db.all("SELECT * FROM movies", (err, movies) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    } else if (!movies) {
      res.status(404).send("Movie not found");
    } else {
      res.json({
        data: movies,
      });
    }
  });
});

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

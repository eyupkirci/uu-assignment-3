const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

//initialize the app
const app = express();

// // GLOBALS //

// Set up db
const db = new sqlite3.Database("./database.db");
// // db initialized
// db.serialize(() => {
//   // Create users table
//   db.run(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//     email TEXT,
//     username TEXT,
//     password TEXT,
//     address TEXT,
//     credit_card TEXT,
//     order_history TEXT
//   )`);

//   // Insert a single user
//   db.run(`INSERT INTO users (name, email, username, password, address, credit_card, order_history)
//     VALUES ('Eyup Kirci', 'eyup@example.com', 'eyupkirci', 'password', '123 Main St, Anytown USA', '****-****-****-1234', ''),
//   ('Alice Smith', 'alice@example.com', 'alice123', 'password1', '123 Main St, Anytown USA', '****-****-****-1234', ''),
//   ('Bob Johnson', 'bob@example.com', 'bob123', 'password2', '456 Elm St, Anytown USA', '****-****-****-5678', ''),
//   ('Charlie Brown', 'charlie@example.com', 'charlie123', 'password3', '789 Oak St, Anytown USA', '****-****-****-9012', ''),
//   ('Dave Davis', 'dave@example.com', 'dave123', 'password4', '321 Pine St, Anytown USA', '****-****-****-3456', '')`);

//   db.all("SELECT * FROM users", (err, rows) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log(rows);
//     }
//   });
//   console.log("Table created and user inserted");
// });
// db.close();

// MIDDLEWARES

// static files
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
// app.use("/static", express.static(path.join(__dirname, "public")));

// Set up bodyParser middleware to parse request bodies

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up cookie parser middleware
app.use(cookieParser());

// // set up for session middleware (creates: sid)
let options = {
  secret: "uu-assignment-3",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
    maxAge: 60 * 60 * 1000, // 1h
    sameSite: "strict",
    secure: true,
  },
};
app.use(session(options));

// Set Up cros
app.use(cors());

// ROUTES

//login.html
app.use(morgan("tiny")).get("/login.html", (req, res) => {
  const requestCookie = req.cookies.user;
  const session = req.session;
  console.log(session, requestCookie);

  if (requestCookie !== undefined && session) {
    res.status(200).send("Welcome", requestCookie.username.name);
  } else {
    res.status(200).send("/login.html");
  }
});

// 'get users'
app.use(morgan("tiny")).get("/users", (req, res) => {
  const requestCookie = req.cookies.user;
  const session = req.session;
  console.log(session, requestCookie);

  if (requestCookie !== undefined && session) {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        res.status(200).send(rows);
      }
    });
  } else {
    res.status(401).send("Login to see users");
  }
});

// 'login'
app.use(morgan("tiny")).post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email) {
    db.get(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password],
      (err, row) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("Server error");
        } else if (row) {
          //set cookie
          res.cookie("user", row, {
            maxAge: 5 * 60 * 1000, // 5 min
          });
          // res.setHeader("Content-Type", "application/json");
          res.status(200).send(row);
        } else {
          res.status(401).send("Invalid email or password");
        }
      }
    );
  } else {
    res.status(400).send("Enter a valid email or password");
  }
});

// 'register'
app.use(morgan("tiny")).post("/users/register", (req, res) => {
  const userData = req.body;
  const { email, password } = req.body;
  console.log("register parameters: ", userData);

  // Connect to the existing "users" database
  const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
      res.status(500).send("Error connecting to the database", err.message);
    } else {
      // Insert the user data into the "users" table
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
              (err, row) => {
                if (err) {
                  console.error(err.message);
                  res.status(500).send("Server error");
                } else if (row) {
                  //set cookie
                  res.cookie("user", row, {
                    maxAge: 5 * 60 * 1000, // 5 min
                  });
                  // res.setHeader("Content-Type", "application/json");
                  res.status(200).send({
                    message: "User data added successfully",
                    user: row,
                  });
                } else {
                  res.status(401).send("Invalid email or password");
                }
              }
            );
          }
        }
      );
    }
  });

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed");
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("connect.sid"); // clear the session cookie
      res.clearCookie("user"); // Delete the user cookie
      res.redirect("/login.html");
    }
  });
});

// not found
app.use((request, response) => {
  response.status(404).send("Page not found!");
});

//listen
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

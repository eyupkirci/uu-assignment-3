const app = require("express")();
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const ses = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// // GLOBALS //

let options = { secret: "uu-assignment-3" };
let curentSession;

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

// Set up bodyParser middleware to parse request bodies

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up cookie parser middleware
app.use(cookieParser());

// // set up for session middleware (creates: sid)
app.use(ses(options));

// Set Up cros
app.use(cors());

// ROUTES

// 'get'
app.use(morgan("tiny")).get("/users", (req, res) => {
  const requestCookie = req.cookies;

  if (requestCookie) {
    console.log("requestCookie", requestCookie);
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(rows);
      }
    });
    res.send(requestCookie);
  }
});

// 'login'
app.use(morgan("tiny")).post("/users/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      } else if (row) {
        res.cookie("username", row, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(row);
      } else {
        res.status(401).send("Invalid email or password");
      }
    }
  );
});

// 'register'
app.use(morgan("tiny")).post("/users/register", (req, res) => {
  const userData = req.body;
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
            res.status(200).send("User data added successfully");
          }
        }
      );
    }
  });

  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("rows", rows);
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

//listen
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

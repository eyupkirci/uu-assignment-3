const sqlite3 = require("sqlite3").verbose();
const movies = require("./movies");
const users = require("./users");

// Set up db
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    address TEXT NOT NULL,
    credit_card REAL NOT NULL,
    order_history TEXT
  )`);

  // Insert 5  users

  for (const user of users) {
    db.run(
      `INSERT INTO users (name, email, username, password, address, credit_card, order_history)
    VALUES  (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.name,
        user.email,
        user.username,
        user.password,
        user.address,
        user.credit_card,
        user.order_history,
      ],
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`User ${user.name} inserted into the database`);
        }
      }
    );
  }

  // Create users table
  db.run(
    `CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          genre TEXT NOT NULL,
          imageurl TEXT NOT NULL,
          imdbid TEXT NOT NULL,
          imdbrating REAL NOT NULL,
          released INTEGER NOT NULL,
          synopsis TEXT NOT NULL,
          title TEXT NOT NULL,
          type TEXT NOT NULL
          )`
  );

  //insert 50 movies into movies table
  for (const movie of movies) {
    db.run(
      `INSERT INTO movies (genre, imageurl, imdbid, imdbrating, released, synopsis, title, type)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.genre.join(", "),
        movie.imageurl.join(", "),
        movie.imdbid,
        movie.imdbrating,
        movie.released,
        movie.synopsis,
        movie.title,
        movie.type,
      ],
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Movie ${movie.title} inserted into the database`);
        }
      }
    );
  }

  // Create orders table

  db.run(
    `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  movie_id INTEGER,
  movie_title TEXT,
  isCompleted BOOLEAN DEFAULT false,
  date DATE DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (movie_title) REFERENCES movies(title)
)`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("orders table created.");
    }
  );

  //last comment
  console.log("Tables created and users and movies inserted");
});
db.close();

/*

// db creator function
const createDB = (movies, users, db) => {
  // Set up db
  const db = new sqlite3.Database("./database.db");

  db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    address TEXT NOT NULL,
    credit_card TEXT NOT NULL,
    order_history TEXT
  )`);

    // Insert 5  users

    for (const user of users) {
      db.run(
        `INSERT INTO users (name, email, username, password, address, credit_card, order_history)
    VALUES  (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.name,
          user.email,
          user.username,
          user.password,
          user.address,
          user.credit_card,
          user.order_history,
        ],
        (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`User ${user.name} inserted into the database`);
          }
        }
      );
    }

    // Create users table
    db.run(
      `CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          genre TEXT NOT NULL,
          imageurl TEXT NOT NULL,
          imdbid TEXT NOT NULL,
          imdbrating REAL NOT NULL,
          released INTEGER NOT NULL,
          synopsis TEXT NOT NULL,
          title TEXT NOT NULL,
          type TEXT NOT NULL
          )`
    );

    //insert 50 movies into movies table
    for (const movie of movies) {
      db.run(
        `INSERT INTO movies (genre, imageurl, imdbid, imdbrating, released, synopsis, title, type)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          movie.genre.join(", "),
          movie.imageurl.join(", "),
          movie.imdbid,
          movie.imdbrating,
          movie.released,
          movie.synopsis,
          movie.title,
          movie.type,
        ],
        (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`Movie ${movie.title} inserted into the database`);
          }
        }
      );
    }

    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    credit_card TEXT NOT NULL,
    order_history TEXT
  )`);

    console.log("Table created and user inserted");
  });
  db.close();
};

module.exports = createDB;

*/

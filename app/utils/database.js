const sqlite3 = require("sqlite3").verbose();
const movies = require("./movies");
const users = require("./users");
const bcrypt = require("bcryptjs");

// Set up db
const db = new sqlite3.Database("./database.db");

db.serialize(async () => {
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

  // // Insert 5  users
  // for (const user of users) {
  //   //hashing passwords before creatiin
  //   const salt = await bcrypt.genSalt(10);
  //   user.password = await bcrypt.hash(user.password, salt);
  //   //inserting users onto db
  //   db.run(
  //     `INSERT INTO users (name, email, username, password, address, credit_card, order_history)
  //   VALUES  (?, ?, ?, ?, ?, ?, ?)`,
  //     [
  //       user.name,
  //       user.email,
  //       user.username,
  //       user.password,
  //       user.address,
  //       user.credit_card,
  //       user.order_history,
  //     ],
  //     (err) => {
  //       if (err) {
  //         console.error(err.message);
  //       } else {
  //         console.log(`User ${user.name} inserted into the database`);
  //       }
  //     }
  //   );
  // }

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

  // Create availability table
  db.run(
    `CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER,
    date DATE,
    timeslot TEXT,
    available_seats INTEGER CHECK (available_seats <= 30),
    FOREIGN KEY (movie_id) REFERENCES movies (id)
);`,
    (err) => {
      if (err) {
        console.error(err.message);
      }

      console.log("availability table created.");
    }
  );

  db.all("SELECT * FROM movies", (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    rows.forEach((movie) => {
      const startDate = new Date("2023-03-10");
      const endDate = new Date("2023-06-10");
      const availableSeats = 30;
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        const timeslots = ["10:00", "13:00", "16:00"]; // assuming these are the available timeslots for each day
        for (const timeslot of timeslots) {
          const sql = `INSERT INTO availability (movie_id, date, timeslot, available_seats) VALUES (?,?,?,?)`;

          db.run(
            sql,
            [movie.id, dateString, timeslot, availableSeats],
            (err) => {
              if (err) {
                console.error(err.message);
                return;
              }
              console.log(`${movie.title} -> availability table created.`);
            }
          );
        }
      }
    });
  });

  // Create orders table
  db.run(
    `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  movie_id INTEGER,
  is_completed TEXT CHECK(is_completed IN ('true', 'false')),
  date TEXT,
  timeslot TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (timeslot) REFERENCES availability(movie_id)
)`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("orders table created.");
    }
  );

  // db.close();

  //last comment
  console.log("Tables created and users and movies inserted");
});

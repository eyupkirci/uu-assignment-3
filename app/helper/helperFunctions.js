const sqlite3 = require("sqlite3").verbose();

async function getMovies() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./utils/database.db");
    db.all("SELECT * FROM movies", (err, movies) => {
      if (err) {
        reject(err);
      } else {
        resolve(movies);
      }
      db.close();
    });
  });
}

async function getMovie(id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./utils/database.db");
    db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        console.log("No book found with ID", id);
        resolve(null);
      } else {
        resolve(row);
      }
      db.close();
    });
  });
}

async function getUser(id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./utils/database.db");
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        console.log("No user found with ID", id);
        resolve(null);
      } else {
        resolve(row);
      }
      db.close();
    });
  });
}

async function getMovieAvailability(movieId, movieDate) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./utils/database.db");
    db.all(
      "SELECT * FROM availability WHERE movie_id = ? AND date = ?",
      [movieId, movieDate],
      (err, movies) => {
        if (err) {
          reject(err);
        } else {
          resolve(movies); // todo: check the result with orders
        }
        db.close();
      }
    );
  });
}

async function getOrderedMovies(array) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./utils/database.db");
    let orderedMovies = [];

    // Use map instead of forEach to create an array of Promises that can be resolved using Promise.all
    const promises = array.map((item) => {
      return new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM movies WHERE id = ?",
          [item.movie_id],
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              orderedMovies.push(row);
              resolve();
            }
          }
        );
      });
    });

    Promise.all(promises)
      .then(() => {
        resolve(orderedMovies);
      })
      .catch((err) => {
        reject(err);
      });
    db.close();
  });
}

async function getOrderHistory(id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./utils/database.db");
    db.all(
      `SELECT orders.id, user_id, movie_id, orders.is_completed, orders.date, orders.timeslot FROM orders JOIN movies ON orders.movie_id = movies.id JOIN users ON orders.user_id = users.id WHERE users.id = ?`,
      [id],
      (err, movies) => {
        if (err) {
          reject(err);
        } else {
          resolve(movies);
        }
        db.close();
      }
    );
  });
}

async function updateOrders(req, movie) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./utils/database.db");
    db.run(
      `INSERT INTO orders (user_id, movie_id, date, is_completed, timeslot )
                 VALUES (?, ?, ?, ?,?)`,
      [
        req.user.id,
        movie.id,
        req.body.date,
        req.body.isCompleted,
        req.body.timeslot,
      ],
      (err) => {
        if (err) {
          console.log(
            "🚀 ~ file: api.js:38 ~ router.use ~ err.message:",
            err.message
          );
          reject(err);
        } else {
          resolve(`Orders for movie with ID ${movie.id} updated.`);
        }

        // insert order into orders table
        db.close();
      }
    );
  });
}

module.exports = {
  getUser,
  updateOrders,
  getMovies,
  getMovie,
  getOrderHistory,
  getOrderedMovies,
  getMovieAvailability,
};

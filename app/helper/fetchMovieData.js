async function getMovies(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM movies", (err, movies) => {
      if (err) {
        reject(err);
      } else {
        resolve(movies);
      }
    });
  });
}

async function getMovie(db, id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        console.log("No book found with ID", id);
        resolve(null);
      } else {
        resolve(row);
      }
    });
  });
}

async function getMovieAvailability(db, movieId, movieDate) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM availability WHERE movie_id = ? AND date = ?",
      [movieId, movieDate],
      (err, movies) => {
        if (err) {
          reject(err);
        } else {
          resolve(movies);
        }
      }
    );
  });
}

async function getOrderedMovies(db, array) {
  return new Promise((resolve, reject) => {
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
  });
}

async function getOrderHistory(db, id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT orders.id, user_id, movie_id, orders.is_completed, orders.date, orders.timeslot FROM orders JOIN movies ON orders.movie_id = movies.id JOIN users ON orders.user_id = users.id WHERE users.id = ?`,
      [id],
      (err, movies) => {
        if (err) {
          reject(err);
        } else {
          resolve(movies);
        }
      }
    );
  });
}

module.exports = {
  getMovies,
  getMovie,
  getOrderHistory,
  getOrderedMovies,
  getMovieAvailability,
};

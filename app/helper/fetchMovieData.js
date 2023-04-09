async function getMovies(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM movies", (err, movies) => {
      if (err) {
        reject(err);
      } else {
        // Map the rows to an array of movie names and resolve the promise
        // const movies = rows.map((row) => row);
        resolve(movies);
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

async function get10Movies(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM movies LIMIT 10", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Map the rows to an array of movie names and resolve the promise
        const movies = rows.map((row) => row);
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

async function getOrderHistory(db, id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT orders.id, user_id, movie_id, orders.is_completed, orders.date FROM orders JOIN movies ON orders.movie_id = movies.id JOIN users ON orders.user_id = users.id WHERE users.id = ?`,
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
  get10Movies,
  getMovie,
  getOrderHistory,
  getMovieAvailability,
};

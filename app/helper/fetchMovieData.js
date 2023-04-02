async function getMovies(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM movies", (err, rows) => {
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

module.exports = { getMovies, getMovie };

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (error) => {
  if (error) {
    console.error(error.message);
  }
});

module.exports = db;

async function updateUserOrderHostory(db, id) {
  return new Promise((resolve, reject) => {
    db.run(
      `
    UPDATE users
    SET order_history = (
      SELECT GROUP_CONCAT(m.title, ', ') 
      FROM orders o
      JOIN movies m ON o.movie_id = m.id 
      WHERE o.user_id = ?
    )
    WHERE id = ?
  `,
      [id, id],
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Order history for user with ID ${id} updated.`);
        }
      }
    );
  });
}

module.exports = { updateUserOrderHostory };

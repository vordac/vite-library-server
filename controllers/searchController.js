const searchBooks = (req, res) => {
    console.log("searchBooks called with title:", req.query.title);
    const { pool } = req;
    const { title } = req.query;
  
    pool.query(
      `SELECT b.book_id, b.isbn, b.title, c.category_name, p.publisher_name, l.language_name, a.full_name as author_name
       FROM library.book b
       JOIN library.category c ON b.category_id = c.category_id
       JOIN library.publisher p ON b.publisher_id = p.publisher_id
       JOIN library.language l ON b.language_id = l.language_id
       JOIN library.author a ON b.author_id = a.author_id
       WHERE b.title ILIKE $1`,
      [`%${title}%`],
      (err, result) => {
        if (err) {
          console.log("PostgreSQL query failed: ", err);
          res.status(500).send("Internal server error");
        } else {
          console.log("PostgreSQL query result:", result.rows);
          res.status(200).json(result.rows);
        }
      }
    );
  };

module.exports = { searchBooks };

const allBooks = (req, res) => {
  const { pool } = req;

  pool.query(
    'SELECT b.book_id, b.isbn, b.title, c.category_name, p.publisher_name, l.language_name, a.full_name as author_name, f.address as fund_address FROM library.book b JOIN library.category c ON b.category_id = c.category_id JOIN library.publisher p ON b.publisher_id = p.publisher_id JOIN library.language l ON b.language_id = l.language_id JOIN library.author a ON b.author_id = a.author_id LEFT JOIN library.book_fund f ON b.isbn = f.book_isbn',
    (err, result) => {
      if (err) {
        console.log('PostgreSQL query failed: ', err);
        res.status(500).send('Internal server error');
      } else {
        res.status(200).json(result.rows);
      }
    }
  );
};

module.exports = { allBooks };

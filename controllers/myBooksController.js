const myBooks = (req, res) => {
    const { pool } = req;
    const { userId } = req.query;

    pool.query(
        `SELECT f.formulary_number, f.employee_full_name, f.book_isbn, f.loan_date, f.loan_days, f.return_date, f.reader_full_name, f.address
         FROM library.book_formulary f
         JOIN library.reader r ON f.reader_full_name = r.full_name
         WHERE r.id = $1`,
        [userId],
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

module.exports = { myBooks };
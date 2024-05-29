const lendBook = async (req, res) => {
    const { pool } = req;
    const { employee_personal_id, book_isbn, reader_id } = req.body;

    try {
        // Begin transaction
        await pool.query("BEGIN");

        // Step 1: Get employee_full_name
        const employeeResult = await pool.query(
            "SELECT full_name FROM library.employee WHERE personal_id = $1",
            [employee_personal_id]
        );
        const employee_full_name = employeeResult.rows[0].full_name;

        // Step 2: Get reader_full_name
        const readerResult = await pool.query(
            "SELECT full_name FROM library.reader WHERE id = $1",
            [reader_id]
        );
        const reader_full_name = readerResult.rows[0].full_name;

        // Step 3-5: Calculate loan_date, loan_days, and return_date
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 3); // Ukrainian timezone is UTC+3
        const loan_date = currentDate.toISOString().slice(0, 10);
        const loan_days = 14;
        const return_date = new Date(currentDate);
        return_date.setDate(return_date.getDate() + loan_days);
        const formattedReturnDate = return_date
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "/");

        // Step 6: Insert data into library.book_formulary
        await pool.query(
            "INSERT INTO library.book_formulary (employee_full_name, book_isbn, loan_date, loan_days, return_date, reader_full_name) VALUES ($1, $2, $3, $4, $5, $6)",
            [
                employee_full_name,
                book_isbn,
                loan_date,
                loan_days,
                formattedReturnDate,
                reader_full_name,
            ]
        );

        // Commit transaction
        await pool.query("COMMIT");

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("PostgreSQL query failed:", error);

        // Rollback transaction
        await pool.query("ROLLBACK");

        res.status(500).json({ success: false });
    }
};

module.exports = { lendBook };

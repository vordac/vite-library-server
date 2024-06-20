const pool = require("../db");

const deleteFormular = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(
      "DELETE FROM library.book_formulary WHERE formulary_number = $1",
      [id]
    );

    res.status(200).json({ message: "Formular deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  deleteFormular: deleteFormular,
};

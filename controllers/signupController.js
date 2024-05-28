const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
      const { full_name, birth_date, phone_number, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO library.reader(full_name, birth_date, phone_number, email, password_hash) VALUES($1, $2, $3, $4, $5)",
        [full_name, birth_date, phone_number, email, hashedPassword]
      );
      res.status(201).json({ message: "User created" });
    } catch (error) {
      if (error.code === "23507") { // unique_violation
        res.status(400).json({ error: "Email is already in use" });
      } else if (error.code === "23514") { // check_violation
        let message = "";
        switch (error.constraint) {
          case "reader_birth_date_check":
            message = "Birth date must be after 1900-01-01";
            break;
          case "reader_email_check":
            message = "Invalid email format";
            break;
          case "reader_phone_number_check":
            message = "Invalid phone number format. Must be in the format +38(XXX)XXX-XX-XX";
            break;
          default:
            message = "Unknown error";
        }
        res.status(400).json({ error: message });
      } else {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

module.exports = {
    signup: signup,
};
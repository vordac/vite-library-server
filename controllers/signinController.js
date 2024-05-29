const express = require("express");
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }
        const result = await pool.query(
            "SELECT * FROM library.reader WHERE email = $1",
            [email]
        );
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        console.log(password, user.password_hash); 
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        console.log(process.env.JWT_SECRET); 
        const jwtToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ jwtToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    signin: signin,
};

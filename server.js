const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'supersecretjwtkey123';

app.use(express.json());
app.use(cors());

// In-memory array to simulate DB for POC purposes,
// but we will also setup mysql as requested if it's available.
let users = [];

// Create a pool for MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'auth_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create tables if using real DB
async function initDB() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database connected and users table ensured.');
        connection.release();
    } catch (error) {
        console.log('MySQL not running or accessible. Falling back to in-memory store for POC testing.');
        // App will gracefully degrade to using 'users' array if MySQL isn't setup locally.
        // We will mock pool.execute in the routes if DB is down.
    }
}

initDB();

let isDbConnected = false;
pool.getConnection()
    .then(conn => { isDbConnected = true; conn.release(); })
    .catch(() => { isDbConnected = false; });

// API Route: Register
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (isDbConnected) {
            // Check if user exists
            const [rows] = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
            if (rows.length > 0) {
                return res.status(400).json({ message: 'User already exists.' });
            }

            // Insert into DB
            await pool.execute(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );
            return res.status(201).json({ message: 'User registered successfully.' });
        } else {
            // Fallback to array for testing if MySQL is unavailable
            const userExists = users.find(u => u.email === email);
            if (userExists) {
                return res.status(400).json({ message: 'User already exists.' });
            }
            users.push({ id: users.length + 1, name, email, password: hashedPassword });
            return res.status(201).json({ message: 'User registered successfully (in-memory).' });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// API Route: Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        let user;

        if (isDbConnected) {
            const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
            user = rows[0];
        } else {
            user = users.find(u => u.email === email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.user_id || user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.user_id || user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// API Route: Logout
// Note: In a pure JWT setup, logout is usually handled client-side by destroying the token.
// We provide this endpoint to fulfill the requirements.
app.post('/api/logout', (req, res) => {
    // Optionally, you could implement a token blacklist here
    res.json({ message: 'Logged out successfully.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

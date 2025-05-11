import express from 'express';
import db from '../db.js';
// import bcrypt from 'bcryptjs'; // For password hashing (recommended)
// import jwt from 'jsonwebtoken'; // For token generation (recommended)

const router = express.Router();

// @route   POST api/auth/login
// @desc    Authenticate user & get token (simplified: just check password)
// @access  Public
router.post('/login', async (req, res) => {
  console.log('POST /api/auth/login hit'); // New log
  const { email, password } = req.body;
  console.log('Request body:', req.body); // New log

  if (!email || !password) {
    console.log('Login validation failed: Missing fields'); // New log
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    console.log('Attempting to get DB pool...'); // New log
    const pool = db.getPool();
    console.log('DB pool obtained. Querying for user by email:', email); // New log
    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('User query result:', userRows); // New log

    if (userRows.length === 0) {
      console.log('Login failed: User not found with email:', email); // New log
      return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
    }

    const user = userRows[0];
    console.log('User found:', user); // New log

    // INSECURE: Plain text password comparison.
    // In a real app, use bcrypt.compare:
    // const isMatch = await bcrypt.compare(password, user.password_hash); // Assuming column is password_hash
    // if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials (password mismatch)' });

    console.log('Comparing provided password with stored password.'); // New log
    if (password !== user.password) { // Direct comparison (INSECURE)
        console.log('Login failed: Password mismatch for user:', email); // New log
        return res.status(400).json({ msg: 'Invalid credentials (password mismatch)' });
    }

    console.log('Login successful for user:', email); // New log
    // If using JWT (recommended)
    // const payload = { user: { id: user.id } };
    // jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
    //   if (err) throw err;
    //   res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    // });

    // Simplified response for now
    res.json({
      success: true,
      msg: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error('Login error in /api/auth/login:', err.message, err.stack); // Enhanced log
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/register
// @desc    Register a new user (simplified)
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const pool = db.getPool();

        // Check if user already exists
        const [emailExistsRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (emailExistsRows.length > 0) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }
        
        const [usernameExistsRows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (usernameExistsRows.length > 0) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        // INSECURE: Storing plain text password.
        // In a real app, hash the password:
        // const salt = await bcrypt.genSalt(10);
        // const passwordHash = await bcrypt.hash(password, salt);
        // Then insert passwordHash instead of password

        const sqlQuery = 'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())';
        const [result] = await pool.query(sqlQuery, [username, email, password]); // Storing plain password (INSECURE)

        res.status(201).json({
            msg: 'User registered successfully',
            user: {
                id: result.insertId, // Get the auto-incremented ID
                username: username,
                email: email,
            },
        });

    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/change-password
// @desc    Change user password
// @access  Private (should be protected by auth middleware in a real app)
router.post('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'Please provide User ID, current password, and new password.' });
  }

  try {
    const pool = db.getPool();
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    const user = userRows[0];

    // INSECURE: Plain text password comparison.
    // In a real app, use bcrypt.compare:
    // const isMatch = await bcrypt.compare(currentPassword, user.password);
    // if (!isMatch) return res.status(400).json({ msg: 'Invalid current password.' });
    if (currentPassword !== user.password) { // Direct comparison (INSECURE)
      return res.status(400).json({ msg: 'Invalid current password.' });
    }

    // INSECURE: Storing plain text password.
    // In a real app, hash the new password:
    // const salt = await bcrypt.genSalt(10);
    // const newPasswordHash = await bcrypt.hash(newPassword, salt);
    // await pool.query('UPDATE users SET password = ? WHERE id = ?', [newPasswordHash, userId]);
    
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]); // Storing plain password (INSECURE)

    res.json({ success: true, msg: 'Password updated successfully.' });

  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;

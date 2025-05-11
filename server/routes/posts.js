import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const pool = db.getPool();
    const [rows] = await pool.query('SELECT * FROM posts ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single post by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = db.getPool();
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const { title, content, status } = req.body;
  try {
    const pool = db.getPool();
    const sqlQuery = 'INSERT INTO posts (title, content, status, date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW(), NOW())';
    const [result] = await pool.query(sqlQuery, [title, content, status || 'draft']);
    
    // Get the newly created post
    const [newPostRows] = await pool.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    res.status(201).json(newPostRows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;
  try {
    const pool = db.getPool();
    const sqlQuery = 'UPDATE posts SET title = ?, content = ?, status = ?, updated_at = NOW() WHERE id = ?';
    const [result] = await pool.query(sqlQuery, [title, content, status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Post not found or no changes made' });
    }
    // Get the updated post
    const [updatedPostRows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    res.json(updatedPostRows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = db.getPool();
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
      
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json({ msg: 'Post deleted' }); // MySQL delete doesn't return the deleted row by default
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;

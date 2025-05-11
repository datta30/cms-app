import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js'; // Import auth routes
// import pageRoutes from './routes/pages.js'; // Future use
// import mediaRoutes from './routes/media.js'; // Future use

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Backend port

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes); // Add auth routes
// app.use('/api/pages', pageRoutes); // Future use
// app.use('/api/media', mediaRoutes); // Future use

// Basic route
app.get('/', (req, res) => {
  res.send('CMS Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

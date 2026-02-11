const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/user.route');
app.use('/api/users', userRoutes); 
const postRoutes = require('./routes/posts.route');
app.use('/api/posts', postRoutes);
const searchRoutes = require('./routes/search.route');
app.use('/api/search', searchRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
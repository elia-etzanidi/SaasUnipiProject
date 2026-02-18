const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./socket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

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
const messageRoutes = require('./routes/message.route');
app.use('/api/messages', messageRoutes);
const groupRoutes = require('./routes/group.route');
app.use('/api/groups', groupRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log(err));

// Initialize Socket.io
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/v1/auth');
const postsRoutes = require('./routes/v1/posts');
const commentsRoutes = require('./routes/v1/comments');
const topicsRoutes = require('./routes/v1/topics');
const listsRoutes = require('./routes/v1/lists');
const likesRoutes = require('./routes/v1/likes');
const notificationsRoutes = require('./routes/v1/notifications');
const uploadRoutes = require('./routes/v1/upload');
const dashboardRoutes = require('./routes/v1/dashboard');

dotenv.config();
const app = express();
const swaggerDocument = require('./swagger.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/posts/covers', express.static(path.join(__dirname, 'public', 'posts', 'covers')));
app.use('/users/avatars', express.static(path.join(__dirname, 'public', 'users', 'avatars')));
app.use('/posts/podcasts', express.static(path.join(__dirname, 'public', 'posts', 'podcasts')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/v1/auth', authRoutes);
app.use('/v1/posts', postsRoutes);
app.use('/v1/comments', commentsRoutes);
app.use('/v1/topics', topicsRoutes);
app.use('/v1/lists', listsRoutes);
app.use('/v1/likes', likesRoutes);
app.use('/v1/notifications', notificationsRoutes);
app.use('/v1/upload', uploadRoutes);
app.use('/v1/dashboard', dashboardRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'مسیر مورد نظر یافت نشد' });
});

module.exports = app;
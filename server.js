const express = require('express');
const path = require('path');
const config = require('config');

const connectDB = require('./config/db');
const { generalErrorHandle } = require('./utils/errorHandling');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes

// backend apis
app.use('/api/backend/auth/auth', require('./routes/backend/auth/auth'));
app.use('/api/backend/users/users', require('./routes/backend/users/users'));
app.use(
  '/api/backend/artists/artists',
  require('./routes/backend/artists/artists')
);
app.use(
  '/api/backend/artists/artDirectors',
  require('./routes/backend/artists/artDirectors')
);
app.use(
  '/api/backend/artists/eventArtists',
  require('./routes/backend/artists/eventArtists')
);
app.use(
  '/api/backend/events/events',
  require('./routes/backend/events/events')
);
app.use(
  '/api/backend/events/phaseEvents',
  require('./routes/backend/events/phaseEvents')
);
app.use(
  '/api/backend/phases/phases',
  require('./routes/backend/phases/phases')
);
// media api
app.use('/api/backend/media', require('./routes/backend/media/media'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Override Express default error handling
// https://expressjs.com/en/guide/error-handling.html
app.use(function (err, req, res, next) {
  generalErrorHandle(err, res);
});

const PORT = config.get('Network.port') || process.env.PORT || 5000;

app.listen(PORT, _ => {
  console.log(`Server started on ${PORT}`);
});

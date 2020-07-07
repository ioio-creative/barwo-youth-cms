require('dotenv').config();
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

// Allow CORS
// https://enable-cors.org/server_expressjs.html
// TODO:
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token'
  );
  next();
});

// Define Routes

// backend apis
app.use('/api/backend/auth/auth', require('./routes/backend/auth/auth'));
app.use('/api/backend/users/users', require('./routes/backend/users/users'));
app.use(
  '/api/backend/users/editPassword',
  require('./routes/backend/users/editPassword')
);
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
  '/api/backend/events/ticketingDefault',
  require('./routes/backend/events/ticketingDefault')
);
app.use(
  '/api/backend/phases/phases',
  require('./routes/backend/phases/phases')
);
app.use(
  '/api/backend/landingPage/landingPage',
  require('./routes/backend/landingPage/landingPage')
);
app.use(
  '/api/backend/globalConstants/globalConstants',
  require('./routes/backend/globalConstants/globalConstants')
);
// media api
app.use('/api/backend/media', require('./routes/backend/media/media'));

// frontend apis
app.use('/api/frontend/artists', require('./routes/frontend/artists/artists'));
app.use('/api/frontend/events', require('./routes/frontend/events/events'));
app.use('/api/frontend/phases', require('./routes/frontend/phases/phases'));
app.use(
  '/api/frontend/landingPage/landingPage',
  require('./routes/frontend/landingPage/landingPage')
);
// app.use(
//   '/api/frontend/globalConstants',
//   require('./routes/frontend/globalConstants/globalConstants')
// );

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

console.log('Environment:', process.env.NODE_ENV);

const PORT = config.get('Network.port') || process.env.PORT || 5000;

app.listen(PORT, _ => {
  console.log(`Server started on ${PORT}`);
});

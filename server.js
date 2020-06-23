const express = require('express');
const path = require('path');

const connectDB = require('./config/db');
const { generalErrorHandle } = require('./utils/errorHandling');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/events', require('./routes/events'));
app.use('/api/artDirectors', require('./routes/artDirectors'));
app.use('/api/eventArtists', require('./routes/eventArtists'));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, _ => {
  console.log(`Server started on ${PORT}`);
});

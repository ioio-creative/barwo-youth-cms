require('dotenv').config();
const express = require('express');
const path = require('path');
const config = require('config');
const router = express.Router();

const connectDB = require('./config/db');
const { generalErrorHandle } = require('./utils/errorHandling');

const app = express();

require("./utils/cache/cache");
// Connect Database
connectDB();




// Init Middleware
// app.use(express.raw({ type: 'application/vnd.ms-excel' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(express.json({ extended: false }));
// app.use(express.urlencoded({ extended: false }));

// Allow CORS
// https://enable-cors.org/server_expressjs.html
// TODO:
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token'
  );
  // console.log(req.url && req.url);
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
  '/api/backend/activities/activities',
  require('./routes/backend/activities/activities')
);
app.use(
  '/api/backend/activities/activitiesForSelect',
  require('./routes/backend/activities/activitiesForSelect')
);
app.use(
  '/api/backend/newses/newses',
  require('./routes/backend/newses/newses')
);
// app.use(
//   '/api/backend/newses/newsesInOrder',
//   require('./routes/backend/newses/newsesInOrder')
// );
app.use(
  '/api/backend/newsMediaItems/newsMediaItems',
  require('./routes/backend/newsMediaItems/newsMediaItems')
);
app.use(
  '/api/backend/globalConstants/globalConstants',
  require('./routes/backend/globalConstants/globalConstants')
);
app.use(
  '/api/backend/landingPage/landingPage',
  require('./routes/backend/landingPage/landingPage')
);
app.use('/api/backend/about/about', require('./routes/backend/about/about'));
app.use(
  '/api/backend/miscellaneousInfo/miscellaneousInfo',
  require('./routes/backend/miscellaneousInfo/miscellaneousInfo')
);
app.use(
  '/api/backend/pageMetaMiscellaneous/pageMetaMiscellaneous',
  require('./routes/backend/pageMetaMiscellaneous/pageMetaMiscellaneous')
);
app.use(
  '/api/backend/contacts/contacts',
  require('./routes/backend/contacts/contacts')
);
app.use(
  '/api/backend/contacts/exportAndImport',
  require('./routes/backend/contacts/contactsExportAndImport')
);
app.use(
  '/api/backend/newsletters/newsletters',
  require('./routes/backend/newsletters/newsletters')
);
// app.use(
//   '/api/backend/newsletters/newslettersInOrder',
//   require('./routes/backend/newsletters/newslettersInOrder')
// );
app.use(
  '/api/backend/newsletters/sendHistory',
  require('./routes/backend/newsletters/sendHistory')
);
app.use(
  '/api/backend/sender/sender',
  require('./routes/backend/sender/sender')
);

// media api
app.use('/api/backend/media', require('./routes/backend/media/media'));

// frontend apis
app.use('/api/frontend/artists', require('./routes/frontend/artists/artists'));
app.use(
  '/api/frontend/events',
  require('./routes/frontend/events/events').router
);
app.use(
  '/api/frontend/events/ticketingDefault',
  require('./routes/frontend/events/ticketingDefault')
);
app.use('/api/frontend/phases', require('./routes/frontend/phases/phases'));
app.use(
  '/api/frontend/activities',
  require('./routes/frontend/activities/activities')
);
// app.use(
//   '/api/frontend/newses/newsCombined',
//   require('./routes/frontend/newses/newsCombined')
// );
app.use(
  '/api/frontend/newses',
  require('./routes/frontend/newses/newses').router
);
app.use(
  '/api/frontend/newsletters',
  require('./routes/frontend/newsletters/newsletters').router
);
app.use(
  '/api/frontend/newsMediaItems',
  require('./routes/frontend/newsMediaItems/newsMediaItems').router
);
app.use(
  '/api/frontend/globalConstants',
  require('./routes/frontend/globalConstants/globalConstants')
);
app.use(
  '/api/frontend/landingPage',
  require('./routes/frontend/landingPage/landingPage')
);
app.use('/api/frontend/about', require('./routes/frontend/about/about'));
app.use(
  '/api/frontend/miscellaneousInfo',
  require('./routes/frontend/miscellaneousInfo/miscellaneousInfo')
);
app.use(
  '/api/frontend/pageMetaMiscellaneous',
  require('./routes/frontend/pageMetaMiscellaneous/pageMetaMiscellaneous')
    .router
);
app.use(
  '/api/frontend/contacts',
  require('./routes/frontend/contacts/contacts')
);

// search
app.use('/api/frontend/search', require('./routes/frontend/search/search'));

// aws: for email bounces and complaints
app.use('/api/aws/sns', require('./routes/aws/sns'));
app.use(function (req, res, next) {
  if (req.get('x-amz-sns-message-type')) {
    req.headers['content-type'] = 'application/json'; //IMPORTANT, otherwise content-type is text for topic confirmation reponse, and body is empty
  }
  next();
});

// Load body parser to handle POST requests
// app.use(bodyParser.json());

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

// test ssl

const WebsiteBackend = config.get('WebsiteBackend.root');

 try {
   const SSLPORT = config.get('Network.sslport') || process.env.PORT || 5000;
   if (SSLPORT && SSLPORT !== PORT) {
     const https = require('https');
     const { readFileSync } = require('fs');
      const sslServer = https.createServer(
       {
         // key: fs.readFileSync(
         //   '/etc/letsencrypt/live/testbarwocms.ioiocreative.com/privkey.pem',
         //   'utf-8'
         // ),
         // cert: fs.readFileSync(
         //   '/etc/letsencrypt/live/testbarwocms.ioiocreative.com/cert.pem',
         //   'utf-8'
         // ),
         // ca: fs.readFileSync(
         //   '/etc/letsencrypt/live/testbarwocms.ioiocreative.com/chain.pem',
         //   'utf-8'
         // ),
         key: readFileSync('./cert/privkey.pem', 'utf-8'),
         cert: readFileSync('./cert/cert.pem', 'utf-8')
       },
       app
     );
     sslServer.listen(SSLPORT, _ => {
       console.log(`SSL Server started on ${SSLPORT}`);
     });
   }
 } catch (err) {
   console.error('Test SSL Warning:');
   console.error(err);
 }
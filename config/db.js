const mongoose = require('mongoose');
const config = require('config');
const db = config.get('Database_ConnectionString');

const connectDB = async _ => {
  try {
    if (config.get('Database_IsDebug')) {
      mongoose.set('debug', true);
    }

    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      // https://medium.com/cashpositive/the-hitchhikers-guide-to-mongodb-transactions-with-mongoose-5bf8a6e22033
      replicaSet: 'rs'
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

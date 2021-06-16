/**
 * https://medium.com/@haimrait/how-to-add-a-redis-cache-layer-to-mongoose-in-node-js-a9729181ad69
 * How to add a Redis cache layer to Mongoose in Node.js
 */
const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const config = require("config");

const client = redis.createClient({
  host: config.get("Redis.host"),
  port: config.get("Redis.port"),
  retry_strategy: () => 1000
});
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = { time: 60 }) {
  this.useCache = true;
  this.time = options.time;
  this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);

  return this;
};

mongoose.Query.prototype.exec = async function() {
  // try to cache all query first to see the performance
  // if (!this.useCache) {
  //   return await exec.apply(this, arguments);
  // }

  this.time = config.get("Redis.cacheTime");
  this.hashKey = this.mongooseCollection.name;
  
  const key = JSON.stringify({
    ...this.getQuery()
  });

  const cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    console.log("Response from Redis");
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  console.log(this.time);
  client.hset(this.hashKey, key, JSON.stringify(result));
  client.expire(this.hashKey, this.time);

  console.log("Response from MongoDB");
  return result;
};

module.exports = {
  clearKey(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
const { Redis } = require('@upstash/redis');
require('dotenv').config();
try{
exports.redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});
console.log("Redis Connected Successfully!");
}catch(error){
console.error("Error Occured While Redis Connection!",error.message);
}

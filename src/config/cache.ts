import { createClient } from "redis";

export const redisClient = createClient();
redisClient.on("error", (err) => console.log(err));
redisClient.connect().then(() => {
  console.log("Connected to Redis");
  redisClient.flushAll().then((_) => console.log("Redis cache clean"));
});

import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { connect } from "mongoose";
import * as dotenv from "dotenv";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

import { createSchema } from "./utils/createSchema";
import { __prod__ } from "./constants";

dotenv.config();

const DB_URL: string | any = process.env.MONGO_DB_URL;
const PORT = 4000;

const main = async () => {
  try {
    const app = express();

    const mongoose = await connect(DB_URL);
    mongoose.connection.on("open", () => console.log("DB CONNECTED! ✨"));

    //session connection
    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
      session({
        name: process.env.COOKIE_NAME,
        store: new RedisStore({
          client: redis,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          sameSite: "lax", // csrf
          secure: __prod__, //cookie only works in https
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET as string,
        resave: false,
      })
    );

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 30 }));

    const apolloServer = new ApolloServer({
      uploads: false, // disable apollo upload property
      schema: await createSchema(),
      context: ({ req, res }) => ({ req, res, redis }),
    });

    apolloServer.applyMiddleware({
      app,
    });

    app.listen(PORT, () =>
      console.log(`Server has started on port ${PORT} 🚀`)
    );
  } catch (err) {
    console.error(err);
  }
};

main().catch((err) => {
  console.error(err);
});

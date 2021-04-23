import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        database: "lireddit2",
        username: "jsyovo",
        password: "jsyovo",
        logging: true,
        synchronize: true,
        entities: [Post, User],
    });
    console.log(conn);
    // const orm = await MikroORM.init(mikroOrmConfig);
    // await orm.getMigrator().up();

    // const post = orm.em.create(Post, { title: "my first post" });
    // await orm.em.persistAndFlush(post);

    // console.log("==========sql2===========");
    // await orm.em.nativeInsert(Post, { title: "my first post 2" });

    // const insertedPost = await orm.em.find(Post, {});
    // console.log(insertedPost);

    const app = express();
    const RedisStore = connectRedis(session as any);
    const redis = new Redis();
    app.use(
        cors({ origin: "http://localhost:3000", credentials: true })
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
                disableTTL: true,
            }) as any,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                secure: __prod__, // cookie only works on https
                sameSite: "lax", // csrf
            },
            saveUninitialized: false,
            secret: "asdasfqascdcds",
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) =>
            // context이며, express의 req, res도 사용 가능
            ({
                req,
                res,
                redis,
            }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.get("/", (_, res) => {
        res.send("hello world");
    });
    app.listen(4000, () => {
        console.log(`Server started on localhost:4000`);
    });
};

main().catch((err) => {
    console.error(err);
});

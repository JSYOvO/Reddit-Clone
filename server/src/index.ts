import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    // const post = orm.em.create(Post, { title: "my first post" });
    // await orm.em.persistAndFlush(post);

    // console.log("==========sql2===========");
    // await orm.em.nativeInsert(Post, { title: "my first post 2" });

    // const insertedPost = await orm.em.find(Post, {});
    // console.log(insertedPost);

    const app = express();
    const RedisStore = connectRedis(session as any);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: `qid`,
            store: new RedisStore({
                client: redisClient,
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
        context: ({ req, res }: any): MyContext =>
            // context이며, express의 req, res도 사용 가능
            ({
                em: orm.em,
                req,
                res,
            }),
    });

    apolloServer.applyMiddleware({ app });

    app.get("/", (req, res) => {
        res.send("hello world");
    });
    app.listen(4000, () => {
        console.log(`Server started on localhost:4000`);
    });
};

main().catch((err) => {
    console.error(err);
});

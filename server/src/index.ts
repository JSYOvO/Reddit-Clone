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

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false,
        }),
        context: () =>
            // context이며, express의 req, res도 사용 가능
            ({
                em: orm.em,
            }),
    });
    apolloServer.applyMiddleware({ app });

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

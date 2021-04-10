// createdb lireddit

import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    // const post = orm.em.create(Post, { title: "my first post" });
    // await orm.em.persistAndFlush(post);

    // console.log("==========sql2===========");
    // await orm.em.nativeInsert(Post, { title: "my first post 2" });

    // const insertedPost = await orm.em.find(Post, {});
    // console.log(insertedPost);
};

main();

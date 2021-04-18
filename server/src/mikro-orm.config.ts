import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path"; // Function built in node
import { User } from "./entities/User";
// import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    dbName: "lireddit",
    user: "jsyovo",
    type: "postgresql",
    debug: !__prod__,
    // } as const; // 이렇게 쓰면 String이 아닌 데이터 타입으로 들어감
} as Parameters<typeof MikroORM.init>[0];

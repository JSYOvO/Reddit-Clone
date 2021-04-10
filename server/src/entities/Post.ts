import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
// import { O_NOFOLLOW } from "constants";

@ObjectType() // graphQL 타입으로 변환
@Entity()
export class Post {
    @Field() // graphQL 타입 스키마로 반환
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({ type: "date" })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({ type: "text" })
    title!: string;
}

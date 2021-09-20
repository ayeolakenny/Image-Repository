import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true, unique: true })
  username: string;

  @Property({ required: true })
  password: string;

  @Field()
  @Property({ default: new Date(), required: true })
  createdAt: Date;

  @Field()
  @Property({ default: new Date(), required: true })
  updatedAt: Date;
}

export const UserModel = getModelForClass(User);

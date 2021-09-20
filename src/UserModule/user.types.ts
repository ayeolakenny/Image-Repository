import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";

@ObjectType()
class UserFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

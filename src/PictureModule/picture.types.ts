import { Field, ObjectType } from "type-graphql";
import { Picture } from "./picture.schema";

@ObjectType()
class PictureFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class PictureResponse {
  @Field(() => [PictureFieldError], { nullable: true })
  errors?: PictureFieldError[];

  @Field(() => [Picture], { nullable: true })
  result?: Picture[];
}

@ObjectType()
class DeleteFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class DeleteResponse {
  @Field(() => [DeleteFieldError], { nullable: true })
  errors?: DeleteFieldError[];

  @Field(() => String, { nullable: true })
  result?: string;
}

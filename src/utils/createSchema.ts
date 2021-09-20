import { buildSchema } from "type-graphql";
import { PictureResolver } from "../PictureModule/picture.resolver";
import { UserResolver } from "../UserModule/user.resolver";

export const createSchema = async () =>
  await buildSchema({
    resolvers: [UserResolver, PictureResolver],
    validate: false,
  });

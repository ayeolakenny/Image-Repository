import { graphql } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../utils/createSchema";
import { ObjectId } from "mongodb";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: ObjectId;
}

export const gCall = async ({ source, variableValues, userId }: Options) => {
  return graphql({
    schema: await createSchema(),
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};

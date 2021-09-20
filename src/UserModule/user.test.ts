import { gCall } from "../test-utils/gCall";
import { closeConnection, createConnection } from "../test-utils/dbHandler";
import { LoginMutation, MeQuery, SignupMutation } from "../test-utils/user.gql";
import * as argon2 from "argon2";
import faker from "faker";
import { UserModel } from "./user.schema";

beforeAll(async () => {
  await createConnection();
});

afterAll(async () => {
  await closeConnection();
});

describe("Signup", () => {
  it("create user", async () => {
    const user = {
      username: faker.name.firstName(),
      password: faker.internet.password(),
    };
    const response = await gCall({
      source: SignupMutation,
      variableValues: {
        options: user,
      },
    });
    expect(response).toMatchObject({
      data: {
        signup: {
          errors: null,
          user: {
            username: user.username,
          },
        },
      },
    });
    const dbUser = await UserModel.findOne({ username: user.username });
    expect(dbUser).toBeDefined();
    expect(dbUser?.username).toBe(user.username);
  });
});

describe("Login", () => {
  it("login user", async () => {
    const user = {
      username: faker.name.firstName(),
      password: faker.internet.password(),
    };
    const newUser = await new UserModel({
      username: user.username,
      password: await argon2.hash(user.password),
    }).save();
    const response = await gCall({
      source: LoginMutation,
      variableValues: {
        username: user.username,
        password: user.password,
      },
    });
    expect(response).toMatchObject({
      data: {
        login: {
          errors: null,
          user: {
            username: newUser.username,
          },
        },
      },
    });
    const dbUser = await UserModel.findOne({ username: user.username });
    expect(dbUser).toBeDefined();
    expect(dbUser?.username).toBe(user.username);
  });
});

describe("Me", () => {
  it("get loggedin user", async () => {
    const user = await new UserModel({
      username: faker.name.firstName(),
      password: faker.internet.password(),
    }).save();
    const response = await gCall({
      source: MeQuery,
      userId: user._id,
    });
    expect(response).toMatchObject({
      data: {
        me: {
          _id: user._id,
          username: user.username,
        },
      },
    });
  });
});

it("return null", async () => {
  const response = await gCall({
    source: MeQuery,
  });
  expect(response).toMatchObject({
    data: {
      me: null,
    },
  });
});

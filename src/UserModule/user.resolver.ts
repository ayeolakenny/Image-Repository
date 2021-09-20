import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "./user.schema";
import { UsernamePasswordInput, UserResponse } from "./user.types";
import * as argon2 from "argon2";
import * as dotenv from "dotenv";

import { MyContext } from "../types";
import { validateUserInput } from "./helpers/validateUserInput";
dotenv.config();

const COOKIE_NAME: string | any = process.env.COOKIE_NAME;

@Resolver()
export class UserResolver {
  //get current logged in user
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null; //not logged in

    const user = await UserModel.findById(req.session.userId);

    return user;
  }

  // signup a new user
  @Mutation(() => UserResponse)
  async signup(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const { password, username } = options;
    const checkUsernameTaken = await UserModel.findOne({
      username,
    });

    if (checkUsernameTaken) {
      return {
        errors: [
          {
            field: "username",
            message: "Username already taken",
          },
        ],
      };
    }

    const errors: any = validateUserInput(options);
    if (errors) return { errors };

    const hashedPassword = await argon2.hash(password);
    const user = await new UserModel({
      username: options.username,
      password: hashedPassword,
    }).save();

    req.session.userId = user.id;

    return { user };
  }

  //login a user
  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "credentials are not correct, try again",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "credentials are not correct, try again",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  //logout a user
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}

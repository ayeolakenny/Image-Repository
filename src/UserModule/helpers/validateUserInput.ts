import { UsernamePasswordInput } from "../user.types";

export const validateUserInput = (options: UsernamePasswordInput) => {
  const { password, username } = options;
  if (!username) {
    return [
      {
        field: "username",
        message: "required",
      },
    ];
  }

  if (username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  if (password.length === 0) {
    return [
      {
        field: "password",
        message: "required",
      },
    ];
  }

  if (password.length < 6) {
    return [
      {
        field: "password",
        message: "needs to be atleast 6 characters long",
      },
    ];
  }

  return null;
};

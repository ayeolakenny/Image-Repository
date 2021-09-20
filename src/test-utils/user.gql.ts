export const SignupMutation = `
 mutation Signup($options: UsernamePasswordInput!){
  signup(options: $options){
    errors{
      field
      message
    }
    user{
      _id
      username
    }
  }
}
`;

export const LoginMutation = `
 mutation LoginMutation($username: String!, $password: String!){
  login(username:$username, password:$password){
    errors{
      field
      message
    }
    user{
      _id
      username
    }
  }
}
`;

export const MeQuery = `
query Me{
  me{
    _id
    username
  }
}
`;

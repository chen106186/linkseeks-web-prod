enum LOGIN_TYPE {
  PASSWORD = 1,
}

interface LoginOptions {
  loginType: LOGIN_TYPE
}

class LoginFactoryClass {
  loginType: LOGIN_TYPE

  constructor(options: LoginOptions) {
    this.loginType = options.loginType
  }
}

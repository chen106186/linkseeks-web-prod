export interface ILoginModule {
  username: string
  password: string
  res: object

  handleLogin(): Promise<object>
}

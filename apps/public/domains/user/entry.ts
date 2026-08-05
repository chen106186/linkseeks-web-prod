import { postMemberLogin } from '@@/apis/src'
import { useMemo, useState } from 'react'
import { IEntityWithId, IValueObject } from '../BaseEntry'

// 实体层

type UserId = string

class User implements IEntityWithId<UserId> {
  id: UserId
  name: string
  constructor({ id, name }) {
    this.id = id
    this.name = name
  }
}

class Email implements IValueObject<string> {
  constructor(public value: string) {}

  public equals(other: Email): boolean {
    return this.value === other.value
  }
}

class Password implements IValueObject<string> {
  constructor(public value: string) {}

  public equals(other: Password): boolean {
    return this.value === other.value
  }
}

// 领域服务层

interface IAuthService {
  login(account: string, password: string): Promise<User | null>
}

class AuthService implements IAuthService {
  private users: User[] = []

  async login(account: string, password: string): Promise<any> {
    try {
      const result = await postMemberLogin({
        account,
        password,
      })
    } catch (err) {}
  }
}

// 聚合层，也可成为控制层Controller

class UserAggregate {
  constructor(private readonly authService: IAuthService, private readonly userRepository: IUserRepository) {}

  async login(email: Email, password: string): Promise<User | null> {
    const user = await this.authService.login(email, password)
    if (!user) {
      return null
    }
    await this.userRepository.save(user)
    return user
  }
}

interface IUserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}

// 仓库层,可以在这里做缓存之类的操作

class UserRepository implements IUserRepository {
  private readonly users: User[] = []

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null
  }

  async save(user: User): Promise<void> {
    const existingUserIndex = this.users.findIndex((u) => u.id === user.id)
    if (existingUserIndex >= 0) {
      this.users[existingUserIndex] = user
    } else {
      this.users.push(user)
    }
  }
}

// 视图层

export function useLogin() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const authService = useMemo(() => new AuthService(), [])
  const userRepository = useMemo(() => new UserRepository(), [])

  async function login(email: Email, password: string) {
    setIsLoading(true)
    const userAggregate = new UserAggregate(authService, userRepository)
    const user = await userAggregate.login(email, password)
    setUser(user)
    setIsLoading(false)
  }

  return { user, isLoading, login }
}

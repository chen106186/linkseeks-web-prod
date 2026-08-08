import { useEffect } from 'react'
import TencentCloudChat from '@tencentcloud/chat'
import { chat } from './IMSDK'
import { useToggle } from '@linkseeks/hooks'
export const useIMInit = () => {
  const [isLogin, toggleLogin] = useToggle(false)

  useEffect(() => {
    const preLogin = async () => {
      try {
        const { data } = await chat.login({
          userID: '100039006115',
          userSig:
            'eJwtzMsKgzAQheF3ybrIJOkYI3QhtJtSEXpdF4wy9JZqUEnpuzdVl*f74XzYcXeIOtOwlIkI2GLcVJqno4pG5gAgNUDMOc69LW9Xa6lkKY9DRVRSTsUMlhoTHBFFSJM6evxNiSRRXKKaX6gO9-12XZz5prIFvXzmOvTvu29ytT8N7bKXmczp4murjYYV*-4AuXQyaQ__',
        })

        console.log(data)
        toggleLogin(true)
      } catch (err) {
        console.error('IM登录失败', '->', err)
      }
    }
    preLogin()
  }, [])

  useEffect(() => {
    if (isLogin) {
      // 登录成功后，即可绑定事件
    }
  }, [isLogin])
  return {
    isLogin,
  }
}

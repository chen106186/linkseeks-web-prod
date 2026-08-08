import { useMemo } from 'react'
import zxcvbn from 'zxcvbn'

/**
 * 获取当前输入密码强度
 * @param password 密码
 * @returns score 密码得分
 * @returns success boolean
 */
const usePasswordVerify = (password: string) => {
  const score = useMemo(() => zxcvbn(password).score, [password])
  const success = useMemo(() => score >= 1, [score])

  return {
    score,
    success,
  }
}

export default usePasswordVerify

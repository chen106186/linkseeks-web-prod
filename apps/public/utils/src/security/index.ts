import { decryptedByAES } from '@linkseeks/crypto'

export const hidePhoneNumber = (phoneNumber: string) => {
  // 使用正则表达式匹配手机号中的数字部分
  const regex = /(\d{3})(\d{4})(\d{4})/
  // 将中间的数字部分替换为星号
  const maskedNumber = phoneNumber.replace(regex, (_, prefix, middle, suffix) => {
    const maskedMiddle = '*'.repeat(middle.length) // 将中间部分替换为星号
    return `${prefix}${maskedMiddle}${suffix}`
  })
  return maskedNumber
}

export const hideEmail = (email: string) => {
  // 使用正则表达式匹配电子邮件地址中的用户名和域名部分
  const regex = /^([^@]+)(@[^.]+\.[^.]+)$/
  // 将用户名部分中间的字符替换为星号
  const maskedEmail = email.replace(regex, (_, username, domain) => {
    const maskedUsername = '*'.repeat(username.length - 2) // 将用户名部分中间的字符替换为星号，保留第一个和最后一个字符
    return `${username[0]}${maskedUsername}${username.slice(-1)}${domain}`
  })
  return maskedEmail
}

/**
 * 手机号aes解码
 * @param value 加密后的手机号
 * @param hide 是否将中间的数字部分替换为星号
 */
export const decryptedPhone = (value: string | undefined, hide = true) => {
  if (!value) return ''
  if (hide) {
    return hidePhoneNumber(decryptedByAES(value))
  }
  return decryptedByAES(value)
}

/**
 * 邮箱aes解码
 * @param value 加密后的邮箱
 * @param hide 是否将用户名部分中间的字符替换为星号
 */
export const decryptedEmail = (value: string | undefined, hide = true) => {
  if (!value) return ''
  if (hide) {
    return hideEmail(decryptedByAES(value))
  }
  return decryptedByAES(value)
}

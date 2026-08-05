export const isWindow = typeof window !== 'undefined'

export const getEnv = (key: string) => {
  try {
    if (key === 'SITE_URL') {
      return (isWindow && window[key]) || process.env.OUT_SITE_URL
    }

    if (key === 'MEMBER_URL') {
      return (isWindow && window[key]) || process.env.OUT_MEMBER_URL
    }

    if (key === 'IM_URL') {
      return (isWindow && window[key]) || process.env.OUT_IM_URL
    }

    if (key === 'BACK_GATEWAY') {
      return (isWindow && window[key]) || process.env.OUT_BACK_GATEWAY
    }
    return window[key]
  } catch (err) {}

  return typeof process !== 'undefined' ? process.env[key] : undefined
}

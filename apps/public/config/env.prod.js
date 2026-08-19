const env = {
  BACK_GATEWAY: process.env.BACK_GATEWAY || 'http://yunjinglian.com:8100',
  YAPI_REQUEST_BACK_GATEWAY:
    process.env.YAPI_REQUEST_BACK_GATEWAY || process.env.BACK_GATEWAY || 'http://yunjinglian.com:8100',
  SOCKET_URL: process.env.SOCKET_URL || 'ws://yunjinglian.com:8100',
  SITE_URL: process.env.SITE_URL || 'http://yunjinglian.com',
  MEMBER_URL: process.env.MEMBER_URL || 'http://yunjinglian.com',
  REQUEST_HEADER: process.env.REQUEST_HEADER || 'http://',
  IM_URL: process.env.IM_URL || 'http://yunjinglian.com',
  MALL_ONLY_CLIENT: process.env.MALL_ONLY_CLIENT || false,
}

exports.define = {
  OUT_BACK_GATEWAY: env.BACK_GATEWAY,
  OUT_YAPI_REQUEST_BACK_GATEWAY: env.YAPI_REQUEST_BACK_GATEWAY,
  OUT_SOCKET_URL: env.SOCKET_URL,
  OUT_SITE_URL: env.SITE_URL,
  OUT_MEMBER_URL: env.MEMBER_URL,
  OUT_REQUEST_HEADER: env.REQUEST_HEADER,
  IM_URL: env.IM_URL || '',
  OUT_MALL_ONLY_CLIENT: env.MALL_ONLY_CLIENT,
}

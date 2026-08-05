const env = {
  BACK_GATEWAY: process.env.BACK_GATEWAY || 'http://gateway.yuanxiaozhixianfang.com:5443',
  YAPI_REQUEST_BACK_GATEWAY:
    process.env.YAPI_REQUEST_BACK_GATEWAY || process.env.BACK_GATEWAY || 'http://gateway.yuanxiaozhixianfang.com:5443',
  SOCKET_URL: process.env.SOCKET_URL || 'ws://lingxi-gateway-test-2023-v3.shushangyun.com:12880',
  SITE_URL: process.env.SITE_URL || 'http://lingxi-test-2023-v3.shushangyun.com:12880',
  MEMBER_URL: process.env.MEMBER_URL || 'http://lingxi-platform-test-2023-v3.shushangyun.com:12880',
  REQUEST_HEADER: process.env.REQUEST_HEADER || 'http://',
  GROUP_BUY_H5: process.env.GROUP_BUY_H5 || '',
  IM_URL: process.env.IM_URL || 'http://localhost:4400',
  MALL_ONLY_CLIENT: process.env.MALL_ONLY_CLIENT || false,
}

exports.define = {
  OUT_BACK_GATEWAY: env.BACK_GATEWAY,
  OUT_YAPI_REQUEST_BACK_GATEWAY: env.YAPI_REQUEST_BACK_GATEWAY,
  OUT_SOCKET_URL: env.SOCKET_URL,
  OUT_SITE_URL: env.SITE_URL,
  OUT_MEMBER_URL: env.MEMBER_URL,
  OUT_REQUEST_HEADER: env.REQUEST_HEADER,
  OUT_GROUP_BUY_H5: env.GROUP_BUY_H5,
  OUT_IM_URL: env.IM_URL,
  IM_URL: env.IM_URL,
  OUT_MALL_ONLY_CLIENT: env.MALL_ONLY_CLIENT,
}

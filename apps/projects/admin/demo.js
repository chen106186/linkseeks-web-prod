const mockData = {
  message: '',
  code: 1000,
  data: {
    linkseeks: {
      logo: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/logo.png',
      countryList: [
        {
          name: '简体中文-ZH',
          key: 'cn',
          icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/china.png',
        },
        {
          name: 'English-EN',
          key: 'en',
          icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/us.png',
        },
        {
          name: '日本語-JP',
          key: 'jp',
          icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/japen.png',
        },
        {
          name: '한국어-KO',
          key: 'ko',
          icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/koren.png',
        },
      ],
      menuList: [
        { code: '/memberCenter/commodityAbility', children: [{ code: '/mem' }] },
        { code: '/memberCenter/commodityAbility/classAndProperty/class' },
      ],
    },
  },
}

exports.fetchConfig = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData.data)
    }, 2 * 1000)
  })
}

const mockData = {
  message: '',
  code: 1000,
  data: {
    publicSelect: {
      siteList: [
        {
          name: '简体中文-ZH',
          key: 'zh-CN',
          icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/china.png'
        },
        {
          name: 'English-EN',
          key: 'en-US',
          icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/us.png'
        },
        // {
        //   name: '日本語-JP',
        //   key: 'jp',
        //   icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/japen.png'
        // },
        {
          name: '한국어-KO',
          key: 'ko-KR',
          icon: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/koren.png'
        }
      ]
    }
  }
}

exports.fetchConfig = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData.data)
    }, 2 * 1000)
  })
}

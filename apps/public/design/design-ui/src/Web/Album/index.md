## 公司相册

### 基础用法

```tsx
import React from 'react'
import { Album, LocaleProvide } from '@apps/design-ui'

const shopInfo = {
  id: 3,
  logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/8225da43b0bb4d6199a028a63d9f8da91603161481060.jpg',
  describe:
    '广州市数商云网络科技有限公司（软件企业编号：粤RO-2018-0284 | 高新科技企业编号：GR201844008227），简称「数商云」，是一家领先的企业全链数字化运营服务提供商。致力于通过大数据、云计算等新技术协助企业打造渠道端—营销端—数据端等全链数字化运营体系，全面提升企业运营效益与智慧数字化商业转型。自2013年成立以来，数商云致力于提供企业数字化运营产品及解决方案。',
  workshopPics: [
    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/1fd1b242c72d45ac8c4950fe45ead3641602840737765.jpg',
  ],
  honorPics: [
    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/bc9ebf96f3444063ab38456fd384c6511601286280869.jpg',
    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/ed78a5e0cf984d8b9b0e2901c7eaf7331601286289517.jpg',
    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/5d960eb644da493a82c820cde44055621601286293632.jpg',
    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/d8b2dd1f6d204d7ea9e48f97551feb2c1601286299031.jpg',
    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/2ef2306619304e7e8bfd505a092bfe3b1601286331100.jpg',
    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/140027f0881d4a2dbeb1dd4214d761f51601286345616.jpg',
  ],
  shopId: 2,
  storeUrl:
    'http://lingxi.shushangyun.com/shop/pointsMall?shopId=eyJzaG9wSWQiOjMsIm1lbWJlcklkIjo5fQ==',
  customerUrl:
    ' http://10.0.0.25:4396/shop?shopId=eyJzaG9wSWQiOm51bGwsIm1lbWJlcklkIjpudWxsfQ==',
  allStatus: 0,
  company: '广州市数商云网络科技有限公司',
  templateId: 3,
  fileName: 'science',
  memberId: 9,
  levelTag: '青铜会员',
  outerStatus: 3,
  registerYears: 1,
}

export default () => (
  <div className="theme-shop-science">
    <LocaleProvide locale="zh-CN">
      <Album workshopPics={shopInfo.workshopPics} />
    </LocaleProvide>
  </div>
)
```

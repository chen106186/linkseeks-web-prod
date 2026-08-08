import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export default {
  themeStyle: {
    sort: 0,
    props: {
      color: '#00A98F',
    },
  },
  top: {
    sort: 1,
    props: {
      theme: 0,
      visible: true,
      imageUrl: '',
    },
  },
  coupon: {
    sort: 2,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.youhuihaoquan'),
      childrenData: [],
    },
  },
  hot: {
    sort: 3,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.huodongtuijian'),
      childrenData: [],
    },
  },
  specialOffer: {
    sort: 5,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.tejiaocuxiao'),
      childrenData: [],
    },
  },
  plummet: {
    sort: 4,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.zhijiangcuxiao'),
      childrenData: [],
    },
  },
  discount: {
    sort: 6,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.zhekoucuxiao'),
      childrenData: [],
    },
  },
  fullQuantitySub: {
    sort: 7,
    props: {
      theme: 1,
      visible: true,
      title: translate('web.resource.marketing.manliangjian'),
      childrenData: [],
    },
  },
  fullQuantityDiscount: {
    sort: 8,
    props: {
      theme: 1,
      visible: true,
      title: translate('web.resource.marketing.manliangzhe'),
      childrenData: [],
    },
  },
  fullMoneySub: {
    sort: 9,
    props: {
      theme: 1,
      visible: true,
      title: translate('web.resource.marketing.manejian'),
      childrenData: [],
    },
  },
  fullMoneyDiscount: {
    sort: 10,
    props: {
      theme: 1,
      visible: true,
      title: translate('web.resource.marketing.manezhe'),
      childrenData: [],
    },
  },
  giveProduct: {
    sort: 11,
    props: {
      theme: 3,
      visible: true,
      title: translate('web.resource.marketing.zengsongshangpin'),
      childrenData: [],
    },
  },
  giveCoupon: {
    sort: 12,
    props: {
      theme: 4,
      visible: true,
      title: translate('web.resource.marketing.zengsongyouhuiquan'),
      childrenData: [],
    },
  },
  morePiece: {
    sort: 13,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.duojiancuxiao'),
      childrenData: [],
    },
  },
  combination: {
    sort: 14,
    props: {
      theme: 2,
      visible: true,
      title: translate('web.resource.marketing.zuhecuxiao'),
      childrenData: [],
    },
  },
  groupPurchase: {
    sort: 15,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.pintuan'),
      childrenData: [],
    },
  },
  secKill: {
    sort: 17,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.miaosha'),
      childrenData: [],
    },
  },
  fullSwap: {
    sort: 18,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.manehuangou'),
      childrenData: [],
    },
  },
  buySwap: {
    sort: 19,
    props: {
      theme: 0,
      visible: true,
      title: translate('web.resource.marketing.maishangpinhuangou'),
      childrenData: [],
    },
  },
  setMeal: {
    sort: 21,
    props: {
      theme: 2,
      visible: true,
      title: translate('web.resource.marketing.taocan'),
      childrenData: [],
    },
  },
  suggestProduct: {
    sort: 23,
    props: {
      visible: true,
      childrenData: [],
    },
  },
}

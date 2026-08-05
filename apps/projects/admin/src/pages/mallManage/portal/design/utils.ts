import { TOP_DOMAIN, REQUEST_HEADER } from '@apps/constants'
import { SRM_CENTER_URL, LOGISTICS_CENTER_URL, MANUFACTURE_CENTER_URL, INFO_CENTER_URL } from '@/constants'
import { MallUrl } from '../../services/feature'
import { PLATFORM_DESIGN_COMPONENT } from '@apps/design-ui'
import { getOssUrlPath } from '@apps/constants'
const siteUrl = process.env.OUT_SITE_URL

export interface NavItemType {
  id?: number
  link: string
  name: string
  status: boolean
  type: number
  key?: string
  sort: number
}

const getStatusByType = (type: number, list: NavItemType[] | undefined) => {
  if (!list) return true
  const current = list.filter((item) => item.type === type)[0]
  if (current) {
    return current.status
  }
  return true
}

const getSortByType = (type: number, list: NavItemType[] | undefined, defaultSort: number) => {
  if (!list) return defaultSort
  const current = list.filter((item) => item.type === type)[0]
  if (current) {
    return current.sort || defaultSort
  }
  return defaultSort
}

export const getMenuData = (list?: NavItemType[], mallUrl?: MallUrl) => {
  const menu = [
    {
      id: 0,
      link: siteUrl,
      name: '首页',
      type: 1,
      status: getStatusByType(1, list),
      key: 'home',
      sort: getSortByType(1, list, 1),
    },
    {
      id: 1,
      link: `${REQUEST_HEADER}${mallUrl?.mallUrl}.${TOP_DOMAIN}`,
      name: '企业商城',
      type: 2,
      status: getStatusByType(2, list),
      key: 'enterpriseMall',
      sort: getSortByType(2, list, 2),
    },
    {
      id: 2,
      link: `${REQUEST_HEADER}${mallUrl?.srmUrl}.${TOP_DOMAIN}`,
      name: '名企采购',
      type: 3,
      status: getStatusByType(3, list),
      key: 'srm',
      sort: getSortByType(3, list, 3),
    },
    {
      id: 3,
      link: `${REQUEST_HEADER}${mallUrl?.mallUrl}.${TOP_DOMAIN}/stores`,
      name: '优选供应商',
      type: 4,
      status: getStatusByType(4, list),
      key: 'enterpriseMallStores',
      sort: getSortByType(4, list, 4),
    },
    {
      id: 5,
      link: `${REQUEST_HEADER}${mallUrl?.logisticsUrl}.${TOP_DOMAIN}`,
      name: '物流服务',
      type: 6,
      key: 'logistics',
      status: getStatusByType(6, list),
      sort: getSortByType(6, list, 5),
    },
    {
      id: 6,
      link: `${REQUEST_HEADER}${mallUrl?.processUrl}.${TOP_DOMAIN}`,
      name: '加工服务',
      type: 7,
      status: getStatusByType(7, list),
      key: 'process',
      sort: getSortByType(7, list, 6),
    },
    {
      id: 7,
      link: `${REQUEST_HEADER}${mallUrl?.mallUrl}.${TOP_DOMAIN}/integral`,
      name: '积分商城',
      type: 8,
      status: getStatusByType(8, list),
      key: 'enterprisePointsMall',
      sort: getSortByType(8, list, 7),
    },
    {
      id: 8,
      link: `${REQUEST_HEADER}${mallUrl?.mallUrl}.${TOP_DOMAIN}/info`,
      name: '行情资讯',
      type: 9,
      status: getStatusByType(9, list),
      key: 'information',
      sort: getSortByType(9, list, 8),
    },
  ]

  return menu.sort((a, b) => (b.sort > a.sort ? -1 : 1))
}

export const getPlatformDefaultConfig = () => {
  return {
    [PLATFORM_DESIGN_COMPONENT.MallMainNav]: {},
  }
}

export const getDefaultConfig = (mallUrl?: MallUrl) => {
  return [
    {
      name: 'navList',
      status: true,
      content: getMenuData([], mallUrl),
    },
    {
      name: 'bannerAdvert',
      status: true,
      content: [
        // {
        //   link: '',
        //   imgUrl:
        //     getOssUrlPath('/积分商城-默认头图639ead79aac64d7aaff5492ecb7fa0d7.jpg','ssyOne'),
        // },
        // {
        //   link: '',
        //   imgUrl:
        //     getOssUrlPath('/积分商城-默认头图639ead79aac64d7aaff5492ecb7fa0d7.jpg','ssyOne'),
        // },
      ],
    },
    {
      name: 'bannerRightAdvert',
      status: true,
      content: [
        // {
        //   link: '',
        //   imgUrl:
        //     getOssUrlPath('/20210526172707d615298a7f8e4439bf5d137517d8cd34.jpg','ssyOne'),
        // },
      ],
    },
    {
      name: 'banneBottomrAdvert',
      status: true,
      content: [
        // {
        //   link: '',
        //   imgUrl:
        //     getOssUrlPath('/202105261727241c2b85a9823c4f13bdd1b01bb10d3cb6.jpg','ssyOne'),
        // },
        // {
        //   link: '',
        //   imgUrl:
        //     getOssUrlPath('/202105261727241c2b85a9823c4f13bdd1b01bb10d3cb6.jpg','ssyOne'),
        // },
        // {
        //   link: '',
        //   imgUrl:
        //     getOssUrlPath('/20210526172735392fd23b81d3447eb11330090a64f035.jpg','ssyOne'),
        // },
      ],
    },
    {
      name: 'fastVisit',
      status: true,
      content: {
        sellerBOList: [
          {
            name: '上传商品',
            icon: '',
            link: '',
          },
          {
            name: '报价',
            icon: '',
            link: '',
          },
          {
            name: '接单',
            icon: '',
            link: '',
          },
        ],
        buyerBOList: [
          {
            name: '我要求购',
            icon: '',
            link: '',
          },
          {
            name: '报价信息',
            icon: '',
            link: '',
          },
          {
            name: '我的订单',
            icon: '',
            link: '',
          },
        ],
        fastFunctionBOList: [
          {
            name: '找现货',
            icon: '',
            link: '',
          },
          {
            name: '找供应',
            icon: '',
            link: '',
          },
          {
            name: '去求购',
            icon: '',
            link: '',
          },
          {
            name: '找店铺',
            icon: '',
            link: '',
          },
          {
            name: '换积分',
            icon: '',
            link: '',
          },
          {
            name: '看资讯',
            icon: '',
            link: '',
          },
        ],
      },
    },
    {
      name: 'goods',
      status: true,
      content: [
        // {
        //   advertImg: '',
        //   shopId: undefined,
        //   firstId: undefined,
        //   secondId: undefined,
        //   thirdlyId: undefined,
        //   name: '',
        //   describe: '',
        //   goodsIdList: [],
        //   visible: false,
        // },
        // {
        //   advertImg: '',
        //   shopId: undefined,
        //   firstId: undefined,
        //   secondId: undefined,
        //   thirdlyId: undefined,
        //   name: '',
        //   describe: '',
        //   goodsIdList: [],
        //   visible: false,
        // },
        // {
        //   advertImg: '',
        //   shopId: undefined,
        //   firstId: undefined,
        //   secondId: undefined,
        //   thirdlyId: undefined,
        //   name: '',
        //   describe: '',
        //   goodsIdList: [],
        //   visible: false,
        // },
        // {
        //   advertImg: '',
        //   shopId: undefined,
        //   firstId: undefined,
        //   secondId: undefined,
        //   thirdlyId: undefined,
        //   name: '',
        //   describe: '',
        //   goodsIdList: [],
        //   visible: false,
        // },
        // {
        //   advertImg: '',
        //   shopId: undefined,
        //   firstId: undefined,
        //   secondId: undefined,
        //   thirdlyId: undefined,
        //   name: '',
        //   describe: '',
        //   goodsIdList: [],
        //   visible: false,
        // },
        // {
        //   advertImg: '',
        //   shopId: undefined,
        //   firstId: undefined,
        //   secondId: undefined,
        //   thirdlyId: undefined,
        //   name: '',
        //   describe: '',
        //   goodsIdList: [],
        //   visible: false,
        // },
      ],
    },
    {
      name: 'brand',
      status: true,
      content: [],
    },
    {
      name: 'merchant',
      status: true,
      content: [],
    },
    {
      name: 'marketInformation',
      status: true,
      content: {
        marketList: [],
        information: {
          allList: [],
          bazaarList: [],
          hotList: [],
          allIdList: [],
          bazaarIdList: [],
          hotIdList: [],
        },
      },
    },
    {
      name: 'middleAdvert',
      status: true,
      content: [],
    },
    {
      name: 'purchase',
      status: true,
      content: [],
    },
    {
      name: 'logistics',
      status: true,
      content: {
        advertImg: '',
        link: '',
        advertTitle: '',
        advertDescribe: '',
        logisticsMerchantList: [],
      },
    },
    {
      name: 'process',
      status: true,
      content: {
        advertImg: '',
        link: '',
        advertTitle: '',
        advertDescribe: '',
        processMerchantList: [],
      },
    },
    {
      name: 'platform',
      status: true,
      content: [
        {
          advertImg: getOssUrlPath('/irregular/service-1baeca046d4c14d3cbfaa48e4ee7c24d8.png'),
          link: '',
          advertTitle: '商品销售服务',
          advertDescribe:
            '提供现货商品的直接下单支付购买的便捷交易模式、也提供询价商品的询价报价购买的交易模式，支持品牌商发展渠道代销，提供渠道代理商独立的渠道商城实现交易协同。',
        },
        {
          advertImg: getOssUrlPath('/irregular/service-2ae18d0265c62451cb18844625df6ce3a.png'),
          link: '',
          advertTitle: '供应链服务',
          advertDescribe:
            '提供全站式一体化采购寻源、合同管理、订单协同、物流服务、加工服务、供应商生命周期管理等供应链服务，协助供应链企业更好地进行数字化转型。',
        },
        {
          advertImg: getOssUrlPath('/irregular/service-3be7edf87c7c14cef9c9cc8dc79e45563.png'),
          link: '',
          advertTitle: '运营服务',
          advertDescribe:
            '提供数据运营工具、营销推广工具、用户运营工具，帮助传统企业通过互联网和数字化的方式，从传统的业务管理转向业务运营，解决企业运营人才匮乏，运营水平不高的难题。',
        },
        {
          advertImg: getOssUrlPath('/irregular/service-40dce2b6d91c248d08192ac6c3f64a19c.png'),
          link: '',
          advertTitle: '推广服务',
          advertDescribe:
            'PC+移动端，线上+线下，国内+国际同步推广，吸引更多的行业流量，帮助更多企业获取销售线索，实现销售业绩快速增长。',
        },
        {
          advertImg: getOssUrlPath('/irregular/service-553d52b54069343d48d1237742c71be01.png'),
          link: '',
          advertTitle: '市场行情服务',
          advertDescribe:
            '提供行业市场价格行情走势，行业热点资讯，帮助企业及时掌握市场行情，调整运营策略，同时平台通过专业市场行情资讯文章关键字进行线上推广，获取定向客户流量，助力企业获取更多商机。',
        },
      ],
    },
    {
      name: 'bottomAdvert',
      status: true,
      content: [],
    },
  ]
}

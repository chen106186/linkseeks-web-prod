import { LAYOUT_TYPE } from '@/constants'
import { getOssUrlPath } from '@apps/constants'

const TEST_COMPONENTS_KEYS = ['22', '23', '24', '25', '26', '27']

export const mallLayoutConfig = {
  key: '0',
  '0': {
    componentName: 'LocaleProvide',
    props: {
      style: {
        width: '100%',
        minHeight: '100%',
        background: '#F5F6F7',
      },
    },
    childNodes: ['1', '2', '3', '5'],
  },
}

export const topBarConfig = {
  key: '1',
  '1': {
    componentName: 'TopBar',
    canHide: true,
    props: {
      linkdisable: true,
    },
  },
}

export const headerConfig = {
  key: '2',
  '2': {
    componentName: 'Header',
    canHide: true,
    props: {
      logoUrl: '',
      type: 'own',
    },
  },
}

export const mainNavConfig = {
  key: '3',
  '3': {
    componentName: 'OwnMainNav',
    canHide: true,
    props: {
      type: LAYOUT_TYPE.own,
    },
  },
}

export const bannerWrap = {
  key: '5',
  '5': {
    componentName: 'View',
    canHide: true,
    props: {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '1200px',
        margin: '0 auto',
        marginTop: 16,
      },
    },
    childNodes: ['6', '7'],
  },
}

export const oneBannerConfig = {
  key: '6',
  '6': {
    componentName: 'OwnBanner',
    props: {
      type: 1,
      linkdisable: true,
      advertList: [],
    },
  },
}

export const bannerColumnWrap = {
  key: '7',
  '7': {
    componentName: 'View',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 16,
      },
    },
    childNodes: ['8', '9'],
  },
}

export const twoBannerConfig = {
  key: '8',
  '8': {
    componentName: 'OwnBanner',
    props: {
      type: 2,
      linkdisable: true,
      advertList: [],
    },
  },
}

export const threeBannerConfig = {
  key: '9',
  '9': {
    componentName: 'OwnBanner',
    props: {
      type: 3,
      linkdisable: true,
      advertList: [],
    },
  },
}

export const fourBannerConfig = {
  key: '16',
  '16': {
    componentName: 'OwnBanner',
    props: {
      type: 4,
      linkdisable: true,
      advertList: [],
    },
  },
}

export const InformationConfig = {
  key: '20',
  '20': {
    componentName: 'Information',
    canHide: true,
    props: {
      linkdisable: true,
      visible: true,
    },
  },
}

export const FooterConfig = {
  key: '21',
  '21': {
    componentName: 'Footer',
    canHide: true,
    props: {
      linkdisable: true,
    },
  },
}

export const TestComponents = {
  '22': {
    componentName: 'CarouselBanner',
    props: {
      canDelete: true,
      linkdisable: true,
      dataList: [
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
      ],
    },
  },
  '23': {
    componentName: 'HorizontalBanner',
    props: {
      linkdisable: true,
      canDelete: true,
      dataList: [
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
      ],
    },
  },
  '24': {
    componentName: 'Empty',
    props: {
      linkdisable: true,
      canDelete: true,
    },
  },
  '25': {
    componentName: 'RichText',
    props: {
      linkdisable: true,
      canDelete: true,
      html: '<p><span style="font-size:30px">富文本一级标题</span></p><p></p><p><span style="font-size:24px">富文本二级标题</span></p><p></p><p><span style="font-size:18px">富文本三级标题</span></p>',
    },
  },
  '26': {
    componentName: 'CommodityFloor',
    props: {
      linkdisable: true,
      canDelete: true,
      title: '品类楼层',
      subNavList: [
        {
          name: '云服务器',
          sort: 1,
          type: 1,
        },
        {
          name: '裸金属云服务器',
          sort: 2,
          type: 2,
        },
        {
          name: 'GPU 云服务器',
          sort: 3,
          type: 3,
        },
      ],
      floorImg: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
      dataList: [
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
        {
          picUrl: getOssUrlPath('/irregular/主推海报图3f18d097a6cf46309c36ad374e241a35.png'),
        },
        {
          picUrl: getOssUrlPath('/irregular/图片广告组件3caaff28b1824142a38757ef8048a812.png'),
        },
      ],
    },
  },
  '27': {
    componentName: 'HotspotImage',
    props: {
      linkdisable: true,
      canDelete: true,
      imgUrl: getOssUrlPath('/irregular/主推海报图3f596bb8bef6410790f077473d681cb2.png'),
      hotspotList: [
        {
          shortid: 'LTjvqLsgQ',
          width: 262.0859375,
          height: 187.8515625,
          x: 8,
          y: 8,
          zIndex: 1,
          type: 11,
          valueText: '大米',
          value: 'c285_c286',
        },
        {
          shortid: 'hUPEF-tORx',
          width: 253.7890625,
          height: 182.31640625,
          x: 308.08203125,
          y: 2.2734375,
          zIndex: 2,
          type: 6,
        },
      ],
    },
  },
}

export const AddComponentButton = {
  key: '99',
  '99': {
    componentName: 'AddComponentButton',
    canHide: true,
    props: {},
  },
}

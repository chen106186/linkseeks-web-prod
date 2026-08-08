import React, { useRef, useState } from 'react'
import { SSY_OSS_DOMAIN } from '@apps/constants'
import styles from './index.less'

interface DataItemType {
  /** 名称 */
  name: string
  /** 类型：1-商品 2-店铺 3-品牌 4-资讯 */
  type: number
  /** 提示语 */
  markerWord: string
  recommend: any[]
  recommendList?: any[]
}

export enum RecommendType {
  commodity = 1,
  shop = 2,
  brand = 3,
  information = 4,
}

const MobileUIDemo: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const carouselRef: any = useRef()

  const shopInfo = {
    memberName: '温州市龙昌皮业有限公司',
    logo: SSY_OSS_DOMAIN + '/f60693caed3f47868e5897bd1ccf40ea1610331248766.png',
    creditPoint: 998,
    registerYears: 2,
    avgTradeCommentStar: 3,
  }

  const navList = [
    {
      id: 1,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/c5d66f1488cc47d0a73279ce1ef11c991610677462848.png',
      type: 1,
      name: '热轧板卷',
      url: '',
    },
    {
      id: 2,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/9f105bdebcfb4010b5827f7b64fb53281610696444606.png',
      type: 2,
      name: '热轧硅钢',
      url: '',
    },
    {
      id: 3,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/d4383c684c6e4707b405f46f281796d71610696469970.png',
      type: 3,
      name: '容器钢板',
      url: '',
    },
    {
      id: 4,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/d4383c684c6e4707b405f46f281796d71610696469970.png',
      type: 4,
      name: '造船钢板',
      url: '',
    },
    {
      id: 5,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/441a66ebeb3b45e6a64ecfa9977f411c1610696489991.png',
      type: 5,
      name: '管线钢板',
      url: '',
    },
    {
      id: 6,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/c5d66f1488cc47d0a73279ce1ef11c991610677462848.png',
      type: 6,
      name: '热轧板卷',
      url: '',
    },
    {
      id: 7,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/9f105bdebcfb4010b5827f7b64fb53281610696444606.png',
      type: 7,
      name: '热轧硅钢',
      url: '',
    },
    {
      id: 8,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/d4383c684c6e4707b405f46f281796d71610696469970.png',
      type: 8,
      name: '容器钢板',
      url: '',
    },
    {
      id: 9,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/d4383c684c6e4707b405f46f281796d71610696469970.png',
      type: 9,
      name: '造船钢板',
      url: '',
    },
    {
      id: 10,
      expand: false,
      icon: SSY_OSS_DOMAIN + '/441a66ebeb3b45e6a64ecfa9977f411c1610696489991.png',
      type: 10,
      name: '管线钢板',
      url: '',
    },
  ]

  //SSY_OSS_DOMAIN+  /c5d66f1488cc47d0a73279ce1ef11c991610677462848.png 商品

  const dataList: any = [
    {
      style: 0,
      title: '电气电工',
      viceTitle: 'ELECTRICAL',
      productList: [
        {
          id: 11,
          name: '三级抗震螺纹钢 HRB400E 25*12三钢',
          sellPoints: ['硬度适中偏软', '手感舒适'],
          min: 79,
          unitName: '吨',
          sold: 3133,
          mainPic: SSY_OSS_DOMAIN + '/19466a6f8a5448c5b1a2011f642126611610677625949.png',
        },
        {
          id: 12,
          name: '三级抗震螺纹钢 HRB400E 25*12三钢',
          sellPoints: ['硬度适中偏软', '手感舒适'],
          min: 79,
          unitName: '吨',
          sold: 3133,
          mainPic: SSY_OSS_DOMAIN + '/19466a6f8a5448c5b1a2011f642126611610677625949.png',
        },
        {
          id: 13,
          name: '三级抗震螺纹钢 HRB400E 25*12三钢',
          sellPoints: ['硬度适中偏软', '手感舒适'],
          min: 79,
          unitName: '吨',
          sold: 3133,
          mainPic: SSY_OSS_DOMAIN + '/19466a6f8a5448c5b1a2011f642126611610677625949.png',
        },
        {
          id: 14,
          name: '三级抗震螺纹钢 HRB400E 25*12三钢',
          sellPoints: ['硬度适中偏软', '手感舒适'],
          min: 79,
          unitName: '吨',
          sold: 3133,
          mainPic: SSY_OSS_DOMAIN + '/19466a6f8a5448c5b1a2011f642126611610677625949.png',
        },
      ],
    },
    {
      style: 1,
      title: '机械设备',
      viceTitle: 'ELECTRICAL',
      categoryImage: SSY_OSS_DOMAIN + '/19466a6f8a5448c5b1a2011f642126611610677625949.png',
      productList: [
        {
          id: 21,
          name: '四级抗震螺纹钢 HRB400E 25*12三钢',
          sellPoints: ['硬度适中偏软'],
          min: 79,
          unitName: '吨',
          sold: 3133,
          mainPic: SSY_OSS_DOMAIN + '/19466a6f8a5448c5b1a2011f642126611610677625949.png',
        },
        {
          id: 22,
          name: '三级抗震螺纹钢 HRB400E 25*12三钢',
          sellPoints: ['硬度适中偏软', '手感舒适'],
          min: 79,
          unitName: '吨',
          sold: 3133,
          mainPic: SSY_OSS_DOMAIN + '/19466a6f8a5448c5b1a2011f642126611610677625949.png',
        },
      ],
    },
  ]

  const handleChangeCurrentIndex = (e, index: number) => {
    e.stopPropagation()
    if (currentIndex !== index) {
      carouselRef.current.goTo(index, false)
      setCurrentIndex(index)
    }
  }

  return (
    <div className={styles.mall_latyout}>
      {/* <MobileChannelHeaderNav name="" /> */}
      {/* <MobileShopHeaderNav shopInfo={shopInfo} /> */}
      <div style={{ position: 'relative', marginTop: -48, zIndex: 6 }}>
        {/* <MobileBanner dataList={[]} className={styles.nomar} /> */}
      </div>
      {/* <MobileQuickNav dataList={navList} className={styles.channel_quick_nav} /> */}
      {/* <MobileChannelGoodsCard dataList={dataList} /> */}
      {/* <MobileChannelInformation /> */}
    </div>
  )
}

export default MobileUIDemo

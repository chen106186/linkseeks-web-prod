import React, { useRef, useState } from 'react'
import cx from 'classnames'
import { getOssUrlPath } from '@apps/constants'
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

  const qualityDataList: DataItemType[] = [
    {
      type: 1,
      name: '推荐',
      markerWord: '猜你喜欢',
      recommend: [],
      recommendList: [
        {
          id: 1,
          name: '黑色手折纹胎水牛皮黑色折',
          mainPic: getOssUrlPath('/irregular/e1a63de9b7f3434f914e886e2a12a2a11606725018902.jfif'),
          price: '79',
          unitName: '吨',
          sale: 3200,
        },
        {
          id: 2,
          name: '黑色手折纹胎水牛皮黑色折',
          mainPic: getOssUrlPath('/irregular/e1a63de9b7f3434f914e886e2a12a2a11606725018902.jfif'),
          price: '79',
          unitName: '吨',
          sale: 3200,
        },
        {
          id: 3,
          name: '黑色手折纹胎水牛皮黑色折',
          mainPic: getOssUrlPath('/irregular/e1a63de9b7f3434f914e886e2a12a2a11606725018902.jfif'),
          price: '79',
          unitName: '吨',
          sale: 3200,
        },
      ],
    },
    {
      type: 2,
      name: '店铺',
      markerWord: '优选好货',
      recommend: [],
      recommendList: [
        {
          id: 1,
          shopLogo: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
          shopName: '温州市龙昌皮业有限公司',
          credit: 998,
          year: 2,
          goodsList: [
            {
              id: 1,
              name: '黑色手折纹胎水牛皮黑色折',
              img: getOssUrlPath('/irregular/e1a63de9b7f3434f914e886e2a12a2a11606725018902.jfif'),
              price: '79',
            },
          ],
        },
        {
          id: 2,
          shopLogo: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
          shopName: '温州市龙昌皮业有限公司',
          credit: 998,
          year: 2,
          goodsList: [
            {
              id: 1,
              name: '黑色手折纹胎水牛皮黑色折',
              img: getOssUrlPath('/irregular/e1a63de9b7f3434f914e886e2a12a2a11606725018902.jfif'),
              price: '79',
            },
            {
              id: 2,
              name: '黑色手折纹胎水牛皮黑色折',
              img: getOssUrlPath('/irregular/e1a63de9b7f3434f914e886e2a12a2a11606725018902.jfif'),
              price: '79',
            },
          ],
        },
      ],
    },
    {
      type: 3,
      name: '品牌',
      markerWord: '进货首选',
      recommend: [],
      recommendList: [
        {
          id: 1,
          categoryName: '家具',
          categoryImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
          brandList: [
            {
              id: 1,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
            {
              id: 2,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
            {
              id: 3,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
            {
              id: 4,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
            {
              id: 5,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
            {
              id: 6,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
          ],
        },
        {
          id: 2,
          categoryName: '灯具',
          categoryImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
          brandList: [
            {
              id: 7,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
            {
              id: 8,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
            {
              id: 9,
              brandImg: getOssUrlPath('/irregular/7cce734b38764b11a4dfff60eb1cb5c11606707859644.png'),
            },
          ],
        },
      ],
    },
    {
      type: 4,
      name: '资讯',
      markerWord: '成交快讯',
      recommend: [],
      recommendList: [
        {
          id: 1,
          imgUrl: 'http://10.0.0.28:88/group1/M00/00/11/CgAAHF_bBvaAVsByAAMHRaUCLH0782.png',
          title: 'B2B供应链电商系统平台解决方案，如何实现全网整合B2B',
          tag: '今日热点',
          date: '1小时前',
          read: 237,
        },
        {
          id: 2,
          imgUrl: 'http://10.0.0.28:88/group1/M00/00/11/CgAAHF_bBvaAVsByAAMHRaUCLH0782.png',
          title: 'B2B供应链电商系统平台解决方案，如何实现全网整合B2B',
          tag: '今日热点',
          date: '1小时前',
          read: 237,
        },
      ],
    },
  ]

  const dataList = [
    {
      name: '首页',
      icon: 'http://10.0.0.28:88/group1/M00/00/11/CgAAHF_bBvaAVsByAAMHRaUCLH0782.png',
      type: 1,
      status: false,
    },
    {
      name: '分类',
      icon: '',
      type: 2,
      status: false,
    },
    {
      name: '工作台',
      icon: '',
      type: 4,
      status: false,
    },
    {
      name: '购物车',
      icon: '',
      type: 3,
      status: true,
    },
    {
      name: '我的',
      icon: '',
      type: 5,
      status: false,
    },
  ]

  // showcase1: http://10.0.0.28:88/group1/M00/00/11/CgAAHF_bBvaAVsByAAMHRaUCLH0782.png
  // showcase2: http://10.0.0.28:88/group1/M00/00/11/CgAAHF_bCKCAG7RtAAMe1wpE-4U350.png
  // showcase3: http://10.0.0.28:88/group1/M00/00/11/CgAAHF_bCPuARi8kAANPm9vsbAY341.png
  // showcase4: http://10.0.0.28:88/group1/M00/00/11/CgAAHF_bCRCAKKsDAAGtbDYm_QM496.png

  return (
    <div className={styles.mall_latyout}>
      <div className={styles['lingxi-bottom-navigation']}>
        <div className={styles['lingxi-bottom-navigation-list']}>
          {dataList &&
            dataList.map((item, index) => (
              <div
                className={cx(styles['lingxi-bottom-navigation-list-item'], item.status ? styles.hide : null)}
                key={`lingxi-bottom-navigation-list-item-${index}`}
              >
                <img className={styles['lingxi-bottom-navigation-list-item-icon']} src={item.icon} />
                <span className={styles['lingxi-bottom-navigation-list-item-name']}>{item.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default MobileUIDemo

import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View } from '@apps/mobile-ui'
import { getCurrentInstance, useDidShow } from '@apps/mobile-services/utils/taro'
import Taro from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import MallTabBottom from '@/components/MallTabBottom'
import {
  getProductMobileShopBrowseRecordGetBrowseRecordList,
  getProductMobileShopCommodityCollectGetCommodityCollectList,
} from '@apps/apis'
import { getMarketingMobileCouponDetailCount } from '@apps/apis'
import { getMemberMobileInfoMinePage } from '@apps/apis'
import { usePageInit } from '@/hooks/usePageInit'
import UserInfo from './components/UserInfo'
import AlwaysUse from './components/AlwaysUse'
import FirstItem from './components/UserItem/FirstItem'
import MyMessage from './components/UserItem/MyMessage'
import styles from './index.module.scss'
const MineView: React.FC = (props) => {
  const initialState = {
    loading: {
      commodity: false,
      shop: false,
      collection: false,
    },
    collection: {
      title: {
        id: 'mine.shangpinshoucang',
        defaultMessage: '商品收藏',
      },
      count: 0,
    },
    footprint: {
      title: {
        id: 'mine.zuji',
        defaultMessage: '足迹',
      },
      count: 0,
    },
    commodity: {
      title: {
        id: 'mine.youhuiquan',
        defaultMessage: '优惠券',
      },
      count: 0,
    },
    card: {
      title: {
        id: 'mine.kabao',
        defaultMessage: '卡包',
      },
      count: 0,
    },
  }
  usePageInit()
  const [state, setState] = useState({
    ...initialState,
  })
  const {
    userStore: { userInfo, setUserInfo, shopAndSite },
  } = useStores()
  const $router = getCurrentInstance()
  const { layoutType } = $router.router?.params || {}
  /**
   * 获取
   */
  const fnGetCardNumber = () => {
    if (!userInfo) {
      setState({
        ...initialState,
      })
      return
    }
    const parmas = {
      current: '1',
      pageSize: '10',
    }
    const uerMessage = {
      shopId: String(shopAndSite?.id || 0),
    }
    const keyArr = ['collection', 'footprint', 'commodity', 'card']
    Promise.all([
      getProductMobileShopCommodityCollectGetCommodityCollectList(parmas),
      // 商品收藏
      getProductMobileShopBrowseRecordGetBrowseRecordList(parmas),
      // 足迹
      getMarketingMobileCouponDetailCount(uerMessage),
      // 优惠卷
      getMemberMobileInfoMinePage(parmas), // 卡包
    ]).then((res) => {
      const stateDesc = {
        ...state,
      }
      res.forEach((item: any, index: number) => {
        const keyName = keyArr[index]
        if (index === 2) {
          stateDesc[keyName].count = item.data?.receiveCount || 0
        } else {
          stateDesc[keyName].count = item.data?.totalCount || 0
        }
      })
      setState({
        ...stateDesc,
      })
    })
  }
  useDidShow(() => {
    fnGetCardNumber()
  })
  useEffect(() => {
    // 隐藏首页按钮
    Taro.hideHomeButton()
  }, [])
  return (
    <MallTabBottom visible layoutType={layoutType as LAYOUT_TYPE} activeUrl="extra/mine">
      <View className={styles['mine-page']}>
        <ScrollView
          scrollY
          style={{
            height: '100%',
          }}
        >
          <View className={styles['mine-page-scrollView']}>
            <UserInfo
              userInfo={userInfo}
              collectionData={state}
              isSelf={!!shopAndSite?.isSelf}
              setUserInfo={setUserInfo}
            />
            <View className={styles['mine-page-alwaysUse']}>
              <AlwaysUse />
            </View>
            <View className={styles['mine-page-alwaysUse']}>
              <FirstItem />
            </View>
            <View className={styles['mine-page-alwaysUse']}>
              <MyMessage />
            </View>
          </View>
        </ScrollView>
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(observer(MineView))

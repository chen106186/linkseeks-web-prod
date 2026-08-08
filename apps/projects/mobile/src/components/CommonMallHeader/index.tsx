import React, { useState, useEffect } from 'react'
import { Navigator, ScrollView } from '@tarojs/components'
import { View, Text, Icons } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import {
  getCommodityMobileCategoryMobileSelfMemberCategory,
  getCommodityMobileCategoryMobileEnterpriseCategory,
} from '@apps/apis'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import MallNavBar from './MallNavBar'
import './index.scss'

type topItemType = {
  /**
   * 名称
   */
  name: string
  /**
   * 内容（图标或提示语）
   */
  content: string
  /**
   * 是否隐藏
   */
  status: boolean
  /**
   * 1: 我的； 2: 进货单；3: 消息；4: 搜索框
   */
  type: 1 | 2 | 3 | 4
}

type ConfigType =
  | {
      /**
       * 样式：根据UI由前端自定义类型
       */
      style: number
      /**
       * 是否隐藏整个模块
       */
      status: boolean
      /**
       * 顶部导航栏详情 ,TopDetailsBO
       */
      details: topItemType[]
    }
  | undefined

interface CommonMallHeaderProps {
  styleTheme?: 0 | 1
  /** 是否自营商城 */
  isSelf?: boolean
  config?: ConfigType
  /** 是否显示category */
  isShowCategory?: boolean
  adornId?: number
  refreshing?: boolean
}

const STYLE_THEME_LIST = {
  0: 'default',
  1: 'science',
}

const CommonMallHeader: React.FC<CommonMallHeaderProps> = (props) => {
  const { isShowCategory, isSelf, refreshing, adornId, styleTheme = 0 } = props
  const [firstCategoryList, setFirstCategoryList] = useState<any[]>([])
  const {
    userStore: { shopAndSite, setShopAndSite },
  } = useStores()
  const intl = useIntl()
  const fetchFirstCategoryList = () => {
    let getFn
    const params: any = {}
    if (isSelf) {
      ;(params.adornId = adornId),
        (params.memberId = shopAndSite?.memberId),
        (params.roleId = shopAndSite?.memberRoleId),
        (getFn = getCommodityMobileCategoryMobileSelfMemberCategory)
    } else {
      params.adornId = adornId
      getFn = getCommodityMobileCategoryMobileEnterpriseCategory
    }
    getFn &&
      getFn(params).then((res) => {
        if (res.code === 1000) {
          setFirstCategoryList(res.data)
        }
      })
  }

  useEffect(() => {
    if (adornId) {
      fetchFirstCategoryList()
    }
  }, [adornId])

  useEffect(() => {
    if (refreshing) {
      if (adornId) {
        fetchFirstCategoryList()
      }
    }
  }, [refreshing])

  const handleLink = () => {
    if (isSelf) {
      Router.navigateTo('shop/shopAbout')
    }
  }

  const handleMoreLink = () => {
    if (isSelf) {
      shopAndSite && setShopAndSite(shopAndSite)
      Router.navigateTo('extra/mall/own/select')
    }
  }

  const handleCategoryLink = (info: any) => {
    if (!info.status) {
      Router.navigateTo(isSelf ? 'extra/commonClassify' : 'extra/classify', {
        categoryId: info.id,
        categoryName: info.name,
        showBack: isSelf ? false : true, // 显示返回按钮
      })
    }
  }

  const handleSearch = () => {
    const param: any = {}
    if (isSelf) {
      param.shopId = shopAndSite?.memberId
    }
    Router.navigateTo(isSelf ? 'shop/shopSearch' : 'extra/search', { ...param })
  }

  const _renderNavBar = () => {
    return (
      <MallNavBar
        title={shopAndSite?.name}
        onClick={handleLink}
        extra={
          isSelf && (
            <Icons name="ArrowDownFill" size={24} onClick={handleMoreLink} color="#303133" className="exchange_icon" />
          )
        }
      />
    )
  }

  return (
    <View className={cx(`common-mall-header`, STYLE_THEME_LIST[styleTheme])} id="mallHeader">
      {_renderNavBar()}
      <View className="searchContainer">
        <View className="search" onClick={handleSearch}>
          <Icons customStyle={{ margin: '0 8px' }} name="Search" color="#91959B" size={20} />
          <View className="keyword">
            {isSelf
              ? intl.formatMessage({ id: 'mall_common_header_search_placeholder_self' })
              : intl.formatMessage({ id: 'mall_common_header_search_placeholder' })}
          </View>
          <View className="searchBtn">
            <Text>{intl.formatMessage({ id: 'mall_common_header_search', defaultMessage: '搜索' })}</Text>
          </View>
        </View>
      </View>
      {isShowCategory ? (
        <View className="categoryContainer">
          <ScrollView scrollX className="scrollView">
            <View className="categoryWrap">
              <Navigator className="categoryItem">
                <Text className="categoryText active">
                  {intl.formatMessage({ id: 'mall_common_header_home', defaultMessage: '首页' })}
                </Text>
              </Navigator>
              {firstCategoryList &&
                firstCategoryList.map((item) => (
                  <View className="categoryItem" key={item.id} onClick={() => handleCategoryLink(item)}>
                    <Text className="categoryText">{item.name}</Text>
                  </View>
                ))}
            </View>
          </ScrollView>
          <View
            className="moreBtn"
            onClick={() =>
              Router.navigateTo(isSelf ? 'extra/commonClassify' : 'extra/classify', { showBack: isSelf ? false : true })
            }
          >
            <Icons name="Menu" color={styleTheme === 0 ? '#91959B' : '#FFFFFF'} size={24} />
          </View>
        </View>
      ) : null}
    </View>
  )
}

CommonMallHeader.defaultProps = {
  isSelf: false,
  isShowCategory: true,
  refreshing: false,
}

export default observer(CommonMallHeader)

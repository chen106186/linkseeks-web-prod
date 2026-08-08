import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useState } from 'react'
import { pxTransform, getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Tabs, Text, SwipeAction, ScrollView, Toast, TabsPane } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import BusinessCard from '@/components/BusinessCard'
import MellowCard from '@/components/MellowCard'
import Loading from '@/components/Loading'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import DeviceEventEmitter from '@/utils/lib/DeviceEventEmitter'
import Router from '@/utils/router'
import { SHOP_TYPE } from '@/constants/const/shop'
import EmptyLayout from '@/components/Empty'
import {
  getProductMobileShopCommodityCollectGetCommodityCollectList,
  postProductShopCommodityCollectDeleteCommodityCollect,
} from '@apps/apis'
import { getCommodityMobileStoreMobileCollectList, postCommodityMobileStoreMobileCollect } from '@apps/apis'
import { getManageMobileInformationMobileCollectList, postManageMobileInformationMobileCollect } from '@apps/apis'
import Information from './components/Information'
import Products from './components/Products'
import useFetchCollection from './useFetchCollections'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const MyCollections: React.FC = () => {
  const route: {
    params: any
  } = {
    params: getCurrentInstance().router?.params,
  }
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [isNew] = useState(shopAndSite?.isSelf)
  const [active, setActive] = useState(`${Number(route.params?.mode || '0') ? Number(route.params?.mode) - 1 : '0'}`)
  const commodityParams = {}
  const {
    loading,
    hasMore,
    dataSource,
    handleLoadMore,
    handleRemove: handleCommodityRemove,
    removeLoading: commodityRemoveLoading,
    refresh: refreshCommodityData,
  } = useFetchCollection(
    getProductMobileShopCommodityCollectGetCommodityCollectList,
    '1',
    `${Number(active) + 1}`,
    {
      type: 1,
    } as any,
    commodityParams,
  )
  const intl = useIntl()
  const {
    loading: storeLoading,
    hasMore: storeHasMore,
    dataSource: storeData,
    handleLoadMore: handleStoreLoadMore,
    handleRemove: handleStoreRemove,
    removeLoading: storeRemoveLoading,
    refresh: refreshStoreData,
  } = useFetchCollection(getCommodityMobileStoreMobileCollectList, '2', `${Number(active) + 1}`)
  const {
    loading: informationLoading,
    hasMore: informationHasMore,
    dataSource: informationData,
    handleLoadMore: handleInformationLoadMore,
    handleRemove: handleInformationRemove,
    removeLoading: informationRemoveLoading,
    refresh: refreshInfomationData,
    // getManageContentInformationCollectList
  } = useFetchCollection(getManageMobileInformationMobileCollectList, '3', `${Number(active) + (isNew ? 2 : 1)}`)
  const handleCommodityLoadMore = () => {
    handleLoadMore(commodityParams)
  }
  const handleRemove = (
    params: {
      type: number | null
      commodityId: number
      channelMemberId?: number
    },
    key: string,
    value: number,
  ) => {
    const postData: {
      type: number | null
      commodityId: number
      channelMemberId?: number
    } = {
      type: params.type,
      commodityId: params.commodityId,
    }
    // 渠道会员id(type为3、4、5的时候需要传)
    if (params.type && ['3', '4', '5'].includes(params.type.toString())) {
      postData.channelMemberId = params.channelMemberId
    }
    handleCommodityRemove(postProductShopCommodityCollectDeleteCommodityCollect, postData, key, value)
  }
  const storeRemove = (params: any, key: string, value: number) => {
    handleStoreRemove(postCommodityMobileStoreMobileCollect, params, key, value)
  }
  const informationRemove = (params: any, key: string, value: number) => {
    // postManageContentInformationCollect,
    handleInformationRemove(postManageMobileInformationMobileCollect, params, key, value)
  }
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('collectProductChange', () => {
      refreshCommodityData()
    })
    return () => subscription.remove()
  }, [])
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'card.myCollections.navigationBarTitleText', defaultMessage: '我的收藏' }),
    // })
    const subscription = DeviceEventEmitter.addListener('collectShopChange', () => {
      refreshStoreData()
    })
    return () => subscription.remove()
  }, [])
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('collectCollectionChange', () => {
      refreshInfomationData()
    })
    return () => subscription.remove()
  }, [])
  const renderProductItem = (item: { item: any }) => {
    const { sold, unitName, name, min, mainPic, id, priceType } = item.item.commodity ?? {}
    return (
      <View className={styles['collection-container']}>
        <SwipeAction
          customStyle={{
            padding: 0,
            width: '100%',
          }}
          options={[
            {
              text: intl.formatMessage({
                id: 'card.myCollections.action.delete',
                defaultMessage: '删除',
              }),
              className: styles['slip'],
            },
          ]}
          onClick={() =>
            handleRemove(
              {
                commodityId: id!,
                type: item.item.type,
                channelMemberId: item.item.channelMemberId,
              },
              'id',
              item.item.id!,
            )
          }
          maxDistance={99}
        >
          <Products
            id={id!}
            name={name!}
            minPrice={min!}
            sold={sold!}
            unitName={unitName!}
            mainPic={mainPic!}
            priceType={priceType as 1 | 2 | 3}
            isPublish={item.item.isPublish}
          />
        </SwipeAction>
      </View>
    )
  }
  const renderStoreItem = (rowItem: { item: any }) => {
    const { name, id, logo, creditPoint, registerYears, roleId, memberId, status } = rowItem.item
    const cardData = {
      name,
      id,
      logo,
      creditPoint,
      registerYears,
      roleId,
      memberId,
      status,
    }
    return (
      <View className={styles['collection-container']}>
        <SwipeAction
          customStyle={{
            padding: 0,
            width: '100%',
          }}
          options={[
            {
              text: intl.formatMessage({
                id: 'card.myCollections.action.delete',
                defaultMessage: '删除',
              }),
              className: styles['slip'],
            },
          ]}
          onClick={() =>
            storeRemove(
              {
                id,
                status: false,
              },
              'id',
              id,
            )
          }
          maxDistance={99}
        >
          <MellowCard>
            <BusinessCard data={cardData} />
          </MellowCard>
        </SwipeAction>
      </View>
    )
  }
  const renderInformationItem = (dataItem: { item: any }) => {
    const { title, readCount, createTime, imageUrl, id, status } = dataItem.item
    return (
      <View className={styles['collection-container']}>
        <SwipeAction
          customStyle={{
            padding: 0,
            width: '100%',
          }}
          options={[
            {
              text: intl.formatMessage({
                id: 'card.myCollections.action.delete',
                defaultMessage: '删除',
              }),
              className: styles['slip'],
            },
          ]}
          onClick={() =>
            informationRemove(
              {
                informationId: id,
                status: false,
              },
              'id',
              id,
            )
          }
          maxDistance={99}
        >
          <Information
            title={title}
            readCount={readCount}
            createdTime={createTime}
            imageUrl={imageUrl}
            id={id}
            status={status as 1 | 2 | 3}
          />
        </SwipeAction>
      </View>
    )
  }

  // const handleTabChange = (key: number) => {
  //   setActive(`${key}`)
  // }

  const renderChildren = (key: string) => {
    if (key === '1') {
      return dataSource.length ? (
        <ScrollView
          style={{
            height: 'calc(100vh - 44px)',
          }}
          className={styles['scrollView']}
          renderItem={renderProductItem}
          keyExtractor={(_, index) => `product-${index}`}
          data={dataSource}
          listFooterComponent={<Loading loading={loading} noMore={!hasMore} noMoreText="" />}
          onEndReached={handleCommodityLoadMore}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <View className={styles['collect-view']}>
          <EmptyLayout />
        </View>
      )
    }
    if (key === '2') {
      return storeData.length ? (
        <ScrollView
          style={{
            height: 'calc(100vh - 44px)',
          }}
          className={styles['scrollView']}
          renderItem={renderStoreItem}
          keyExtractor={(_, index) => `gotScore-${index}`}
          data={storeData}
          listFooterComponent={<Loading loading={storeLoading} noMore={!storeHasMore} noMoreText="" />}
          onEndReached={() => handleStoreLoadMore({})}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <View className={styles['collect-view']}>
          <EmptyLayout />
        </View>
      )
    }
    return informationData.length ? (
      <ScrollView
        style={{
          height: 'calc(100vh - 44px)',
        }}
        className={styles['scrollView']}
        renderItem={renderInformationItem}
        keyExtractor={(_, index) => `usedScore-${index}`}
        data={informationData}
        listFooterComponent={<Loading loading={informationLoading} noMore={!informationHasMore} noMoreText="" />}
        onEndReached={() => handleInformationLoadMore({})}
        onEndReachedThreshold={0.1}
      />
    ) : (
      <View className={styles['invoice-view']}>
        <EmptyLayout />
      </View>
    )
  }
  useEffect(() => {
    if (isNew && route.params?.mode === '3') {
      setActive('1')
    }
  }, [isNew])

  /** 如果是b端或者是c端 的自营商城，那么直接过滤掉商品收藏 */
  const tabItems = useMemo(() => {
    const list = [
      {
        id: '1',
        key: '1',
        name: intl.formatMessage({
          id: 'card.myCollections.goods',
          defaultMessage: '商品收藏',
        }),
      },
      {
        id: '2',
        key: '2',
        name: intl.formatMessage({
          id: 'card.myCollections.shop',
          defaultMessage: '店铺收藏',
        }),
      },
      // {
      //   id: '3',
      //   key: '3',
      //   name: intl.formatMessage({
      //     id: 'card.myCollections.information',
      //     defaultMessage: '资讯收藏',
      //   }),
      // },
    ]
    const newList = [
      {
        id: '1',
        key: '1',
        name: intl.formatMessage({
          id: 'card.myCollections.goods',
          defaultMessage: '商品收藏',
        }),
      },
      // {
      //   id: '3',
      //   key: '2',
      //   name: intl.formatMessage({
      //     id: 'card.myCollections.information',
      //     defaultMessage: '资讯收藏',
      //   }),
      // },
    ]
    return isNew ? newList : list
  }, [isNew])
  const handleTabChange = (key: number) => {
    const isSelfMall = shopAndSite?.isSelf
    /** 这里这样写是因为tab 的index 貌似只能对应数组的key， 这里需要修改， 应该整个tab都要修改。。。 */
    if (isSelfMall) {
      setActive(key === 0 ? '0' : `${tabItems.length - 1}`)
      return
    }
    setActive(`${key}`)
  }
  const tabsList = tabItems.map((_item) => {
    return {
      title: _item.name,
    }
  })
  return (
    <View className={styles['page']}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          backgroundColor: '#F4F5F7',
          borderTopColor: '#F4F5F7',
          borderTopWidth: 0.5,
        }}
      >
        <Tabs
          className={styles['tab-bar-style']}
          current={Number(active)}
          tabList={tabsList}
          onClick={handleTabChange}
          /** 这里不设置会跟swiperAction  */ swipeable={false}
        >
          {tabItems.map((_item, _index) => {
            return (
              <TabsPane key={Number(_item.key)} current={Number(active)} index={_index}>
                {renderChildren(_item.id)}
              </TabsPane>
            )
          })}
        </Tabs>
      </View>
      <Loading
        customStyle={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          backgroundColor: '#000',
          width: '100px',
          height: '100px',
          marginLeft: '-50px',
          marginTop: '-50px',
          opacity: 0.8,
          zIndex: 101,
        }}
        loading={informationRemoveLoading || commodityRemoveLoading || storeRemoveLoading}
        vertical
        size={40}
        textSize={14}
      />
    </View>
  )
}
export default GlobalWrapper(observer(MyCollections))

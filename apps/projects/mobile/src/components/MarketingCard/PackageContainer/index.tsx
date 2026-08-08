import React, { useState, useEffect, useMemo } from 'react'
import { Text, View, ScrollView, Tabs, TabsPane } from '@apps/mobile-ui'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import GoodsItem from '../GoodsItem'
import DetailItem from '../DetailItem'

import './index.scss'

interface PackageContainerProps {
  details: any
}

const PackageContainer: React.FC<PackageContainerProps> = (props: PackageContainerProps) => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const { details } = props
  const windowWidth = getSystemInfoSync().windowWidth
  const _childWitdh = (windowWidth - 16) / 4.5
  const [activeKey, setActiveKey] = useState<number>(0)
  const [groupOriginalPrice, setGroupOriginalPrice] = useState<Number>(0)
  const [groupPrice, setGroupPrice] = useState<string>('')

  const _onTabPress = (index: any) => {
    const _goodSub = details?.goodsSubsidiaryGroupList[index]
    let _childPrice = 0
    _goodSub?.goodsSubsidiaryGroupDetailsList &&
      _goodSub.goodsSubsidiaryGroupDetailsList.forEach((item: any) => {
        _childPrice += Number(item.price)
      })
    setGroupOriginalPrice(_childPrice)
    setGroupPrice(_goodSub?.groupPrice || 0)
  }

  useEffect(() => {
    _onTabPress(0)
  }, [])

  const _groupPrice = useMemo(() => {
    return (
      <Text className="marketingCard-packageContainer-container-bottom-leftBox-discountPrice">
        {intl.formatMessage({ id: 'currency' })}
        <Text className="marketingCard-packageContainer-container-bottom-leftBox-discountPrice-inner">
          {groupPrice}
        </Text>
      </Text>
    )
  }, [groupPrice])

  const _onTab = () => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: details.productId })
  }

  const _tabList = useMemo(() => {
    return details?.goodsSubsidiaryGroupList.map((item) => {
      return {
        title: item.title
          ? item.title
          : `${intl.formatMessage({ id: 'activity.type.setMeal', defaultMessage: '套餐' })}${item.groupNo}`,
      }
    })
  }, [details?.goodsSubsidiaryGroupList])

  const handleTabsChange = (key: number) => {
    _onTabPress(key)
    setActiveKey(key)
  }

  return (
    <View className="marketingCard-packageContainer-container">
      <DetailItem
        detail={{ ...details }}
        detailType="package"
        tag={intl.formatMessage({ id: 'components.marketingCard.packageContainer.tag' })}
        containStyle={{ margin: pxTransform(12), padding: 0 }}
        customImageWidth={96}
      />
      <Tabs scroll current={activeKey} tabList={_tabList} onClick={handleTabsChange}>
        {details?.goodsSubsidiaryGroupList.map((item: any, index: any) => (
          <TabsPane key={index} current={activeKey}>
            <ScrollView
              style={{
                backgroundColor: '#fff',
                minWidth: pxTransform(windowWidth - 16),
                paddingTop: pxTransform(12),
                paddingBottom: pxTransform(12),
              }}
              horizontal
              key={`PackageContainer_${index}`}
              keyExtractor={(childItem) => childItem.id}
              data={item.goodsSubsidiaryGroupDetailsList}
              // eslint-disable-next-line no-shadow
              renderItem={({ item: child, index: childIndex }) => (
                <View
                  key={child?.id || childIndex}
                  style={{ width: pxTransform(_childWitdh), marginLeft: pxTransform(18), marginRight: pxTransform(18) }}
                >
                  <GoodsItem
                    {...child}
                    childWitdh={_childWitdh}
                    img={child.productImgUrl}
                    discountPrice={child.price}
                    originalPrice={child.price}
                  />
                </View>
              )}
            />
          </TabsPane>
        ))}
      </Tabs>
      <View className="marketingCard-packageContainer-container-bottom">
        <View className="marketingCard-packageContainer-container-bottom-leftBox">
          <Text className="marketingCard-packageContainer-container-bottom-leftBox-left">
            {intl.formatMessage({ id: 'components.marketingCard.packageContainer.bottomLeft' })}
          </Text>
          {_groupPrice}
          <Text className="marketingCard-packageContainer-container-bottom-leftBox-originalPrice">{`${intl.formatMessage(
            { id: 'currency' },
          )}${groupOriginalPrice}`}</Text>
        </View>
        <View className="marketingCard-packageContainer-container-bottom-buyButton" onClick={_onTab}>
          <Text className="marketingCard-packageContainer-container-bottom-buyButton-text">
            {intl.formatMessage({ id: 'components.marketingCard.packageContainer.buyButtonText' })}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PackageContainer

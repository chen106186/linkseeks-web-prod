import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Tabs, TabsPane } from '@apps/mobile-ui'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { THEME_COLORS } from '@/constants/theme'
import useProductDetailJump from '@/hooks/useProductDetailJump'

import GoodsItem from '../GoodsItem'
import GiveContainerItemCoupon from '../GiveContainerItemCoupon'
import DetailItem, { DetailItemProps } from '../DetailItem'

import './index.scss'

interface GiveContainerItemProps extends DetailItemProps {
  childType: 'goods' | 'coupons'
}

const GiveContainerItem: React.FC<GiveContainerItemProps> = (props: GiveContainerItemProps) => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const { detail, childType } = props
  const windowWidth = getSystemInfoSync().windowWidth
  const [activeKey, setActiveKey] = useState<number>(0)
  const _childWitdh = useMemo(() => {
    if (childType === 'goods') {
      return (windowWidth - 76) / 3
    }
    return (windowWidth - 76) / 3.5
  }, [childType])

  const _leftTag = useMemo(() => {
    if (childType === 'goods') {
      return intl.formatMessage({ id: 'components.marketingCard.giveContainerItem.leftTag.1' })
    }
    return intl.formatMessage({ id: 'components.marketingCard.giveContainerItem.leftTag.2' })
  }, [childType])
  const _needBtn = useMemo(() => childType === 'coupons', [childType])

  const _returnTitle = (limitValue: number) => {
    if (childType === 'goods') {
      return intl.formatMessage({ id: 'components.marketingCard.giveContainerItem.returnTitle.1', data: limitValue })
    }
    return intl.formatMessage({ id: 'components.marketingCard.giveContainerItem.returnTitle.2', data: limitValue })
  }

  const _groupPrice = useMemo(() => {
    if (typeof detail?.discountPrice === 'number' && detail?.discountPrice === 0) {
      return (
        <Text className="marketingCard-giveContainerItem-container-bottom-leftBox-discountPrice">
          {intl.formatMessage({ id: 'currency' })}
          <Text className="marketingCard-giveContainerItem-container-bottom-leftBox-discountPrice-inner">0</Text>
          .00
        </Text>
      )
    }
    const _text = detail?.discountPrice?.split('.')
    if (_text && _text.length > 0) {
      return (
        <Text className="marketingCard-giveContainerItem-container-bottom-leftBox-discountPrice">
          {intl.formatMessage({ id: 'currency' })}
          <Text className="marketingCard-giveContainerItem-container-bottom-leftBox-discountPrice-inner">
            {_text?.[0]}
          </Text>
          {`.${_text?.[1] || '00'}`}
        </Text>
      )
    }
    return null
  }, [detail])

  const _children = useMemo(() => {
    if (childType === 'goods') {
      return detail?.goodsSubsidiaryGroupList.map((item: any) => {
        const _showNum = item.goodsSubsidiaryGroupDetailsList.filter((child: any) => child.num > 1)
        return {
          ...item,
          showNum: _showNum.length > 0,
        }
      })
    }
    return detail?.giveCouponList.map((item: any) => {
      const _couponList: any[] = []
      item.list.forEach((child: any) => {
        for (let i = 0; i < child.num; i += 1) {
          _couponList.push({ ...child })
        }
      })
      return {
        ...item,
        couponList: _couponList,
      }
    })
  }, [detail, childType])

  const _tabList = useMemo(() => {
    return _children.map((item) => {
      return { title: _returnTitle(item.limitValue) }
    })
  }, [_children])

  const _tab = () => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: detail.productId })
  }

  const handleTabsChange = (key: number) => {
    setActiveKey(key)
  }

  return (
    <View className="marketingCard-giveContainerItem-container">
      <DetailItem
        {...props}
        tag={_needBtn ? '' : intl.formatMessage({ id: 'components.marketingCard.giveContainerItem.tag' })}
        tagColor={_needBtn ? [] : ['#D8612E', '#D8612E']}
        containStyle={{ padding: 0 }}
        detail={detail}
        detailType="give"
        leftTag={_leftTag}
        needBtn={_needBtn}
      />
      <Tabs scroll current={activeKey} tabList={_tabList} onClick={handleTabsChange} className="give_tabs">
        {_children &&
          _children.map((child: any, childIndex: any) => (
            <TabsPane key={`TabsPane_${childIndex}`} current={activeKey} index={childIndex}>
              <ScrollView
                key={`TabsPane_ScrollView_${childIndex}`}
                keyExtractor={(item) => `${item.id}`}
                style={{
                  backgroundColor: THEME_COLORS.surface,
                  minWidth: pxTransform(windowWidth - 40),
                  paddingTop: pxTransform(12),
                  paddingBottom: pxTransform(12),
                }}
                horizontal
                data={childType === 'goods' ? child?.goodsSubsidiaryGroupDetailsList : child?.couponList}
                // eslint-disable-next-line no-shadow
                renderItem={({ item, index }) => (
                  <View key={item?.id || index} style={{ marginLeft: index !== 0 ? pxTransform(12) : pxTransform(0) }}>
                    {childType === 'goods' ? (
                      <GoodsItem
                        {...item}
                        childWitdh={_childWitdh}
                        img={item.productImgUrl}
                        info={intl.formatMessage({
                          id: 'components.marketingCard.giveContainerItem.original',
                          data: item.price,
                        })}
                        num={child?.showNum ? item.num : 0}
                        direction="column"
                        disable
                      />
                    ) : (
                      <GiveContainerItemCoupon {...item} childWitdh={_childWitdh} />
                    )}
                  </View>
                )}
              />
            </TabsPane>
          ))}
      </Tabs>
      {!_needBtn && (
        <View className="marketingCard-giveContainerItem-container-bottom">
          <View className="marketingCard-giveContainerItem-container-bottom-leftBox">
            {_groupPrice}
            <Text className="marketingCard-giveContainerItem-container-bottom-leftBox-originalPrice">
              {detail?.originalPrice ? `${intl.formatMessage({ id: 'currency' })}${detail?.originalPrice}` : null}
            </Text>
          </View>
          <View className="marketingCard-giveContainerItem-container-bottom-buyButton" onClick={_tab}>
            <Text className="marketingCard-giveContainerItem-container-bottom-buyButton-text">
              {intl.formatMessage({ id: 'components.marketingCard.giveContainerItem.button' })}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default GiveContainerItem

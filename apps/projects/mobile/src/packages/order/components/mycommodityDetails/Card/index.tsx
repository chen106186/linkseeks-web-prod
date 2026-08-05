import React, { useEffect, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface Iprops {
  btnNode?: any
  dataSource?: any
  shopLogo?: string
  vendorMemberName?: string
  orderMode?: number
  groupId?: number
  storeId?: number
  cbgSelfPickup?: boolean
}
const Card = (props: Iprops) => {
  const { dataSource, btnNode, shopLogo, vendorMemberName, orderMode, groupId, storeId, cbgSelfPickup } = props
  const [dataArr, setDataArr] = useState<any[]>([])
  const [moreCommodity, setMoreCommodity] = useState<boolean>(false)
  const intl = useIntl()
  const { jmpProductDetail, jmpProductDetailGroup } = useProductDetailJump()
  useEffect(() => {
    const arr: any = []
    dataSource.forEach((item: any) => {
      if (arr[item.deliverType]) {
        arr[item.deliverType].push(item)
      } else {
        arr[item.deliverType] = [item]
      }
    })
    setDataArr([...arr.filter((v: any) => v)])
  }, [])
  const showDeliverType = (id: number) => {
    switch (id) {
      case 1:
        return intl.formatMessage({ id: 'order.wuliu', defaultMessage: '物流' })
      case 2:
        return intl.formatMessage({ id: 'order.ziti', defaultMessage: '自提' })
      case 3:
        return intl.formatMessage({ id: 'order.wuxupeisong', defaultMessage: '无需配送' })
      case 4:
        return storeId
          ? intl.formatMessage({ id: 'order.ziti', defaultMessage: '自提' })
          : intl.formatMessage({ id: 'order.wuliu', defaultMessage: '物流' })
      default:
        return intl.formatMessage({ id: 'order.wuxupeisong', defaultMessage: '无需配送' })
    }
  }
  const like = (item: any) => {
    if (groupId) {
      jmpProductDetailGroup({
        commodityId: item.productId,
      })
    } else {
      jmpProductDetail(item.priceType, { commodityId: item.productId, skuId: item.skuId })
    }
  }

  const isGift = (data) => {
    return data?.priceType === PRICE_TYPE_ENUM.GIFT
  }

  const showColor = () => {
    return orderMode === 10 || orderMode === 11
  }

  const showItemPrice = (item) => {
    return !showColor() && !isGift(item)
  }

  return (
    <View className={styles['commodity-card']}>
      <View className={styles['commodity-card-flex']}>
        <Image
          src={String(shopLogo)}
          style={{
            width: pxTransform(16),
            height: pxTransform(16),
            borderRadius: pxTransform(10),
            marginRight: pxTransform(10),
          }}
        />
        <Text className={styles.title}>{vendorMemberName}</Text>
      </View>
      {dataArr?.map((items: any[], i: number) =>
        items?.map(
          (item: any, index: number) =>
            ((i === 0 && index < 3) || moreCommodity) && (
              <View
                key={`${item.deliverType}_${item.orderProductId}`}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <View className={styles['warp-card']}>
                  <Image
                    src={String(item.logo)}
                    style={{
                      width: pxTransform(80),
                      height: pxTransform(80),
                      borderRadius: pxTransform(10),
                      marginRight: pxTransform(10),
                    }}
                    onClick={() => like(item)}
                  />
                  <View className={styles['right-card']}>
                    <Text className={styles.label}>{item.name}</Text>
                    <Text className={styles.type}>{item.spec}</Text>
                    <View className={styles.warp}>
                      <View className={styles.flex}>
                        {showItemPrice(item) && (
                          <Text className={styles.color}>
                            {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                          </Text>
                        )}
                        <Text className={styles.price} style={showColor() ? { color: '#EB9B00' } : {}}>
                          {isGift(item)
                            ? intl.formatMessage({ id: 'order.zengpin', defaultMessage: '赠品' })
                            : item.refPrice?.split('.')[0]}
                        </Text>
                        {showItemPrice(item) && <Text className={styles.color}>.{item.refPrice?.split('.')[1]}</Text>}
                        <Text className={styles.uitl} style={showColor() ? { color: '#EB9B00' } : {}}>
                          {showColor() ? intl.formatMessage({ id: 'order.jifen', defaultMessage: '积分' }) : item.uitl}
                        </Text>
                        <Text className={styles.num}>x{item.quantity}</Text>
                      </View>
                      <View>{btnNode?.(item.orderProductId)}</View>
                    </View>
                  </View>
                </View>
                {(item.deliverType !== 2 || index === items.length - 1) && moreCommodity && (
                  <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: pxTransform(16) }}>
                      <Text style={{ fontSize: pxTransform(12), color: '#5C626A' }}>
                        {intl.formatMessage({ id: 'order.peisongfangshi', defaultMessage: '配送方式' })}
                      </Text>
                      <Text style={{ fontSize: pxTransform(12), color: '#303133' }}>
                        {showDeliverType(item.deliverType)}
                      </Text>
                    </View>
                    {item.deliverType === 2 && !cbgSelfPickup && (
                      <>
                        <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: pxTransform(16) }}>
                          <Text style={{ fontSize: pxTransform(12), color: '#5C626A' }}>
                            {intl.formatMessage({ id: 'order.zitidizhi', defaultMessage: '自提地址' })}
                          </Text>
                          <Text style={{ fontSize: pxTransform(12), color: '#303133' }}>
                            {item.receiver}/{item.phone}
                          </Text>
                        </View>
                        <View style={{ display: 'flex', justifyContent: 'flex-end', marginTop: pxTransform(6) }}>
                          <Text style={{ fontSize: pxTransform(12), color: '#303133' }}>{item.address}</Text>
                        </View>
                      </>
                    )}
                  </View>
                )}
              </View>
            ),
        ),
      )}
      <View
        style={{ display: 'flex', justifyContent: 'center', marginTop: pxTransform(9) }}
        onClick={() => setMoreCommodity(!moreCommodity)}
      >
        <Text style={{ fontSize: pxTransform(12) }}>
          {moreCommodity
            ? intl.formatMessage({ id: 'order.shouqi', defaultMessage: '收起' })
            : `${intl.formatMessage({ id: 'order.gong', defaultMessage: '共' })}${
                dataSource.length || 0
              }${intl.formatMessage({ id: 'order.jianshangpindianjizhakan', defaultMessage: '件商品，点击查看全部' })}`}
        </Text>
        <Image
          src={moreCommodity ? getOssUrlPath(`/Images/show.svg`) : getOssUrlPath(`/Images/next.svg`)}
          style={{ width: pxTransform(15), height: pxTransform(15), marginLeft: pxTransform(5) }}
        />
      </View>
    </View>
  )
}
Card.defaultProps = {
  dataSource: {},
  btnNode: null,
}
export default Card

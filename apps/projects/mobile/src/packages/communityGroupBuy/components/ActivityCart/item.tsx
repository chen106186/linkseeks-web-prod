/*
 * @Description: 活动购物车商品
 */
import React, { useState, useEffect, useMemo } from 'react'
import cs from 'classnames'
import { SwipeAction, View, Text, Icons, Image } from '@apps/mobile-ui'
import { Input } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import { priceFormat } from '@/utils/numberFormat'
import styles from './index.module.scss'

const CheckedIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/Checked-@2x.png'
const DefaultIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/Default@2x.png'

interface IProps {
  /**
   * 商品信息
   */
  data: any
  /**
   * 价格设置
   */
  priceConfig?: any | null
  /**
   * 是否选中
   */
  selected: boolean
  /**
   * 活动库存
   */
  activityStock: number
  /**
   * 数量更改触发事件
   */
  onCountChange?: (number) => void
  /**
   * 选择触发事件
   */
  onSelect?: () => void
  /**
   * 删除触发事件
   */
  onDelete?: () => void
}

const Item = (props: IProps) => {
  const { data, selected, priceConfig, activityStock, onCountChange, onSelect, onDelete } = props
  const intl = useIntl()

  const stockCount = useMemo(() => {
    return Math.min(data.stockCount, activityStock)
  }, [data, activityStock])
  const [count, setCount] = useState<string>(isNaN(data?.count) ? '1' : String(data?.count))
  useEffect(() => {
    setCount(isNaN(data?.count) ? '1' : String(data?.count))
  }, [data?.count])

  const renderPrice = () => {
    const {
      count,
      purchaseSkuResp: { unitPrice },
    } = data
    let price = 0
    for (const key of Object.keys(unitPrice)) {
      if (key === '0-0') {
        price = unitPrice[key]
        break
      }
      const arr = key.split('-')
      if (count >= arr[0] && count <= arr[1]) {
        price = unitPrice[key]
        break
      }
    }
    const { handPrice, commodityPrice } = priceConfig || {}
    let arr = String(priceFormat(handPrice || commodityPrice || price || 0)).split('.')
    return (
      <View className={styles['list-item-content-more-price']}>
        <Text className={styles['list-item-content-more-price-red']}>
          ￥<Text className={styles['list-item-content-more-price-large']}>{arr[0]}</Text>
          {arr[1] && <Text>.{arr[1]}</Text>}
        </Text>
        {/* {handPrice && (
          <Text className={styles['list-item-content-more-price-original']}>￥{priceFormat(commodityPrice)}</Text>
        )} */}
      </View>
    )
  }

  const handleCountInputChange = (value) => {
    setCount(value)
  }

  const handleCountInputBlur = (value) => {
    if (isNaN(value) || value < data?.purchaseSkuResp?.commodity?.minOrder || value > stockCount) {
      setCount(String(data?.count))
    } else {
      handleCountChange(Number(value))
    }
  }

  const handleCountChange = (value: number) => {
    onCountChange?.(value)
  }

  return (
    <SwipeAction
      customStyle={{
        width: '100%',
      }}
      options={[
        {
          text: intl.formatMessage({
            id: 'mine.options.shanchu',
            defaultMessage: '删除',
          }),
          className: styles['delbtn'],
        },
      ]}
      onClick={() => onDelete?.()}
      maxDistance={94}
    >
      <View className={styles['list-item']}>
        <Image
          src={selected ? CheckedIcon : DefaultIcon}
          className={styles['select-icon']}
          onClick={() => {
            onSelect?.()
          }}
        />
        <View className={styles['list-item-image']}>
          <Image
            src={data.purchaseSkuResp.commodity.mainPic}
            className={cs(styles['list-item-image-img'], (!data.isPublish || stockCount <= 0) && styles['disabled'])}
          />
          {!data.isPublish ? (
            <View className={styles['list-item-image-tag']}>
              {intl.formatMessage({
                id: 'communityGroupBuy.activity.yixiajia',
                defaultMessage: '已下架',
              })}
            </View>
          ) : stockCount <= 0 ? (
            <View className={styles['list-item-image-tag']}>
              {intl.formatMessage({
                id: 'communityGroupBuy.activity.yishouqing',
                defaultMessage: '已售罄',
              })}
            </View>
          ) : (
            <></>
          )}
        </View>
        <View className={styles['list-item-content']}>
          <View className={styles['list-item-content-name']}>{data.purchaseSkuResp.commodity.name}</View>
          <View className={styles['list-item-content-spec']}>
            {data.purchaseSkuResp.commoditySkuAttributeList
              ?.map((it) => `${it.customerAttribute.name}:${it.customerAttributeValue.value}`)
              .join(',')}
          </View>
          <View className={styles['list-item-content-more']}>
            {renderPrice()}
            <View className={styles['list-item-content-more-count']}>
              <Icons
                name="Minus"
                size={16}
                color={
                  !data.isPublish || data.count <= data?.purchaseSkuResp?.commodity?.minOrder ? '#C8CACD' : '#252D37'
                }
                className={styles['list-item-content-more-count-btn']}
                onClick={() => {
                  let value = data.count - 1
                  if (data.isPublish && value >= data?.purchaseSkuResp?.commodity?.minOrder) {
                    handleCountChange(value)
                  }
                }}
              />
              <Input
                type="number"
                value={count}
                className={styles['list-item-content-more-count-input']}
                disabled={!data.isPublish}
                maxlength={6}
                onInput={({ detail: { value } }) => handleCountInputChange(value)}
                onBlur={({ detail: { value } }) => handleCountInputBlur(value)}
              />
              <Icons
                name="Plus"
                size={16}
                color={!data.isPublish || data.count >= stockCount ? '#C8CACD' : '#252D37'}
                className={styles['list-item-content-more-count-btn']}
                onClick={() => {
                  let value = data.count + 1
                  if (data.isPublish && value <= stockCount) {
                    handleCountChange(value)
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SwipeAction>
  )
}

export default Item

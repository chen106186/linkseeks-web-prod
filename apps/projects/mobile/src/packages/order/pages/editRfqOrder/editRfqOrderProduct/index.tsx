import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { View, Image, Checkbox } from '@apps/mobile-ui'
import { setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import Stepper from '@/components/Stepper'
import { useIntl } from '@linkseeks/i18n'
import { themeLayout } from '@/constants/theme'
import { useSafeArea } from '@apps/mobile-services'
import useEditRfqOrderProduct from '../services/hooks/useEditRfqOrderProduct'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const EditRfqOtherInfo = () => {
  const { productList, getProductList, handleCheckItem, handleStepItem, handleSubmit } = useEditRfqOrderProduct()
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'order.xiugaishangpinxunjia', defaultMessage: '修改商品询价' }),
    // })
    getProductList()
  }, [])
  return (
    <View className={styles['scrollWrap']}>
      <View className={styles['product']}>
        {productList.map((item, index) => (
          <View className={styles['product-item']} key={index}>
            <View className={styles['product-item-left']}>
              <Checkbox checked={item.check} onChange={(value) => handleCheckItem(value, item)} />
            </View>
            <View className={styles['product-item-center']}>
              <Image src={item.imgUrl} mode="aspectFill" />
              <View className={styles['extra']}>
                <View>{item.productName}</View>
                <View className={styles['stock']}>
                  <View>
                    {intl.formatMessage({
                      id: 'order.kucun',
                      defaultMessage: '库存',
                    })}
                    {item.stockCount}
                  </View>
                  <Stepper
                    min={item.minOrder}
                    max={item.stockCount}
                    value={item.purchaseCount}
                    onBlur={(value) => handleStepItem(value, item)}
                    onPlus={(value) => handleStepItem(value, item)}
                    onMinus={(value) => handleStepItem(value, item)}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View
        className={styles['submit']}
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        }}
      >
        <View className={styles['submit-text']} onClick={handleSubmit}>
          {intl.formatMessage({
            id: 'order.queren',
            defaultMessage: '确认',
          })}
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(EditRfqOtherInfo)

import React, { useState } from 'react'
import { View, Text, ScrollView, Modal } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Popup from '@/components/Popup'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import CommodityContent from './CommodityContent'
import styles from './index.module.scss'
// import { CoverView } from '@tarojs/components';

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  showCommodityList: boolean
  fnClose: Function
  selectShop: any
}

const CommodityList: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { showCommodityList, fnClose, selectShop } = props
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const translate = useWebIntl()

  const fnClosePopup = () => {
    if (fnClose) {
      fnClose()
    }
  }

  const fnGetCommodityNum = () => {
    let allNum = 0
    selectShop.forEach((item: any) => {
      allNum += item.count
    })
    return allNum
  }

  return (
    <Popup visible={showCommodityList} onClose={fnClosePopup}>
      <View className={styles['warp']}>
        <View className={styles['title']}>
          <Text className={styles['text']}>
            {intl.formatMessage({ id: 'confirmOrder_components_commodityList_text' })}
          </Text>
          <Text className={styles['commodity-number']}>
            {intl.formatMessage({
              id: 'confirmOrder_components_commodityList_commodityNumber',
              data: fnGetCommodityNum(),
            })}
          </Text>
        </View>
      </View>
      <ScrollView className={styles['money-main']}>
        {selectShop.map((item: any, index: number) => (
          <View key={`shop${index}`}>
            <CommodityContent newCommodity={item} />
          </View>
        ))}
      </ScrollView>
      <View className={styles['tip-wrap']} onClick={() => setModalVisible(true)}>
        <Text className={styles['tip-wrap-text']}>
          {intl.formatMessage({
            id: 'confirmOrder_components_commodityList_priceTip',
            defaultMessage: '若对价格有疑问，可点击查看详情 >',
          })}
        </Text>
      </View>
      <Modal
        className={styles['price-tip-model']}
        title={translate('mobile.resource.order.jiageshuoming')}
        confirmText={translate('mobile.resource.order.zhidaole')}
        isOpened={modalVisible}
        content={translate('mobile.resource.order.pricemodaltip')}
        onConfirm={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
      />
    </Popup>
  )
}

export default observer(CommodityList)

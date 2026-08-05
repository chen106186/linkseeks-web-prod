import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { View, Text, Toast, Checkbox } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import useStores from '@/store/useStores'
import { postOrderMobileCreateCheck } from '@apps/apis'
import {
  postProductMobileShopCommodityCollectSaveBatchCommodityCollect,
  postProductMobileShopPurchaseDeletePurchase,
} from '@apps/apis'
import { fnGetCheckPar, fnKeepTwo } from '../../commonlyFn'
import styles from './index.module.scss'

interface Iprops {
  mode?: 'balance' | 'collect'
  shopMessage: any // 购物车商品信息
  shopMessageOther: any // 购物车总计信息
  resetParShopMessage: Function // 回调
  shopAndSite: any // 商城信息
  fnResetShopMessage: Function // 回调重新获取数据
  fnFullScreenLoading: Function // 蒙板
  clickEdit: Function // 修改折叠
}
const ButtonAccount: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()

  const messageDesc = {
    allType: 0,
    allNumber: 0,
    allPrice: 0,
    originalPrice: 0,
  }
  const {
    mode,
    shopMessage,
    resetParShopMessage,
    shopAndSite,
    shopMessageOther,
    fnResetShopMessage,
    fnFullScreenLoading,
    clickEdit,
  } = props
  // const navigation = useNavigation();
  const [isAll, setIsAll] = useState<boolean>(false)
  const [cardmessage, setCarfMessage] = useState(messageDesc)
  const [loading, setLoading] = useState(false)
  const [allSelectNumDesc, setallSelectNumDesc] = useState(0)
  /**
   * 跳转确认订单
   */
  const handleBalance = async () => {
    // navigation.navigate("ConfirmOrder");
    if (cardmessage.allType > 99) {
      Toast.show({ title: intl.formatMessage({ id: 'purchase_components_buttonAccount_show_1' }), icon: 'none' })
      return
    }
    if (cardmessage.allNumber === 0) {
      Toast.show({ title: intl.formatMessage({ id: 'purchase_components_buttonAccount_show_2' }), icon: 'none' })
      return
    }
    const par = fnGetCheckPar(shopMessage)
    const objPar = {
      shopId: shopAndSite?.id, // 订单来源商城Id
      vendors: par,
    }
    fnFullScreenLoading('show')
    postOrderMobileCreateCheck(objPar).then((res: any) => {
      // const { code, message }
      fnFullScreenLoading('hide')
      if (res.code !== 1000) {
        Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }), icon: 'none' })
        return
      }
      Router.navigateTo('order/ConfirmOrder')
    })
  }

  /**
   * 判断当前是否全选
   */
  const fnGetIsAll = () => {
    let newCount = 0
    const keys = Object.keys(shopMessage)
    let isAllDesc = true
    let newSelectNum = 0
    let allSelectNum = 0
    keys.forEach((key) => {
      if (shopMessage[key].allSelectCommodity) {
        allSelectNum += shopMessage[key].allSelectCommodity.length
      }
      if (
        shopMessage[key].selectCommodity.length === shopMessage[key].allSelectCommodity.length &&
        shopMessage[key].allSelectCommodity.length !== 0
      ) {
        newCount += 1
        isAllDesc = false
        newSelectNum += shopMessage[key].selectCommodity.length
      }
    })
    setallSelectNumDesc(allSelectNum)
    if (keys.length === 0) {
      isAllDesc = false
    } else if (newCount === 0) {
      isAllDesc = false
    }
    if (newSelectNum === allSelectNum && newSelectNum !== 0) {
      isAllDesc = true
    }
    setIsAll(isAllDesc)
  }

  /**
   * 全选
   */
  const fnAllSelect = () => {
    const shopMessageDesc = JSON.parse(JSON.stringify(shopMessage))
    const keys = Object.keys(shopMessage)
    if (keys.length === 0) {
      return
    }
    keys.forEach((key) => {
      if (isAll) {
        shopMessageDesc[key].selectCommodity = []
      } else {
        shopMessageDesc[key].selectCommodity = shopMessageDesc[key].allSelectCommodity
      }
    })
    resetParShopMessage({ ...shopMessageDesc })
  }

  /**
   * 收藏商品
   */
  const handleCollection = async () => {
    // if (loading) {
    //   Toast.show({ title: intl.formatMessage({id: 'purchase_components_buttonAccount_show_3'}), icon: 'loading' });
    //   return;
    // }
    setLoading(true)
    const keys = Object.keys(shopMessage)
    let commodityIdList: any[] = []
    keys.forEach((key) => {
      shopMessage[key].selectCommodity.forEach((selectId: number) => {
        shopMessage[key].commodity.forEach((item: any) => {
          if (item.skuId === selectId) {
            const indexOf = commodityIdList.indexOf(item.commodityId)
            if (indexOf < 0) {
              commodityIdList.push(item.commodityId)
            }
          }
        })
      })
      // commodityIdList = [...commodityIdList];
    })
    // const commodityIdList = shopMessage.map((item: any) => [...item.selectCommodity]);
    // 渠道商城，渠道自由商城， 积分商城
    if (commodityIdList.length === 0) {
      setLoading(false)
      Toast.show({ title: intl.formatMessage({ id: 'purchase_components_buttonAccount_show_2' }), icon: 'loading' })
      return
    }

    const data: any = {
      commodityIdList,
      type: 1,
    }

    const { code, message } = await postProductMobileShopCommodityCollectSaveBatchCommodityCollect(data, {
      headers: { type: 1 },
    })
    setLoading(false)
    if (code === 1000) {
      Toast.show({ title: intl.formatMessage({ id: 'purchase_components_buttonAccount_show_4' }), icon: 'success' })
    } else {
      Toast.show({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
    }
    setTimeout(() => {
      clickEdit()
    }, 1000)
  }
  /**
   * 删除商品
   */
  const handleRemove = () => {
    if (loading) {
      Toast.show({ title: intl.formatMessage({ id: 'purchase_components_buttonAccount_show_5' }), icon: 'loading' })
      return
    }
    setLoading(true)
    // 企业商城 === 1， 渠道商城，渠道自有商城 == 3 / 4 , 积分商城是没有购物车的所以不用考虑
    /**
     * 如果删除商品
     * 1. 连同商品属性一起删除
     * 2. 判断当前商品中的店铺只有一间，那店铺也要删除
     */
    let idList: any[] = []
    const keys = Object.keys(shopMessage)
    keys.forEach((key) => {
      const selectSku = shopMessage[key].selectCommodity
      shopMessage[key].commodity.forEach((item: any) => {
        if (selectSku.indexOf(item.skuId) > -1) {
          idList.push(item.id)
        }
      })
    })
    postProductMobileShopPurchaseDeletePurchase({
      idList,
    })
      .then(({ code }) => {
        if (code === 1000) {
          // fetchPurchaselise()；
          Toast.show({ title: intl.formatMessage({ id: 'purchase_components_buttonAccount_show_6' }), icon: 'success' })
        } else {
          Toast.show({ title: intl.formatMessage({ id: 'purchase_components_buttonAccount_show_7' }) })
        }
        setLoading(false)
        fnResetShopMessage()
      })
      .finally(() => {
        setLoading(false)
      })
    setTimeout(() => {
      clickEdit()
    }, 1000)
  }

  useEffect(() => {
    fnGetIsAll()
  }, [shopMessage])

  useEffect(() => {
    setCarfMessage({ ...shopMessageOther })
  }, [shopMessageOther])

  const renderBalance = (
    <View className={styles['total-action']}>
      <View className={styles['btn']} onClick={handleBalance}>
        <Text className={styles['btn-text']}>
          {intl.formatMessage({
            id: 'purchase_components_buttonAccount_renderBalance',
            data: cardmessage.allNumber ? `(${cardmessage.allNumber})` : '',
          })}
        </Text>
      </View>
    </View>
  )

  const renderCollect = (
    <View className={styles['config-warp']}>
      <View className={cx(styles['collect'], styles['collect-text'])} onClick={handleCollection}>
        {intl.formatMessage({ id: 'purchase_components_buttonAccount_renderCollect_handleCollection' })}
      </View>
      <View className={styles['remove']} onClick={handleRemove}>
        {intl.formatMessage({ id: 'purchase_components_buttonAccount_renderCollect_handleRemove' })}
      </View>
    </View>
  )

  return (
    <>
      <View className={styles['bottom-container']}>
        <View className={styles['all-select-view']}>
          <View className={styles['checked']} onClick={fnAllSelect}>
            <Checkbox.Group value={isAll ? [1] : []}>
              <Checkbox value={1} />
            </Checkbox.Group>
          </View>
          <Text className={styles['allSelect-text']}>
            {intl.formatMessage({ id: 'purchase_components_buttonAccount_allSelect' })}
          </Text>
          {mode === 'balance' && (
            <View className={styles['total-content']}>
              <View className={styles['total-view']}>
                <Text className={styles['total-text']}>
                  {intl.formatMessage({ id: 'purchase_components_buttonAccount_totalText' })}
                </Text>
                <Text className={styles['total-price']}>{`${intl.formatMessage({ id: 'currency' })}${fnKeepTwo(
                  cardmessage.allPrice,
                )}`}</Text>
              </View>
              <View className={styles['total-description']}>
                <Text className={styles['total-description-text']}>
                  {intl.formatMessage({ id: 'purchase_components_buttonAccount_totalDescriptionText' })}
                  {intl.formatMessage({ id: 'currency' })}
                  {fnKeepTwo(cardmessage.originalPrice - cardmessage.allPrice)}
                </Text>
              </View>
            </View>
          )}
        </View>
        {mode === 'balance' ? renderBalance : renderCollect}
      </View>
    </>
  )
}

ButtonAccount.defaultProps = {
  mode: 'collect',
}

export default observer(ButtonAccount)

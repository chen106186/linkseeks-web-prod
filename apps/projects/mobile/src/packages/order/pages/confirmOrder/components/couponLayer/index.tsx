import React, { useEffect, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, ScrollView, Checkbox, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Popup from '@/components/Popup'
import Coupon from '@/components/Coupon'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const empty = getOssUrlPath('/miniprogram/assets/images/empty.png')

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  showCouponLayer: boolean
  fnClose: Function
  shopMessageStore: any
  fnDetermineCallCouponBlack: Function
  couponList: any
  selectCoupon: any
}

const CouponLayer: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { showCouponLayer, selectCoupon, couponList, fnClose, shopMessageStore, fnDetermineCallCouponBlack } = props
  const [couponIdListSelect, setCouponIdListSelect] = useState<any>([]) // 选中优惠券的Id集合
  const [shouldResetShop, setShouldResetShop] = useState<number>(1) // 是否需要重置商店的选中

  const [selectPlatform, setSelectPlatform] = useState<any>({}) // 选中的平台优惠券
  const [selectShop, setSelectShop] = useState<any>({}) // 选中的店铺优惠券
  const [selectCommodity, setLectCommodity] = useState<any>({}) // 选中的商品优惠券
  const fnClosePopup = () => {
    if (fnClose) {
      fnClose()
    }
  }
  /**
   * @returns 返回skuid列表
   */
  const fnGetSkuIdList = () => {
    const skuIdList: Array<number> = []
    Object.keys(shopMessageStore).forEach((key) => {
      shopMessageStore[key].forEach((item: any) => {
        if (item.skuId && String(item.skuId).indexOf('_') > -1) {
          skuIdList.push(Number(item.skuId.split('_')[0]))
        } else {
          skuIdList.push(item.skuId)
        }
      })
    })
    return skuIdList
  }
  /**
   *  平台优惠券的选择
   * @param indexId 当前选中优惠券的id在所有选中的下的坐标
   * @param item
   */
  const fnPlatformCoupon = (indexId: number, item: any) => {
    if (!selectPlatform.onlyId) {
      // 平台优惠券没有被选择
      setSelectPlatform(item) // 设置平台优惠券
      couponIdListSelect.push(item.onlyId)
      setCouponIdListSelect([...couponIdListSelect])
    } else if (selectPlatform.onlyId === item.onlyId) {
      // 选择了 并且选择了同一张 将之取消
      setSelectPlatform({})
      couponIdListSelect.splice(indexId, 1)
      setCouponIdListSelect([...couponIdListSelect])
    } else {
      // 如果选择不是同一张平台优惠券，则提示
      Toast.show({
        title: intl.formatMessage({ id: 'confirmOrder_components_couponLayer_fnPlatfromCoupon_show' }),
        icon: 'none',
      })
    }
  }
  /**
   *  商店通用优惠券的选择
   * @param indexId 当前选中优惠券的id在所有选中的下的坐标
   * @param item
   */
  const fnShopCoupon = (indexId: number, item: any) => {
    const selectShopDesc = { ...selectShop } // 商城通用优惠券
    const keyName = `shopId_${item.memberId}_${item.roleId}`
    if (!selectShopDesc[keyName]) {
      // 还没有选择这商城优惠券
      selectShopDesc[keyName] = item
      setSelectShop(selectShopDesc) // 设置商城优惠券
      couponIdListSelect.push(item.onlyId) // 选中优惠券
      setCouponIdListSelect([...couponIdListSelect])
      // 还是选择了同一张平台优惠券，即取消
    } else if (selectShopDesc[keyName].onlyId === item.onlyId) {
      selectShopDesc[keyName] = null
      setSelectShop({ ...selectShopDesc })
      couponIdListSelect.splice(indexId, 1) // 删除这优惠券
      setCouponIdListSelect([...couponIdListSelect])
    } else if (selectShopDesc[keyName].id) {
      // 有商店通用 且有id
      Toast.show({
        title: intl.formatMessage({ id: 'confirmOrder_components_couponLayer_fnShopCoupon_show_1' }),
        icon: 'none',
      })
    } else {
      // 这个商店通用是因为选择了商品优惠券
      // Toast.show('商店通用优惠券和商品优惠券只能使用一种');
      Toast.show({
        title: intl.formatMessage({ id: 'confirmOrder_components_couponLayer_fnShopCoupon_show_2' }),
        icon: 'none',
      })
    }
  }
  /**
   *  商品优惠券的选中
   * @param indexId 当前选中优惠券的id在所有选中的下的坐标
   * @param item
   */
  const fnCommodity = (indexId: number, item: any) => {
    const selectShopDesc = { ...selectShop } // 商城通用优惠券
    const selectCommodityDesc = { ...selectCommodity } // 商品优惠券
    const keyName = `shopId_${item.memberId}_${item.roleId}` // 商城通用卷名称
    // 存在了选额商店通用卷
    if (selectShopDesc[keyName] && selectShopDesc[keyName].onlyId) {
      // ps 因为选择商品添加的商店通用 是没有couponId的
      Toast.show({
        title: intl.formatMessage({ id: 'confirmOrder_components_couponLayer_fnCommodity_show_1' }),
        icon: 'none',
      })
      return
    }
    // 这个商品优惠券所属的商店没选过优惠券
    if (!selectShopDesc[keyName] || !selectShopDesc[keyName].onlyId) {
      let skuIdName = '' // 商品优惠券名称
      const readySelectCommodity = Object.keys(selectCommodityDesc)
      const skuIdListDesc = fnGetSkuIdList()
      if (indexId > -1) {
        // 这张优惠券已经被选择了
        delete selectCommodityDesc[item.selectSkuId]
        // selectCommodityDesc[item.selectSkuId] = null; // 设置商品优惠券选择
        couponIdListSelect.splice(indexId, 1) // 删除这优惠券的id
        setCouponIdListSelect([...couponIdListSelect])
        setLectCommodity(selectCommodityDesc)
        setShouldResetShop(shouldResetShop + 1) // 删除了商品优惠券 重置一下商店优惠券
        return
      }
      item.suitableSkuIdList.forEach((newSkuId: string) => {
        // 能选择的优惠券skuId
        if (readySelectCommodity.indexOf(`${newSkuId}`) === -1 && !skuIdName) {
          // 已经选择的 并且没有选中这个
          if (skuIdListDesc.indexOf(Number(newSkuId)) > -1) {
            skuIdName = newSkuId
          }
        }
      })
      if (!skuIdName) {
        Toast.show({
          title: intl.formatMessage({ id: 'confirmOrder_components_couponLayer_fnCommodity_show_2' }),
          icon: 'none',
        })
        return
      }
      // if (indexId === -1) { // 这张优惠券并没有使用
      // eslint-disable-next-line no-param-reassign
      item.selectSkuId = skuIdName
      selectCommodityDesc[skuIdName] = item // 设置商品优惠券选择
      selectShopDesc[keyName] = {} // 因为选中商品优惠券，不能选商店通用 所以来占坑
      couponIdListSelect.push(item.onlyId) // 选中优惠券
      setCouponIdListSelect([...couponIdListSelect])
      setSelectShop({ ...selectShopDesc })
      setLectCommodity(selectCommodityDesc)
      // }
    }
  }
  /**
   * 修改选中优惠券
   * @param item 当前优惠券
   */
  const fnChangeCheck = (item: any) => {
    const indexId = couponIdListSelect.indexOf(item.onlyId)
    if (item.belongType === 1) {
      // 平台优惠券
      fnPlatformCoupon(indexId, item)
    } else if (item.type === 2) {
      // 商家通用优惠券
      fnShopCoupon(indexId, item)
    } else {
      // 商品优惠券
      fnCommodity(indexId, item)
    }
  }

  /**
   *  重置商店通用优惠券的选择
   * 因为不知道删除了商品优惠券，这个商店还有没有使用优惠券
   */
  const fnResetShopCoupon = () => {
    const obj: any = {}
    Object.keys(selectCommodity).forEach((keyName: string) => {
      if (selectCommodity[keyName]) {
        const shopKeyName = `shopId_${selectCommodity[keyName].memberId}_${selectCommodity[keyName].roleId}`
        obj[shopKeyName] = selectShop[shopKeyName] || {}
      }
    })
    setSelectShop({ ...obj })
  }

  useEffect(() => {
    fnResetShopCoupon()
  }, [shouldResetShop])

  /**
   * 确定选择优惠券
   */
  const fnDetermine = () => {
    const callBlackObj = [selectPlatform]
    Object.keys(selectShop).forEach((key) => {
      callBlackObj.push(selectShop[key])
    })
    Object.keys(selectCommodity).forEach((key) => {
      callBlackObj.push(selectCommodity[key])
    })
    fnDetermineCallCouponBlack(callBlackObj)
  }
  /**
   * 重置后台返回的最优选中信息
   */
  const resetCouponMessage = () => {
    const selectPlatformIndex = Object.keys(selectPlatform).length
    const selectShopIndex = Object.keys(selectShop).length
    const selectCommodityIndex = Object.keys(selectCommodity).length
    // 全部为0的时候 就是第一次打开的时候
    if (selectPlatformIndex === 0 && selectShopIndex === 0 && selectCommodityIndex === 0) {
      selectCoupon.forEach((item: any) => {
        if (!item.onlyId) {
          return
        }
        if (item.belongType === 1) {
          // 平台优惠券
          fnPlatformCoupon(-1, item)
        } else if (item.type === 2) {
          // 商家通用优惠券
          fnShopCoupon(-1, item)
        } else {
          // 商品优惠券
          fnCommodity(-1, item)
        }
      })
    }
  }
  useEffect(() => {
    if (showCouponLayer) {
      resetCouponMessage()
    }
  }, [showCouponLayer])
  /**
   * 重置一下优惠券的字段
   */
  const fnResetDataSource = () => {
    const dataSource = couponList.map((item: any) => {
      item.effectiveTimeEnd = item.validTimeEnd
      return item
    })
    return dataSource
  }
  return (
    <Popup visible={showCouponLayer} onClose={fnClosePopup}>
      <View className={styles['warp']}>
        <View className={styles['title']}>
          <Text className={styles['text']}>
            {intl.formatMessage({ id: 'confirmOrder_components_couponLayer_title' })}
          </Text>
        </View>
        <Text className={styles['tips']}>{intl.formatMessage({ id: 'confirmOrder_components_couponLayer_tips' })}</Text>
      </View>
      {couponList.length !== 0 && (
        <ScrollView className={styles['money-main']}>
          <Coupon.List
            dataSource={fnResetDataSource()}
            customRenderRight={(item: any) => (
              <Checkbox.Group
                onChange={() => {
                  fnChangeCheck(item)
                }}
                value={couponIdListSelect.indexOf(item.onlyId) > -1 ? [item.onlyId] : []}
              >
                <Checkbox value={item.onlyId} />
              </Checkbox.Group>
            )}
          />
        </ScrollView>
      )}
      {couponList.length === 0 && (
        <View className={`${styles['empty']} ${styles['section']}`}>
          <Image src={empty} style={{ width: pxTransform(160), height: pxTransform(120) }} />
          <Text className={styles.emptyText}>
            {intl.formatMessage({ id: 'confirmOrder_components_couponLayer_empty' })}
          </Text>
        </View>
      )}
      <View className={styles['footer-btn-warp']} onClick={fnDetermine}>
        {intl.formatMessage({ id: 'confirmOrder_components_couponLayer_footerBtnWarp' })}
      </View>
    </Popup>
  )
}

export default observer(CouponLayer)

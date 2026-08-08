import React, { useEffect, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, ScrollView, Checkbox, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Popup from '@/components/Popup'
import { useIntl } from '@linkseeks/i18n'
import { postOrderMobileCreateLrcList } from '@apps/apis'
import styles from './index.module.scss'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import isEmpty from 'lodash/isEmpty'

const empty = getOssUrlPath('/miniprogram/assets/images/empty.png')

export type PostOrderMobileCreateLrcListResponse = {
  /**
   * 供应会员Id
   */
  vendorMemberId: number
  /**
   * 供应会员角色Id
   */
  vendorRoleId: number
  /**
   * 供应会会员logo
   */
  vendorLogo: string
  /**
   * 供应会会员名称
   */
  vendorName: string
  /**
   * 积分类型：0=平台；1=会员
   */
  relType: number
  /**
   * 单个订单允许使用积分上限
   */
  userScoreLimit: number
  /**
   * 积分抵扣金额比例
   */
  deductionRate: number
  /**
   * 当前可用的权益积分=累计获得的权益积分-累计已用权益积分
   */
  currentPoint: number
  /**
   * 本单可用积分
   */
  enablePoint: number
  /**
   * 本单可抵扣
   */
  enableDeductionAmount: number
}

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  showIntegralLayer: boolean
  fnClose: Function
  shopMessageStore: any
  fnDetermineCallCouponBlack: Function
  allPrice: number | string
  selectCoupon: any
}

const IntegralLayer: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { showIntegralLayer, fnClose, shopMessageStore, allPrice, fnDetermineCallCouponBlack, selectCoupon } = props
  const [integralList, setIntegralList] = useState<any>([]) // 优惠券列表

  const [selectIntegralList, setSelectIntegralList] = useState<any>([]) // 选中的积分优惠券对象
  const [selectIntegralIdList, setSelectIntegralIdList] = useState<any>([]) // 选中的积分优惠券对象Id
  const [hasSelectPlatform, setHasSelectPlatform] = useState(false) // 平台积分是否选中

  const translate = useMobileIntl()

  const fnClosePopup = () => {
    if (fnClose) {
      fnClose()
    }
  }
  const fnDetermine = () => {
    fnDetermineCallCouponBlack(selectIntegralList)
  }

  /**
   * 获取积分券列表
   */
  const fnetIntegralList = () => {
    setSelectIntegralList([])
    setSelectIntegralIdList([])
    setHasSelectPlatform(false)
    const parmas: any = []
    const keyArr = Object.keys(shopMessageStore)
    let isGroupPurchasing = false
    keyArr.forEach((key: string) => {
      const obj = {
        vendorMemberId: '',
        vendorRoleId: '',
        memberAmount: 0, // 供应商商品总金额
        platformAmount: Number(allPrice), // 平台总金额
      }
      let selectCouponShop: any = {} // 选中的供应商优惠券
      shopMessageStore[key].forEach((item) => {
        if (item.isGroupPurchasing) {
          // 是否为评团
          isGroupPurchasing = true
        }
        selectCoupon.forEach((thisCoupon: any) => {
          if (thisCoupon && thisCoupon.roleId === item.memberRoleId && thisCoupon.memberId === item.memberId) {
            selectCouponShop = item
          }
        })
        if (obj.memberAmount === 0) {
          obj.vendorMemberId = item.memberId
          obj.vendorRoleId = item.memberRoleId
          obj.memberAmount += item.count * (item.estimatePrice || item.newPrice)
        } else {
          obj.memberAmount += item.count * (item.estimatePrice || item.newPrice)
        }
      })
      if (selectCouponShop.denomination) {
        obj.memberAmount -= selectCouponShop.denomination
      }
      if (obj.memberAmount > obj.platformAmount) {
        obj.memberAmount = obj.platformAmount
      }
      if (obj.vendorMemberId && obj.vendorRoleId) {
        parmas.push(obj)
      }
    })
    const itemList = {
      itemList: parmas,
    }
    if (isGroupPurchasing || parmas.length === 0) {
      // 拼团订单不能使用积分抵扣
      return
    }
    postOrderMobileCreateLrcList(itemList).then((res: any) => {
      if (res.code === 1000) {
        // message.destroy()
        // setIntegralList(res.data);
        setIntegralList(res.data)
      }
    })
  }

  /**
   * 修改选中积分
   * @param item 当前积分数据
   */
  const fnSelectIntegral = (item: any) => {
    const index = selectIntegralIdList.indexOf(item.vendorMemberId) // 判断是否已经选中
    if (item.relType === 0) {
      // 当前选中的说平台积分
      if (!hasSelectPlatform) {
        // 当前平台积分没选中
        if (selectIntegralIdList.length !== 0) {
          Toast.show({ title: translate('mobile.resource.order.pingtaijifenhehuiyuanjifen_tip'), icon: 'none' })
          return
        }
        setHasSelectPlatform(true)
        setSelectIntegralIdList([item.vendorMemberId])
        setSelectIntegralList([item])
      } else {
        // 当前已经选中平台积分,并且只有它 取消选中,重置为空
        setSelectIntegralIdList([])
        setSelectIntegralList([])
        setHasSelectPlatform(false)
      }
      return
    }
    if (hasSelectPlatform) {
      // message.error('平台积分和会员积分不可以同时使用');
      Toast.show({ title: translate('mobile.resource.order.pingtaijifenhehuiyuanjifen_tip'), icon: 'none' })
      return
    }
    // 下面是会员积分操作
    if (index === -1) {
      selectIntegralIdList.push(item.vendorMemberId)
      setSelectIntegralIdList([...selectIntegralIdList])
      selectIntegralList.push(item)
      setSelectIntegralList([...selectIntegralList])
    } else {
      selectIntegralIdList.splice(index, 1)
      setSelectIntegralIdList([...selectIntegralIdList])
      selectIntegralList.splice(index, 1)
      setSelectIntegralList([...selectIntegralList])
    }
  }

  useEffect(() => {
    if (!isEmpty(shopMessageStore)) {
      fnetIntegralList()
    }
  }, [selectCoupon])

  return (
    <Popup visible={showIntegralLayer} onClose={fnClosePopup}>
      <View className={styles['warp']}>
        <View className={styles['title']}>
          <Text className={styles['text']}>{translate('mobile.resource.order.keyongjifen')}</Text>
        </View>
      </View>
      <Checkbox.Group value={selectIntegralIdList}>
        {integralList.length !== 0 && (
          <ScrollView className={styles['money-main']}>
            {integralList.map((item: PostOrderMobileCreateLrcListResponse) => {
              return (
                <View
                  className={styles['integral-warp']}
                  key={item.vendorRoleId}
                  onClick={() => {
                    fnSelectIntegral(item)
                  }}
                >
                  <View className={styles['integral-title']}>
                    <View className={styles['integral-title-left']}>
                      {item.relType === 0 ? translate('mobile.resource.order.pingtaitongyongjifen') : item.vendorName}
                    </View>
                    <View className={styles['integral-title-right']}>
                      <View>
                        {translate('mobile.resource.order.dikou')}{' '}
                        <Text className={styles['integral-title-money']}>
                          {intl.formatMessage({ id: 'currency' })}
                          {item.enableDeductionAmount}
                        </Text>
                      </View>
                      <Checkbox size={12} value={item.vendorMemberId} />
                    </View>
                  </View>
                  <View className={styles['integral-tips']}>
                    {translate('mobile.resource.order.keyongjifen')}:{item.currentPoint}
                  </View>
                  <View className={styles['integral-tips']}>
                    {translate('mobile.resource.order.bendankeyongjifen')}: {item.enablePoint}
                  </View>
                </View>
              )
            })}
          </ScrollView>
        )}
      </Checkbox.Group>
      {integralList.length === 0 && (
        <View className={`${styles['empty']} ${styles['section']}`}>
          <Image src={empty} style={{ width: pxTransform(160), height: pxTransform(120) }} />
          <Text className={styles.emptyText}>
            {translate('mobile.resource.order.dangqianhaimeiyouzhichijifenyouhui')}
          </Text>
        </View>
      )}
      <View className={styles['footer-btn-warp']} onClick={fnDetermine}>
        {intl.formatMessage({ id: 'confirmOrder_components_couponLayer_footerBtnWarp' })}
      </View>
      {/* <FullScreenLoading /> */}
    </Popup>
  )
}

export default observer(IntegralLayer)

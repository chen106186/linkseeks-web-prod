import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image, Icons, ScrollView } from '@apps/mobile-ui'
import GlobalWrapper from '@/components/GlobalWrapper'
import { observer } from 'mobx-react-lite'
import styles from './index.module.scss'
import { useIntl } from '@linkseeks/i18n'
import {
  pxTransform,
  useRouter,
  setClipboardData,
  hideLoading,
  showLoading,
  showToast,
  showModal
} from '@apps/mobile-services/utils/taro'
import {
  getOrderMobileCbgTeamLeaderDeliveryDetail,
  postOrderMobileCbgTeamLeaderDeliveryConfirm,
} from '@apps/apis'
import Empty from '@/components/Empty'
import cx from 'classnames'

const TeamLeaderReceiptDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const { orderId, vendorMemberId } = useRouter().params
  const [detailsInfo, setDetailsInfo] = useState<any>({})
  const [goodsList, setGoodsList] = useState<any>([])
  // 自定义状态页面使用-statusStr备货中为1，statusStr配送中为2，statusStr已送达为3
  const [customizeStatus, setCustomizeStatus] = useState(1)
  const customizeStatusMap: Record<string, number> = {
    '备货中': 1,
    '配送中': 2,
    '已送达': 3,
  }

  useEffect(() => {
    getDetails()
  }, [])

  const getDetails = async () => {
    showLoading({
      title: intl.formatMessage({
        id: 'teamLeader.jiazaizhong',
        defaultMessage: '加载中',
      }),
      mask: true,
    })
    const params = {
      deliveryId: orderId,
      vendorMemberId: vendorMemberId
    }
    const res =  await getOrderMobileCbgTeamLeaderDeliveryDetail(params)
    hideLoading()
    if (res.code === 1000) {
      const data = res.data
      const mappedStatus = customizeStatusMap[data.statusStr]

      const updatedProducts = (data.products || []).map(item => {
        // 状态为配送中-默认收货数量为发货数量
        if (mappedStatus === 2) {
          return {
            ...item,
            received: item.delivered,
          }
        }
        return item
      })

      setDetailsInfo(data)
      setGoodsList(updatedProducts)

      if (mappedStatus) {
        setCustomizeStatus(mappedStatus)
      }
    } else {
      showToast({
        title: res?.message || intl.formatMessage({
          id: 'teamLeader.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    }
  }

  // 复制
  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        showToast({
          title: intl.formatMessage({
            id: 'teamLeader.neirongfuzhichenggong',
            defaultMessage: '内容复制成功',
          }),
          icon: 'none',
        })
      },
    })
  }


  const total = useMemo(() => {
    // 商品数量
    let totalQuantity = 0
    // 应收数量
    let totalDelivered = 0
    // 实收数量
    let totalReceived = 0

    goodsList.forEach(item => {
      const quantity = Number(item.quantity || 0)
      const delivered = Number(item.delivered || 0)
      const received = Number(item.received || 0)

      totalQuantity += quantity
      totalDelivered += delivered
      totalReceived += received
    })

    return { totalQuantity, totalDelivered, totalReceived }
  }, [goodsList])

  // 加减实收数量
  const onChangeReceived = (id, newValue) => {
    setGoodsList(prev => prev.map(item => (item.id === id ? { ...item, received: newValue } : item)))
  }

  // 确认收货
  const handleCheckClosed = () => {
    showModal({
      title: '',
      confirmText: intl.formatMessage({
        id: 'confirm',
        defaultMessage: '确认',
      }),
      cancelText: intl.formatMessage({
        id: 'cancel',
        defaultMessage: '取消',
      }),
      content: intl.formatMessage({
        id: 'teamLeader.shifouquerenshouhuo',
        defaultMessage: '是否确认收货？',
      }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          const id = detailsInfo.id
          const products = goodsList.map(item => ({
            id: item.id,
            num: item.received
          }))
          const params = {
            id,
            products
          }
          postOrderMobileCbgTeamLeaderDeliveryConfirm(params).then(res => {
            if (res.code === 1000) {
              showToast({
                title: res.message,
                icon: 'none',
              })
              setTimeout(() => {
                getDetails()
              }, 800)
            } else {
              showToast({
                title: res.message,
                icon: 'none',
              })
            }
          })
        }
      },
    })
  }

  const renderGoodsItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View className={cx(styles['details-box-item'], styles[`details-box-item-status-${customizeStatus}`])} key={index}>
        <View className={styles['col-name']}>
          <View className={styles['item-info']}>
            <View className={styles['item-info-left']}></View>
            <Image className={styles['item-info-left-img']} src={item.productImage} />
            <View className={cx(styles['item-info-right'], styles[`item-info-right-status-${customizeStatus}`])}>
              <Text className={styles['item-info-right-text']}>{item.name}</Text>
              <Text className={styles['item-info-right-text2']}>{item.spec}</Text>
            </View>
          </View>
        </View>
        {/* 数量 */}
        {customizeStatus === 1 && <View className={styles['col-number']}>{item.quantity || 0}</View>}
        {/* 应收 */}
        {customizeStatus !== 1 && <View className={styles['col-number']}>{item.delivered || 0}</View>}
        {/* 配送中-实收 */}
        {customizeStatus == 2 && (
          <View className={styles['col-calculation']}>
            <Icons
              name="Minus"
              size={16}
              color={Number(item.received) <= 0 ? '#C8CACD' : '#252D37'}
              onClick={() => {
                if (item.received > 0) {
                  onChangeReceived(item.id, item.received - 1)
                }
              }}
            />
            <View className={styles['item-calculation-box']}>{item.received || 0}</View>
            <Icons
              name="Plus"
              size={16}
              color={item.received >= item.delivered ? '#C8CACD' : '#252D37'}
              onClick={() => {
                // 是否小于应收
                if (item.received < item.delivered) {
                  onChangeReceived(item.id, item.received + 1)
                }
              }}
            />
          </View>
        )}
        {/* 已送达-实收 */}
        {customizeStatus == 3 && <View className={styles['col-number']}>{item.received || 0}</View>}
      </View>
    )
  }

  return (
    <View className={styles['receipt-details']}>
      <View className={styles['top']}>
        <Text className={styles['top-title']}>
          {detailsInfo?.statusStr}
        </Text>
      </View>
      <View className={styles['info']}>
        <View className={styles['info-item']}>
          <Text className={styles['info-item-left']}>
            {intl.formatMessage({ id: 'teamLeader.shouhuodanhao', defaultMessage: '收货单号：' })}
          </Text>
          <Text className={styles['info-item-text']}>{detailsInfo?.deliveryNo}</Text>
        </View>
        <View className={styles['info-item']}>
          <Text className={styles['info-item-left']}>
            {intl.formatMessage({ id: 'teamLeader.shouhuodizhi', defaultMessage: '收货地址：' })}
          </Text>
          <View className={styles['info-item-right']}>
            <Text className={styles['info-item-text2']}>{detailsInfo?.pickupPointName}</Text>
            <Text className={styles['info-item-text3']}>{detailsInfo?.pickupPointAddress}</Text>
          </View>
        </View>
        {customizeStatus !== 1 && (
          <View>
            <View className={styles['info-item']}>
              <Text className={styles['info-item-left']}>
                {intl.formatMessage({ id: 'teamLeader.fahuoshangjia', defaultMessage: '发货商家：' })}
              </Text>
              <Text className={styles['info-item-text']}>{detailsInfo?.vendorName}</Text>
            </View>
            <View className={styles['info-item']}>
              <Text className={styles['info-item-left']}>
                {intl.formatMessage({ id: 'teamLeader.wuliugongsi', defaultMessage: '物流公司：' })}
              </Text>
              <Text className={styles['info-item-text']}>{detailsInfo?.company}</Text>
            </View>
            <View className={styles['info-item']}>
              <Text className={styles['info-item-left']}>
                {intl.formatMessage({ id: 'teamLeader.wuliudanhao', defaultMessage: '物流单号：' })}
              </Text>
              <Text className={styles['info-item-text4']}>{detailsInfo?.logisticsNo}</Text>
              <Text
                style={{ color: '#303133', fontSize: pxTransform(12), fontWeight: 400 }}
                onClick={() => clipboard(detailsInfo?.logisticsNo)}
              >
                {intl.formatMessage({ id: 'teamLeader.fuzhi', defaultMessage: '复制' })}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles['details']}>
        <View className={styles['details-top']}>
          <View className={styles['details-top-line']}></View>
          <View className={styles['details-top-title']}>
            {customizeStatus !== 1
              ? intl.formatMessage({ id: 'teamLeader.shouhuomingxi', defaultMessage: '收货明细' })
              : intl.formatMessage({ id: 'teamLeader.weibeishangpinhuomingxi', defaultMessage: '未备商品货明细' })}
          </View>
        </View>

        <View className={cx(styles['details-row'], styles[`details-row-status-${customizeStatus}`])}>
          <View className={styles['col-name']}>
            {intl.formatMessage({ id: 'teamLeader.shangpinmingcheng', defaultMessage: '商品名称' })}
          </View>
          {customizeStatus === 1 && (
            <View className={styles['col-number']}>
              {intl.formatMessage({ id: 'teamLeader.shuliang', defaultMessage: '数量' })}
            </View>
          )}
          {customizeStatus !== 1 && (
            <View className={styles['col-number']}>
              {intl.formatMessage({ id: 'teamLeader.yingshou', defaultMessage: '应收' })}
            </View>
          )}
          {customizeStatus !== 1 &&
            (customizeStatus === 2 ? (
              <View className={styles['col-calculation']}>
                {intl.formatMessage({ id: 'teamLeader.shishou', defaultMessage: '实收' })}
              </View>
            ) : (
              <View className={styles['col-number']}>
                {intl.formatMessage({ id: 'teamLeader.shishou', defaultMessage: '实收' })}
              </View>
            ))}
        </View>
        <View
          className={styles['details-box']}
          style={{
            height: '100%',
            maxHeight: customizeStatus === 3 ? pxTransform(280) : customizeStatus === 2 ? pxTransform(272) : pxTransform(390),
          }}
        >
          <ScrollView
            scrollY
            data={goodsList}
            style={{ height: '100%' }}
            className={styles['scroll-list']}
            renderItem={renderGoodsItem}
            listEmptyComponent={<Empty />}
          ></ScrollView>
        </View>
      </View>

      {customizeStatus !== 2 && (
        <View className={styles['amount']}>
          <Text className={styles['amount-title']}>
            {intl.formatMessage({ id: 'teamLeader.zongji', defaultMessage: '总计' })}
          </Text>
          <View className={styles['amount-item']}>
            <Text className={styles['amount-item-text']}>
              {customizeStatus === 1
                ? intl.formatMessage({ id: 'teamLeader.shangpinshuliang', defaultMessage: '商品数量' })
                : intl.formatMessage({ id: 'teamLeader.yingshoushuliang', defaultMessage: '应收数量' })}
            </Text>
            <Text className={styles['amount-item-text']}>
              {customizeStatus === 1 ? total.totalQuantity : total.totalDelivered}
            </Text>
          </View>
          {customizeStatus === 3 && (
            <View className={styles['amount-item']}>
              <Text className={styles['amount-item-text']}>
                {intl.formatMessage({ id: 'teamLeader.shishoushuliang', defaultMessage: '实收数量' })}
              </Text>
              <Text className={styles['amount-item-text']}>{total.totalReceived}</Text>
            </View>
          )}
        </View>
      )}

      {customizeStatus === 2 && (
        <View className={styles['bottom']}>
          <View className={styles['bottom-title']}>
            {intl.formatMessage({ id: 'teamLeader.zongjiyingshou', defaultMessage: '总计应收：' })}
            <Text style={{ color: '#EF3346' }}>{total.totalDelivered}</Text>
            {intl.formatMessage({ id: 'teamLeader.jian', defaultMessage: '件，' })}
            {intl.formatMessage({ id: 'teamLeader.shishou', defaultMessage: '实收：' })}
            <Text style={{ color: '#EF3346' }}>{total.totalReceived}</Text>
            {intl.formatMessage({ id: 'teamLeader.jian', defaultMessage: '件' })}
          </View>
          <View className={styles['bottom-btn']} onClick={() => handleCheckClosed()}>
            {intl.formatMessage({
              id: 'teamLeader.shuliangyiheduiquerenshouhuo',
              defaultMessage: '数量已核对，确认收货',
            })}
          </View>
        </View>
      )}
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderReceiptDetail))

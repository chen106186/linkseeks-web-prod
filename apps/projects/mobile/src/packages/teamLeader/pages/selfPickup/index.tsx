import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, Icons } from '@apps/mobile-ui'
import { getOrderMobileCbgTeamLeaderBuyerOrderDetail, getOrderMobileCbgTeamLeaderOrderNotice } from '@apps/apis'
import styles from './index.module.scss'
import {
  pxTransform,
  setClipboardData,
  useRouter,
  showLoading,
  hideLoading,
  showToast,
  showModal,
} from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import Router from '@/utils/router'
import { createQrCodeImg } from '../../utils/qrcode.js'

const TeamLeaderSelfPickup: React.FC<{}> = () => {
  const intl = useIntl()

  const { orderId } = useRouter().params

  const splitPrice = (price: number | string): { intPart: string; decimalPart: string } => {
    if (price == null || price === '') {
      return { intPart: '0', decimalPart: '.00' }
    }
    const num = Number(price)
    if (isNaN(num)) return { intPart: String(price), decimalPart: '' }
    const str = String(price)
    const [rawInt, rawDec = ''] = str.split('.')
    // 截断小数点后两位，不四舍五入
    const truncatedDecimal = rawDec.slice(0, 2).padEnd(2, '0')
    // 整数部分加千分位
    const formattedInt = Number(rawInt).toLocaleString()
    return {
      intPart: formattedInt,
      decimalPart: `.${truncatedDecimal}`,
    }
  }

  /* 生成二维码 */
  const fnGetQrCode = (code) => {
    return createQrCodeImg(code, {
      typeNumber: 1,
      size: 112,
      errorCorrectLevel: 'L',
    })
  }

  useEffect(() => {
    getOrderDetail()
  }, [])

  const [orderDetailInfo, setOrderDetailInfo] = useState<any>({})
  const [isPickup, setIsPickup] = useState<any>(false)

  const getOrderDetail = async () => {
    showLoading({
      title: intl.formatMessage({
        id: 'teamLeader.jiazaizhong',
        defaultMessage: '加载中',
      }),
      mask: true,
    })
    const res = await getOrderMobileCbgTeamLeaderBuyerOrderDetail({ orderId: orderId! })
    hideLoading()
    if (res.code === 1000) {
      const data = res.data
      setOrderDetailInfo(data)
      setIsPickup(data?.receiverPickupName)
    } else {
      showToast({
        title:
          res.message ||
          intl.formatMessage({
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

  // 金额收缩/展开
  const [amountExpanded, setAmountExpanded] = useState(true)
  // 订单信息收缩/展开
  const [infoExpanded, setInfoExpanded] = useState(true)

  const handleTake = () => {
    Router.navigateTo('teamLeader/agentPickup', { orderId: orderDetailInfo?.orderId, enterType: 2 })
  }

  // 到货通知
  const handleNotice = () => {
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
        id: 'teamLeader.shifouquerentongzhi',
        defaultMessage: '是否确认通知？',
      }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          getOrderMobileCbgTeamLeaderOrderNotice({ orderId: orderDetailInfo?.orderId }).then((res) => {
            if (res.code === 1000) {
              showToast({
                title: res.message,
                icon: 'none',
              })
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

  return (
    <View className={styles['self-pickup']}>
      <View className={styles['pickup-top']}>
        <Text className={styles['pickup-top-title']}>{orderDetailInfo?.statusStr}</Text>
      </View>
      {/*style={{paddingBottom: orderDetailInfo?.statusStr === "" ? pxTransform(80) : pxTransform(8)}}*/}
      <View
        className={styles['self']}
        style={{
          paddingBottom:
            orderDetailInfo?.statusStr === '待取货' || orderDetailInfo?.statusStr === '待收货'
              ? pxTransform(80)
              : pxTransform(8),
        }}
      >
        <View className={styles['self-top']}>
          <View style={{ marginBottom: pxTransform(16) }} className={styles['self-top-row']}>
            <Text>
              {intl.formatMessage({ id: 'teamLeader.tihuoren', defaultMessage: isPickup ? '提货人：' : '收货人：' })}
            </Text>
            <Text>
              {isPickup ? orderDetailInfo?.receiverPickupName : orderDetailInfo?.consignee}{' '}
              {isPickup ? orderDetailInfo?.receiverPickupPhone : orderDetailInfo?.phone}
            </Text>
          </View>
          <View className={styles['self-top-row']}>
            <Text>
              {intl.formatMessage({ id: 'teamLeader.tihuodian', defaultMessage: isPickup ? '提货点：' : '收货点：' })}
            </Text>
            <View className={styles['self-top-row-view']}>
              <Text>{isPickup ? orderDetailInfo?.pickupPointName : ''}</Text>
              <Text
                className={styles['row-view-text']}
                style={{ marginTop: isPickup ? pxTransform(8) : pxTransform(0) }}
              >
                {orderDetailInfo?.areaName}
                {orderDetailInfo?.address}
              </Text>
            </View>
          </View>
        </View>
        {/* checkStatus 核销状态 1-待核销 2-已核销。 已核销不展示 */}
        {orderDetailInfo?.checkCode && (
          <View className={styles['self-code']}>
            <Text className={styles['self-code-text1']}>
              {intl.formatMessage({ id: 'teamLeader.daihexiao', defaultMessage: '待核销' })}
            </Text>
            <Image className={styles['self-code-img']} src={fnGetQrCode(orderDetailInfo?.checkCode)} />
            <Text className={styles['self-code-text2']}>{orderDetailInfo?.checkCode}</Text>
          </View>
        )}
        <View className={styles['self-commodity']}>
          <View className={styles['self-commodity-top']}>
            <Image className={styles['commodity-top-img']} src={orderDetailInfo?.storeLogo} />
            <Text>{orderDetailInfo?.storeName}</Text>
          </View>
          {(orderDetailInfo?.products || []).map((item: any) => (
            <View className={styles['self-commodity-box']} key={item.orderProductId}>
              <View className={styles['box-row']}>
                <View className={styles['box-row-left']}>
                  <Image className={styles['box-row-img']} src={item.logo} />
                </View>
                <View className={styles['box-row-info']}>
                  <Text className={styles['row-info-text']}>{item.name}</Text>
                  <Text className={styles['row-info-text2']}>{item.spec}</Text>
                  <View className={styles['row-info-btm']}>
                    <View className={styles['info-btm-number']}>
                      <Text style={{ color: '#ef3346', fontSize: pxTransform(12) }}>
                        {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                      </Text>
                      <Text style={{ color: '#ef3346', fontSize: pxTransform(16) }}>
                        {splitPrice(item.refPrice).intPart}
                      </Text>
                      <Text style={{ color: '#ef3346', fontSize: pxTransform(12) }}>
                        {/*取小数位*/}
                        {splitPrice(item.refPrice).decimalPart}
                      </Text>

                      <Text style={{ color: '#91959b', fontSize: pxTransform(10), fontWeight: 400 }}>
                        / {item.unit}
                      </Text>
                    </View>
                    <Text className={styles['info-btm-text']}>x{item.quantity}</Text>
                  </View>
                </View>
              </View>
              <View className={styles['box-btm']}>
                <Text style={{ marginRight: pxTransform(16) }}>
                  {intl.formatMessage({ id: 'teamLeader.yongjinbili', defaultMessage: '佣金比例' })}
                </Text>
                <Text style={{ marginRight: pxTransform(16) }}>{item.commissionRate}%</Text>
                <Text style={{ marginRight: pxTransform(16) }}>
                  {intl.formatMessage({ id: 'teamLeader.yongjinjine', defaultMessage: '佣金金额' })}
                </Text>
                <Text style={{ marginRight: pxTransform(16) }}>
                  {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                  {item.commissionAmount}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles['self-amount']}>
          <View className={styles['self-amount-top']}>
            <Text className={styles['amount-top-text']}>
              {intl.formatMessage({ id: 'teamLeader.jine', defaultMessage: '金额' })}
            </Text>
            <View className={styles['amount-top-right']} onClick={() => setAmountExpanded(!amountExpanded)}>
              <Text style={{ marginRight: pxTransform(4) }}>
                {intl.formatMessage({
                  id: amountExpanded ? 'teamLeader.shousuo' : 'teamLeader.chakangengduo',
                  defaultMessage: amountExpanded ? '收起' : '查看更多',
                })}
              </Text>
              <Icons name={amountExpanded ? 'ChevronUp' : 'ChevronDown'} size={12} color="#91959b" />
            </View>
          </View>
          {amountExpanded && (
            <View style={{ marginTop: pxTransform(16) }}>
              <View className={styles['self-amount-row']} style={{ marginBottom: pxTransform(12) }}>
                <Text className={styles['amount-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.shifujine', defaultMessage: '实付金额' })}
                </Text>
                <View className={styles['amount-row-text2']}>
                  {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                  <Text style={{ fontSize: pxTransform(14) }}>{splitPrice(orderDetailInfo?.totalAmount).intPart}</Text>
                  <Text>{splitPrice(orderDetailInfo?.totalAmount).decimalPart}</Text>
                </View>
              </View>
              <View className={styles['self-amount-row']}>
                <Text className={styles['amount-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.yongjinjine', defaultMessage: '佣金金额' })}
                </Text>
                <View className={styles['amount-row-text2']}>
                  {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                  <Text style={{ fontSize: pxTransform(14) }}>
                    {splitPrice(orderDetailInfo?.commissionAmount).intPart}
                  </Text>
                  <Text>{splitPrice(orderDetailInfo?.commissionAmount).decimalPart}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View className={styles['self-info']}>
          <View className={styles['self-info-top']}>
            <Text className={styles['info-top-text']}>
              {intl.formatMessage({ id: 'teamLeader.dingdanxinxi', defaultMessage: '订单信息' })}
            </Text>
            <View className={styles['info-top-right']} onClick={() => setInfoExpanded(!infoExpanded)}>
              <Text style={{ marginRight: pxTransform(4) }}>
                {intl.formatMessage({
                  id: infoExpanded ? 'teamLeader.shousuo' : 'teamLeader.chakangengduo',
                  defaultMessage: infoExpanded ? '收起' : '查看更多',
                })}
              </Text>
              <Icons name={infoExpanded ? 'ChevronUp' : 'ChevronDown'} size={12} color="#91959b" />
            </View>
          </View>
          {infoExpanded && (
            <View>
              <View className={styles['self-info-row']}>
                <Text className={styles['info-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.dingdanbianhao', defaultMessage: '订单编号' })}
                </Text>
                <View className={styles['info-row-right']}>
                  <Text className={styles['info-row-text2']} style={{ marginRight: pxTransform(4) }}>
                    {orderDetailInfo?.orderNo}
                  </Text>
                  <Icons name="Copy" size={12} color="#C8CACD" onClick={() => clipboard(orderDetailInfo?.orderNo)} />
                </View>
              </View>
              <View className={styles['self-info-row']}>
                <Text className={styles['info-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.dingdanzhaiyao', defaultMessage: '订单摘要' })}
                </Text>
                <Text className={styles['info-row-text2']}>{orderDetailInfo?.digest}</Text>
              </View>
              <View className={styles['self-info-row']}>
                <Text className={styles['info-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.dingdanbezhu', defaultMessage: '订单备注' })}
                </Text>
                <Text className={styles['info-row-text2']}>{orderDetailInfo?.requirement?.remark}</Text>
              </View>
              <View className={styles['self-info-row']}>
                <Text className={styles['info-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.fapiao', defaultMessage: '发票' })}
                </Text>
                <View className={styles['info-row-right']}>
                  {orderDetailInfo?.invoiceTitle && (
                    <>
                      <Text className={styles['info-row-text2']}>{orderDetailInfo?.invoiceTitle}</Text>
                      <Icons name="ChevronRight" size={12} color="#C8CACD" />
                    </>
                  )}
                </View>
              </View>
              <View className={styles['self-info-row']}>
                <Text className={styles['info-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.xiadanshijian', defaultMessage: '下单时间' })}
                </Text>
                <Text className={styles['info-row-text2']}>{orderDetailInfo?.createTime}</Text>
              </View>
              <View className={styles['self-info-row']}>
                <Text className={styles['info-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.laiyuanshangcheng', defaultMessage: '来源商城' })}
                </Text>
                <Text className={styles['info-row-text2']}>{orderDetailInfo?.shopName}</Text>
              </View>
            </View>
          )}
        </View>

        {orderDetailInfo?.statusStr === '待取货' && (
          <View className={styles['self-btm']}>
            <View className={styles['self-btm-btn1']} onClick={() => handleTake()}>
              {intl.formatMessage({ id: 'teamLeader.daikequhuo', defaultMessage: '代客取货' })}
            </View>
            <View className={styles['self-btm-btn2']} onClick={() => handleNotice()}>
              {intl.formatMessage({ id: 'teamLeader.daohuotongzhi', defaultMessage: '到货通知' })}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderSelfPickup))

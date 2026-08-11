import React, { useEffect, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { isWeChat } from '@/utils'
import { IS_WEB } from '@/constants'
import classNames from 'classnames'
import { View, Text, Icons, Image, CountDown, Button, Toast } from '@apps/mobile-ui'
import useWxConfig from '@/hooks/useWxConfig'
import ImageBox from '@/components/ImageBox'
import Router from '@/utils/router'
import useCustomerService from '@/hooks/useCustomerService'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
import cStyles from '../Card/index.module.scss'
import Card from '../Card/index'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import { createQrCodeImg } from '../utils/qrcode'

interface Iprops {
  dataSource?: any
  outerStatusName: string
  fnClosePayType?: any
  fnShowTime?: any
  getDisplayInvoice: (value: any) => void
  showAfterSale?: boolean
  noBtn?: boolean
  totalAmount?: string
  countdown: any
  hasLogisticsSummary?: boolean
}

// const { customerServiceInfo } = GlobalConfig.global;
const customerServiceInfo = {}

const StaySubmit = (props: Iprops) => {
  const { wxConfig } = useWxConfig()
  const {
    dataSource = {},
    outerStatusName,
    fnClosePayType,
    fnShowTime,
    getDisplayInvoice,
    showAfterSale,
    noBtn,
    totalAmount,
    hasLogisticsSummary,
    countdown = {
      itemList: [],
    },
  } = props
  const intl = useIntl()
  const { routerToCustomerService } = useCustomerService()
  const [payStatus, setPayStatus] = useState<boolean>(false)
  const [orderStatus, setOrderStatus] = useState<boolean>(false)
  const [btnFlag, setBtnFlag] = useState<boolean>(false)
  const translate = useMobileIntl()

  /* 生成二维码 */
  const fnGetQrCode = (code) => {
    return createQrCodeImg(code, {
      typeNumber: 1,
      size: 112,
      errorCorrectLevel: 'L',
    })
  }

  console.log(dataSource, 'dataSource')
  /* 传入组件节点 */
  const btnNode = (id: number) =>
    showAfterSale ? (
      <View
        onClick={() =>
          Router.navigateTo('afterService/afterTodo/applyAs', {
            orderId: dataSource.orderId,
            orderMode: dataSource.orderMode,
          })
        }
        style={{
          borderWidth: pxTransform(1),
          borderColor: '#E3E4E5',
          padding: '2px 10px',
          borderRadius: pxTransform(3),
        }}
      >
        <Text style={{ fontSize: pxTransform(12) }}>
          {intl.formatMessage({ id: 'order.shenqingshouhou', defaultMessage: '申请售后' })}
        </Text>
      </View>
    ) : null

  const goJump = (infos?: {}) => {
    Router.navigateTo('order/payList', infos)
  }
  /* 显示发票 */
  const displayInvoice = () => {
    if (dataSource.invoiceTitle) {
      getDisplayInvoice(true)
    }
  }

  let flag = false

  dataSource.products &&
    dataSource.products.forEach((i) => {
      if (i.deliverType === 3) {
        flag = true
      }
    })

  const arr = [
    {
      title: intl.formatMessage({ id: 'order.dingdanbianhao', defaultMessage: '订单编号' }),
      value: dataSource.orderNo,
    },
    {
      title: intl.formatMessage({ id: 'order.duiyingbaojiadanhao', defaultMessage: '对应报价单号' }),
      value: dataSource.quoteNo,
    },
    { title: intl.formatMessage({ id: 'order.dingdanzhaiyao', defaultMessage: '订单摘要' }), value: dataSource.digest },
    {
      title: intl.formatMessage({ id: 'order.songhuoshijian', defaultMessage: '送货时间' }),
      value: dataSource.deliverDate,
      fn: fnShowTime,
    },
    {
      title: intl.formatMessage({ id: 'order.dingdanbeizhu', defaultMessage: '订单备注' }),
      value: dataSource.requirement?.remark,
    },
    {
      title: intl.formatMessage({ id: 'order.baozhuangyaoqiu', defaultMessage: '包装要求' }),
      value: dataSource.requirement?.pack,
    },
    {
      title: intl.formatMessage({ id: 'order.fapiao', defaultMessage: '发票' }),
      value: dataSource.invoiceTitle,
      fn: displayInvoice,
    },
    {
      title: intl.formatMessage({ id: 'order.xiadanshijian', defaultMessage: '下单时间' }),
      value: dataSource.createTime?.split(' ')[0],
    },
    {
      title: intl.formatMessage({ id: 'order.laiyuanshangcheng', defaultMessage: '来源商城' }),
      value: dataSource.shopName,
    },
  ]

  if (flag) {
    arr.splice(3, 1)
  }

  const arrMore = [
    {
      title: intl.formatMessage({ id: 'order.zhifufangshi', defaultMessage: '支付方式' }),
      value: dataSource.payChannelName,
    },
    {
      title: intl.formatMessage({ id: 'order.zhifushijian', defaultMessage: '支付时间' }),
      value: dataSource.payTime?.split(' ')[0],
    },
    { title: intl.formatMessage({ id: 'order.zhifucishu', defaultMessage: '支付次数' }), value: dataSource.payTimes },
    {
      title: intl.formatMessage({ id: 'order.zhifuxinxi', defaultMessage: '支付信息' }),
      value: intl.formatMessage({ id: 'order.zhakanxinxi', defaultMessage: '查看信息' }),
      fn: () => goJump({ orderId: dataSource.orderId }),
    },
    {
      title: intl.formatMessage({ id: 'order.fahuoshijian', defaultMessage: '发货时间' }),
      value: dataSource.deliverTime?.split(' ')[0],
    },
    {
      title: intl.formatMessage({ id: 'order.shouhuoshijian', defaultMessage: '收货时间' }),
      value: dataSource.receiptTime?.split(' ')[0],
    },
    {
      title: intl.formatMessage({ id: 'order.dingdanguidangshijian', defaultMessage: '订单归档时间' }),
      value: dataSource.archiveTime?.split(' ')[0],
    },
  ].filter((v) => v.value)
  const listView = (item, index) => {
    return (
      <View className={styles['cell-iem']} key={`${item.title}_${index}`} onClick={() => (item.fn ? item.fn() : {})}>
        <Text className={styles['cell-name']}>{item.title}</Text>
        <Text
          className={classNames(
            styles['cell-text'],
            item.title !== intl.formatMessage({ id: 'order.dingdanbeizhu', defaultMessage: '订单备注' }) &&
              styles['ellipsis'],
          )}
        >
          {item.value}
          {item.fn && <Icons name="ChevronRight" size={12} />}
        </Text>
      </View>
    )
  }

  // 拼团dom
  const CountDom = () => {
    let secKillEndTime = 0
    const currentTimestamp = new Date().valueOf()
    let num: any
    if (countdown) {
      secKillEndTime = Math.ceil((countdown.endTime - currentTimestamp) / 1000)
      num = countdown.num
    }
    return (
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CountDown count={secKillEndTime}>
          {(time, formatTime) => {
            const { formatTimeString } = formatTime
            setBtnFlag(time > 0 ? false : true)
            const [hour, minute, second] = formatTimeString.split(':')

            return (
              <View className={styles['countDown']}>
                {time > 0 && (
                  <Text className={styles['countDownTitle']}>
                    {intl.formatMessage({ id: 'order.haicha', defaultMessage: '还差' })}
                    <Text className={styles['countDownTitle']} style={{ color: 'red' }}>{`${
                      countdown.assembleNum - num
                    }${intl.formatMessage({ id: 'order.ren', defaultMessage: '人' })}`}</Text>
                    {intl.formatMessage({ id: 'order.pincheng', defaultMessage: '拼成' })}
                  </Text>
                )}
                <View className={styles['time']}>
                  {(time > 0 && (
                    <>
                      <Text className={styles['timeUnit']}>
                        {intl.formatMessage({ id: 'order.shengyu', defaultMessage: '剩余' })}
                      </Text>
                      <Text className={styles['timeUnit']}>{hour}</Text>
                      <Text className={styles['splitCode']}>:</Text>
                      <Text className={styles['timeUnit']}>{minute}</Text>
                      <Text className={styles['splitCode']}>:</Text>
                      <Text className={styles['timeUnit']}>{second}</Text>
                    </>
                  )) || (
                    <Text className={styles['countDownTitle']}>
                      {intl.formatMessage({ id: 'order.yiguoqi', defaultMessage: '已过期' })}
                    </Text>
                  )}
                </View>
              </View>
            )
          }}
        </CountDown>
      </View>
    )
  }

  const uriErrIcon = '/cry.png'
  const uriSussIcon = getOssUrlPath('/Images/select.png')

  const handleShare = (key: 'wechat' | 'wechatMoment' | 'qq') => {
    if (!IS_WEB) return
    if (!isWeChat()) {
      Toast.show({ title: translate('mobile.common.qingzaiweixinxiashiyong'), icon: 'none' })
      return
    }
    wxConfig()
    Toast.show({ title: translate('mobile.common.qingdianjiyoushangjiao'), icon: 'none' })
    const prefix = `${window.location.origin}/#/packages/commodityMerge/pages/stocksSourcing/shareGroupDetail/index`
    const url = `${prefix}?commodityId=${dataSource?.products[0].productId}&teamId=${dataSource?.groupId}&shopId=${dataSource?.shopId}&shopType=1&skuId=${dataSource.products[0].skuId}`
    const shareData = {
      link: url,
      title: `${dataSource?.products[0].refPrice}`,
      desc: `${intl.formatMessage({ id: 'order.yuanjia', defaultMessage: '原价：' })}${dataSource?.products[0].price} ${
        countdown?.assembleNum
      }${intl.formatMessage({ id: 'order.rentuanzhixu', defaultMessage: '人团 只需' })}${
        dataSource?.products[0].refPrice
      }${intl.formatMessage({ id: 'order.yuan', defaultMessage: '元' })}`,
      imgUrl: `${dataSource.products[0]?.logo}`,
      success: function () {
        console.log('success')
      },
      fail: function (e) {
        console.log('error', e)
      },
    }
    wx.ready(function () {
      wx.updateAppMessageShareData({ ...shareData })
      wx.updateTimelineShareData({ ...shareData })
    })
  }

  return (
    <View style={{ flexDirection: 'column', paddingLeft: pxTransform(10), paddingRight: pxTransform(10) }}>
      {(outerStatusName === translate('mobile.resource.order.daizhifu') ||
        outerStatusName === translate('mobile.resource.order.querenweidaozhang')) && (
        <View className={styles.cell} style={{ marginBottom: pxTransform(12) }}>
          <View
            className={styles['head-cell']}
            onClick={() => !!dataSource.payTimes && goJump({ orderId: dataSource.orderId })}
          >
            <Text className={styles['head-cell-text']}>
              {intl.formatMessage({ id: 'order.zhifuxinxi', defaultMessage: '支付信息' })}
              {!!dataSource.payTimes &&
                `(${intl.formatMessage({ id: 'order.di', defaultMessage: '第' })}${dataSource.payTag}/${
                  dataSource.payTimes
                })`}
            </Text>
            <View>
              <View className={styles['cell-show-item']}>
                <Icons name="ChevronRight" size={12} />
              </View>
            </View>
          </View>
          <View className={styles['cell-iem']} style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}>
            <Text className={styles['cell-name']}>
              {intl.formatMessage({ id: 'order.xufukuan', defaultMessage: '需付款：' })}
            </Text>
            <Text className={styles['cell-text']}>
              {!(dataSource?.orderMode === 10 || dataSource?.orderMode === 11) && (
                <Text className={cStyles.color}>{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}</Text>
              )}
              <Text
                className={cStyles.price}
                style={dataSource?.orderMode === 10 || dataSource?.orderMode === 11 ? { color: '#EB9B00' } : {}}
              >
                {`${Number(totalAmount?.split('.')[0])
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              </Text>
              <Text
                className={cStyles.color}
                style={dataSource?.orderMode === 10 || dataSource?.orderMode === 11 ? { color: '#EB9B00' } : {}}
              >
                {dataSource?.orderMode === 10 || dataSource?.orderMode === 11
                  ? intl.formatMessage({ id: 'order.jifen', defaultMessage: '积分' })
                  : `.${totalAmount?.split('.')[1]}`}
              </Text>
            </Text>
          </View>
          {!noBtn && (
            <View className={styles['cell-iem']} onClick={() => fnClosePayType?.()}>
              <View className={styles['pay-btn']}>
                <Text style={{ color: '#fff', fontSize: pxTransform(12) }}>
                  {intl.formatMessage({ id: 'order.quzhifu', defaultMessage: '去支付' })}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
      {/* 地址 */}
      {dataSource.receiverPickupName ? (
        <View className={styles['self-pickup']}>
          <View className={styles['self-pickup-item']}>
            {intl.formatMessage({ id: 'order.tihuoren', defaultMessage: '提货人' })}：
            {`${dataSource.receiverPickupName} ${dataSource.receiverPickupPhone}`}
          </View>
          <View className={styles['self-pickup-item']}>
            {intl.formatMessage({ id: 'order.tihuodian', defaultMessage: '提货点' })}：{dataSource.pickupPointName}
          </View>
          <View className={styles['self-pickup-desc']}>
            {dataSource.areaName || ''}
            {dataSource.address}
          </View>
        </View>
      ) : (
        !!dataSource.address && (
          <View
            className={classNames(styles.address, {
              [styles['address-after-logistics']]: hasLogisticsSummary,
            })}
          >
            <Image src={getOssUrlPath(`/Images/map.svg`)} style={{ width: pxTransform(15), height: pxTransform(15) }} />
            <View className={styles['address-flex']}>
              <Text className={styles['address-name']}>
                {dataSource.consignee} {dataSource.phone}
              </Text>
              <Text className={styles['address-text']}>
                {dataSource.areaName || ''}
                {dataSource.address}
              </Text>
            </View>
          </View>
        )
      )}
      {/* 取货码 */}
      {!!dataSource?.checkCode && (
        <View className={styles['check-view']}>
          <View className={styles['check-view-status']}>
            {intl.formatMessage({ id: 'order.daihexiao', defaultMessage: '待核销' })}
          </View>
          <Image className={styles['check-view-img']} src={fnGetQrCode(dataSource.checkCode)} />
          <View className={styles['check-view-code']}>{dataSource.checkCode}</View>
        </View>
      )}
      {/* 拼团 */}
      {countdown?.status === 1 && (
        <View className={styles['Collage']}>
          <View className={styles['CollageBox']}>
            <View style={{ justifyContent: 'center', position: 'relative' }}>
              {countdown?.itemList.map((item: any) => (
                <Image src={item.logo} key={item} className={styles['CollageImg']} />
              ))}
            </View>
            <View style={{ justifyContent: 'center' }}>{CountDom()}</View>
          </View>

          {!btnFlag && (
            <View className={styles['CollageBtn']}>
              <Button
                openType={IS_WEB ? 'button' : 'share'}
                className={styles['share-modal-button']}
                onClick={handleShare}
              >
                <Text className={styles['CollageBtntext']}>
                  {intl.formatMessage({ id: 'order.yaoqinghaoyoupintuan', defaultMessage: '邀请好友拼团' })}
                </Text>
              </Button>
            </View>
          )}
        </View>
      )}
      {(countdown?.status === 3 || countdown?.status === 2) && (
        // dataSource.promotionStatus === 3 || dataSource.promotionStatus === 4
        <View className={styles['Collageflex']}>
          <View className={styles['CollageItem']}>
            <View className={styles['CollageItem']}>
              <Image
                src={countdown?.isJoin && countdown?.status === 2 ? uriSussIcon : uriErrIcon}
                className={styles['CollageImg1']}
              />
              <Text className={styles['size']}>
                {countdown?.isJoin && countdown?.status === 2
                  ? intl.formatMessage({ id: 'order.gongxinipintuanchenggong', defaultMessage: '恭喜你，拼团成功' })
                  : intl.formatMessage({ id: 'order.henyihanpintuanshibai', defaultMessage: '很遗憾，拼团失败' })}
              </Text>
            </View>
            <View
              style={{ display: 'flex', justifyContent: 'center', marginBottom: pxTransform(5), position: 'relative' }}
            >
              {countdown?.itemList.map((item: any) => (
                <Image src={item.logo} key={item} className={styles['CollageImg']} />
              ))}
              <View className={styles['tag']}>
                <Text className={styles['tagtxt']}>{`+${countdown?.itemList.length}`}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {/* 商品卡槽 */}
      {dataSource.products && (
        <Card
          dataSource={dataSource.products}
          btnNode={btnNode}
          shopLogo={dataSource.storeLogo || dataSource.logo}
          vendorMemberName={dataSource.storeName || dataSource.shopName || dataSource.vendorMemberName}
          orderMode={dataSource.orderMode}
          groupId={dataSource.groupId}
          storeId={dataSource.storeId}
          cbgSelfPickup={!!dataSource.receiverPickupName}
        />
      )}
      {/* 在线客服 */}
      {customerServiceInfo?.id && (
        <View onClick={routerToCustomerService}>
          <View className={styles.customer}>
            <Image
              src={getOssUrlPath(`/Images/Service.svg`)}
              style={{ width: pxTransform(20), height: pxTransform(20), marginRight: pxTransform(5) }}
            />
            <Text className={styles.customerText}>
              {intl.formatMessage({ id: 'order.zaixiankefu', defaultMessage: '在线客服' })}
            </Text>
          </View>
        </View>
      )}
      {/* 付款信息 */}
      <View className={styles.cell}>
        <View className={styles['head-cell']}>
          <Text className={styles['head-cell-text']}>
            {intl.formatMessage({ id: 'order.fukuanxinxi', defaultMessage: '付款信息' })}
          </Text>
          <View onClick={() => setPayStatus(!payStatus)}>
            <View className={styles['cell-show-item']}>
              <Text className={styles['cell-show']}>
                {payStatus
                  ? intl.formatMessage({ id: 'order.shouqi', defaultMessage: '收起' })
                  : intl.formatMessage({ id: 'order.zhakangengduo', defaultMessage: '查看更多' })}
              </Text>
              <Image
                src={payStatus ? getOssUrlPath(`/Images/show.svg`) : getOssUrlPath(`/Images/next.svg`)}
                style={{ width: pxTransform(15), height: pxTransform(15), marginLeft: pxTransform(5) }}
              />
            </View>
          </View>
          {/* 内容 */}
        </View>
        {payStatus && (
          <>
            <View className={styles['cell-iem']}>
              <Text className={styles['cell-name']}>
                {intl.formatMessage({ id: 'order.shangpinzongjijine', defaultMessage: '商品总计金额' })}
              </Text>
              <Text className={styles['cell-text']}>
                +{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {dataSource.productAmount}
              </Text>
            </View>
            <View className={styles['cell-iem']}>
              <Text className={styles['cell-name']}>
                {intl.formatMessage({ id: 'order.huiyuanzhekou', defaultMessage: '会员折扣' })}
              </Text>
              <Text className={styles['cell-text']}>
                -{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {dataSource.memberDiscount}
              </Text>
            </View>
            <View className={styles['cell-iem']}>
              <Text className={styles['cell-name']}>{translate('mobile.resource.order.shuifei')}</Text>
              <Text className={styles['cell-text']}>
                +{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {dataSource.taxes}
              </Text>
            </View>
            <View className={styles['cell-iem']}>
              <Text className={styles['cell-name']}>
                {intl.formatMessage({ id: 'order.yunfei', defaultMessage: '运费' })}
              </Text>
              <Text className={styles['cell-text']}>
                +{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {dataSource.freight}
              </Text>
            </View>
            <View className={styles['cell-iem']}>
              <Text className={styles['cell-name']}>
                {intl.formatMessage({ id: 'order.cuxiaohuodong', defaultMessage: '促销活动' })}
              </Text>
              <Text className={styles['cell-text']}>
                -{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {dataSource.promotionAmount}
              </Text>
            </View>
            <View className={styles['cell-iem']}>
              <Text className={styles['cell-name']}>
                {intl.formatMessage({ id: 'order.youhuiquan', defaultMessage: '优惠券' })}
              </Text>
              <Text className={styles['cell-text']}>
                -{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {dataSource.couponAmount}
              </Text>
            </View>
            <View className={styles['cell-iem']}>
              <Text className={styles['cell-name']}>
                {intl.formatMessage({ id: 'order.integral', defaultMessage: '积分抵扣' })}
              </Text>
              <Text className={styles['cell-text']}>
                -{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {dataSource.deductionAmount}
              </Text>
            </View>
          </>
        )}
        <View className={styles['cell-iem']}>
          <Text className={styles['cell-name']}>
            {intl.formatMessage({ id: 'order.shifujine', defaultMessage: '实付金额' })}
          </Text>
          <Text className={styles['cell-text']}>
            {!(dataSource?.orderMode === 10 || dataSource?.orderMode === 11) && (
              <Text className={cStyles.Color}>{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}</Text>
            )}
            <Text
              className={cStyles.price}
              style={dataSource?.orderMode === 10 || dataSource?.orderMode === 11 ? { color: '#EB9B00' } : {}}
            >
              {`${dataSource.totalAmount ? dataSource.totalAmount?.split('.')[0] : ''}`}
            </Text>
            <Text
              className={cStyles.color}
              style={dataSource?.orderMode === 10 || dataSource?.orderMode === 11 ? { color: '#EB9B00' } : {}}
            >
              {dataSource?.orderMode === 10 || dataSource?.orderMode === 11
                ? intl.formatMessage({ id: 'order.jifen', defaultMessage: '积分' })
                : `.${dataSource?.totalAmount ? dataSource?.totalAmount?.split('.')[1] : ''}`}
            </Text>
          </Text>
        </View>
      </View>
      {/* 订单信息 */}
      <View className={styles.cell}>
        <View className={styles['head-cell']}>
          <Text className={styles['head-cellText']}>
            {intl.formatMessage({ id: 'order.dingdanxinxi', defaultMessage: '订单信息' })}
          </Text>
          {(arrMore.length > 2 || dataSource.payTimes > 1) && (
            <View onClick={() => setOrderStatus(!orderStatus)}>
              <View className={styles['cell-showItem']}>
                <Text className={styles['cell-show']}>
                  {orderStatus
                    ? intl.formatMessage({ id: 'order.shouqi', defaultMessage: '收起' })
                    : intl.formatMessage({ id: 'order.zhakangengduo', defaultMessage: '查看更多' })}
                </Text>
                <Image
                  src={orderStatus ? getOssUrlPath(`/Images/show.svg`) : getOssUrlPath(`/Images/next.svg`)}
                  style={{ width: pxTransform(15), height: pxTransform(15), marginLeft: pxTransform(5) }}
                />
              </View>
            </View>
          )}
          {/* 内容 */}
        </View>
        {arr.map((item, index) => {
          if (item.value || item.title === translate('mobile.resource.order.songhuoshijian')) {
            return listView(item, index)
          }
        })}
        {/* 上传凭证 */}
        <View className={styles['cell-iem']}>
          <Text className={styles['cell-name']}>{translate('mobile.resource.order.shangchuanpinzheng')}</Text>
          <View>
            {Object.keys(dataSource).length &&
              dataSource?.payments &&
              dataSource?.payments.map((item: { vouchers: string[] }) => {
                if (item.vouchers && item.vouchers.length > 0) {
                  return item.vouchers.map((voucher, voucherIndex) => (
                    <ImageBox
                      key={voucherIndex}
                      canPreview
                      onPress={() => {}}
                      source={voucher}
                      width={60}
                      height={60}
                    />
                  ))
                }
                return null
              })}
          </View>
        </View>
        {orderStatus &&
          arrMore.map((item, index) => {
            if (
              item.value &&
              !(
                (item.title === intl.formatMessage({ id: 'order.zhifucishu', defaultMessage: '支付次数' }) ||
                  item.title === intl.formatMessage({ id: 'order.zhifuxinxi', defaultMessage: '支付信息' })) &&
                dataSource.payTimes <= 1
              )
            ) {
              return listView(item, index)
            }
          })}
      </View>
    </View>
  )
}
export default StaySubmit

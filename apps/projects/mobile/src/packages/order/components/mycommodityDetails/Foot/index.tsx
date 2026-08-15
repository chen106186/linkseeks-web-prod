import React, { useState } from 'react'
import { RouterKeys } from '@/routes'
import uploadFileRequest from '@/utils/uploadFileRequest'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { DELIVERIES_DATA } from '@/constants/storage'
import { View, Text, Toast, Image, ActionSheet, Upload, Modal } from '@apps/mobile-ui'
import {
  postOrderMobileBuyerPageDelete,
  postOrderMobileBuyerValidateReceiveConfirm,
  postOrderMobileBuyerValidateReceiveCbgConfirm,
  postOrderMobileBuyerValidateSubmit,
} from '@apps/apis'
import { postProductMobileShopPurchaseSavePurchaseBatch } from '@apps/apis'
import cStyles from '../Card/index.module.scss'
// import CancelOrder from '../../../components/CancelOrder';
import CancelOrder from '../CancelOrder'
import styles from './index.module.scss'
import { IS_WEB } from '@/constants'
import { requestSubscribeMessage } from '@tarojs/taro'

interface Iprops {
  dataSource?: any
  sendInfo: {
    outerStatus: number
    batchNo?: number
    showReceive?: Boolean
    cbgReceive?: Boolean
  }
  status?: number
  categoryIndex?: any
  showCancel?: boolean
  showSubmit?: boolean
  fnClosePayType?: any
  totalAmount?: string
}

const Foot = (props: Iprops) => {
  const {
    dataSource,
    sendInfo: { outerStatus, batchNo, showReceive, cbgReceive },
    status,
    categoryIndex,
    showCancel,
    showSubmit,
    fnClosePayType,
    totalAmount,
  } = props
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [cancelOrderVisible, setCancelOrderVisible] = useState<boolean>(false)
  const [uploadData, setUploadData] = useState<any>([])
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [deleteToggle, setDeleteToggle] = useState(false) // 控制显示弹出
  const intl = useIntl()
  const goJump = (url: String, infos?: {}) => {
    if (url) {
      if (url === 'order/mycommodityList') {
        Router.redirectTo(`${url}` as RouterKeys, infos)
      } else {
        Router.navigateTo(`${url}` as RouterKeys, infos)
      }
    }
  }
  const seeLogistics = () => {
    setAsyncStorage(DELIVERIES_DATA, dataSource?.deliveries)
    const delivery = dataSource?.deliveries?.find((item: any) => !!item?.logisticsOrderId)
    goJump('order/logisticsDetail', {
      logisticsOrderId: delivery?.logisticsOrderId,
    })
  }
  const toSubmit = () => {
    const param: any = {
      orderId: dataSource.orderId,
    }
    postOrderMobileBuyerValidateSubmit(param).then((res) => {
      if (res.code === 1000) {
        Toast.show({
          title: intl.formatMessage({ id: 'order.dingdantijiaochenggong', defaultMessage: '订单提交成功' }),
        })
        goJump('order/mycommodityList', { status, Index: categoryIndex, Refresh: true })
      } else if (res.message) {
        Toast.show({ icon: 'none', title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
      }
    })
  }
  const toComfirm = async () => {
    if (!IS_WEB) {
      // 小程序授权订阅消息-确认收货通知
      await requestSubscribeMessage({
        tmplIds: ['Alya6vWJJk5tZPQ2_g2TSIRqVi8zqlttNyOIHZlHxmM'],
        entityIds: [],
      }).catch(() => {})
    }
    const param: any = {
      orderId: dataSource.orderId,
      batchNo,
      receiveBill: uploadData[0]?.url,
    }
    const fn = !cbgReceive ? postOrderMobileBuyerValidateReceiveConfirm : postOrderMobileBuyerValidateReceiveCbgConfirm
    fn(param).then((res) => {
      if (res.code === 1000) {
        goJump('order/mycommodityList', { status, Index: categoryIndex })
      } else if (res.message) {
        Toast.show({ icon: 'none', title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
      }
    })
  }
  /* 再次购买 */
  const BuyAgain = async () => {
    const List: any = []
    // eslint-disable-next-line array-callback-return
    dataSource.products.find((key: any) => {
      if (Number(key.priceType) !== 4) {
        List.push({
          id: key.productId,
          commoditySkuId: key.skuId,
          count: key.quantity,
        })
      }
    })
    const headers = {
      shopId: shopAndSite?.id,
    }
    const res = await postProductMobileShopPurchaseSavePurchaseBatch({ purchaseBatchList: List }, { headers })
    if (res.code === 1000) {
      Toast.show({
        title: intl.formatMessage({ id: 'order.jiarugouwuchechenggong', defaultMessage: '加入购物车成功' }),
      })
    } else {
      Toast.show({ icon: 'none', title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
    }
  }
  const deleteOrder = () => {
    const param: any = {
      orderId: dataSource.orderId,
    }
    postOrderMobileBuyerPageDelete(param).then((res) => {
      setDeleteToggle(false)
      if (res.code === 1000) {
        Toast.show({ title: intl.formatMessage({ id: 'order.detail.delmsg', defaultMessage: '删除成功' }) })
        goJump('order/mycommodityList', { status, Index: categoryIndex, Refresh: true })
      }
    })
  }
  // eslint-disable-next-line consistent-return
  const footView = (type: number) => {
    if (type === 6 || type === 8) {
      return (
        <View className={styles.foot} style={{ alignItems: 'center' }}>
          <Text>
            <Text style={{ fontSize: pxTransform(12) }}>
              {intl.formatMessage({ id: 'order.bencizhifu', defaultMessage: '本次支付' })}{' '}
            </Text>
            {!(dataSource?.orderMode === 10 || dataSource?.orderMode === 11) && (
              <Text className={cStyles.color}>{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}</Text>
            )}
            <Text
              className={cStyles.price}
              style={dataSource?.orderMode === 10 || dataSource?.orderMode === 11 ? { color: '#EB9B00' } : {}}
            >
              {Number(totalAmount?.split('.')[0])
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
          {showCancel && (
            <Text
              className={`${styles.btn} ${styles['pay-btn']}`}
              style={{ marginRight: pxTransform(0) }}
              onClick={() => setCancelOrderVisible(true)}
            >
              {intl.formatMessage({ id: 'order.quxiaodingdan', defaultMessage: '取消订单' })}
            </Text>
          )}
          <Text
            className={`${styles.btn} ${styles['btn-color']} ${styles['pay-btn']}`}
            onClick={() => fnClosePayType?.()}
          >
            {intl.formatMessage({ id: 'order.quzhifu', defaultMessage: '去支付' })}
          </Text>
        </View>
      )
    }
    if (status === 1 || status === 2) {
      return (
        <View className={`${styles['foot']} ${styles['flex']}`}>
          {showCancel && (
            <Text className={styles.btn} style={{ flex: 1 }} onClick={() => setCancelOrderVisible(true)}>
              {intl.formatMessage({ id: 'order.quxiaodingdan', defaultMessage: '取消订单' })}
            </Text>
          )}
          <Text
            className={styles.btn}
            style={{ flex: 1 }}
            onClick={() =>
              goJump('order/feedback', { status, Index: categoryIndex, auditState: 0, orderId: dataSource.orderId })
            }
          >
            {intl.formatMessage({ id: 'order.shenhebutongguo', defaultMessage: '审核不通过' })}
          </Text>
          <Text
            className={`${styles.btn} ${styles['btn-color']}`}
            style={{ flex: 1 }}
            onClick={() =>
              goJump('order/feedback', { status, Index: categoryIndex, auditState: 1, orderId: dataSource.orderId })
            }
          >
            {intl.formatMessage({ id: 'order.shenhetongguo', defaultMessage: '审核通过' })}
          </Text>
        </View>
      )
    }
    if (type === 1) {
      return (
        <View className={`${styles.foot} ${styles.flex}`}>
          {showCancel && (
            <Text className={styles.btn} style={{ flex: 1 }} onClick={() => setCancelOrderVisible(true)}>
              {intl.formatMessage({ id: 'order.quxiaodingdan', defaultMessage: '取消订单' })}
            </Text>
          )}
          {showSubmit && (
            <Text className={`${styles.btn} ${styles['btn-color']}`} style={{ flex: 1 }} onClick={() => toSubmit()}>
              {intl.formatMessage({ id: 'order.tijiaodingdan', defaultMessage: '提交订单' })}
            </Text>
          )}
        </View>
      )
    }
    if (type === 13 && showReceive) {
      return (
        <View className={`${styles.foot} ${styles.flex}`}>
          <Text className={`${styles.btn} ${styles['btn-color']}`} style={{ flex: 1 }} onClick={() => setToggle(true)}>
            {intl.formatMessage({ id: 'order.querenshouhuo', defaultMessage: '确认收货' })}
          </Text>
        </View>
      )
    }
    if (type === 13 && !showReceive) {
      return (
        <View className={`${styles.foot} ${styles.flex}`}>
          <View className={styles.btn} style={{ flex: 1, backgroundColor: '#EDEEEF', color: '#C7CACE' }}>
            {intl.formatMessage({ id: 'order.yiquerenshouhuo', defaultMessage: '已确认收货' })}
          </View>
        </View>
      )
    }
    if (type === 100) {
      return (
        <View className={styles.foot}>
          {!(dataSource?.orderMode === 10 || dataSource?.orderMode === 11) && (
            <Text
              className={`${styles.btn} ${styles['btn-border']}`}
              style={{ paddingBottom: pxTransform(7) }}
              onClick={() => BuyAgain()}
            >
              {intl.formatMessage({ id: 'order.zaicigoumai', defaultMessage: '再次购买' })}
            </Text>
          )}
          <Text
            className={`${styles.btn} ${styles['btn-border']}`}
            style={{ paddingBottom: pxTransform(7) }}
            onClick={() => goJump('extra/evaluatingManage')}
          >
            {intl.formatMessage({ id: 'order.pingjia', defaultMessage: '评价' })}
          </Text>
          <Text
            className={`${styles.btn} ${styles['btn-color']}`}
            style={{ paddingBottom: pxTransform(7) }}
            onClick={() => seeLogistics()}
          >
            {intl.formatMessage({ id: 'order.zhakanwuliu', defaultMessage: '查看物流' })}
          </Text>
        </View>
      )
    }
    if (type === 100) {
      return (
        <View className={styles.foot}>
          <Text
            className={`${styles.btn} ${styles['btn-border']}`}
            style={{ paddingBottom: pxTransform(7) }}
            onClick={() => {
              setDeleteToggle(true)
            }}
          >
            {intl.formatMessage({ id: 'order.detail.del', defaultMessage: '删除订单' })}
          </Text>
        </View>
      )
    }
  }
  // 图片上传
  const uploadFile = async (result) => {
    const uploadResult = await uploadFileRequest([result[0]])
    console.log(uploadResult, 'uploadResult')
    // const data = from;
    // data[name] = uploadResult[0].url
    // console.log(data, 'data')
    // setForm(data)
    // const uploadKey = uploadData;
    // uploadKey[name] = uploadResult[0].url;
    setUploadData(uploadResult)
    return uploadResult
  }
  return (
    <>
      {footView(outerStatus)}
      {/* 取消订单 */}
      <CancelOrder
        cancelOrderVisible={cancelOrderVisible}
        onHandleClose={() => setCancelOrderVisible(false)}
        onConfirm={() => goJump('order/mycommodityList', { status, Index: categoryIndex, Refresh: true })}
        orderItem={{ orderId: dataSource?.orderId }}
      />
      {/* <Modal
        title={intl.formatMessage('order.shifouquerenshouhuo', '是否确认收货？')}
        isOpened={toggle}
        onConfirm={toComfirm}
        onCancel={() => { setToggle(false) }}
        cancelText={intl.formatMessage('order.quxiao', '取消')}
        confirmText={intl.formatMessage('order.queding', '确定')}
        className={styles['order-model']}
      >
      </Modal> */}

      <ActionSheet isOpened={toggle} onClose={() => setToggle(false)}>
        <View className={styles['ActionSheet-warp']}>
          <View className={styles['ActionSheet-title']}>
            {intl.formatMessage({ id: 'order.shifouquerenshouhuo', defaultMessage: '是否确认收货？' })}
          </View>
          {/* <View className={styles['ActionSheet-conter']}>
            <View className={styles['ActionSheet-tip']}>上传收货回单</View>
            <Upload actions={(e) => uploadFile(e)} pickerMax={1}  >
              {
                uploadData.length > 0 ?
                  <Image className={styles['Img']} src={uploadData[0]?.url} mode='aspectFill' />
                  :
                  <View className={styles['UploadWarp']}>
                    <Image src={UploadIcon} />
                    <View className={styles['UploadWarpText']}>点击上传</View>
                  </View>
              }
            </Upload>
          </View> */}
          <View onClick={toComfirm} className={styles['btntext']}>
            {intl.formatMessage({ id: 'order.queding', defaultMessage: '确定' })}
          </View>
        </View>
      </ActionSheet>
      <Modal
        title={intl.formatMessage({ id: 'order.querenshanchugaidingdang', defaultMessage: '确认删除该订单？' })}
        isOpened={deleteToggle}
        onConfirm={deleteOrder}
        onCancel={() => {
          setDeleteToggle(false)
        }}
        cancelText={intl.formatMessage({ id: 'mine.quxiao', defaultMessage: '取消' })}
        confirmText={intl.formatMessage({ id: 'order.querenshanchu', defaultMessage: '确认删除' })}
        className={styles['delete-model']}
      />
    </>
  )
}

export default Foot

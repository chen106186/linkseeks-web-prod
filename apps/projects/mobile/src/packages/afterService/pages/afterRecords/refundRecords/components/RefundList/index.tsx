/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 19:52:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 17:17:11
 * @Description: 确认退款列表
 */
import React from 'react'
import cx from 'classnames'
import { preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Icons, NoticeBar } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { RETURN_OUTER_STATUS_UNCONFIRMED_REFUND, RETURN_OUTER_STATUS_NOT_RECEIVED } from '@/constants/const/refund'
import { OfflinePay } from '@/constants/const/payWay'
import Descriptions from '@/components/Descriptions'
import Progress from '@/components/Progress'
import Cell from '@/components/Cell'
import Bookshelf from '../../../components/Bookshelf'
import AsProductsList from '../../../../afterTodo/components/AsProductsList'
import styles from './index.module.scss'

export interface FileListItem {
  /**
   * 证明名称
   */
  name: string
  /**
   * 证明地址
   */
  proveUrl: string
}

export interface DetailItem {
  /**
   * 退款id
   */
  refundId?: number
  /**
   * 支付id
   */
  payId?: number
  /**
   * 支付外部状态：1.待支付2.待确认支付结果3.确认到账4.确认未到账
   */
  externalState?: number
  /**
   * 支付次数
   */
  payCount?: number
  /**
   * 支付环节
   */
  payNode?: string
  /**
   * 支付比例
   */
  payRatio?: number
  /**
   * 支付金额
   */
  payAmount?: number
  /**
   * 支付方式：1.线上支付2.线下支付3.授信额度支付4.货到付款支付
   */
  payWay?: number
  /**
   * 支付方式名称
   */
  payWayName?: string
  /**
   * 支付渠道：0.积分支付1.支付宝2.微信3.银联4.余额支付5.线下支付线上确认6.授信额度支付7.货到付款
   */
  channel?: number
  /**
   * 支付渠道名称
   */
  channelName?: string
  /**
   * 退款金额
   */
  refundAmount?: number
  /**
   * 外部状态:0.所有1.待退款2.待确认退款3.退款未到账4.退款到账5.无需退款
   */
  outerStatus?: number
  /**
   * 外部状态名称
   */
  outerStatusName?: string
  /**
   * 内部状态:0.所有1.未退款2.退款失败3.退款成功4.无需退款
   */
  innerStatus?: number
  /**
   * 内部状态名称
   */
  innerStatusName?: string
  /**
   * 退款时间（yyyy-MM-ddHH:mm）
   */
  refundTime?: string
  /**
   * 支付凭证 ,PayProveBO
   */
  payProve?: {
    /**
     * 账户名称
     */
    name?: string
    /**
     * 银行账号
     */
    bankAccount?: string
    /**
     * 开户行
     */
    bankDeposit?: string
    /**
     * 支付凭证文件 ,PayProveFileBO
     */
    fileList?: FileListItem[]
  }
  /**
   * 是否允许退款：0-否，1-是
   */
  canRefund?: number
}

export interface DataItem {
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品id
   */
  productId: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 采购单价
   */
  purchasePrice: number
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 采购金额
   */
  purchaseAmount: number
  /**
   * 支付金额
   */
  payAmount: number
  /**
   * 退货数量
   */
  returnCount: number
  /**
   * 退款金额
   */
  refundAmount: number
  /**
   * 退款明细 ,ReturnGoodsRefundDetailVO
   */
  detailList: DetailItem[]
  /**
   * 商品主图
   */
  skuPic: string
}

interface IProps {
  /**
   * 数据
   */
  data: DataItem[]
  /**
   * 是否可以编辑
   */
  isEdit?: boolean
  /**
   * 确认退款到账事件
   */
  onConfirmRefundTransferred?: (record: DataItem) => void
}

const RefundList: React.FC<IProps> = (props: IProps) => {
  const { data, isEdit, onConfirmRefundTransferred } = props

  const intl = useIntl()

  // 跳转到确认退款到账
  const handleConfirmRefundTransferred = (record: DataItem) => {
    if (onConfirmRefundTransferred) {
      onConfirmRefundTransferred(record)
    }
  }

  // 跳转到退款信息
  const handleJumpRefundInfo = (record: DataItem) => {
    preload({
      data: record.detailList,
    })
    Router.navigateTo('afterService/afterTodo/refundPrConfirmResult/refundInfo')
  }

  return (
    <View>
      {data.map((item, i) => {
        const offlineItems = item.detailList.filter(
          (detail) =>
            detail.channel === OfflinePay &&
            (detail.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUND ||
              detail.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED),
        )
        return (
          <View key={i} className={styles['list-item']}>
            <Bookshelf
              title={
                <AsProductsList
                  dataSource={[
                    {
                      orderId: 0,
                      orderNo: item.orderNo,
                      productId: item.productId,
                      productName: item.productName,
                      skuPic: item.skuPic,
                      purchasePrice: item.purchasePrice,
                      purchaseCount: item.purchaseCount,
                      unit: item.unit,
                      skuId: 0,
                      remaining: 0,
                    },
                  ]}
                />
              }
              footLeft={
                isEdit ? (
                  <View className={styles['list-item-actions']}>
                    <View onClick={() => handleJumpRefundInfo(item)} className={styles['list-item-actions-item']}>
                      <View className={styles['list-item-actions-item-icon']}>
                        <Icons name="Bulb" size={16} color="#252D37" />
                      </View>
                      <Text className={styles['list-item-actions-item-text']}>
                        {intl.formatMessage({
                          id: 'refundRecords.components.refundList.refundInfo',
                          defaultMessage: '退款信息',
                        })}
                      </Text>
                    </View>
                    <View
                      onClick={() => handleConfirmRefundTransferred(item)}
                      className={styles['list-item-actions-item']}
                    >
                      <View className={styles['list-item-actions-item-icon']}>
                        <Icons name="CheckmarkCircle" size={14} color="#13BC9D" />
                      </View>
                      <Text
                        className={cx(
                          styles['list-item-actions-item-text'],
                          styles['list-item-actions-item-text__primary'],
                        )}
                      >
                        {intl.formatMessage({
                          id: 'refundRecords.components.refundList.transferred',
                          defaultMessage: '确认退款到账',
                        })}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Cell.Item
                    icon="Bulb"
                    iconSize={14}
                    title={intl.formatMessage({
                      id: 'refundRecords.components.refundList.refundInfo',
                      defaultMessage: '退款信息',
                    })}
                    onPress={() => handleJumpRefundInfo(item)}
                    customHeadStyle={{
                      paddingTop: pxTransform(2),
                      paddingBottom: pxTransform(2),
                    }}
                    hasArrow
                    clickable
                  />
                )
              }
              customContentStyle={{
                padding: 0,
              }}
              ribbon={false}
            >
              <View className={styles['list-item-content']}>
                <View className={styles['list-item-desc']}>
                  <View className={styles['list-item-desc-left']}>
                    <Descriptions.Item
                      label={`${intl.formatMessage({
                        id: 'refundRecords.components.refundList.payAmount',
                        defaultMessage: '已支付',
                      })}(${intl.formatMessage({ id: 'yuan', defaultMessage: '元' })})`}
                      customStyle={{
                        marginBottom: pxTransform(0),
                      }}
                      customContentWrapStyle={{
                        flex: 0,
                      }}
                    >
                      {item.payAmount}
                    </Descriptions.Item>
                  </View>
                  <View className={styles['list-item-desc-right']}>
                    <Descriptions.Item
                      label={`${intl.formatMessage({
                        id: 'refundRecords.components.refundList.purchaseAmount',
                        defaultMessage: '采购金额',
                      })}(${intl.formatMessage({ id: 'yuan', defaultMessage: '元' })})`}
                      customStyle={{
                        marginBottom: pxTransform(0),
                      }}
                      customContentWrapStyle={{
                        flex: 0,
                      }}
                    >
                      {item.purchaseAmount}
                    </Descriptions.Item>
                  </View>
                </View>
                <View className={styles['list-item-progress']}>
                  <Progress percent={[30, 10]} strokeColor={['#00a98f', '#ef3346']} showInfo={false} />
                </View>
                <View className={styles['list-item-tag']}>
                  <Text
                    className={cx(styles['list-item-tag-text'], styles['list-item-tag-text__danger'])}
                  >{`${intl.formatMessage({
                    id: 'refundRecords.components.refundList.refundAmount',
                    defaultMessage: '采购金额',
                  })}：${intl.formatMessage({ id: 'yuan', defaultMessage: '元' })}${item.refundAmount}`}</Text>
                  <Text className={styles['list-item-tag-text']}>{` (${item.returnCount}${intl.formatMessage({
                    id: 'refundRecords.components.refundList.returnCount',
                    defaultMessage: '件',
                  })})`}</Text>
                </View>
              </View>
              {offlineItems.length > 0 ? (
                <NoticeBar>
                  {`${intl.formatMessage({
                    id: 'refundRecords.components.refundList.notice',
                    length: offlineItems.length,
                  })}${
                    isEdit
                      ? intl.formatMessage({
                          id: 'refundRecords.components.refundList.deal',
                          defaultMessage: '，点击确认款项到账进行处理',
                        })
                      : ''
                  }`}
                </NoticeBar>
              ) : null}
            </Bookshelf>
          </View>
        )
      })}
    </View>
  )
}

RefundList.defaultProps = {
  isEdit: false,
  onConfirmRefundTransferred: undefined,
}

export default RefundList

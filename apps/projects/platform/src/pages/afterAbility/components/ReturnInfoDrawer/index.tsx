/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 17:36:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:38:45
 * @Description: 查看退货数量与退款金额 抽屉
 */
import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button, Spin } from 'antd'
import NiceForm from '@/components/NiceForm'
import { createAsyncFormActions, FormEffectHooks } from '@apps/formily'
import BigNumber from 'bignumber.js'
import { getOrderCommonAfterSalePaymentFind } from '@apps/apis'
import schema from './schema'
import { createEffects } from './effects'
import Stamp from '../Stamp'
import { isMaterialOrder } from '../../utils'
import SteamerTicket from './components/SteamerTicket'
import styles from './index.less'

const schemaAction = createAsyncFormActions()

export type PayListItem = {
  /**
   * 支付id
   */
  payId: number
  /**
   * 支付次数
   */
  payCount: number
  /**
   * 支付环节
   */
  payNode: string
  /**
   * 支付比例
   */
  payRatio: number
  /**
   * 支付金额
   */
  payAmount: number
  /**
   * 支付方式
   */
  payWay: number
  /**
   * 支付方式名称
   */
  payWayName: string
  /**
   * 支付渠道
   */
  channel: number
  /**
   * 支付渠道名称
   */
  channelName: string
  /**
   * 退款金额
   */
  refundAmount: number
  /**
   * 支付时间
   */
  payTime: string
  /**
   * 支付配置：1.平台代收2.会员直接到账
   */
  payRuleId?: number
  /**
   * 支付外部状态
   * 这个字段现在没用了，支付信息返回的都是 确认到账 的数据，后台说写死
   */
  externalState: number
  /**
   * 第三方支付成功返回的code
   */
  transactionPayId: string
}

export interface ReturnApplyInfo {
  /**
   * 列表索引
   */
  index?: number
  /**
   * 订单id
   */
  orderId: number
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品类
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 采购单价
   */
  purchasePrice: number
  /**
   * 采购金额
   */
  purchaseAmount: number
  /**
   * 退货数量
   */
  returnCount: number
  /**
   * 剩余可退数量
   */
  remaining?: number
  /**
   * 订单类型
   */
  orderType?: number
  /**
   * 支付信息
   */
  payList?: PayListItem[]
  /**
   * 总的退款金额
   */
  refundAmount?: number
  /**
   * 退款理由
   */
  returnReason?: string
}
interface ReturnInfoDrawerProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 申请信息
   */
  applyInfo: ReturnApplyInfo
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * form 提交触发事件
   */
  onSubmit?: (values: { [key: string]: any }) => void
  /**
   * 是否是编辑的
   */
  isEdit?: boolean
}

const ReturnInfoDrawer: React.FC<ReturnInfoDrawerProps> = ({
  visible = false,
  applyInfo,
  onClose,
  onSubmit,
  isEdit = false,
}) => {
  const [innerApplyInfo, setInnerApplyInfo] = useState<ReturnApplyInfo | null>(applyInfo)
  const [payInfoLoading, setPayInfoLoading] = useState(false)

  const intl = useIntl()

  const getPayInfo = async () => {
    if (!applyInfo || !applyInfo.orderId) {
      return
    }
    const isMateriel = isMaterialOrder(applyInfo.orderType)
    if (isMateriel) {
      schemaAction.setFieldState('productName', (state) => {
        state.title = intl.formatMessage({
          id: 'afterService.components.ReturnInfoDrawer.materialName',
          defaultMessage: '物料名称',
        })
      })
    }
    let payList = applyInfo.payList
      ? applyInfo.payList.map((item) => ({
          ...item,
          payRatio: +new BigNumber(item.payRatio).multipliedBy(100).toFixed(2),
        }))
      : []
    setPayInfoLoading(true)
    try {
      // 编辑状态才请求支付信息，否则默认取申请信息里边的支付信息
      if (isEdit && !isMateriel) {
        const res = await getOrderCommonAfterSalePaymentFind({
          orderId: `${applyInfo.orderId}`,
        })
        if (res.code === 1000) {
          payList = res.data.map((item, index) => {
            const payRatio = +new BigNumber(item.payRate).multipliedBy(100).toFixed(2)
            const current = payList[index]
            return {
              payId: item.paymentId,
              payCount: item.batchNo,
              payNode: item.payNode,
              payRatio,
              payAmount: item.payAmount,
              payWay: item.payType,
              payWayName: item.payTypeName,
              channel: item.payChannel,
              channelName: item.payChannelName,
              refundAmount: current?.refundAmount
                ? current?.refundAmount
                : +new BigNumber(+applyInfo.remaining)
                    .multipliedBy(applyInfo.purchasePrice)
                    .multipliedBy(item.payRate)
                    .toFixed(2),
              payTime: item.payTime,
              payRuleId: item.fundMode,
              externalState: 3, // 这个状态写死了，因为现在只有付款了才会出现这条支付信息
              transactionPayId: item.tradeNo, // 微信 或 其他第三方支付返回的 code，原路退款需要
            }
          })
        }
      }
    } catch (error) {
      console.warn(error)
    }
    setPayInfoLoading(false)
    setInnerApplyInfo({
      ...applyInfo,
      returnCount: applyInfo.returnCount || applyInfo.remaining, // 默认赋值
      refundAmount:
        applyInfo.refundAmount !== undefined
          ? applyInfo.refundAmount
          : isMateriel
          ? +new BigNumber(+applyInfo.remaining).multipliedBy(applyInfo.purchasePrice).toFixed(2)
          : 0, // 默认赋值，如果是有支付信息的订单，退款金额 refundAmount 交给 payList 累加
      payList,
    })
    if (payList.length) {
      schemaAction.setFieldState('REPOSIT_TABS', (state) => {
        state.props['x-component-props'].hiddenKeys = []
      })
    }
  }

  useEffect(() => {
    getPayInfo()
  }, [applyInfo])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values: ReturnApplyInfo) => {
    if (onSubmit) {
      const { remaining, orderType, ...rest } = values
      onSubmit(rest)
    } else {
      onClose()
    }
  }

  return (
    <Drawer
      title={
        isEdit
          ? intl.formatMessage({
              id: 'afterService.components.ReturnInfoDrawer.edit',
              defaultMessage: '编辑退货数量与退款金额',
            })
          : intl.formatMessage({
              id: 'afterService.components.ReturnInfoDrawer.check',
              defaultMessage: '查看退货数量与退款金额',
            })
      }
      placement="right"
      width={800}
      onClose={handleClose}
      visible={visible}
      closable={false}
      bodyStyle={{
        padding: 0,
      }}
      className={styles['refund-apply-drawer']}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            {onSubmit
              ? intl.formatMessage({ id: 'afterService.components.ReturnInfoDrawer.cancel', defaultMessage: '取消' })
              : intl.formatMessage({ id: 'afterService.components.ReturnInfoDrawer.close', defaultMessage: '关闭' })}
          </Button>
          {onSubmit && (
            <Button onClick={() => schemaAction.submit()} type="primary">
              {intl.formatMessage({ id: 'afterService.components.ReturnInfoDrawer.confirm', defaultMessage: '确定' })}
            </Button>
          )}
        </div>
      }
      destroyOnClose
    >
      <Spin spinning={payInfoLoading}>
        <NiceForm
          value={innerApplyInfo}
          previewPlaceholder=" "
          components={{
            Stamp,
            SteamerTicket,
          }}
          editable={isEdit}
          effects={($, actions) => {
            createEffects($, actions)
          }}
          onSubmit={handleSubmit}
          actions={schemaAction}
          schema={schema}
          colon
        />
      </Spin>
    </Drawer>
  )
}

export default ReturnInfoDrawer

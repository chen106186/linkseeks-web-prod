/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 17:36:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-07 16:41:31
 * @Description: 查看退货数量与退款金额 抽屉
 */
import React from 'react'
import { Drawer, Button, Space } from 'antd'
import NiceForm from '@/components/NiceForm'
import { createAsyncFormActions } from '@apps/formily'
import schema from './schema'
import { createEffects } from './effects'
import Stamp from '../Stamp'
import SteamerTicket from './components/SteamerTicket'
import styles from './index.less'

const schemaAction = createAsyncFormActions()

export interface PayListItemType {
  /**
   * 支付id
   */
  payId: number
  /**
   * 支付外部状态：1.待支付2.待确认支付结果3.确认到账4.确认未到账
   */
  externalState: number
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
   * 支付方式：1.线上支付2.线下支付3.授信额度支付4.货到付款支付
   */
  payWay: number
  /**
   * 支付方式名称
   */
  payWayName: string
  /**
   * 支付渠道：0.积分支付1.支付宝2.微信3.银联4.余额支付5.线下支付线上确认6.授信额度支付7.货到付款
   */
  channel: number
  /**
   * 支付渠道名称
   */
  channelName: string
  /**
   * 支付时间(yyyy-MM-ddHH:mm)
   */
  payTime: string
  /**
   * 退款金额
   */
  refundAmount: number
  /**
   * 交易支付id
   */
  transactionPayId: string
}

export interface OrderInfoType {
  /**
   * 列表索引
   */
  index?: number
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
   * 品牌
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
   * 支付记录
   */
  payList: PayListItemType[]
  /**
   * 退款数量
   */
  returnCount?: number | string
  /**
   * 退款理由
   */
  returnReason?: string
  /**
   * 总的退款金额
   */
  refundAmount?: number
}

interface ReturnInfoDrawerProps {
  visible: boolean
  orderInfo: OrderInfoType
  onClose: () => void
  onSubmit?: (values: { [key: string]: any }) => void
  /**
   * 是否是编辑的
   */
  isEdit?: boolean
}

const ReturnInfoDrawer: React.FC<ReturnInfoDrawerProps> = ({
  visible = false,
  orderInfo = {},
  onClose,
  onSubmit,
  isEdit = false,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values)
    } else {
      onClose()
    }
  }

  return (
    <Drawer
      title="查看退货数量与退款金额"
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
          <Space>
            <Button onClick={handleClose}>{onSubmit ? '取消' : '关闭'}</Button>
            {onSubmit && (
              <Button onClick={() => schemaAction.submit()} type="primary">
                确定
              </Button>
            )}
          </Space>
        </div>
      }
      destroyOnClose
    >
      <NiceForm
        initialValues={orderInfo}
        previewPlaceholder=" "
        components={{
          Stamp,
          SteamerTicket,
        }}
        editable={isEdit}
        effects={($, actions) => {
          createEffects($, actions)

          if (orderInfo?.payList?.length) {
            schemaAction.setFieldState('REPOSIT_TABS', (state) => {
              state.props['x-component-props']!.hiddenKeys = []
            })
          }
        }}
        onSubmit={handleSubmit}
        actions={schemaAction}
        schema={schema}
        colon
      />
    </Drawer>
  )
}

export default ReturnInfoDrawer

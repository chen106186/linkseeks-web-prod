/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-09 17:07:33
 * @Description: 货到付款退款确认
 */
import React from 'react'
import { Descriptions, Divider } from 'antd'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'

interface bankAccount {
  id: number
  name: string
  bankAccount: string
  bankDeposit: string
  memberId: number
}

interface BalanceProps {
  /**
   * 弹窗需要的数据值
   */
  value: { [key: string]: any }
}

const COD: React.FC<BalanceProps> = ({ value }) => {
  return (
    <div className={styles.COD}>
      <Descriptions column={1}>
        <Descriptions.Item label="当前退款金额(元)">
          <span className={styles['amount-plus']}>￥{priceFormat(value.refundAmount)}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label="支付方式"
          style={{
            paddingBottom: 0,
          }}
        >
          货到付款
        </Descriptions.Item>
      </Descriptions>
      <Divider dashed />
      <p className={styles.tip}>
        支付方式为货到付款的订单，用户确认退款方式与退款金额后， 系统会按照退款流程来完成退款动作，实际资金的退款结算由
        交易双方线下处理。
      </p>
    </div>
  )
}

export default COD

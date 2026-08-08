import { Modal } from 'antd'
import React from 'react'
import styles from './index.less'

interface Iprops {
  visible: boolean
  balanceInfo: {
    /** 结算方名字 */
    name: string
    amount: number
    /** 付款状态, 成功失败 */
    /** 支付状态 */
    statusName: string
    /** 支付时间 */
    settlementDate: string
    /** 支付方式 */
    payWayName: string
  }
  onOk: () => void
  onClose: () => void
}

/** 查看通联支付付款 */
const ViewUniversalPay: React.FC<Iprops> = (props: Iprops) => {
  const { visible, balanceInfo, onClose, onOk } = props

  const handleClose = () => {
    onClose?.()
  }

  const handleOnOk = () => {
    onOk?.()
  }

  const list = [
    {
      title: '结算金额',
      value: balanceInfo?.amount,
    },
    {
      title: '付款方式',
      value: balanceInfo?.payWayName,
    },
    {
      title: '付款时间',
      value: balanceInfo?.settlementDate,
    },
    {
      title: '付款状态',
      value: balanceInfo?.statusName,
    },
  ]

  return (
    <Modal width={548} title="查看付款" onCancel={handleClose} visible={visible} onOk={handleOnOk}>
      <div className={styles.balanceInfoName}>结算方: {balanceInfo?.name}</div>
      <div className={styles.wrapContainer}>
        {list.map((_item) => {
          return (
            <div className={styles.item} key={_item.title}>
              <span className={styles['item-title']}>{_item.title}</span>
              <span className={styles['item-value']}>{_item.value}</span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default ViewUniversalPay

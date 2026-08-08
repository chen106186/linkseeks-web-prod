import { Modal, Radio } from 'antd'
import React, { useState, useEffect, useCallback } from 'react'
import styles from './index.less'

interface Iprops {
  visible: boolean
  onConfirm: () => void
  onClose: () => void
  confirmLoading: boolean
  /** 结算方信息 */
  balanceInfo: {
    /** 结算方名字 */
    name: string
    /** 结算金额 */
    amount: number
    payMethods: string
  }
}

const OtherPayModal: React.FC<Iprops> = (props: Iprops) => {
  const { visible, balanceInfo, onConfirm, onClose, confirmLoading } = props

  const handleClose = () => {
    onClose?.()
  }

  const list = [
    {
      title: '结算金额',
      value: balanceInfo.amount,
    },
    {
      title: '支付方式',
      value: balanceInfo.payMethods,
    },
  ]

  const handleOnOk = () => {
    onConfirm?.()
  }

  return (
    <Modal
      width={548}
      title="付款"
      onCancel={handleClose}
      visible={visible}
      okText={'确定付款'}
      onOk={handleOnOk}
      confirmLoading={confirmLoading}
    >
      <div className={styles.balanceInfoName}>结算方：{balanceInfo.name}</div>
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

export default OtherPayModal

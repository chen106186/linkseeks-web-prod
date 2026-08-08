import { Modal } from 'antd'
import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import styles from './index.less'
const intl = getIntl()
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
      title: intl.formatMessage({ id: 'balance.jiesuanjine' }),
      value: balanceInfo?.amount,
    },
    {
      title: intl.formatMessage({ id: 'balance.fukuanfangshi' }),
      value: balanceInfo?.payWayName,
    },
    {
      title: intl.formatMessage({ id: 'balance.fukuanshijian' }),
      value: balanceInfo?.settlementDate,
    },
    {
      title: intl.formatMessage({ id: 'balance.fukuanzhuangtai' }),
      value: balanceInfo?.statusName,
    },
  ]

  return (
    <Modal
      width={548}
      title={intl.formatMessage({ id: 'balance.zhakanfukuan' })}
      onCancel={handleClose}
      visible={visible}
      onOk={handleOnOk}
    >
      <div className={styles.balanceInfoName}>
        {intl.formatMessage({ id: 'balance.jiesuanfang' })}: {balanceInfo?.name}
      </div>
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

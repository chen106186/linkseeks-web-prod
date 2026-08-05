import React from 'react'
import { Modal } from 'antd'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

interface Iprops {
  dataSource: {
    address: string
    deliveryTime: string
    logisticsNo: string
    company: string
  }
  visible: boolean
  onClose?: () => void
  onConfirm?: () => void
}
const intl = getIntl()
const ConfirmReceive: React.FC<Iprops> = (props: Iprops) => {
  const { dataSource, visible, onClose, onConfirm } = props
  const rowList = [
    {
      title: intl.formatMessage({ id: 'handling.fahuodizhi' }),
      dataIndex: 'address',
    },
    {
      title: intl.formatMessage({ id: 'handling.fahuodizhi' }),
      dataIndex: 'deliveryTime',
    },
    {
      title: intl.formatMessage({ id: 'handling.fahuodanhao' }),
      dataIndex: 'logisticsNo',
      render: (text, record) => {
        return <a>{record.logisticsNo}</a>
      },
    },
    {
      title: intl.formatMessage({ id: 'handling.fahuodizhi' }),
      dataIndex: 'company',
    },
  ]
  return (
    <Modal
      title={intl.formatMessage({ id: 'handling.querenshouhuo' })}
      visible={visible}
      onCancel={onClose}
      onOk={onConfirm}
    >
      <div className={styles.container}>
        {rowList.map((_item) => {
          return (
            <div className={styles.row}>
              <span className={styles.label}>{_item.title}</span>
              <span style={styles.value}>
                {(_item.render && _item.render(dataSource[_item.dataIndex], dataSource)) || dataSource[_item.dataIndex]}
              </span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default ConfirmReceive

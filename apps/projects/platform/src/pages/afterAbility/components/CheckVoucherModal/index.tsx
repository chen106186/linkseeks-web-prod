/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-09 17:55:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-09 17:55:58
 * @Description: 线下退款凭证
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal, Upload } from 'antd'
import styles from './index.less'

interface CheckVoucherModalProps {
  visible: boolean
  fileList: {
    uid: string
    name: string
    status: any
    url: string
  }[]
  onCancel: () => void
}

const CheckVoucherModal: React.FC<CheckVoucherModalProps> = ({ visible, fileList = [], onCancel }) => {
  const intl = useIntl()

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'afterService.components.CheckVoucherModal.title', defaultMessage: '查看凭证' })}
      width={576}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{
        padding: '16px 24px',
      }}
      destroyOnClose
    >
      <Upload defaultFileList={fileList} disabled />
    </Modal>
  )
}

export default CheckVoucherModal

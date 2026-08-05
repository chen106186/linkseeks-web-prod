/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-09 17:55:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-09 17:55:58
 * @Description: 线下退款凭证
 */
import React from 'react'
import { Modal, Upload } from 'antd'

interface CheckVoucherModalProps {
  visible: boolean
  fileList: {
    uid: string
    name: string
    status: string
    url: string
  }[]
  onCancel: () => void
}

const CheckVoucherModal: React.FC<CheckVoucherModalProps> = ({ visible, fileList = [], onCancel }) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Modal
      title="查看凭证"
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

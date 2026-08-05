import React, { useState } from 'react'
import { Space, Modal, Popconfirm, Button } from 'antd'
import UploadPayVoucher from '../UploadPayVoucher'

interface FileType {
  name: string
  proveUrl: string
}

interface UploadVocherProps {
  /**
   * 结算方id
   */
  settlementId?: number
  /**
   * 结算单id
   */
  id?: number
  roleId?: number
  handleUpload: (params: any) => void
  visible: boolean
  onCancel: () => void
}
// 待付款 状态 上传付款凭证
const UploadVoucherModal: React.FC<UploadVocherProps> = (props) => {
  const { settlementId, roleId, visible, onCancel } = props
  const [fileList, setFileList] = useState<FileType[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const getFileList = (list: FileType[], status) => {
    if (status === 'done') {
      setFileList(list)
      setIsUploading(false)
    } else {
      setIsUploading(true)
    }
  }

  const handleComfirm = (params) => {
    props.handleUpload({ onCancel: params.onCancel, id: params.id, fileList: params.fileList })
  }

  return (
    <Modal
      width={548}
      title="上传付款凭证"
      onCancel={onCancel}
      visible={visible}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          {isUploading ? (
            <Popconfirm
              title="还有文件正在上传，是否确认提交？"
              okText="是"
              cancelText="否"
              onConfirm={() => handleComfirm({ onCancel: onCancel, id: props.id, fileList: fileList })}
            >
              <Button type={'primary'}>确认</Button>
            </Popconfirm>
          ) : (
            <Button
              type={'primary'}
              onClick={() => handleComfirm({ onCancel: onCancel, id: props.id, fileList: fileList })}
            >
              确认
            </Button>
          )}
        </Space>
      }
    >
      <UploadPayVoucher roleId={roleId!} id={settlementId!} getFileList={getFileList} />
    </Modal>
  )
}

export default UploadVoucherModal

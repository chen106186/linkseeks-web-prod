import React, { useState } from 'react'
import { Button, Modal } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { UploadImage } from '@apps/components'
import { CloudUploadOutlined } from '@ant-design/icons'
import { UploadFile, message } from 'antd'

interface IProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  orderId: number
}

const UploadContract: React.FC<IProps> = (props) => {
  const { visible, setVisible } = props
  const translate = useWebIntl()
  const [fileList, setFileList] = useState<UploadFile<any>[]>([])

  const handleOk = () => {
    if (fileList.length === 0) {
      message.error(translate('web.resource.contract.qingshangchuanhetong'))
      return
    }
  }

  return (
    <Modal
      open={visible}
      centered
      title={translate('web.resource.contract.shangchuanhetongwenjian')}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
    >
      <UploadImage
        onChange={(value) => {
          setFileList(value.fileList)
        }}
        listType="text"
        showUploadList
        fileList={fileList}
        accept=".jpg,.png"
      >
        <Button type="link" icon={<CloudUploadOutlined />}>
          {translate('web.common.shangchuan')}
        </Button>
      </UploadImage>
    </Modal>
  )
}

export default UploadContract

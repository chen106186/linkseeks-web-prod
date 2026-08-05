import React, { useState } from 'react'
import { LineTitle, MimeTypes } from '@apps/components'
import { Button, message, Upload } from 'antd'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useWebIntl } from '@apps/locales'
import exportIcon from '@/assets/icons/export_icon.svg'
import { PlusOutlined } from '@ant-design/icons'
import { postSupportDatasheetFileLogImportData } from '@apps/apis'

const { Dragger } = Upload

interface IPorps {
  onSuccess?: () => void
}

const UploadProduct: React.FC<IPorps> = ({ onSuccess }) => {
  const translate = useWebIntl()
  const [loading, setLoading] = useState<boolean>(false)
  const [fileList, setFileList] = useState<UploadFile<any>[]>([])
  const [fileUrl, setFileUrl] = useState<string>()
  const filetTypeList = ['xlsx', 'xls']
  const MAX_SIZE = 5

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: true,
    accept: filetTypeList.map((type) => `.${type}`).join(','),
    action: '/api/support/file/upload',
    data: {
      fileType: 1,
    },
    fileList,
    onChange(info) {
      const { status } = info.file
      setFileList(info.fileList)
      if (status === 'removed') {
        setFileUrl(undefined)
      }
      if (status === 'uploading') {
        setLoading(true)
        return
      }
      setLoading(false)
      if (status === 'done') {
        setFileUrl(info.file.response?.data)
      } else if (status === 'error') {
        message.error(translate('web.common.shangchuanchucuo'))
      }
    },
    // 上传限制验证
    beforeUpload: (file: any) => {
      let { size, type } = file
      const typeList = filetTypeList.map((item) => MimeTypes[item] || 'unknown')
      let fileTypeOutcome = typeList.includes(type)
      let fileTypeTips = filetTypeList.map((item) => item.replace(/image\/|video\//, '').toLocaleUpperCase()).join('/')

      let fileSizeOutcome = size / 1024 / 1024 <= MAX_SIZE

      // 图片类型校验
      if (!fileTypeOutcome) {
        message.error(`${translate('web.common.jinzhichishagnchuan')}${fileTypeTips}${translate('web.common.leixing')}`)
        return Upload.LIST_IGNORE
      }
      // 图片大小校验
      if (!fileSizeOutcome) {
        message.error(`${translate('web.common.shangchuantupianbuchaoguo')}${MAX_SIZE} M!`)
        return Upload.LIST_IGNORE
      }
      return fileTypeOutcome && fileSizeOutcome
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  /**
   * 确认导入
   */
  const handleImport = () => {
    if (!fileUrl) {
      message.info(translate('web.resource.commodity.qingshangchuanwenjian'))
      return
    }
    setLoading(true)
    postSupportDatasheetFileLogImportData({
      bizType: 2,
      fileUrl,
    })
      .then((res) => {
        if (res.code === 1000) {
          setFileList([])
          setFileUrl(undefined)
          onSuccess?.()
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <LineTitle
        extra={
          <Button loading={loading} onClick={() => handleImport()} type="primary" size="small" icon={<PlusOutlined />}>
            {translate('web.resource.commodity.querendaoru')}
          </Button>
        }
      >
        <span>{translate('web.resource.commodity.daoruwenjian')}</span>
      </LineTitle>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <img src={exportIcon} />
        </p>
        <p className="ant-upload-text">{translate('web.common.uploaddragtip')}</p>
        <p className="ant-upload-hint">
          {translate('web.resource.commodity.jinzhichidangewenjianshangchuansize', { size: 5 })}
        </p>
      </Dragger>
    </div>
  )
}

export default UploadProduct

import React from 'react'
import { useIntl } from '@linkseeks/i18n'

const UploadFileTip = () => {
  const intl = useIntl()
  return (
    <div>
      <p>
        1.{' '}
        {intl.formatMessage({
          id: 'material.upload.tips1',
          defaultMessage: '图片尺寸为 800*800，单张大小不超过 600K，仅支持JPEG/JPG/PNG格式',
        })}
      </p>
      <p>
        2.{' '}
        {intl.formatMessage({
          id: 'material.upload.tips2',
          defaultMessage: '图片质量要清晰，不要虚化，建议主图为白色背景正面图',
        })}
      </p>
    </div>
  )
}

UploadFileTip.isVirtualFieldComponent = true

export default UploadFileTip

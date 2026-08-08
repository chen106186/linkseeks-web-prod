import React, { useMemo, useRef } from 'react'
import { BaseUpload, BaseUploadProps, UPLOAD_FILE_TYPE_LIST, UploadFileType } from './BaseUpload'
import { PlusOutlined } from '@ant-design/icons'
import './index.global.less'
import { UploadProps, Spin, Image, Space, message } from '@linkseeks/ui'
import { useToggle } from '@linkseeks/hooks'
import StandardImage from '../StandardImage'
import { useWebIntl } from '@apps/locales'
export interface SingleCardUploadProps extends BaseUploadProps {
  uploadButtonText?: string
  maxSize?: number // 图片大小(默认单位：MB)
  unit?: 'MB' | 'KB' // 图片大小单位
  tips?: string | boolean // 上传提示
  imgSizeText?: string // 图片尺寸文本提示
  value?: string
  onChange?(url: any): void
}

/**
 * 单张卡片式的图片上传
 */
export const SingleCardUpload = (props: SingleCardUploadProps) => {
  const translate = useWebIntl()
  const {
    value,
    tips = false,
    uploadButtonText,
    maxSize = 10, // 图片大小(单位：M)
    unit = 'MB',
    fileType = UploadFileType.IMAGE, // 图片类型
    imgSizeText = '',
    onChange,
    ...uploadPorps
  } = props
  const [loading, toggleLoading] = useToggle(false)
  const uploader = useRef<any>({})

  const filetTypeList = UPLOAD_FILE_TYPE_LIST[fileType]

  // 上传限制验证
  const beforeUpload = (file: any) => {
    let { type, size } = file

    let fileTypeOutcome = filetTypeList.includes(type)
    let fileTypeTips = filetTypeList.map((item) => item.replace(/image\/|video\//, '').toLocaleUpperCase()).join('/')

    let fileSizeOutcome = unit === 'MB' ? size / 1024 / 1024 <= maxSize : size / 1024 <= maxSize

    // 图片类型校验
    if (!fileTypeOutcome) {
      message.error(`${translate('web.common.jinzhichishagnchuan')}${fileTypeTips}${translate('web.common.leixing')}`)
    }
    // 图片大小校验
    if (!fileSizeOutcome) {
      message.error(`${translate('web.common.shangchuantupianbuchaoguo')}${maxSize} ${unit}!`)
    }
    return fileTypeOutcome && fileSizeOutcome
  }

  const singleUploadConfig: UploadProps = {
    showUploadList: false,
    beforeUpload,
    onChange(e) {
      if (e.file) {
        if (e.file.status === 'uploading') {
          toggleLoading(true)
          return
        }
        toggleLoading(false)
        if (e.file.status === 'done') {
          const url = e.file.response.data || ''
          if (url) {
            onChange && onChange(url)
          } else {
            console.error(translate('web.common.shangchuanchucuo'))
          }
        }
      }
    },
    ...uploadPorps,
  }

  const handleEmitUpload = () => {
    uploader.current.click()
  }

  const handleDelete = () => {
    onChange && onChange('')
  }
  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <div className="single-upload-plus">
          <Spin />
        </div>
      )
    }
    if (!value) {
      // 不存在值时，显示上传按钮
      return (
        <div className="single-upload-plus" onClick={handleEmitUpload}>
          <PlusOutlined size={48} />
          <span>{translate('web.common.shangchuan')}</span>
        </div>
      )
    } else {
      return <StandardImage handleDelete={handleDelete} preview src={value} width={128} height={128} />
    }
  }, [loading, value])

  return (
    <div className="single-card-upload">
      {renderContent}
      {tips && (
        <div className="tips">
          <div>
            {translate('web.common.suport')}：
            {filetTypeList.map((item) => item.split('/')[1].toLocaleUpperCase()).join('/')}
          </div>
          <div>
            {translate('web.common.daixiaobuchaoguo')} {maxSize} {unit}
          </div>
          {imgSizeText && (
            <div>
              {translate('web.resource.marketing.jianyichicun')}：{imgSizeText}
            </div>
          )}
          {typeof tips === 'string' && tips}
        </div>
      )}
      <BaseUpload fileType={fileType} {...singleUploadConfig}>
        <div ref={uploader}></div>
      </BaseUpload>
    </div>
  )
}

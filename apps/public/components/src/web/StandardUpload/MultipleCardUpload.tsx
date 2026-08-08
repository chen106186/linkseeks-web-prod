import React, { useMemo, useRef } from 'react'
import { BaseUpload, BaseUploadProps } from './BaseUpload'
import { PlusOutlined } from '@ant-design/icons'
import './index.global.less'
import { UploadProps, Spin, Image, Space, message } from '@linkseeks/ui'
import { useToggle } from '@linkseeks/hooks'
import StandardImage from '../StandardImage'
import { useWebIntl } from '@apps/locales'
export interface MultipleCardUploadProps extends BaseUploadProps {
  pictureSize?: number
  value?: string[]
  maxSize?: number // 图片大小(默认单位：MB)
  onChange?(url: any): void
}

/**
 * 单张卡片式的图片上传
 */
export const MultipleCardUpload = (props: MultipleCardUploadProps) => {
  const { value, onChange, pictureSize = 128, maxSize = 10, maxCount = 2 } = props
  const translate = useWebIntl()
  const [loading, toggleLoading] = useToggle(false)
  const uploader = useRef<any>({})

  const fileList = useMemo(() => {
    if (value) {
      return value?.filter(Boolean).map((v: any) => {
        if (typeof v === 'string') {
          // 字符串类型
          return {
            url: v,
          }
        } else {
          return {
            ...v,
            url: v?.url || v?.response?.data || '',
          }
        }
      })
    } else {
      return []
    }
  }, [value])

  // 上传限制验证
  const beforeUpload = (file: any) => {
    let { size } = file

    let fileSizeOutcome = size / 1024 / 1024 <= maxSize

    // 图片大小校验
    if (!fileSizeOutcome) {
      message.error(`${translate('web.common.shangchuantupianbuchaoguo')}${maxSize} MB!`)
    }

    return fileSizeOutcome
  }

  const multipleUploadConfig: UploadProps = {
    beforeUpload,
    onChange(e) {
      if (e.fileList) {
        if (e.file.status === 'uploading') {
          toggleLoading(true)
          onChange && onChange(e.fileList)
        } else if (e.file.status === 'done') {
          let flag = true
          e.fileList.forEach((v) => {
            if (v.response && v.response?.code !== 1000) {
              message.error(v.response.message)
              flag = false
            }
          })
          // 如果上传失败，会出现异常报错
          if (!flag) {
            onChange && onChange(e.fileList.filter((v) => (v.url ? true : v.response?.code === 1000)))
            return
          }
          const fileList = e.fileList.map((v) => {
            return {
              ...v,
              url: v.url || v?.response?.data || '',
            }
          })
          if (fileList) {
            // 如果上传成功后，会返回完整的列表
            onChange && onChange(fileList)
          } else {
            console.error(translate('web.common.shangchuanchucuo'))
          }
        }
        toggleLoading(false)
      }
    },
    showUploadList: false,
  }

  const handleEmitUpload = () => {
    uploader.current.click()
  }

  const handleDelete = (url) => {
    const newFileList = [...fileList]
    const index = newFileList.findIndex((v) => v.url === url)
    newFileList.splice(index, 1)
    onChange && onChange(newFileList)
  }
  const renderContent = useMemo(() => {
    if (loading) {
      return <Spin />
    }
    if (fileList.length > 0) {
      return fileList.map((v) => (
        <StandardImage
          width={pictureSize}
          height={pictureSize}
          src={v.url}
          preview
          handleDelete={() => handleDelete(v.url)}
          key={v.url}
        />
      ))
    } else {
      return null
    }
  }, [loading, fileList, maxCount])

  return (
    <div className="multiple-upload-container">
      <Space>
        {renderContent}
        {fileList.length !== maxCount && (
          <div
            className="multiple-upload-plus"
            onClick={handleEmitUpload}
            style={{ width: pictureSize, height: pictureSize }}
          >
            <PlusOutlined size={48} />
            <span>{translate('web.common.shangchuan')}</span>
          </div>
        )}
      </Space>

      <BaseUpload fileList={fileList as any[]} {...multipleUploadConfig}>
        <div ref={uploader}></div>
      </BaseUpload>
    </div>
  )
}

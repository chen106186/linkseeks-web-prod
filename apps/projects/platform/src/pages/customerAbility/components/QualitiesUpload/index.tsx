/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 17:26:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 16:12:54
 * @Description: 资质上传组件
 */
import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { message, Upload } from 'antd'
import { PlusOutlined, FileOutlined, LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import classNames from 'classnames'
import styles from './index.less'

const QualitiesUpload = (props) => {
  const {
    value,
    className,
    editable,
    path,
    mutators,
    // schema,
  } = props
  const [loading, setLoading] = useState(false)
  const { accept } = props?.props['x-component-props'] || {}

  const intl = useIntl()

  const arrValue = value || []

  const handleChange = (info: UploadChangeParam) => {
    const { file } = info
    const { response = {}, ...rest } = file
    if (file.status === 'uploading') {
      setLoading(true)
    }
    if (file.status === 'done' || file.status === 'error') {
      setLoading(false)
    }
    mutators.change([
      {
        ...rest,
        ...(response.data || {}),
      },
    ])
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>
        {intl.formatMessage({ id: 'customerAbility.components.QualitiesUpload.upload', defaultMessage: '上传' })}
      </div>
    </div>
  )

  const renderFile = () => {
    const url = value[0]?.url || ''
    const imgReg = /\.(png|jpg|gif|jpeg|webp)$/
    const isImg = imgReg.test(url)

    if (!url) {
      return (
        <div style={{ color: '#ff4d4f' }}>
          <ExclamationCircleOutlined />
          <div style={{ marginTop: 8 }}>
            {intl.formatMessage({
              id: 'customerAbility.components.QualitiesUpload.upload.error',
              defaultMessage: '上传失败',
            })}
          </div>
        </div>
      )
    }

    if (isImg) {
      return <img src={url} className={styles.img} />
    }

    return <FileOutlined style={{ fontSize: 36 }} />
  }

  const uploadCls = classNames({
    [styles['no-img']]: arrValue.length,
    className,
  })

  const handleBeforeUpload = (files: File) => {
    if (accept && typeof accept === 'string') {
      const nameSplit = files.name.split('.')
      const fileType = nameSplit[nameSplit.length - 1]
      const FILTER_TYPE_LIMIT = accept.split(/, ?/).map((item) => item.trim().replace(/\./g, ''))
      if (!FILTER_TYPE_LIMIT.includes(fileType)) {
        message.error(
          intl.formatMessage({
            id: 'common.file.type.nosupport',
            defaultMessage: '不支持的文件类型',
          }),
        )
        return Upload.LIST_IGNORE
      }
    }

    return true
  }

  return (
    <div className={styles.upload}>
      <Upload
        {...(props.props['x-component-props'] || {})}
        listType="picture-card"
        showUploadList={false}
        maxCount={1}
        fileList={arrValue}
        onChange={handleChange}
        disabled={!editable}
        className={uploadCls}
        beforeUpload={handleBeforeUpload}
      >
        {!loading ? arrValue.length ? renderFile() : uploadButton : <LoadingOutlined />}
      </Upload>
    </div>
  )
}

QualitiesUpload.isFieldComponent = true

export default QualitiesUpload

import React, { useState, useEffect } from 'react'
import { Form, Button, Upload, message } from 'antd'
import { UploadOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'

import { UPLOAD_TYPE } from '@/constants'
import { authService } from '@apps/services'

import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const intl = getIntl()
export interface IProps {
  fetchdata: any
  currentRef: any
}

const File: React.FC<IProps> = (props) => {
  const { fetchdata, currentRef } = props
  const [form] = Form.useForm()
  const [files, setFiles] = useState(fetchdata || [])
  const [loading, setloading] = useState(false)
  const { token } = authService.getAuth() || {}

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: File) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message21' }))
    }
    return isLt20M
  }
  // 上传回调
  const handleChange = ({ file }) => {
    const arr: any = files
    setloading(true)
    if (file.response) {
      if (file.response.code === 1000) {
        arr.push({
          name: file.name,
          url: file.response.data,
        })
        setloading(false)
      }
    }
    setFiles([...arr])
  }
  // 删除附件
  const removeFiles = (index: any) => {
    const arr = [...files]
    arr.splice(index, 1)
    setFiles(arr)
  }

  useEffect(() => {
    if (fetchdata.length > 0) {
      setFiles(fetchdata)
    }
  }, [fetchdata])

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              resolve({
                state: true,
                name: 'explain',
                data: files,
              })
            })
            .catch((error) => {
              if (error && error.errorFields) {
              }
            })
        }),
    }
  })

  return (
    <Form form={form} {...layout} className={styles.revise_style}>
      <Form.Item label={intl.formatMessage({ id: 'balance.components.businessFileLayout.title' })} name="upload">
        <div className={styles.upload_data}>
          {files.length > 0 &&
            files.map((v, index) => (
              <div key={index} className={styles.upload_item}>
                <a className={styles.upload_left} href={v.url} target="_blank">
                  <LinkOutlined />
                  <span>{v.name}</span>
                </a>
                <div className={styles.upload_right} onClick={() => removeFiles(index)}>
                  <DeleteOutlined />
                </div>
              </div>
            ))}
        </div>
        <Upload
          action="/api/support/file/upload"
          data={{ fileType: UPLOAD_TYPE }}
          showUploadList={false}
          accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
          beforeUpload={beforeDocUpload}
          onChange={handleChange}
          headers={{ token }}
        >
          <Button loading={loading} icon={<UploadOutlined />}>
            {intl.formatMessage({ id: 'detail.purchase.uploadFile' })}
          </Button>
          <div style={{ marginTop: '8px' }}>{intl.formatMessage({ id: 'detail.purchase.placeholder2' })}</div>
        </Upload>
      </Form.Item>
    </Form>
  )
}

export default File

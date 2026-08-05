import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button, Upload, message } from 'antd'
import { UploadOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'

import { UPLOAD_TYPE } from '@/constants'
import { authService } from '@apps/services'
import { Card } from '@linkseeks/ui'

import styles from './index.less'

interface BusinessFileLayoutProps {
  fetchdata: any
  currentRef?: any
  editAble?: boolean
}

const BusinessFileLayout: React.FC<BusinessFileLayoutProps> = (props: BusinessFileLayoutProps) => {
  const { fetchdata, currentRef, editAble = false } = props
  const intl = useIntl()
  const [files, setFiles] = useState(fetchdata || [])
  const [loading, setloading] = useState(false)
  const { token } = authService.getAuth() || {}

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'balance.components.businessFileLayout.error' }))
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
          fileName: file.name,
          fileUrl: file.response.data,
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
    if (fetchdata?.length > 0) {
      setFiles(fetchdata)
    }
  }, [fetchdata])

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        data: files,
      }
    }
  })

  return (
    <Card id="fileLayout" title={intl.formatMessage({ id: 'balance.components.businessFileLayout.title' })}>
      <div>
        {files.length > 0
          ? files.map((v, index) => (
              <div key={index} className={styles.upload_item}>
                <a className={styles.upload_left} href={v.fileUrl} target="_blank">
                  <LinkOutlined />
                  <span>{v.fileName}</span>
                </a>
                {editAble && (
                  <div className={styles.upload_right} onClick={() => removeFiles(index)}>
                    <DeleteOutlined />
                  </div>
                )}
              </div>
            ))
          : editAble
          ? ''
          : '-'}
      </div>
      {editAble && (
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
            {intl.formatMessage({ id: 'balance.components.businessFileLayout.button' })}
          </Button>
          <div style={{ marginTop: '8px' }}>
            {intl.formatMessage({ id: 'balance.components.businessFileLayout.tip' })}
          </div>
        </Upload>
      )}
    </Card>
  )
}

export default BusinessFileLayout

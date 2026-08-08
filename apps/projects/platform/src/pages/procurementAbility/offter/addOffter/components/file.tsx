import React, { useState, useEffect } from 'react'
import { Form, Button, Upload, message, Typography } from 'antd'
import UploadProps from '@/constants/uploadProps'
import styles from './index.less'
import { UploadOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'
import { downloadFileByNameAndUrl } from '@apps/utils'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

export interface IProps {
  fetchdata: any
  currentRef: any
  /** 当前报价轮次 */
  round: number
  /** 点击报价信息切换的轮次 */
  checkRound: number
}
const intl = getIntl()
const File: React.FC<IProps> = (props) => {
  const { fetchdata, currentRef, round, checkRound } = props
  const [form] = Form.useForm()
  /** 用于提交 */
  const [enclosureUrls, setEnclosureUrls] = useState([])
  /** 用于展示 */
  const [files, setFiles] = useState([])

  const [loading, setloading] = useState(false)

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message21' }))
    }
    return isLt20M
  }
  // 上传回调
  const handleChange = ({ file }) => {
    const arr: any = enclosureUrls
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
    setEnclosureUrls([...arr])
  }
  // 删除附件
  const removeFiles = (index: any) => {
    const arr = [...enclosureUrls]
    arr.splice(index, 1)
    setEnclosureUrls(arr)
  }
  useEffect(() => {
    if (!isEmpty(fetchdata)) {
      if (checkRound === round) {
        setEnclosureUrls(fetchdata.enclosureUrls ? fetchdata.enclosureUrls : [])
      } else {
        setFiles(fetchdata.enclosureUrls)
      }
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
                data: enclosureUrls,
              })
            })
            .catch((error) => {
              if (error && error.errorFields) {
              }
            })
        }),
    }
  })

  const fileForEach = () => {
    let file: any = []
    if (checkRound === round) {
      file = enclosureUrls
    } else {
      file = files
    }
    return file
  }

  return (
    <Form form={form} {...layout} className={styles.revise_style}>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.file' })} name="upload">
        <div className={styles.upload_data}>
          {fileForEach().length > 0 &&
            fileForEach().map((v, index) => (
              <div key={index} className={styles.upload_item}>
                <div className={styles.upload_left}>
                  <Typography.Link
                    style={{ display: 'block' }}
                    key={`link_${index + 1}`}
                    onClick={() => downloadFileByNameAndUrl(v.url, v.name)}
                  >
                    <LinkOutlined style={{ marginRight: '5px' }} />
                    {v.name}
                  </Typography.Link>
                </div>
                {checkRound === round && (
                  <div className={styles.upload_right} onClick={() => removeFiles(index)}>
                    <DeleteOutlined />
                  </div>
                )}
              </div>
            ))}
        </div>
        {checkRound === round && (
          <Upload
            {...UploadProps}
            showUploadList={false}
            accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
            beforeUpload={beforeDocUpload}
            onChange={handleChange}
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              {intl.formatMessage({ id: 'detail.purchase.uploadFile' })}
            </Button>
            <div style={{ marginTop: '8px' }}>{intl.formatMessage({ id: 'detail.purchase.placeholder2' })}</div>
          </Upload>
        )}
      </Form.Item>
    </Form>
  )
}

export default File

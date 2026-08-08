import React, { useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Modal, Form, Input, Upload, Button, message } from 'antd'
import { UPLOAD_TYPE } from '@/constants'
import { UploadOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'

import { authService } from '@apps/services'

import { validatorByte } from '../../validator'

import styles from './index.less'

const intl = getIntl()

interface SubmitResultModalProps {
  title: string
  visible: boolean
  onCancel: () => void
  onOk: (signUpIdea: string, urls: any) => void
  confirmLoading: boolean
}

const SubmitResultModal: React.FC<SubmitResultModalProps> = (props: any) => {
  const { title, visible, onCancel, onOk, confirmLoading } = props
  const [form] = Form.useForm()
  const [files, setFiles] = useState([])
  const [loading, setloading] = useState(false)
  const { token } = authService.getAuth() || {}

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
    form.setFieldsValue({ upload: 'ok' })
  }
  // 删除附件
  const removeFiles = (index: any) => {
    const arr = [...files]
    arr.splice(index, 1)
    setFiles(arr)
    arr.length <= 0 && form.setFieldsValue({ upload: '' })
  }

  const formSubmit = () => {
    form.validateFields().then((res) => {
      onOk && onOk(res.opinion, files)
    })
  }

  return (
    <Modal
      width={600}
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        formSubmit()
      }}
      afterClose={() => {
        form.resetFields()
        setFiles([])
      }}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout={'vertical'} className={styles.revise_style}>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.signUpIdea' })}
          name="opinion"
          rules={[
            { required: true, message: intl.formatMessage({ id: 'detail.purchase.message94' }) },
            {
              validator: (r, v) => validatorByte(v, 200),
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            maxLength={200}
            placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder8' })}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.file' })}
          name="upload"
          rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message57' }) }]}
        >
          <div className={styles.upload_data}>
            {files.length > 0 &&
              files.map((v, index) => (
                <div key={index} className={styles.upload_item}>
                  <div className={styles.upload_left}>
                    <LinkOutlined />
                    <span>{v.name}</span>
                  </div>
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
    </Modal>
  )
}

export default SubmitResultModal

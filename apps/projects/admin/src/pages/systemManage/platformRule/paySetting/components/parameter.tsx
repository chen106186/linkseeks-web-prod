import React, { useCallback, useEffect, useState } from 'react'
import { Modal, Form, Select, Input, Typography, Upload, Button, message } from 'antd'
import { isEmpty } from 'lodash'
import style from '../index.less'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { UPLOAD_TYPE } from '@/constants'
import { getOrderPlatformPaymentMemberCommonParameterFind } from '@apps/apis'
const { Option } = Select
const { TextArea } = Input

const layout: any = {
  colon: false,
  labelCol: { style: { width: '100px' } },
  labelAlign: 'left',
}

interface ModalProps {
  /** 支付渠道 */
  payChannel: string
  /** 显示隐藏 */
  visible?: boolean
  /** 编辑回显数据 */
  value?: {
    /** 支付参数枚举值 */
    code?: number
    /** 支付参数Key名称 */
    key?: string
    /** 支付参数内容 */
    value?: string
    /** 描述 */
    remark?: String
  }
  /** 确定 */
  onConfirm: (e) => void
  /** 取消 */
  onCancel: () => void
}

type channel = {
  /** 参数枚举值 */
  code?: number
  /** 参数Key名称 */
  key: string
}[]

const ParameterLayout: React.FC<ModalProps> = ({ payChannel, visible, value, onConfirm, onCancel }) => {
  const [form] = Form.useForm()
  const [channel, setChannel] = useState<channel>([])
  const [files, setFiles] = useState<any>({})
  const [loading, setloading] = useState(false)

  const handleChannelFind = useCallback(async () => {
    await getOrderPlatformPaymentMemberCommonParameterFind({ payChannel }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      setChannel(res.data)
    })
  }, [payChannel])

  useEffect(() => {
    if (payChannel) {
      handleChannelFind()
    }
  }, [payChannel])

  const handleCancel = () => {
    onCancel()
    form.resetFields()
  }

  const handleConfirm = () => {
    form.validateFields().then((res) => {
      onConfirm({
        ...res,
        payChannel,
        key: channel.filter((item) => item.code === res.code)[0].key,
      })
      form.resetFields()
    })
  }

  useEffect(() => {
    if (!isEmpty(value)) {
      form.setFieldsValue({
        ...value,
      })
      if (value?.code === 14) {
        setFiles({
          name: value.remark,
          url: value.value,
        })
      }
    }
  }, [visible, value])

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error('上传文件大小不超过 20M!')
    }
    return isLt20M
  }
  // 上传回调
  const handleChange = ({ file }) => {
    setloading(true)
    if (file.response) {
      if (file.response.code === 1000) {
        setFiles({
          name: file.name,
          url: file.response.data,
        })
        form.setFieldsValue({ value: file.response.data })
        setloading(false)
      }
    }
  }

  const handleDelete = () => {
    setFiles({})
    form.setFieldsValue({ value: undefined })
  }

  return (
    <Modal width={576} title="新增参数配置" visible={visible} onOk={handleConfirm} onCancel={handleCancel}>
      <Form form={form} {...layout}>
        <Form.Item name="code" label="参数代码" rules={[{ required: true, message: '请选择参数代码' }]}>
          <Select>
            {channel.map((item: any) => (
              <Option key={item.code} value={item.code}>
                {item.key}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.code !== curValues.code}>
          {({ getFieldValue }) =>
            getFieldValue('code') === 14 ? (
              <Form.Item name="value" label="退款证书" rules={[{ required: true, message: '请上传退款证书' }]}>
                {!isEmpty(files) && (
                  <div className={style.upload_fileList}>
                    <Typography.Link>{files.url}</Typography.Link>
                    <DeleteOutlined
                      className={style.delect_icon}
                      style={{ color: '#00A98F' }}
                      onClick={() => handleDelete()}
                    />
                  </div>
                )}
                {isEmpty(files) && (
                  <Upload
                    action="/api/support/file/upload"
                    data={{ fileType: UPLOAD_TYPE }}
                    showUploadList={false}
                    beforeUpload={beforeDocUpload}
                    onChange={handleChange}
                  >
                    <Button loading={loading} icon={<UploadOutlined />}>
                      上传文件
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            ) : (
              <Form.Item name="value" label="参数值" rules={[{ required: true, message: '请输入参数值' }]}>
                <Input />
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item name="remark" label="参数描述">
          <TextArea maxLength={200} rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ParameterLayout

import React, { useState, useImperativeHandle, forwardRef, memo, useRef } from 'react'
import { Input, Form, Select, Drawer, Space, Button, Modal } from 'antd'
import { validatorByte } from '@/utils/regExp'
import { BUSINESS_FIELD_TYPE_OPTIONS } from '../const'
import FetchSelect from '@/components/FetchSelect'
import { getEngineProcessEngineGetContentType } from '@apps/apis'

export type HandleType = {
  show: (flag: boolean, data?: any) => void
}

type PropsType = {
  onOk: (values: any) => void
  tableData?: any[]
}

const TextArea = Input.TextArea

const CreateDrawer = ({ onOk, tableData }: PropsType, ref: any) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState<boolean>(false)

  const currentRecordRef = useRef<any>({})
  const isValuesChangeRef = useRef<boolean>(false)

  const validatorCode = (rule, value, callback) => {
    try {
      if (value) {
        if (tableData?.some((item) => currentRecordRef.current.recordId !== item.recordId && item.code === value)) {
          throw new Error(`数据库字段编码不允许重复`)
        } else {
          callback()
        }
      } else {
        callback()
      }
    } catch (err) {
      callback(err)
    }
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!values.recordId) {
        const tempId = new Date().getTime()
        values.recordId = tempId
      }
      isValuesChangeRef.current = false
      setVisible(false)
      onOk?.(values)
    })
  }

  const handleClose = () => {
    if (isValuesChangeRef.current) {
      Modal.confirm({
        content: '您还有未保存的内容，是否确定要关闭？',
        onOk: () => {
          isValuesChangeRef.current = false
          setVisible(false)
        },
      })
      return
    }
    setVisible(false)
  }

  useImperativeHandle(ref, () => ({
    show(flag: boolean, data?: any) {
      setVisible(flag)
      if (flag) {
        form.resetFields()
      }
      if (!!data) {
        form.setFieldsValue(data)
      }
      currentRecordRef.current = data || {}
    },
  }))

  return (
    <Drawer
      title="业务字段配置"
      visible={visible}
      width="40vw"
      onClose={handleClose}
      footer={
        <Space size={12}>
          <Button type="primary" onClick={handleSubmit}>
            确认
          </Button>
          <Button onClick={handleClose}>取消</Button>
        </Space>
      }
    >
      <Form
        form={form}
        labelAlign="left"
        colon={false}
        labelCol={{ span: 5 }}
        onValuesChange={() => {
          isValuesChangeRef.current = true
        }}
      >
        <Form.Item name="recordId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="code"
          label="数据库字段编码"
          rules={[
            { required: true, message: `请填写数据库字段编码` },
            { validator: (r, v, c) => validatorCode(r, v, c) },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item
          name="name"
          label="业务字段名称"
          rules={[
            { required: true, message: `请填写业务字段名称` },
            { validator: (r, v, c) => validatorByte(r, v, c, 40) },
          ]}
        >
          <Input maxLength={40} />
        </Form.Item>
        <Form.Item
          name="type"
          label="字段类型"
          rules={[{ required: true, message: `请选择字段类型` }]}
          initialValue={1}
        >
          <Select options={BUSINESS_FIELD_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.type !== curValues.type}>
          {({ getFieldValue }) =>
            getFieldValue('type') === 1 && (
              <Form.Item name="selectContent" label="选择弹窗" labelCol={{ span: 5 }}>
                <FetchSelect
                  labelKey="value"
                  valueKey="key"
                  requestApi={getEngineProcessEngineGetContentType}
                  allowClear
                />
              </Form.Item>
            )
          }
        </Form.Item>
        <Form.Item noStyle shouldUpdate={true}>
          {({ getFieldValue }) =>
            getFieldValue('type') === 1 &&
            getFieldValue('selectContent') && (
              <Form.Item
                name="codeAlias"
                label="弹窗字段编码"
                rules={[{ required: true, message: `请填写规则引擎弹窗字段编码` }]}
              >
                <Input maxLength={100} />
              </Form.Item>
            )
          }
        </Form.Item>
        <Form.Item name="remark" label="业务字段描述" rules={[{ validator: (r, v, c) => validatorByte(r, v, c, 120) }]}>
          <TextArea rows={3} maxLength={100} placeholder="最长120个字符，60汉字" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default memo(forwardRef(CreateDrawer))

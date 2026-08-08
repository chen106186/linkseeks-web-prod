/**
 * 新增/编辑流程配置共用内容组件
 * @author: Crayon
 */
import React, { useEffect, useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Form, Input, Spin } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { usePrompt } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import FormProgress, { HandleType } from '@/components/FormProgress'
import { InfoCard } from '@/components/InfoCard'
import BusinessConfig from './BusinessConfig'
import {
  getEngineProcessEngineDetail,
  postEngineProcessEngineSave,
  getEngineProcessEngineGetProcessType,
} from '@apps/apis'
import FetchSelect from '@/components/FetchSelect'
import ImageUpload from '@/components/ImageUpload'
import SingleCheckbox from './SingleCheckbox'

type PropsType = {
  id?: string
  title?: string
}

const anchors = [
  { key: 'process', label: '流程配置' },
  { key: 'business', label: '业务字段配置' },
]

const AddEditContent: React.FC<PropsType> = ({ id, title = '新增流程配置' }) => {
  const [form] = Form.useForm()
  const [spinLoading, setSpinLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const progressRef = useRef<HandleType>()

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      console.log('values', values)
      setLoading(true)
      try {
        const res = await postEngineProcessEngineSave({
          ...values,
          processEngineId: id,
        })
        setLoading(false)
        if (res.code === 1000) {
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 200)
        }
      } catch (error) {
        setLoading(false)
      }
    })
  }

  const getDetail = async () => {
    if (id) {
      setSpinLoading(true)
      const res = await getEngineProcessEngineDetail({ processEngineId: id })
      if (res.code === 1000) {
        const fieldList = res.data.fieldList?.map((item) => ({ ...item, recordId: item.processEngineFieldId }))
        form.setFieldsValue({ ...res.data, fieldList })
        progressRef?.current?.render(form)
        setSpinLoading(false)
      }
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <PageHeaderWrapper
      title={<FormProgress title={title} ref={progressRef} />}
      onBack={() => history.goBack()}
      items={anchors}
      extra={
        <Button icon={<SaveOutlined />} loading={loading} onClick={handleSubmit} type="primary">
          保存
        </Button>
      }
    >
      <Spin spinning={spinLoading}>
        <Form
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          colon={false}
          form={form}
          onValuesChange={() => {
            setUnsaved(true)
            progressRef?.current?.render(form)
          }}
        >
          <InfoCard id={anchors[0].key} title={anchors[0].name}>
            <Form.Item name="processKey" label="流程ID" rules={[{ required: true, message: `请填写流程ID` }]}>
              <Input maxLength={80} />
            </Form.Item>
            <Form.Item name="processName" label="流程名称" rules={[{ required: true, message: `请填写流程名称` }]}>
              <Input maxLength={80} />
            </Form.Item>
            <Form.Item name="type" label="流程类型" rules={[{ required: true, message: `请选择流程类型` }]}>
              <FetchSelect requestApi={getEngineProcessEngineGetProcessType} labelKey="value" valueKey="key" />
            </Form.Item>
            <Form.Item name="description" label="流程描述" rules={[{ required: true, message: `请填写流程描述` }]}>
              <Input.TextArea maxLength={200} rows={3} />
            </Form.Item>
            <Form.Item name="processImage" label="流程图" rules={[{ required: true, message: `请上传流程图` }]}>
              <ImageUpload maxSize={1} unit="MB" valueType="String" tips="支持PNG\JPG\JPEG，最大不超过1M" />
            </Form.Item>
            <Form.Item name="isDefault" label="" initialValue={0}>
              <SingleCheckbox>默认工作流</SingleCheckbox>
            </Form.Item>
          </InfoCard>

          <InfoCard id={anchors[1].key} title={anchors[1].name} cols={1}>
            <Form.Item wrapperCol={{ span: 24 }} name="fieldList">
              <BusinessConfig />
            </Form.Item>
          </InfoCard>
        </Form>
      </Spin>
    </PageHeaderWrapper>
  )
}

export default AddEditContent

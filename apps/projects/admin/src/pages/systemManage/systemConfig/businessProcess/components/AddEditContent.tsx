/**
 * 新增/编辑流程业务规则共用内容组件
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
import { postEngineProcessRuleConfigSave, getEngineProcessRuleConfigDetail } from '@apps/apis'

type PropsType = {
  id?: string
  title?: string
}

const anchors = [
  { key: 'process', label: '流程规则' },
  { key: 'business', label: '业务配置' },
]

const AddEditContent: React.FC<PropsType> = ({ id, title = '新增流程业务规则' }) => {
  const [form] = Form.useForm()
  const [spinLoading, setSpinLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const progressRef = useRef<HandleType>()

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      setLoading(true)
      const res = await postEngineProcessRuleConfigSave({
        ...values,
        processStep: Number(values.processStep),
        processRuleConfigId: id,
      })
      setLoading(false)
      if (res.code === 1000) {
        setUnsaved(false)
        setTimeout(() => {
          history.goBack()
        }, 200)
      }
    })
  }

  const getDetail = async () => {
    if (id) {
      setSpinLoading(true)
      const res = await getEngineProcessRuleConfigDetail({ processRuleConfigId: id })
      if (res.code === 1000) {
        const processRuleConfigFieldList = res.data.processRuleConfigFieldList?.map((item, index) => ({
          ...item,
          recordId: index,
        }))
        const newData = { ...res.data, processRuleConfigFieldList }
        form.setFieldsValue(newData)
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
            <Form.Item name="processId" label="流程ID" rules={[{ required: true, message: `请填写流程ID` }]}>
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item name="processName" label="流程名称" rules={[{ required: true, message: `请填写流程名称` }]}>
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item
              name="processStep"
              label="流程步骤标识"
              rules={[{ required: true, message: `请填写流程步骤标识` }]}
            >
              <Input type="number" maxLength={10} />
            </Form.Item>
            <Form.Item
              name="processStepName"
              label="流程步骤名称"
              rules={[{ required: true, message: `请填写流程步骤名称` }]}
            >
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item
              name="processStepMenuPath"
              label="流程步骤对应菜单URL"
              rules={[{ required: true, message: `请填写流程步骤对应菜单URL` }]}
            >
              <Input maxLength={200} />
            </Form.Item>
          </InfoCard>

          <InfoCard id={anchors[1].key} title={anchors[1].name} cols={1}>
            <Form.Item
              wrapperCol={{ span: 24 }}
              name="processRuleConfigFieldList"
              rules={[{ required: true, message: `请添加业务配置` }]}
            >
              <BusinessConfig />
            </Form.Item>
          </InfoCard>
        </Form>
      </Spin>
    </PageHeaderWrapper>
  )
}

export default AddEditContent

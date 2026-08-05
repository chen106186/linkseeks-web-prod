import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Card, Form, Input, Button, Space, Popconfirm, message } from 'antd'
import { postManageSensitiveWordAdd, postManageSensitiveWordUpdate } from '@apps/apis'
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}
const tailLayout = {
  wrapperCol: { style: { marginLeft: '174px' } },
}

const { TextArea } = Input
const Template: React.FC<{}> = () => {
  const [form] = Form.useForm()
  const [lodaing, setLodaing] = useState<boolean>(false)
  const { pathname } = useLocation()
  const { id, name, remark } = usePageStatus()

  const type = pathname.split('/')[pathname.split('/').length - 1]
  const onFinish = (values: any) => {
    if (type === 'add') {
      postManageSensitiveWordAdd({ ...values }, { ctlType: 'none' })
        .then((res) => {
          if (res.code === 1000) {
            setTimeout(() => {
              history.goBack()
            }, 2000)
            message.success('新增敏感词成功')
            setLodaing(true)
          } else {
            message.error(res.message)
          }
        })
        .catch(() => {
          setLodaing(false)
        })
    } else {
      values.id = id
      postManageSensitiveWordUpdate({ ...values }, { ctlType: 'none' })
        .then((res) => {
          if (res.code === 1000) {
            setTimeout(() => {
              history.goBack()
            }, 2000)
            message.success('修改敏感词成功')
            setLodaing(true)
          }
        })
        .catch(() => {
          setLodaing(false)
        })
    }
  }

  const confirmCancel = () => {
    history.goBack()
  }

  useEffect(() => {
    try {
      const data: { name: string; remark: string } = {
        name: decodeURIComponent(atob(name)),
        remark: decodeURIComponent(atob(remark)),
      }
      form.setFieldsValue({
        name: data.name,
        remark: data.remark,
      })
    } catch (error) {
      console.log(error)
    }
  }, [])
  return (
    <PageHeaderWrapper>
      <Card>
        <Form {...layout} form={form} onFinish={onFinish}>
          <Form.Item label="敏感词名称" name="name" rules={[{ required: true, message: '请输入敏感词名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space size={24}>
              <Button type="primary" loading={lodaing} htmlType="submit">
                保存
              </Button>
              <Popconfirm onConfirm={confirmCancel} title="确定要执行这个操作?" okText="确定" cancelText="取消">
                <Button>取消</Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Template

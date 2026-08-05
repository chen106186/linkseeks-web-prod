import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { Card, Form, Input, Button, Space, Popconfirm } from 'antd'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { PageHeaderWrapper } from '@apps/components'
import { postManageAppDownloadLinkUpdate } from '@apps/apis'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const tailLayout = {
  wrapperCol: { style: { marginLeft: '174px' } },
}

const AppLinkEdit = () => {
  const [form] = Form.useForm()
  const query = usePageStatus()
  const [lodaing, setLodaing] = useState<boolean>(false)

  const onFinish = (values: any) => {
    values.id = query.id
    values.status = Number(query.status)
    setLodaing(true)
    postManageAppDownloadLinkUpdate(values)
      .then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
        setLodaing(false)
      })
      .catch(() => {
        setLodaing(false)
      })
  }

  const confirmCancel = () => {
    history.goBack()
  }

  useEffect(() => {
    form.setFieldsValue({
      parameterValue: query.parameterValue,
    })
  }, [])

  return (
    <PageHeaderWrapper>
      <Card>
        <Form {...layout} form={form} onFinish={onFinish}>
          <Form.Item label="APP下载链接" name="link" rules={[{ required: true, message: '请输入APP下载链接' }]}>
            <Input defaultValue={query.link || ''} placeholder="请输入APP下载链接" />
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

export default AppLinkEdit

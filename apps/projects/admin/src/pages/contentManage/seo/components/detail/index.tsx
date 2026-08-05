import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Card, Button, Tabs, Form, Select, Tooltip, Input, Typography } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { RequireItem } from '@apps/components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { SELECT_NAME } from '@/constants'
import { validatorByte } from '@/utils/regExp'
import { getManageSeoGet, postManageSeoAdd, postManageSeoUpdate } from '@apps/apis'
const { TabPane } = Tabs
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const ShopSeoAdded = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const link = pathname.split('/')[pathname.split('/').length - 1]

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState<boolean>(false)
  usePrompt({ when: formIsHalfFilledOut, message: '您还有未保存的内容，是否确定要离开？' })
  const handleFormValueChange = () => {
    setFormIsHalfFilledOut(true)
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    const fetch = link === 'add' ? postManageSeoAdd : postManageSeoUpdate
    form.validateFields().then((value: any) => {
      const type: number = value.type
      const params = {
        id,
        ...value,
        name: SELECT_NAME[type],
      }
      setConfirmLoading(true)
      fetch(params)
        .then((res) => {
          if (res.code !== 1000) {
            setConfirmLoading(false)
            return
          }
          setConfirmLoading(false)
          setFormIsHalfFilledOut(false)
          history.goBack()
        })
        .catch(() => {
          setConfirmLoading(false)
        })
    })
  }

  useEffect(() => {
    if (id) {
      getManageSeoGet({ id }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        form.setFieldsValue({ ...res.data })
      })
    }
  }, [])

  return (
    <PageHeaderWrapper
      extra={
        link !== 'detail' && (
          <Button type="primary" loading={confirmLoading} onClick={handleSave}>
            {' '}
            保存
          </Button>
        )
      }
    >
      <Card>
        <Tabs type="card">
          <TabPane tab="基本信息" key="1">
            <Form {...layout} form={form} hideRequiredMark={true} onValuesChange={handleFormValueChange}>
              <Form.Item
                name="type"
                label={<RequireItem label="页面名称" isRequire={true} />}
                rules={[{ required: true, message: '请选择页面名称' }]}
              >
                <Select disabled={link === 'detail'}>
                  <Select.Option value={1}>平台首页</Select.Option>
                  <Select.Option value={2}>企业商城首页</Select.Option>
                  <Select.Option value={4}>积分商城首页</Select.Option>
                  <Select.Option value={5}>企业直采首页</Select.Option>
                  <Select.Option value={6}>物流服务首页</Select.Option>
                  <Select.Option value={7}>加工服务首页</Select.Option>
                  <Select.Option value={8}>行情资讯首页</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="link"
                label={
                  <RequireItem
                    label="访问链接"
                    brief={
                      <Tooltip placement="top" title="访问该页面的链接">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
              >
                <Input
                  disabled={link === 'detail'}
                  addonBefore={<Typography.Text type="secondary">http://</Typography.Text>}
                />
              </Form.Item>
              <Form.Item
                name="title"
                label={
                  <RequireItem
                    label="标题"
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title="用于显示在页面title标签的内容，便于搜索引擎抓取">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  { required: true, message: '请输入标题' },
                  {
                    validator: (r, v, c) => validatorByte(r, v, c, 100),
                  },
                ]}
              >
                <Input maxLength={50} disabled={link === 'detail'} placeholder="最长100个字符，50个汉字" />
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <RequireItem
                    label="描述"
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title="用于显示在页面Description标签的内容，便于搜索引擎抓取">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  { required: true, message: '请输入描述' },
                  {
                    validator: (r, v, c) => validatorByte(r, v, c, 200),
                  },
                ]}
              >
                <Input.TextArea
                  disabled={link === 'detail'}
                  rows={5}
                  placeholder="最长200个字符，100个汉字"
                  maxLength={200}
                />
              </Form.Item>
              <Form.Item
                name="keywords"
                label={
                  <RequireItem
                    label="关键字"
                    isRequire={true}
                    brief={
                      <Tooltip
                        placement="top"
                        title="用于显示在页面Keywords标签的内容，便于搜索引擎通过关键词搜索时抓取页面，多个关键词用豆号分隔"
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  { required: true, message: '请输入关键字' },
                  {
                    validator: (r, v, c) => validatorByte(r, v, c, 200),
                  },
                ]}
              >
                <Input.TextArea
                  disabled={link === 'detail'}
                  rows={5}
                  placeholder="最长200个字符，100个汉字"
                  maxLength={200}
                />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}

export default ShopSeoAdded

import React, { useEffect, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { Card, Button, Tabs, Form, Select, Tooltip, Input, Typography } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { RequireItem } from '@apps/components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { SELECT_NAME, DOORTYPE } from '@/constants/procurement'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getCommodityWebSeoWebGet, postCommodityWebSeoWebAdd, postCommodityWebSeoWebUpdate } from '@apps/apis'
const { TabPane } = Tabs
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const intl = getIntl()

const PurchasSeoAdded = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const link = pathname.split('/')[pathname.split('/').length - 1]
  console.log(link)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState<boolean>(false)
  usePrompt({
    when: formIsHalfFilledOut,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const handleFormValueChange = () => {
    setFormIsHalfFilledOut(true)
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    const fetch = link === 'add' ? postCommodityWebSeoWebAdd : postCommodityWebSeoWebUpdate
    form.validateFields().then((value: any) => {
      const type: number = value.type
      const link: string = value.link

      const params = {
        id,
        ...value,
        doorType: DOORTYPE.PROCUREMENT_DOORTYPE,
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
      getCommodityWebSeoWebGet({ id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          form.setFieldsValue({ ...res.data })
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  return (
    <PageHeaderWrapper
      extra={
        link !== 'detail' && (
          <Button type="primary" loading={confirmLoading} onClick={handleSave}>
            {' '}
            {intl.formatMessage({ id: 'detail.purchase.save' })}
          </Button>
        )
      }
    >
      <Card>
        <Tabs type="card">
          <TabPane tab={intl.formatMessage({ id: 'detail.purchase.basicLayout' })} key="1">
            <Form {...layout} form={form} hideRequiredMark={true} onValuesChange={handleFormValueChange}>
              <Form.Item
                name="type"
                label={<RequireItem label={intl.formatMessage({ id: 'detail.purchase.pageName' })} isRequire={true} />}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'detail.purchase.message23' })}${intl.formatMessage({
                      id: 'detail.purchase.pageName',
                    })}`,
                  },
                ]}
              >
                <Select disabled={link === 'detail'}>
                  <Select.Option value={1}>{intl.formatMessage({ id: 'detail.purchase.doorIndex' })}</Select.Option>
                  <Select.Option value={2}>{intl.formatMessage({ id: 'detail.purchase.aboutUs' })}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="link"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'detail.purchase.doorLink' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'purchase.fangwengaiyemiandelianjie' })}>
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
                    label={intl.formatMessage({ id: 'detail.purchase.doorTitle' })}
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.label20' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'detail.purchase.message22' })}${intl.formatMessage({
                      id: 'detail.purchase.doorTitle',
                    })}`,
                  },
                ]}
              >
                <Input
                  maxLength={50}
                  disabled={link === 'detail'}
                  placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder5' })}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'detail.purchase.doorDescription' })}
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.label21' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'detail.purchase.message22' })}${intl.formatMessage({
                      id: 'detail.purchase.doorDescription',
                    })}`,
                  },
                ]}
              >
                <Input.TextArea
                  maxLength={100}
                  disabled={link === 'detail'}
                  rows={5}
                  placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder8' })}
                />
              </Form.Item>
              <Form.Item
                name="keywords"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'detail.purchase.keywords' })}
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.label22' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'detail.purchase.message22' })}${intl.formatMessage({
                      id: 'detail.purchase.keywords',
                    })}`,
                  },
                ]}
              >
                <Input.TextArea
                  disabled={link === 'detail'}
                  rows={5}
                  placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder8' })}
                  maxLength={100}
                />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}

export default PurchasSeoAdded

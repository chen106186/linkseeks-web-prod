import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Tabs, Form, Select, Tooltip, Input, Typography } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { RequireItem } from '@apps/components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useLocation, usePrompt } from '@linkseeks/router-core'
import { SHOP_SELECT_NAME, DOORTYPE } from '@/constants/procurement'
import { getCommodityWebSeoWebGet, postCommodityWebSeoWebAdd, postCommodityWebSeoWebUpdate } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { REQUEST_HEADER } from '@apps/constants'

const { TabPane } = Tabs
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const ShopSeoAdded = () => {
  const { id } = usePageStatus()
  const { pathname } = useLocation()
  const link = pathname.split('/')[pathname.split('/').length - 1]
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState<boolean>(false)
  const intl = useIntl()

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
        link: link ? `${REQUEST_HEADER}${link}` : '',
        doorType: DOORTYPE.STORE_DOORTYPE,
        name: SHOP_SELECT_NAME[type],
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
      getCommodityWebSeoWebGet({ id: String(id) }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        form.setFieldsValue({
          ...res.data,
          link: res.data.link ? res.data.link.replace(/^(https?:\/\/)/, '') : '',
        })
      })
    }
  }, [])

  return (
    <PageHeaderWrapper
      extra={
        link !== 'detail' && (
          // <AuthButton type="custom" code={id ? 'edit' : 'add'}>
          <Button type="primary" loading={confirmLoading} onClick={handleSave}>
            {intl.formatMessage({ id: 'common.button.save' })}
          </Button>
          // </AuthButton>
        )
      }
    >
      <Card>
        <Tabs type="card">
          <TabPane tab={intl.formatMessage({ id: 'shop.seo.tab.basic' })} key="1">
            <Form {...layout} form={form} hideRequiredMark={true} onValuesChange={handleFormValueChange}>
              <Form.Item
                name="type"
                label={<RequireItem label={intl.formatMessage({ id: 'shop.seo.table.name' })} isRequire={true} />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'shop.seo.form.name.required' }) }]}
              >
                <Select disabled={link === 'detail'}>
                  <Select.Option value={1}>{intl.formatMessage({ id: 'shop.seo.table.home' })}</Select.Option>
                  <Select.Option value={2}>{intl.formatMessage({ id: 'shop.seo.table.about' })}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="link"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'shop.seo.table.link' })}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.link.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
              >
                <Input
                  disabled={link === 'detail'}
                  addonBefore={<Typography.Text type="secondary">{REQUEST_HEADER}</Typography.Text>}
                />
              </Form.Item>
              <Form.Item
                name="title"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'shop.seo.table.title' })}
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.title.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[{ required: true, message: intl.formatMessage({ id: 'shop.seo.form.title.required' }) }]}
              >
                <Input
                  maxLength={50}
                  disabled={link === 'detail'}
                  placeholder={`${intl.formatMessage({ id: 'common.text.longest' })}50${intl.formatMessage({
                    id: 'common.unit.individual.chinese',
                  })}`}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'shop.seo.table.description' })}
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.description.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[{ required: true, message: intl.formatMessage({ id: 'shop.seo.form.description.required' }) }]}
              >
                <Input.TextArea
                  disabled={link === 'detail'}
                  rows={5}
                  placeholder={`${intl.formatMessage({ id: 'common.text.longest' })}200${intl.formatMessage({
                    id: 'common.unit.individual.chinese',
                  })}`}
                  maxLength={200}
                />
              </Form.Item>
              <Form.Item
                name="keywords"
                label={
                  <RequireItem
                    label={intl.formatMessage({ id: 'shop.seo.table.keywords' })}
                    isRequire={true}
                    brief={
                      <Tooltip placement="top" title={intl.formatMessage({ id: 'shop.seo.table.keywords.tip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    }
                  />
                }
                rules={[{ required: true, message: intl.formatMessage({ id: 'shop.seo.form.keywords.required' }) }]}
              >
                <Input.TextArea
                  disabled={link === 'detail'}
                  rows={5}
                  placeholder={`${intl.formatMessage({ id: 'common.text.longest' })}100${intl.formatMessage({
                    id: 'common.unit.individual.chinese',
                  })}`}
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

export default ShopSeoAdded

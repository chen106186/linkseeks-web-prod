/*
 * @Description: 结算规则配置 -> 发票管理 -> 新增发票 / 修改发票
 */

import React, { useState, useEffect, Fragment } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from '@linkseeks/ui'
import { Form, Radio, Input, Switch, Button, Space } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { IReceiptProps } from '../../common/type'
import {
  getSettlementInvoiceMessageDetails,
  postSettlementInvoiceMessageAdd,
  postSettlementInvoiceMessageUpdate,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import { SaveIcon } from '@linkseeks/icons'

const Info: React.FC = () => {
  const intl = useIntl()
  const { id, preview } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(true)
  const [form] = Form.useForm()
  const translate = useWebIntl()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const isAdd = !id && !preview

  const handleSubmit = (value: IReceiptProps) => {
    const serviceActions = isAdd ? postSettlementInvoiceMessageAdd : postSettlementInvoiceMessageUpdate

    let tempData = { ...value, isDefault: value.isDefault ? 1 : 0 }
    const postData = isAdd ? tempData : { ...tempData, id }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData as any).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.push('/balance/settleRules/receipt')
      }
    })
  }

  useEffect(() => {
    if (id) {
      async function fetchData() {
        const { data } = await getSettlementInvoiceMessageDetails({ id })
        form.setFieldsValue({ ...data, isDefault: data.isDefault === 1 })
      }
      fetchData()
    }
  }, [id])

  const handleCancel = () => {
    history.push('/balance/settleRules/receipt')
  }

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  }

  return (
    <PageHeaderWrapper
      onBack={() => history.goBack()}
      extra={
        <Space>
          <Button type="primary" icon={<SaveIcon />} loading={submitLoading} onClick={() => form.submit()}>
            {translate('web.common.save')}
          </Button>
          <Button onClick={handleCancel}>{translate('web.common.cancel')}</Button>
        </Space>
      }
    >
      <Card title={translate('web.resource.mall.fapiaozhutixinxi')}>
        <Form {...layout} form={form} labelAlign="left" colon={false} onFinish={handleSubmit}>
          <Form.Item
            name="type"
            label={translate('web.resource.balance.kaijuleixing')}
            rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
            initialValue={1}
          >
            <Radio.Group
              onChange={(e) => {
                if (e.target.value === 2) {
                  form.setFieldValue('kind', 1)
                  form.validateFields()
                }
              }}
            >
              <Radio value={1}>{translate('web.common.qiye')}</Radio>
              <Radio value={2}>{translate('web.common.geren')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item dependencies={['type']} shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const type = getFieldValue('type')

              return (
                <Fragment>
                  <Form.Item
                    name="kind"
                    label={translate('web.resource.balance.fapiaozhonglei')}
                    rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
                    initialValue={1}
                  >
                    <Radio.Group>
                      <Radio value={1}>{translate('web.resource.order.zengzhishuifapiao')}</Radio>
                      {type === 1 && (
                        <Radio value={2}>{translate('web.resource.order.zengzhishuizhuangyongfapiao')}</Radio>
                      )}
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item dependencies={['kind']} shouldUpdate noStyle>
                    {({ getFieldValue: childGetFieldValue }) => {
                      const kind = childGetFieldValue('kind')

                      return (
                        <Fragment>
                          <Form.Item
                            name="invoiceTitle"
                            label={translate('web.resource.balance.fapiaotaitou')}
                            rules={[{ required: true, message: translate('web.common.qingxuanze') }]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name="taxNo"
                            label={translate('web.resource.balance.nashuihao')}
                            rules={[
                              {
                                required: type === 1,
                                message: translate('web.common.qingxuanze'),
                              },
                              {
                                pattern: /^[a-zA-Z0-9]+$/,
                                message: translate('web.resource.balance.qingshuruzhengquedenashuihao'),
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name="bankOfDeposit"
                            label={translate('web.resource.balance.kaihuhang')}
                            rules={[
                              {
                                required: kind === 2,
                                message: translate('web.common.qingshuru'),
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name="account"
                            label={translate('web.common.account')}
                            rules={[
                              {
                                required: kind === 2,
                                message: translate('web.common.qingshuru'),
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name="address"
                            label={translate('web.common.address')}
                            rules={[
                              {
                                required: kind === 2,
                                message: translate('web.common.qingshuru'),
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name="tel"
                            label={translate('web.common.telNumber')}
                            rules={[
                              {
                                required: kind === 2,
                                message: translate('web.common.qingshuru'),
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Fragment>
                      )
                    }}
                  </Form.Item>
                </Fragment>
              )
            }}
          </Form.Item>
          <Form.Item name="isDefault" label={translate('web.resource.logistics.shifoumoren')} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Info

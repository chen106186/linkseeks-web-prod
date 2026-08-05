import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Select, Card, Checkbox, Tooltip } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { InfoCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { getProductCustomerGetCustomerAttribute } from '@apps/apis'

const { Option } = Select

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}

const viewAtttributes: React.FC<{}> = () => {
  const intl = useIntl()
  const [menuForm] = Form.useForm()
  const [queryId, setQueryId] = useState('')
  const [formValue, setFormValue] = useState<any>({})

  const { id } = useQuery()

  useEffect(() => {
    if (id) {
      setQueryId(id)
      getProductCustomerGetCustomerAttribute({ id: id }).then((res) => {
        const { data } = res
        setFormValue(data)
        menuForm.setFieldsValue(data)
      })
    }
  }, [])

  return (
    <PageHeaderWrapper
      onBack={() => history.goBack()}
      title={intl.formatMessage({ id: 'classAndProperty.viewAttributes.title' })}
    >
      <Card>
        <Row gutter={[36, 36]}>
          <Col span={16}>
            <Form
              form={menuForm}
              name="edit_infomation"
              layout="horizontal"
              labelAlign="left"
              {...layout}
              initialValues={formValue}
            >
              <Row gutter={24}>
                <Col span={18}>
                  <Form.Item name="id" label={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.id' })}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    name="groupName"
                    label={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.groupName' })}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    name="name"
                    label={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.name' })}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    name="type"
                    label={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.type' })}
                  >
                    <Select disabled>
                      <Option value={2}>
                        {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.type.2' })}
                      </Option>
                      <Option value={1}>
                        {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.type.1' })}
                      </Option>
                      <Option value={3}>
                        {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.type.3' })}
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item label={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting' })}>
                    <Row>
                      <Col span={24}>
                        <Form.Item name="isMust" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled>
                            {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting.isEmpty' })}
                          </Checkbox>
                        </Form.Item>
                      </Col>
                      {/* <Col span={24}>
                      <Form.Item name="isImage" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled>{intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting.isImage' })}</Checkbox></Form.Item>
                      <Tooltip title={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting.isImage.tooltip' })}>
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="isName" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled>{intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting.isName' })}</Checkbox></Form.Item>
                      <Tooltip title={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting.isName.tooltip' })}>
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Col> */}
                      <Col span={24}>
                        <Form.Item name="isPrice" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled>
                            {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting.isPrice' })}
                          </Checkbox>
                        </Form.Item>
                        <Tooltip
                          title={intl.formatMessage({
                            id: 'classAndProperty.viewAttributes.form.setting.isPrice.tooltip',
                          })}
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="isSearch" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled>
                            {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.setting.isSearch' })}
                          </Checkbox>
                        </Form.Item>
                        <Tooltip
                          title={intl.formatMessage({
                            id: 'classAndProperty.viewAttributes.form.setting.isSearch.tooltip',
                          })}
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    label={intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.isEnable' })}
                    name="isEnable"
                  >
                    {formValue.isEnable ? (
                      <>
                        <span className="commonStatusValid"></span>
                        {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.isEnable.1' })}
                      </>
                    ) : (
                      <>
                        <span className="commonStatusInvalid"></span>
                        {intl.formatMessage({ id: 'classAndProperty.viewAttributes.form.isEnable.2' })}
                      </>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default viewAtttributes

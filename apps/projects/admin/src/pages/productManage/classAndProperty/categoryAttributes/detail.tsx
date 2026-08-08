import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Select, Card, Checkbox, Tooltip } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { InfoCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { getProductPlatformGetAttribute } from '@apps/apis'

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
  const [menuForm] = Form.useForm()
  const [formValue, setFormValue] = useState<any>({})

  const query = useQuery()

  useEffect(() => {
    if (query.id) {
      getProductPlatformGetAttribute({ id: query.id }).then((res) => {
        const { data } = res
        setFormValue(data)
        menuForm.setFieldsValue(data)
      })
    }
  }, [])

  return (
    <PageHeaderWrapper title="查看品类属性">
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
                  <Form.Item name="id" label="属性ID">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item name="groupName" label="属性组名">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item name="name" label="属性名称">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item name="type" label="展示方式">
                    <Select disabled>
                      <Option value={2}>多选</Option>
                      <Option value={1}>单选</Option>
                      <Option value={3}>输入</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item label="自定义显示字段">
                    <Row>
                      <Col span={24}>
                        <Form.Item name="isMust" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled>必填</Checkbox>
                        </Form.Item>
                      </Col>
                      {/* <Col span={24}>
                      <Form.Item name="isImage" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled>上传图片</Checkbox></Form.Item>
                      <Tooltip title="勾选后对于此属性的属性值可以上传属性值的对应图片！">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="isName" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled>名称属性</Checkbox></Form.Item>
                      <Tooltip title="勾选后对于此属性的属性值会将属性值添加到商品名称之后，中间以/区隔！">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Col> */}
                      <Col span={24}>
                        <Form.Item name="isPrice" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled>价格属性</Checkbox>
                        </Form.Item>
                        <Tooltip title="勾选后对于此属性的每个属性值会在商品发布时按属性设置不同的价格！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="isSearch" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled>搜索属性</Checkbox>
                        </Form.Item>
                        <Tooltip title="勾选后对于此属性会在商城店铺商品列表进行筛选操作时作为筛选项！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item label="状态" name="isEnable">
                    {formValue.isEnable ? (
                      <>
                        <span className="commonStatusValid" />
                        有效
                      </>
                    ) : (
                      <>
                        <span className="commonStatusInvalid" />
                        无效
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

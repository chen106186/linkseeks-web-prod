import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { Row, Col, Form, Input, Select, Popconfirm, Button, Card, Checkbox, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
// import type { ColumnType } from 'antd/lib/table/interface'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { validatorByte } from '@/utils/regExp'
import { getProductPlatformGetAttribute, postProductPlatformSaveOrUpdateAttribute } from '@apps/apis'

const { Option } = Select

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 12,
  },
}

const AddAtttribute: React.FC<{}> = () => {
  const [menuForm] = Form.useForm()
  const [formValue, setFormValue] = useState<any>({})
  const [isSpecial, setIsSpecial] = useState(false) //特殊属性禁用展示方式
  const { id, pageStatus } = usePageStatus()
  const typeValue = Form.useWatch('type', menuForm)

  useEffect(() => {
    if (typeValue === 1 || typeValue === 3) {
      // 如果选择单选或者输入时，则自动将规格属性取消
      menuForm.setFieldValue('isPrice', false)
    }
  }, [typeValue])

  useEffect(() => {
    if (id) {
      getProductPlatformGetAttribute({ id: id }).then((res) => {
        const { data } = res
        setFormValue(data)
        menuForm.setFieldsValue(data)
      })
    }
  }, [])

  const handleSubmitAllSetting = () => {
    menuForm
      .validateFields()
      .then((values: any) => {
        delete values.attributeShow
        if (JSON.stringify(values.attribute) === '{}') {
          delete values.attribute
        }
        postProductPlatformSaveOrUpdateAttribute(values).then((res) => {
          if (res.code === 1000) history.goBack()
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <PageHeaderWrapper title={pageStatus === 0 ? '新建属性' : pageStatus === 1 ? '编辑属性' : '查看属性'}>
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
              autoComplete="off"
            >
              <Row gutter={24}>
                <Col span={18}>
                  <Form.Item
                    name="groupName"
                    label="属性组名"
                    rules={[
                      {
                        required: true,
                        message: '输入属性组名!',
                      },
                      {
                        validator: (r, v, c) => validatorByte(r, v, c, 20),
                      },
                    ]}
                  >
                    <Input placeholder="输入属性组名" disabled={pageStatus === 2} />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item name="id" style={{ display: 'none' }}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    name="name"
                    label="属性名称"
                    rules={[
                      {
                        required: true,
                        message: '输入属性名称!',
                      },
                      {
                        pattern: /^(?![0-9])/,
                        message: '不能以数字开头',
                      },
                      {
                        pattern:
                          /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]*$/,
                        message: '不能包含特殊字符',
                      },
                      {
                        validator: (r, v, c) => validatorByte(r, v, c, 20),
                      },
                    ]}
                  >
                    <Input placeholder="输入属性名称" disabled={pageStatus === 2} />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    name="type"
                    label="展示方式"
                    rules={[
                      {
                        required: true,
                        message: '展示方式为必须项!',
                      },
                    ]}
                  >
                    <Select placeholder="选择展示方式" disabled={pageStatus === 2 || isSpecial}>
                      <Option value={1}>单选</Option>
                      <Option value={2}>多选</Option>
                      <Option value={3}>输入</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item label="属性设置">
                    <Row>
                      <Col span={24}>
                        <Form.Item name="isMust" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled={pageStatus === 2}>必填</Checkbox>
                        </Form.Item>
                      </Col>
                      {/* <Col span={24}>
                        <Form.Item name="isImage" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled={pageStatus === 2}>上传图片</Checkbox></Form.Item>
                        <Tooltip title="勾选后对于此属性的属性值可以上传属性值的对应图片！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="isName" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled={pageStatus === 2}>名称属性</Checkbox></Form.Item>
                        <Tooltip title="勾选后对于此属性的属性值会将属性值添加到商品名称之后，中间以/区隔！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col> */}
                      <Col span={24}>
                        {/* 规格属性 -> 原价格属性 */}
                        <Form.Item name="isPrice" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled={pageStatus === 2 || typeValue === 1 || typeValue === 3 || !typeValue}>
                            规格属性
                          </Checkbox>
                        </Form.Item>
                        <Tooltip title="勾选后对于此属性的每个属性值会在商品发布时按属性设置不同的价格！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="isSearch" valuePropName="checked" initialValue={false} noStyle>
                          <Checkbox disabled={pageStatus === 2}>搜索属性</Checkbox>
                        </Form.Item>
                        <Tooltip title="勾选后对于此属性会在商城店铺商品列表进行筛选操作时作为筛选项！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item label="状态" name="isEnable" initialValue={true}>
                    {id ? (
                      <>
                        {formValue.isEnable ? (
                          <>
                            <span className="commonStatusValid"></span>有效
                          </>
                        ) : (
                          <>
                            <span className="commonStatusInvalid"></span>无效
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="commonStatusValid"></span>有效
                      </>
                    )}
                  </Form.Item>
                </Col>
                {pageStatus !== 2 && (
                  <Col span={18}>
                    <Form.Item {...tailLayout}>
                      <Button
                        onClick={handleSubmitAllSetting}
                        type="primary"
                        style={{ marginTop: 32, marginBottom: 16, marginRight: 24 }}
                      >
                        保存
                      </Button>
                      <Popconfirm
                        title="确定要取消吗？"
                        onConfirm={() => history.goBack()}
                        onCancel={() => console.log('取消')}
                        okText="是"
                        cancelText="否"
                      >
                        <Button style={{ marginTop: 32, marginBottom: 16 }}>取消</Button>
                      </Popconfirm>
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddAtttribute

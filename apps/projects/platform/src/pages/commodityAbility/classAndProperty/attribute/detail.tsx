import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Form, Input, Select, Popconfirm, Button, Card, Checkbox, Tooltip } from 'antd'
import { LinkOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { ColumnType } from 'antd/lib/table/interface'
import ReturnEle from '@/components/ReturnEle'
import { validatorByte } from '@/utils/regExp'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import ModalTable from '@/components/ModalTable'
import {
  getProductCustomerGetCustomerAttribute,
  getProductPlatformGetAttributeList,
  postProductCustomerSaveOrUpdateCustomerAttribute,
} from '@apps/apis'

const { Option } = Select

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 12,
  },
}

const AddAtttribute: React.FC<{}> = () => {
  const intl = useIntl()
  const [menuForm] = Form.useForm()
  const [roleVisible, setRoleVisible] = useState(false)
  const [selectRow, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
  const [formValue, setFormValue] = useState<any>({})
  const [queryId, setQueryId] = useState('') // 判断编辑依据
  const [isSee, setIsSee] = useState(false) // 判断查看依据
  const [isSpecial, setIsSpecial] = useState(false) //特殊属性禁用展示方式
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const { isMultiple, id = '', isSee: preivew } = useQuery()
  const typeValue = Form.useWatch('type', menuForm)

  useEffect(() => {
    if (typeValue === 1 || typeValue === 3) {
      // 如果选择单选或者输入时，则自动将规格属性取消
      menuForm.setFieldValue('isPrice', false)
    }
  }, [typeValue])
  useEffect(() => {
    if (id) {
      if (preivew) {
        setIsSee(true)
      }
      setQueryId(id)
      getProductCustomerGetCustomerAttribute({ id }).then((res) => {
        const { data } = res
        setFormValue(data)
        menuForm.setFieldsValue(data)
        // let onlyShow = data.attribute ? `${data.attribute.groupName}-->${data.attribute.name}` : ''
        let onlyShow = data.attribute ? data.attribute.name : ''
        menuForm.setFieldsValue({ attributeShow: onlyShow })
      })
    }
  }, [])

  const handleSubmitAllSetting = () => {
    setSubmitLoading(true)
    menuForm
      .validateFields()
      .then((values: any) => {
        delete values.attributeShow
        if (JSON.stringify(values.attribute) === '{}') {
          delete values.attribute
        }
        postProductCustomerSaveOrUpdateCustomerAttribute(values).then((res) => {
          if (res.code === 1000) {
            history.goBack()
          } else {
            setSubmitLoading(false)
          }
        })
      })
      .catch((error) => {
        setSubmitLoading(false)
        console.error(error)
      })
  }

  const handleSelectOk = () => {
    setRoleVisible(false)
    if (selectRow.length) {
      //@ts-ignore
      menuForm.setFieldsValue({ attribute: selectRow[0], attributeShow: selectRow[0].name })
    }
  }

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      getProductPlatformGetAttributeList({
        ...params,
        name: params.name || '',
        groupName: params.groupName || '',
        isEnable: true,
      }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.groupName' }),
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (text: number) => {
        let txt = new Map([
          [1, intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.type.1' })],
          [2, intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.type.2' })],
          [3, intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.type.3' })],
        ])
        return txt.get(text)
      },
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.isEmpty' }),
      dataIndex: 'isMust',
      key: 'isMust',
      render: (text: boolean) =>
        text
          ? intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.isEmpty.1' })
          : intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.columns.isEmpty.2' }),
    },
  ]

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRow(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
      console.log(selectedRowKeys, selectedRows, 'rowSelection')
    },
  }

  const handleLink = () => {
    setRoleVisible(true)
    let menuFormData = menuForm.getFieldValue('attribute')
    let chooseKey = (menuFormData && menuFormData.id) || null
    setSelectedRowKeys([chooseKey])
  }

  // 特殊属性切换
  const onChangeSpecial = (e, type) => {
    if (e.target.checked) {
      setIsSpecial(true)
      menuForm.setFieldsValue({ type: 2 })
    } else {
      setIsSpecial(false)
    }
    if (type === 'isDate') menuForm.setFieldsValue({ isArea: false })
    if (type === 'isArea') menuForm.setFieldsValue({ isDate: false })
  }

  return (
    <PageHeaderWrapper
      title={
        queryId
          ? `${
              isSee
                ? intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.title.1' })
                : intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.title.2' })
            }`
          : intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.title.3' })
      }
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
              colon={false}
              autoComplete="off"
            >
              <Form.Item
                name="groupName"
                label={intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.groupName' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'classAndProperty.attribute.addAttribute.form.groupName.message',
                    }),
                  },
                  {
                    validator: (r, v, c) => validatorByte(r, v, c, 20),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'classAndProperty.attribute.addAttribute.form.groupName.placeholder',
                  })}
                  disabled={isSee}
                />
              </Form.Item>
              <Form.Item name="id" style={{ display: 'none' }}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="name"
                label={intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.name' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'classAndProperty.attribute.addAttribute.form.name.message',
                    }),
                  },
                  {
                    pattern: /^(?![0-9])/,
                    message: intl.formatMessage({
                      id: 'classAndProperty.attribute.addAttribute.form.name.placeholder.error1',
                    }),
                  },
                  {
                    pattern:
                      /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]*$/,
                    message: intl.formatMessage({
                      id: 'classAndProperty.attribute.addAttribute.form.name.placeholder.error2',
                    }),
                  },
                  {
                    validator: (r, v, c) => validatorByte(r, v, c, 20),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'classAndProperty.attribute.addAttribute.form.name.placeholder',
                  })}
                  disabled={isSee}
                />
              </Form.Item>
              <Form.Item
                name="type"
                label={intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.type' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'classAndProperty.attribute.addAttribute.form.type.message',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'classAndProperty.attribute.addAttribute.form.type.placeholder',
                  })}
                  disabled={isSee || isSpecial}
                >
                  <Option value={1}>
                    {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.type.option.1' })}
                  </Option>
                  <Option value={2}>
                    {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.type.option.2' })}
                  </Option>
                  <Option value={3}>
                    {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.type.option.3' })}
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item label={intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.setting' })}>
                <Row>
                  <Col span={24}>
                    <Form.Item name="isMust" valuePropName="checked" initialValue={false} noStyle>
                      <Checkbox disabled={isSee}>
                        {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEmpty' })}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  {/* <Col span={24}>
                        <Form.Item name="isImage" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled={isSee}>上传图片</Checkbox></Form.Item>
                        <Tooltip title="勾选后对于此属性的属性值可以上传属性值的对应图片！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="isName" valuePropName="checked" initialValue={false} noStyle><Checkbox disabled={isSee}>名称属性</Checkbox></Form.Item>
                        <Tooltip title="勾选后对于此属性的属性值会将属性值添加到商品名称之后，中间以/区隔！">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Col> */}
                  <Col span={24}>
                    {/* 规格属性 -> 原价格属性 */}
                    <Form.Item name="isPrice" valuePropName="checked" initialValue={false} noStyle>
                      <Checkbox disabled={isSee || typeValue === 3 || typeValue === 1 || !typeValue}>
                        {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isPrice' })}
                      </Checkbox>
                    </Form.Item>
                    <Tooltip
                      title={intl.formatMessage({
                        id: 'classAndProperty.attribute.addAttribute.form.isPrice.tooltip',
                      })}
                    >
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="isSearch" valuePropName="checked" initialValue={false} noStyle>
                      <Checkbox disabled={isSee}>
                        {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isSearch' })}
                      </Checkbox>
                    </Form.Item>
                    <Tooltip
                      title={intl.formatMessage({
                        id: 'classAndProperty.attribute.addAttribute.form.isSearch.tooltip',
                      })}
                    >
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Col>
                  {/* 日期 地区属性 */}
                  {/* <Col span={24}>
                      <Form.Item name="isDate" valuePropName="checked" initialValue={false} noStyle>
                        <Checkbox onChange={(e) => onChangeSpecial(e, 'isDate')} disabled={isSee}>日期属性</Checkbox>
                      </Form.Item>
                      <Tooltip title="勾选后此属性作为日期属性，日期属性的属性值无需在属性值管理中设置，系统自动取自然日作为属性值">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="isArea" valuePropName="checked" initialValue={false} noStyle>
                        <Checkbox onChange={(e) => onChangeSpecial(e, 'isArea')} disabled={isSee}>地区属性</Checkbox>
                      </Form.Item>
                      <Tooltip title="勾选后此属性作为地区属性，地区属性的属性值无需手工在属性值管理中设置，系统自动取地区数据作为属性值">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Col> */}
                </Row>
              </Form.Item>
              <Form.Item
                name={['attribute', 'id']}
                label={
                  <span>
                    {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.attributeId' })}&nbsp;
                    <Tooltip
                      title={intl.formatMessage({
                        id: 'classAndProperty.attribute.addAttribute.form.attributeId.tooltip',
                      })}
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                style={{ display: 'none' }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item name={['attribute', 'groupName']} style={{ display: 'none' }}>
                <Input disabled />
              </Form.Item>
              {!(isMultiple === 'true') && (
                <Form.Item
                  label={
                    <span>
                      {intl.formatMessage({
                        id: 'classAndProperty.attribute.addAttribute.form.attributeGroupName',
                      })}
                      &nbsp;
                      <Tooltip
                        title={intl.formatMessage({
                          id: 'classAndProperty.attribute.addAttribute.form.attributeGroupName.tooltip',
                        })}
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                >
                  <Row>
                    <Col span={20}>
                      <Form.Item name={['attribute', 'name']} style={{ display: 'none' }}>
                        <Input disabled />
                      </Form.Item>
                      <Form.Item name="attributeShow" noStyle>
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button
                        type="primary"
                        icon={<LinkOutlined />}
                        disabled={isSee}
                        style={{ backgroundColor: '#909399', borderColor: '#909399' }}
                        onClick={() => handleLink()}
                      >
                        {intl.formatMessage({
                          id: 'classAndProperty.attribute.addAttribute.form.attributeGroupName.button',
                        })}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              )}
              <Form.Item
                label={intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEnable' })}
                name="isEnable"
                initialValue={true}
              >
                {!isSee &&
                  (queryId ? (
                    <>
                      <span className="commonStatusInvalid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEnable.1' })}
                    </>
                  ) : (
                    <>
                      <span className="commonStatusValid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEnable.2' })}
                    </>
                  ))}
                {isSee &&
                  (formValue.isEnable ? (
                    <>
                      <span className="commonStatusValid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEnable.2' })}
                    </>
                  ) : (
                    <>
                      <span className="commonStatusInvalid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEnable.1' })}
                    </>
                  ))}
              </Form.Item>
              {!isSee && (
                <Form.Item {...tailLayout}>
                  <Button
                    loading={submitLoading}
                    onClick={handleSubmitAllSetting}
                    type="primary"
                    style={{ marginTop: 32, marginBottom: 16, marginRight: 24 }}
                  >
                    {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isSee.button.1' })}
                  </Button>
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'classAndProperty.attribute.addAttribute.form.isSee.popconfirm',
                    })}
                    onConfirm={() => history.goBack()}
                    onCancel={() => console.log('取消')}
                    okText={intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isSee.okText' })}
                    cancelText={intl.formatMessage({
                      id: 'classAndProperty.attribute.addAttribute.form.isSee.cancelText',
                    })}
                  >
                    <Button style={{ marginTop: 32, marginBottom: 16 }}>
                      {intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isSee.button.2' })}
                    </Button>
                  </Popconfirm>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>

        <ModalTable
          modalTitle={intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.modalTable' })}
          confirm={handleSelectOk}
          cancel={() => setRoleVisible(false)}
          visible={roleVisible}
          columns={columns}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={{
            ctx: {
              schema: {
                type: 'object',
                properties: {
                  groupName: {
                    type: 'string',
                    'x-component': 'ModalSearch',
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'classAndProperty.attribute.addAttribute.modalTable.groupName',
                      }),
                      align: 'flex-left',
                    },
                  },
                  [FORM_FILTER_PATH]: {
                    type: 'object',
                    'x-component': 'flex-layout',
                    'x-component-props': {
                      rowStyle: {
                        flexWrap: 'nowrap',
                        style: {
                          marginRight: 0,
                        },
                      },
                      colStyle: {
                        marginTop: 20,
                      },
                    },
                    properties: {
                      name: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({
                            id: 'classAndProperty.attribute.addAttribute.modalTable.name',
                          }),
                        },
                      },
                      submit: {
                        'x-component': 'Submit',
                        'x-mega-props': {
                          span: 1,
                        },
                        'x-component-props': {
                          children: intl.formatMessage({
                            id: 'classAndProperty.attribute.addAttribute.modalTable.submit',
                          }),
                        },
                      },
                    },
                  },
                },
              },
              components: { ModalSearch: Search, Submit },
              effects: ($, actions) => {
                actions.reset()
                useStateFilterSearchLinkageEffect($, actions, 'groupName', FORM_FILTER_PATH)
              },
            },
          }}
          resetModal={{
            destroyOnClose: true,
          }}
          tableProps={{
            rowKey: 'id',
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddAtttribute

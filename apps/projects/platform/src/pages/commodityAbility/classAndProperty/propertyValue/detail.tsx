import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Form, Input, Popconfirm, Button, Card, Modal, Tooltip, Cascader, Spin } from 'antd'
import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import ReturnEle from '@/components/ReturnEle'
import TabTree, { createTreeActions } from '@/components/TabTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { validatorByte } from '@/utils/regExp'
import { treeReduction } from '@/utils'
import {
  getProductCustomerGetCustomerAttributeValue,
  getProductPlatformGetAttributeValueTree,
  postProductCustomerSaveOrUpdateCustomerAttributeValue,
} from '@apps/apis'
import { getManageAreaAll } from '@apps/apis'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 12,
  },
}

const plateformActions = createTreeActions()

const fetchPlatformTreeData = async (params?) => {
  // 平台后台树
  const res = await getProductPlatformGetAttributeValueTree()
  return res
}

const AddPropertyValue: React.FC<{}> = () => {
  const intl = useIntl()
  const query = useQuery()
  const [attrValueForm] = Form.useForm()
  const [roleVisible, setRoleVisible] = useState(false)
  const [formValue, setFormValue] = useState<any>({})
  const [selectKey, setSelectKey] = useState<any>(undefined)
  const [selectRow, setSelectRow] = useState<any>({})
  const [attributeValueId, setAttributeValueId] = useState(null) // url传入 可判断是编辑/新增
  const [isSee, setIsSee] = useState(false) // 判断查看依据
  const [specialType, setSpecialType] = useState<any>() // 1-日期; 2-地区
  const [proviceOptions, setProviceOptions] = useState<any>()
  const [areaString, setAreaString] = useState<string>()
  const [customPlateformExpandkeys, setCustomPlateformExpandkeys] = useState<any>()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const { isMultiple } = query

  /* 平台属性值列表树 */
  const { treeData } = useTreeTabs({
    fetchMenuData: fetchPlatformTreeData,
  })

  useEffect(() => {
    //获取省市区
    getManageAreaAll().then((res) => {
      if (res.code === 1000) {
        let arr = [...res.data] //裁去最后一级别
        for (let index in arr) {
          for (let _index in arr[index].areaRespList) {
            let o: any = arr[index].areaRespList
            o[_index].areaRespList = null
          }
        }
        setProviceOptions(arr)
      }
    })

    const { attrId, attrName, attrValueId, type, isSee } = query

    if (attrId) {
      attrValueForm.setFieldsValue({ customerAttributeId: Number(attrId) })
    }
    if (attrName) {
      attrValueForm.setFieldsValue({ attributeName: attrName })
    }
    if (attrValueId) {
      // 编辑
      attrValueForm.setFieldsValue({ id: attrValueId })
      setAttributeValueId(attrValueId)
      getProductCustomerGetCustomerAttributeValue({ id: attrValueId }).then((res) => {
        if (res.code === 1000) {
          setFormValue(res.data)
          attrValueForm.setFieldsValue(res.data)
        }
      })
    }
    if (isSee) {
      setIsSee(true)
    }
    if (type) {
      setSpecialType(type)
    }
  }, [])

  const handleSubmitAllSetting = () => {
    setSubmitLoading(true)
    attrValueForm
      .validateFields()
      .then((values) => {
        const { attrId, attrName, type, isMultiple } = query
        let pararms: any = { ...values }
        delete pararms.attributeName
        if (JSON.stringify(pararms.attributeValue) === '{}') {
          delete pararms.attributeValue
        }
        if (type === '2') {
          pararms.value = areaString
        }
        if (type === '1') {
          pararms.value =
            intl.formatMessage({ id: 'classAndProperty.addPropertyValue.datetText' }) +
            parseInt(Math.random() * 100 + '')
        }
        if (pararms.attributeValue && pararms.attributeValue?.id) {
          pararms.attributeValueId = pararms.attributeValue.id
        }

        postProductCustomerSaveOrUpdateCustomerAttributeValue(pararms).then((res) => {
          if (res.code === 1000) {
            history.push(
              `/commodityAbility/classAndProperty/propertyValue?attrId=${attrId}&attrName=${attrName}&type=${type}&isMultiple=${isMultiple}`,
            )
          } else {
            setSubmitLoading(false)
          }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleSelectOk = () => {
    setRoleVisible(false)
    if (selectKey) attrValueForm.setFieldsValue({ attributeValue: { id: selectKey, value: selectRow._title } })
  }

  const handleCancel = () => {
    setRoleVisible(false)
    plateformActions.setExpandedKeys && plateformActions.setExpandedKeys([])
  }

  const handleLink = () => {
    setRoleVisible(true)
    let formData = attrValueForm.getFieldValue('attributeValue')
    let chooseKey = (formData && formData.id) || undefined
    setSelectKey(chooseKey)
    if (formData?.id) {
      const reductData = Object.values(treeReduction(treeData))
      // 筛选同名称的id
      let aimKey = reductData.filter((item) => item['title'] === formData.value).map((_item) => _item['id'])
      setCustomPlateformExpandkeys(aimKey)
      // todo 树回显 无法选中 可能是因为key为含字母字符串原因
      plateformActions.setSelectKey && plateformActions.setSelectKey(aimKey[0])
    }
  }

  const handlePlateformSelect = (key, node) => {
    if (node.children && node.children.length > 0) {
      return
    }
    if (key) {
      let arr = key.split('_')
      setSelectKey(arr[arr.length - 1] * 1)
      setSelectRow(node)
    }
  }

  const onCommodityAreaChange = (value: any, selected: any) => {
    let arr = selected.map((item) => item.name)

    if (arr.length > 1) {
      setAreaString(arr.join('/'))
    } else {
      setAreaString(arr.toString())
    }
  }

  return (
    <PageHeaderWrapper
      title={
        attributeValueId
          ? `${
              isSee
                ? intl.formatMessage({ id: 'classAndProperty.addPropertyValue.title.1' })
                : intl.formatMessage({ id: 'classAndProperty.addPropertyValue.title.2' })
            }`
          : intl.formatMessage({ id: 'classAndProperty.addPropertyValue.title.3' })
      }
    >
      <Card>
        <Row gutter={[36, 36]}>
          <Col span={16}>
            <Form
              form={attrValueForm}
              name="edit_infomation"
              layout="horizontal"
              labelAlign="left"
              {...layout}
              initialValues={formValue}
              colon={false}
              autoComplete="off"
            >
              <Form.Item
                hidden
                name="id"
                label={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.id' })}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name={'customerAttributeId'}
                hidden
                label={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.customerAttributeId' })}
              >
                <Input disabled />
              </Form.Item>
              {specialType !== '1' && specialType !== '2' && (
                <Form.Item
                  name="value"
                  label={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.value' })}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.value.message' }),
                    },
                    {
                      validator: (r, v, c) => validatorByte(r, v, c, 12),
                    },
                  ]}
                >
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'classAndProperty.addPropertyValue.form.value.placeholder',
                    })}
                    disabled={isSee}
                  />
                </Form.Item>
              )}
              {specialType === '2' && (
                <Form.Item
                  name="value"
                  label={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.value' })}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.value.message' }),
                    },
                  ]}
                >
                  <Cascader
                    disabled={isSee}
                    options={proviceOptions}
                    changeOnSelect
                    onChange={onCommodityAreaChange}
                    placeholder={intl.formatMessage({
                      id: 'classAndProperty.addPropertyValue.form.value.cascader',
                    })}
                    fieldNames={{ label: 'name', value: 'code', children: 'areaRespList' }}
                    notFoundContent={<Spin size="small" />}
                  />
                </Form.Item>
              )}
              {specialType === '1' && (
                <Form.Item
                  name="value"
                  label={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.value' })}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '输入属性值名称!',
                  //   },
                  // ]}
                >
                  <span>{intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.span' })}</span>
                </Form.Item>
              )}
              {!(isMultiple === 'true') && (
                <Form.Item
                  label={
                    <span>
                      {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.paltformValue' })}&nbsp;
                      <Tooltip
                        title={intl.formatMessage({
                          id: 'classAndProperty.addPropertyValue.form.paltformValue.tooltip',
                        })}
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                >
                  <Row>
                    <Col span={20} style={{ display: 'none' }}>
                      <Form.Item name={['attributeValue', 'id']}>
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={20}>
                      <Form.Item name={['attributeValue', 'value']}>
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button
                        type="primary"
                        icon={<LinkOutlined />}
                        style={{ backgroundColor: '#909399', borderColor: '#909399' }}
                        onClick={handleLink}
                        disabled={isSee}
                      >
                        {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.paltformValue.button' })}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              )}
              <Form.Item
                name="attributeName"
                label={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.attributeName' })}
              >
                <Input
                  disabled
                  placeholder={intl.formatMessage({
                    id: 'classAndProperty.addPropertyValue.form.attributeName.placeholder',
                  })}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.isEnable' })}
                name="isEnable"
                initialValue={true}
              >
                {!isSee &&
                  (attributeValueId ? (
                    <>
                      <span className="commonStatusInvalid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.isEnable.2' })}
                    </>
                  ) : (
                    <>
                      <span className="commonStatusValid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.isEnable.1' })}
                    </>
                  ))}
                {isSee &&
                  (formValue.isEnable ? (
                    <>
                      <span className="commonStatusValid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.isEnable.1' })}
                    </>
                  ) : (
                    <>
                      <span className="commonStatusInvalid"></span>
                      {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.isEnable.2' })}
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
                    {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.ctr.1' })}
                  </Button>
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'classAndProperty.addPropertyValue.form.ctr.2.popconfirm.title',
                    })}
                    okText={intl.formatMessage({
                      id: 'classAndProperty.addPropertyValue.form.ctr.2.popconfirm.okText',
                    })}
                    cancelText={intl.formatMessage({
                      id: 'classAndProperty.addPropertyValue.form.ctr.2.popconfirm.cancelText',
                    })}
                    onConfirm={() => history.goBack()}
                  >
                    <Button style={{ marginTop: 32, marginBottom: 16 }}>
                      {intl.formatMessage({ id: 'classAndProperty.addPropertyValue.form.ctr.2' })}
                    </Button>
                  </Popconfirm>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
        <Modal
          title={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.modal' })}
          open={roleVisible}
          onOk={handleSelectOk}
          onCancel={handleCancel}
          okText={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.modal.okText' })}
          cancelText={intl.formatMessage({ id: 'classAndProperty.addPropertyValue.modal.cancelText' })}
          className="useTreeModalWrapper"
          // destroyOnClose={true}
        >
          <TabTree
            fetchData={(params) => fetchPlatformTreeData(params)}
            treeData={treeData}
            handleSelect={(key, node) => handlePlateformSelect(key, node)}
            customKey="id"
            actions={plateformActions}
            customExpandkeys={customPlateformExpandkeys}
          />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddPropertyValue

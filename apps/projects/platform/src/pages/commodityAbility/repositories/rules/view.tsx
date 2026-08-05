import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Button, Form, Card, Select, Checkbox, Radio, Table, Image, Input, Tree, Tooltip } from 'antd'
import { SaveOutlined, PlusOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { useIntl } from '@linkseeks/i18n'
import { usePrompt } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import {
  getProductSelectGetInvoicesReduce,
  getProductFreightSpaceRuleConfigGetFreightSpaceRuleConfig,
  postProductFreightSpaceRuleConfigSaveOrUpdateFreightSpaceRuleConfig,
  getProductCustomerGetCustomerCategoryTree,
} from '@apps/apis'
import styles from './rules.less'
import ProductDrawer from '../components/productDrawer'

const { Option } = Select

const RepositoriesRules: React.FC = () => {
  const intl = useIntl()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const [invoicesPlusOptions, setInvoicesPlusOptions] = useState<any>([])
  const [isCreate, setIsCreate] = useState<boolean>(true)
  const [productDrawerVisible, setProductDrawerVisible] = useState<boolean>(false)
  const productRef = useRef({})
  const [rulesForm] = Form.useForm()
  const [type, setType] = useState<number>(1)
  const [treeData, setTreeData] = useState<any[]>([])
  const [customerCategoryIdList, setCustomerCategoryIdList] = useState<any[]>([])
  const [commodityList, setCommodityList] = useState<any[]>([])
  const [invoicesTypeId, setInvoicesTypeId] = useState<any>()
  const [isSync, setIsSync] = useState<boolean>(false)
  const [keyWord, setKeyWord] = useState<string>('')
  const typeList = [
    { value: 1, text: intl.formatMessage({ id: 'repositories.rules.typeList.1' }) },
    { value: 2, text: intl.formatMessage({ id: 'repositories.rules.typeList.2' }) },
    { value: 3, text: intl.formatMessage({ id: 'repositories.rules.typeList.3' }) },
  ]
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const _commodityList = useMemo(() => {
    if (keyWord) {
      const _list = commodityList?.filter((item) => item.name.indexOf(keyWord) >= 0) || []
      return _list
    } else {
      return commodityList
    }
  }, [keyWord, commodityList])

  useEffect(() => {
    getProductSelectGetInvoicesReduce().then((res) => {
      if (res.code === 1000) {
        setInvoicesPlusOptions(res.data)
      }
    })
    getProductFreightSpaceRuleConfigGetFreightSpaceRuleConfig().then((res) => {
      if (res.code === 1000 && res.data) {
        rulesForm.setFieldsValue({
          isSync: res.data?.isSync,
          invoicesTypeId: res.data?.warehouseAutoOut?.invoicesTypeId,
        })
        setIsSync(res.data?.isSync)
        setType(res.data?.type)
        setIsCreate(res.data?.warehouseAutoOut?.isCreate ?? true)
        setCustomerCategoryIdList(res.data?.customerCategoryIdList?.map((item) => String(item)) ?? [])
        setCommodityList(res.data?.commodityList)
        setInvoicesTypeId(res.data?.warehouseAutoOut?.invoicesTypeId)
      }
    })
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      if (res.code === 1000) {
        setTreeData(res.data)
      }
    })
  }, [])

  const formSubmit = () => {
    rulesForm.validateFields().then((values) => {
      const _params = {
        type,
        isSync: values.isSync,
        customerCategoryIdList,
        commoditySkuIdList: commodityList?.map((item) => item.id) || [],
        warehouseAutoOut: {
          isCreate,
          invoicesTypeId: values.invoicesTypeId,
        },
      }
      setSubmitLoading(true)
      postProductFreightSpaceRuleConfigSaveOrUpdateFreightSpaceRuleConfig(_params).finally(() => {
        setUnsaved(false)
        setSubmitLoading(false)
      })
    })
  }

  const _deleteItem = (record) => {
    let _commodityList = [...commodityList]
    const _index = _commodityList.findIndex((item) => item.id === record.id)
    _commodityList.splice(_index, 1)
    setCommodityList(_commodityList)
  }

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'repositories.components.batchPositionSetting.columnsSetProduct.id' }),
      dataIndex: 'commodityId',
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpintupian' }),
      dataIndex: 'mainPic',
      width: 80,
      render: (text) => <Image width={32} height={32} src={text} />,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.batchPositionSetting.columnsSetProduct.name' }),
      dataIndex: 'name',
      width: 448,
    },
    {
      title: intl.formatMessage({
        id: 'repositories.components.batchPositionSetting.columnsSetProduct.customerCategoryName',
      }),
      dataIndex: 'customerCategoryName',
      width: 192,
      render: (_, record) => {
        if (record?.customerCategory) {
          return record?.customerCategory.name
        }
        return record.customerCategoryName
      },
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.batchPositionSetting.columnsSetProduct.brandName' }),
      dataIndex: 'brandName',
      width: 192,
      render: (_, record) => {
        if (record?.brand) {
          return record?.brand.name
        }
        return record.brandName
      },
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.unit' }),
      dataIndex: 'unitName',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.columns.type' }),
      dataIndex: 'type',
      width: 256,
      render: (text) => intl.formatMessage({ id: `commodity.products.columns.type.${text}` }),
    },
    {
      title: intl.formatMessage({ id: 'repositories.columns.option' }),
      dataIndex: 'action',
      width: 128,
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              _deleteItem(record)
            }}
          >
            {intl.formatMessage({ id: 'repositories.components.positionSetting.tableColumns.ctl.button' })}
          </Button>
        )
      },
      fixed: 'right',
    },
  ]

  const drawerConfirm = (data: any) => {
    setCommodityList(data)
    setProductDrawerVisible(false)
  }

  return (
    <div>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'repositories.rules.title' })}
        extra={
          <Button key="1" type="primary" icon={<SaveOutlined />} loading={submitLoading} onClick={formSubmit}>
            {intl.formatMessage({ id: 'common.button.save', defaultMessage: '保存' })}
          </Button>
        }
        backDom={false}
      >
        <Form
          form={rulesForm}
          colon={false}
          name="basic"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          autoComplete="off"
          onValuesChange={() => {
            setUnsaved(true)
          }}
        >
          <Card title={intl.formatMessage({ id: 'repositories.rules.card.1' })} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#91959B', marginBottom: 8 }}>
              {intl.formatMessage({ id: 'repositories.rules.card.1.tips' })}
            </div>
            <Form.Item
              label={intl.formatMessage({ id: 'repositories.rules.card.1.isSync' })}
              name="isSync"
              noStyle
              valuePropName="checked"
            >
              <Checkbox
                checked={isSync}
                onChange={(e) => {
                  setIsSync(e.target.checked)
                  rulesForm.setFieldsValue({ isSync: e.target.checked })
                }}
              >
                {intl.formatMessage({ id: 'repositories.rules.card.1.isSync' })}
              </Checkbox>
            </Form.Item>
          </Card>
          {isSync && (
            <Card
              title={
                <Tooltip title={intl.formatMessage({ id: 'repositories.rules.card.2.tooltips' })}>
                  {intl.formatMessage({ id: 'repositories.rules.card.2' })}
                  <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
                </Tooltip>
              }
              style={{ marginBottom: 16 }}
              extra={
                <Input
                  placeholder={intl.formatMessage({ id: 'components.sousuo', defaultMessage: '搜索' })}
                  suffix={<SearchOutlined />}
                  style={{ width: 256 }}
                  onChange={(e) => {
                    setKeyWord(e.target.value)
                  }}
                />
              }
            >
              <div style={{ fontSize: 12, color: '#91959B', marginBottom: 8 }}>
                {intl.formatMessage({ id: 'repositories.rules.card.2.tips' })}
              </div>
              <Radio.Group
                className={styles['invoice-type']}
                value={type}
                onChange={(e) => {
                  setType(e.target.value as number)
                }}
              >
                {typeList.map((item) => (
                  <Radio value={item.value} key={item.value}>
                    {item.text}
                  </Radio>
                ))}
              </Radio.Group>
              {type === 2 && (
                <div>
                  <div style={{ marginTop: 24, marginBottom: 24 }}>
                    <Button
                      type="default"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setProductDrawerVisible(true)
                      }}
                    >
                      {intl.formatMessage({ id: 'repositories.components.positionSetting.modalTable.2' })}
                    </Button>
                  </div>
                  <Table dataSource={_commodityList} columns={defaultColumns} scroll={{ x: '100%' }} />
                </div>
              )}
              {type === 3 && (
                <div className={styles['customer-tree']}>
                  <Tree
                    checkable
                    autoExpandParent
                    defaultExpandAll
                    treeData={treeData}
                    checkedKeys={customerCategoryIdList}
                    onCheck={(e) => {
                      setCustomerCategoryIdList(e)
                    }}
                    fieldNames={{ title: 'name', key: 'id', children: 'children' }}
                  />
                </div>
              )}
            </Card>
          )}
          {isSync && (
            <Card title={intl.formatMessage({ id: 'repositories.rules.card.3' })}>
              <Form.Item label={intl.formatMessage({ id: 'repositories.rules.card.3.isCreate' })} name="isCreate">
                <>
                  <Checkbox
                    disabled
                    checked={isCreate}
                    onChange={(e) => {
                      setIsCreate(e.target.checked)
                    }}
                  >
                    {intl.formatMessage({ id: 'repositories.rules.card.3.isCreate.text' })}
                  </Checkbox>
                  <div style={{ fontSize: 12, color: '#91959B', marginTop: 8 }}>
                    {intl.formatMessage({ id: 'repositories.rules.card.3.isCreate.tips' })}
                  </div>
                </>
              </Form.Item>
              {isCreate && (
                <Form.Item
                  label={intl.formatMessage({ id: 'repositories.rules.card.3.invoicesTypeId' })}
                  name="invoicesTypeId"
                  required={isCreate}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'repositories.rules.card.3.invoicesTypeId.message' }),
                    },
                  ]}
                >
                  <>
                    <Select
                      value={invoicesTypeId}
                      onChange={(value) => {
                        setInvoicesTypeId(value)
                        rulesForm.setFieldsValue({ invoicesTypeId: value })
                      }}
                    >
                      {invoicesPlusOptions?.map((_item) => (
                        <Option key={`invoicesTypeId_${_item.id}`} value={_item.id}>
                          {_item.name}
                        </Option>
                      ))}
                    </Select>
                    <div style={{ fontSize: 12, color: '#91959B', marginTop: 8 }}>
                      {intl.formatMessage({ id: 'repositories.rules.card.3.invoicesTypeId.tips' })}
                    </div>
                  </>
                </Form.Item>
              )}
            </Card>
          )}
        </Form>
      </PageHeaderWrapper>
      <ProductDrawer
        currentRef={productRef}
        visible={productDrawerVisible}
        cancel={() => {
          setProductDrawerVisible(false)
        }}
        confirm={drawerConfirm}
        selectRows={commodityList || []}
      />
    </div>
  )
}

export default RepositoriesRules

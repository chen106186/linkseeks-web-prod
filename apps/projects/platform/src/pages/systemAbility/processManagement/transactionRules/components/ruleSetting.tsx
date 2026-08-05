import React, { useEffect, useState } from 'react'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { EyeAuthButton } from '@apps/components'
import { findItemAndDelete } from '@/utils'
import { ISchemaFormActions, ISchema, FormEffectHooks } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { createAddContractTemplateEffect } from '../effects'
import { PlusOutlined } from '@ant-design/icons'
import { Button, message, Table } from 'antd'
import NiceForm from '@/components/NiceForm'
import ModalTable from '@/components/ModalTable'
import { GlobalConfig } from '@/global/config'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Search from '@/components/NiceForm/components/Search'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import SelectProcesss from './selectProcesss'
import { usePaymentTable } from '../model/usePaymentTable'
import { help } from '@/pages/transaction/common'
import { fectchShopListsSource } from '@/utils/type'
import {
  getProductCommodityCommonGetCommodityListBySeller,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
} from '@apps/apis'
import { getOrderTradeProcessGet, getOrderTradeProcessProductPage } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

export interface RuleSettingProps {
  addSchemaAction: ISchemaFormActions
  schema: ISchema
  onFieldChange?()
  formSubmit?(values)
}

const RuleSetting: React.FC<RuleSettingProps> = (props) => {
  const { addSchemaAction, schema, formSubmit, onFieldChange = () => {} } = props
  const [visibleChannelRroduct, setVisibleChannelRroduct] = useState(false)
  const [productRowSelection, productRowCtl] = useRowSelectionTable({ customKey: 'id' })
  const [productsLength, setProductsLength] = useState(0)
  const [initValue, setInitialValue] = useState({})
  // const [idNotInList, setIdNotInList] = useState([])
  const intl = useIntl()
  const { id, pageStatus } = usePageStatus()

  const { paymentColumns, paymentComponents, ...sectionProps } = usePaymentTable(addSchemaAction)

  const fetchProductList = async (params) => {
    const shopIds = addSchemaAction.getFieldValue('shopIds')
    const processType = addSchemaAction.getFieldValue('processType')
    if (shopIds.length) {
      let shopInfo: any = GlobalConfig.web.shopInfo.filter((item) => item.id === shopIds[0])
      console.log(shopIds, shopInfo)
      const res = await getProductCommodityCommonGetCommodityListBySeller({
        ...params,
        // 查跨境
        isCrossBorder: processType === 7,
        // shopType: shopInfo[0].type,
        // environment: shopInfo[0].environment,
        shopId: shopInfo['id'],
        statusList: [4, 5, 6, 7],
        // idNotInList: idNotInList,
      })
      return res.data
    } else {
      message.error(
        intl.formatMessage({ id: 'processRuleSetting.qingxianxuanzeshi', defaultMessage: '请先选择适用商城！' }),
      )
      return []
    }
  }

  // table删除商品
  const handleDeleteTable = (id) => {
    const value = addSchemaAction.getFieldValue('products')
    addSchemaAction.setFieldValue('products', findItemAndDelete(value, id))
  }

  const handleAddProductBtn = () => {
    const checkBoxs = addSchemaAction.getFieldValue('products')
    productRowCtl.setSelectedRowKeys(checkBoxs.map((v) => v.id))
    productRowCtl.setSelectRow(checkBoxs)
    setVisibleChannelRroduct(true)
  }

  // 新增商品
  const tableAddButton = (
    <Button
      style={{ marginBottom: 16 }}
      block
      icon={<PlusOutlined />}
      disabled={pageStatus === PageStatus.PREVIEW}
      onClick={handleAddProductBtn}
      type="dashed"
    >
      {intl.formatMessage({ id: 'processRuleSetting.xuanzezhidingshang', defaultMessage: '选择指定商品' })}
    </Button>
  )

  const tableColumns = [
    {
      dataIndex: 'id',
      title: 'ID',
      key: 'id',
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({ id: 'processRuleSetting.shangpinmingcheng', defaultMessage: '商品名称' }),
      key: 'name',
      render: (_, record) => (
        <EyeAuthButton
          url={
            record.productType === 1
              ? `/commodityAbility/commodity/products/directChannel/detail?id=${record.commodityId}`
              : `/commodityAbility/commodity/products/detail?id=${record.commodityId}`
          }
        >
          {_}
        </EyeAuthButton>
      ),
    },
    {
      dataIndex: 'customerCategoryName',
      title: intl.formatMessage({ id: 'processRuleSetting.pinlei', defaultMessage: '品类' }),
      key: 'customerCategoryName',
    },
    {
      dataIndex: 'brandName',
      title: intl.formatMessage({ id: 'processRuleSetting.pinpai', defaultMessage: '品牌' }),
      key: 'brandName',
    },
    {
      dataIndex: 'priceType',
      title: intl.formatMessage({ id: 'processRuleSetting.shangpindingjia', defaultMessage: '商品定价' }),
      key: 'priceType',
      render: (text) => {
        if (text === 1) return intl.formatMessage({ id: 'processRuleSetting.xianhuojiage', defaultMessage: '现货价格' })
        else if (text === 2)
          return intl.formatMessage({ id: 'processRuleSetting.jiagexuyaoxun', defaultMessage: '价格需要询价' })
        else if (text === 3)
          return intl.formatMessage({ id: 'processRuleSetting.jifenduihuanshang', defaultMessage: '积分兑换商品' })
      },
    },
    {
      dataIndex: 'ctl',
      title: intl.formatMessage({ id: 'processRuleSetting.caozuo', defaultMessage: '操作' }),
      render: (_, record) => (
        <Button type="link" disabled={pageStatus === PageStatus.PREVIEW} onClick={() => handleDeleteTable(record.id)}>
          {intl.formatMessage({ id: 'processRuleSetting.shanchu', defaultMessage: '删除' })}
        </Button>
      ),
    },
  ]

  // 规则设置表单提交
  const handleSubmit = async (values) => {
    formSubmit && formSubmit(values)
  }

  // 商品添加弹窗控制
  const handleOkAddProduct = async () => {
    setVisibleChannelRroduct(false)
    setProductsLength(productRowCtl.selectRow.length)
    console.log(productRowCtl.selectRow)
    // productType 1是 0否渠道商品
    addSchemaAction.setFieldValue(
      'products',
      productRowCtl.selectRow.map((item) => ({
        ...item,
        productType: item.isChannelCommodity === undefined ? item.productType : +item.isChannelCommodity,
      })),
    )
    clearModalParams()
  }

  const handleCancelAddProduct = () => {
    setVisibleChannelRroduct(false)
    clearModalParams()
  }

  const clearModalParams = () => {
    let currentState = JSON.parse(sessionStorage.getItem('currentState'))
    let result = { ...currentState, queryParams: {}, current: 1 }
    sessionStorage.setItem('currentState', JSON.stringify(result))
  }

  const columnsSetProduct: any[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      key: 'id',
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({ id: 'processRuleSetting.shangpinmingcheng', defaultMessage: '商品名称' }),
      key: 'name',
    },
    {
      dataIndex: 'customerCategoryName',
      title: intl.formatMessage({ id: 'processRuleSetting.pinlei', defaultMessage: '品类' }),
      key: 'customerCategoryName',
    },
    {
      dataIndex: 'brandName',
      title: intl.formatMessage({ id: 'processRuleSetting.pinpai', defaultMessage: '品牌' }),
      key: 'brandName',
    },
    {
      dataIndex: 'priceType',
      title: intl.formatMessage({ id: 'processRuleSetting.shangpindingjia', defaultMessage: '商品定价' }),
      key: 'priceType',
      render: (text) => {
        if (text === 1) return intl.formatMessage({ id: 'processRuleSetting.xianhuojiage', defaultMessage: '现货价格' })
        else if (text === 2)
          return intl.formatMessage({ id: 'processRuleSetting.jiagexuyaoxun', defaultMessage: '价格需要询价' })
        else if (text === 3)
          return intl.formatMessage({ id: 'processRuleSetting.jifenduihuanshang', defaultMessage: '积分兑换商品' })
      },
    },
  ]

  // 商品弹框高级筛选
  const formProduct: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        'x-component': 'ModalSearch',
        'x-component-props': {
          placeholder: intl.formatMessage({
            id: 'processRuleSetting.qingshurushangpin',
            defaultMessage: '请输入商品名称',
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
          customerCategoryId: {
            type: 'string',
            'x-component': 'SearchSelect',
            'x-component-props': {
              placeholder: intl.formatMessage({
                id: 'processRuleSetting.qingxuanzepinlei',
                defaultMessage: '请选择品类',
              }),
              className: 'fixed-ant-selected-down',
              fetchSearch: getProductSelectGetSelectCustomerCategory,
              style: {
                width: 160,
              },
            },
          },
          brandId: {
            type: 'string',
            'x-component': 'SearchSelect',
            'x-component-props': {
              placeholder: intl.formatMessage({
                id: 'processRuleSetting.qingxuanzepinpai',
                defaultMessage: '请选择品牌',
              }),
              fetchSearch: getProductSelectGetSelectBrand,
              style: {
                width: 160,
              },
            },
          },
          submit: {
            'x-component': 'Submit',
            'x-mega-props': {
              span: 1,
            },
            'x-component-props': {
              children: intl.formatMessage({ id: 'processRuleSetting.chaxun', defaultMessage: '查询' }),
            },
          },
        },
      },
    },
  }

  useEffect(() => {
    async function getInitValue() {
      const { data }: any = await getOrderTradeProcessGet({ processId: id })
      if (data.allProducts === false) {
        const res = await getBindingProducts({ id: id.toString(), current: '1', pageSize: '1000' })
        addSchemaAction.setFieldState('products', (state) => {
          state.value = res.data.map((item) => ({
            ...item,
            id: item.skuId,
            commodityId: item.productId,
            customerCategoryName: item.category,
            brandName: item.brand,
          }))
        })
        setProductsLength(res.totalCount)
      }
      addSchemaAction.setFieldValue('hasContract', data.hasContract ? true : false)
      addSchemaAction.setFieldValue('baseProcessId', data.baseProcessId)
      addSchemaAction.setFieldValue('allProducts', data.allProducts)
      if (data.payments.length) {
        const { payments } = data
        const source = payments.map((item) => ({
          ...item,
          nodes: item.nodes.map((_item) => ({
            ..._item,
            serialNo: item.serialNo,
          })),
        }))
        addSchemaAction.setFieldValue('payments', source)
      }
      if (data.processType === 1) {
        addSchemaAction.setFieldState('expireHours', (state) => {
          state.visible = true
        })
      }
      if (pageStatus === PageStatus.PREVIEW) {
        data.expireHours =
          data.expireHours + intl.formatMessage({ id: 'processRuleSetting.xiaoshi', defaultMessage: '小时' })
      }
      data.shopIds = [data.shopId]
      setInitialValue(data)
    }
    if (id != '') {
      getInitValue()
    }
  }, [id])

  // 拿到绑定的商品
  const getBindingProducts = async ({ id = '1', current = '1', pageSize = '10' }) => {
    const res = await getOrderTradeProcessProductPage({ processId: id, current, pageSize, name: null })
    return res.data
  }

  const paginationChange = async (page: number, size: number) => {
    if (id !== '') {
      const result = await getBindingProducts({ id, current: page.toString(), pageSize: size.toString() })
      addSchemaAction.setFieldValue(
        'products',
        result.data.map((item) => ({
          ...item,
          id: item.skuId,
          commodityId: item.productId,
          customerCategoryName: item.category,
          brandName: item.brand,
          productType: item.productType,
        })),
      )
    }
  }

  // // 查询已设置交易规则的列表
  // const fatchSetedProducts = (id) => {
  //   let baseProcessId = addSchemaAction.getFieldValue("baseProcessId")
  //   addSchemaAction.getFieldState("baseProcessId", state => {
  //     let type = state.dataSource.filter(item => item.baseProcessid === baseProcessId)[0]["processType"]
  //     getOrderTradingRulesProductIdList({shopId: id, type}).then(res => {
  //       const { data, code } = res
  //       setIdNotInList(() => data?.productIds || [])
  //     })
  //   })
  // }

  // 自定义支付批次配置组件
  const CustomPayments = (props) => {
    const { value } = props
    return (
      <div>
        {value?.length
          ? value.map((item) => (
              <div key={`out_${item.serialNo}`}>
                <p>{`${intl.formatMessage({ id: 'processRuleSetting.zhifupici', defaultMessage: '支付批次' })}${
                  item.serialNo
                }`}</p>
                <Table
                  components={paymentComponents}
                  dataSource={item.nodes}
                  columns={paymentColumns}
                  pagination={false}
                />
              </div>
            ))
          : null}
      </div>
    )
  }

  return (
    <>
      <NiceForm
        previewPlaceholder=" "
        editable={pageStatus !== PageStatus.PREVIEW}
        initialValues={initValue}
        expressionScope={{
          tableColumns,
          paymentColumns,
          paymentComponents,
          tableAddButton,
          paginationChange,
          productsLength,
          help,
        }}
        components={{
          SelectProcesss,
          CustomPayments,
        }}
        effects={($, { setFieldState, setFieldValue }) => {
          $('onFormMount').subscribe(async () => {
            const data = await fectchShopListsSource({ type: 1 })
            if (data && data.length) {
              setFieldState('shopIds', (state) => {
                state.props['x-component-props'].dataSource = data.sort((a, b) => a.type - b.type)
              })
            }
          })
          FormEffectHooks.onFormInputChange$().subscribe(() => {
            onFieldChange()
          })
          createAddContractTemplateEffect(addSchemaAction)
          $('onFieldValueChange', 'hasContract').subscribe((parentState) => {
            setFieldState('contractTempleId', (state) => {
              state.visible = parentState.value
            })
          })
          $('onFieldInputChange', 'shopIds').subscribe((parentState) => {
            setFieldState('allProducts', (state) => {
              state.value = true
            })
            // fatchSetedProducts(parentState.value[0])
          })
          // 此项隐藏操作在编辑下能无效
          $('onFieldValueChange', 'baseProcessId').subscribe((parentState) => {
            const selectedObject = parentState.dataSource.filter((item) => item.baseProcessid === parentState.value)[0]
            if (selectedObject) {
              setFieldValue('processType', selectedObject['processType'])
            }
            // 不是下单交易类型 隐藏取消时间
            if (selectedObject && selectedObject['processType'] !== 1) {
              setFieldState('MEGA_LAYOUT1_1', (state) => {
                state.visible = false
              })
              setFieldState('expireHours', (state) => {
                state.visible = false
              })
            } else {
              setFieldState('MEGA_LAYOUT1_1', (state) => {
                state.visible = true
              })
              setFieldState('expireHours', (state) => {
                state.visible = true
              })
            }
            // 不是多次支付 隐藏支付配置
            if (selectedObject && selectedObject['payTimes'] > 0) {
              setFieldState('payments', (state) => {
                state.visible = true
              })
              setFieldValue(
                'payments',
                selectedObject['payments'].map((item) => ({
                  ...item,
                  // 冗余批次号到环节里面
                  nodes: item['nodes'].map((_item) => ({ ..._item, serialNo: item['serialNo'] })),
                })),
              )
            } else {
              setFieldState('payments', (state) => {
                state.visible = false
              })
            }
          })
          // 处理编辑下支付配置的显示隐藏
          $('onFieldValueChange', 'payments').subscribe((parentState) => {
            if (pageStatus === PageStatus.EDIT) {
              if (parentState.value.length) {
                setFieldState('payments', (state) => {
                  state.visible = true
                })
              }
            }
          })
          // 处理编辑下电子的显示隐藏
          $('onFieldValueChange', 'processType').subscribe((parentState) => {
            if (pageStatus === PageStatus.EDIT) {
              if (parentState.value === 1) {
                setFieldState('MEGA_LAYOUT1_1', (state) => {
                  state.visible = true
                })
                setFieldState('expireHours', (state) => {
                  state.visible = true
                })
              } else {
                setFieldState('MEGA_LAYOUT1_1', (state) => {
                  state.visible = false
                })
                setFieldState('expireHours', (state) => {
                  state.visible = false
                })
              }
            }
          })
        }}
        onSubmit={handleSubmit}
        actions={addSchemaAction}
        schema={schema}
      />

      {/* 选择商品 */}
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'processRuleSetting.xuanzeshangpin', defaultMessage: '选择商品' })}
        confirm={handleOkAddProduct}
        cancel={handleCancelAddProduct}
        visible={visibleChannelRroduct}
        columns={columnsSetProduct}
        rowSelection={productRowSelection}
        resetModal={{ destroyOnClose: true }}
        fetchTableData={(params) => fetchProductList(params)}
        formilyProps={{
          ctx: {
            schema: formProduct,
            components: {
              ModalSearch: Search,
              SearchSelect,
              Submit,
            },
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            },
          },
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />
    </>
  )
}

RuleSetting.defaultProps = {}

export default RuleSetting

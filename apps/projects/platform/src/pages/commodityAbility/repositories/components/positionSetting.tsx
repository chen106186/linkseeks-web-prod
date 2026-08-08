import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { ISchemaFormActions, ISchema, FormEffectHooks, FormPath } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { createAddRepositoryEffect } from '../effects'
import { PlusOutlined, LinkOutlined } from '@ant-design/icons'
import { Button, Cascader, message, Select } from 'antd'
import NiceForm from '@/components/NiceForm'
import ModalTable from '@/components/ModalTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Search from '@/components/NiceForm/components/Search'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import { MALL_TYPE } from '@/constants'
import { fectchShopListsSource } from '@/utils/type'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getMemberManagePageitems, postMemberManageAllPageByshoptype } from '@apps/apis'
import {
  postProductCommodityCommonGetCommodityListByStock,
  getProductFreightSpaceDetails,
  getProductFreightSpaceMamberList,
  getProductMaterielGetMateriel,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
  getProductSelectGetWarehouse,
  getProductInventoryByItemNo,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'

export interface PositionSettingProps {
  addSchemaAction: ISchemaFormActions
  schema: ISchema
  onFieldChange?()
  formSubmit?(values)
}

const priceTypeMaps = {
  [MALL_TYPE[0]]: [1, 2],
  [MALL_TYPE[1]]: [3],
  [MALL_TYPE[2]]: [1],
  [MALL_TYPE[3]]: [1],
  [MALL_TYPE[4]]: [3],
}

const transferLabelToValue = (list: any[], label: string, value: string) => {
  return list.map((item) => {
    return {
      label: item[label],
      value: item[value],
    }
  })
}

const BUSINESS_INTEGRATE = [1, 2] // 企业商城， 积分商城
const CANAL = [3, 4, 5] // 渠道商城

const PositionSetting: React.FC<PositionSettingProps> = (props) => {
  const intl = useIntl()
  const translate = useWebIntl()
  const all = [
    {
      label: intl.formatMessage({ id: 'repositories.components.positionSetting.all' }),
      value: 0,
    },
  ]
  const { addSchemaAction, schema, formSubmit, onFieldChange = () => {} } = props
  const [visibleChannelMember, setVisibleChannelMember] = useState(false)
  const [visibleChannelRroduct, setVisibleChannelRroduct] = useState(false)

  const [memberRowSelection, memberRowCtl] = useRowSelectionTable({ customKey: 'memberId' })
  const [productRowSelection, productRowCtl] = useRowSelectionTable({ type: 'radio' })
  const { id, preview, pageStatus, isSync } = usePageStatus()
  // const initValue = useInitValue(getWarehouseFreightSpaceDetails)
  const [shopTypeState, setShopType] = useState(0)
  const [productState, setProductState] = useState<any>({})
  const [membersFilterState, setMemberFilter] = useState({ level: [], role: [], type: [] })
  const [initValue, setInitialValue] = useState({})
  const [membersLength, setMembersLength] = useState(0)
  // const [channelMemberState, setChannelMemberState] = useState({channelMemberRoleId: '', channelMemberIdList: []})

  // useUnitPreview(initValue, addSchemaAction)

  useEffect(() => {
    const getAllShopList = async () => {
      const allShopList = await fectchShopListsSource({ type: 1 })
      if (allShopList && allShopList.length > 0) {
        addSchemaAction.setFieldState('shopIds', (state) => {
          state.props['x-component-props'] = {
            dataSource: allShopList,
          }
        })
      }
    }
    // 拿到所有的角色等级， 根据shopType, 商品的类容重新拿
    async function getMemberLevel() {
      const response = await getMemberManagePageitems({ roleTypeEnum: '2' })
      const { levels = [], memberTypes = [], roles = [] } = response.data
      const allLevels = all.concat(transferLabelToValue(levels, 'levelTag', 'level'))
      const allMemberTypes = all.concat(transferLabelToValue(memberTypes, 'memberTypeName', 'memberType'))
      const allRoles = all.concat(transferLabelToValue(roles, 'roleName', 'roleId'))

      setMemberFilter((state) => {
        return {
          ...state,
          level: allLevels,
          role: allRoles,
          type: allMemberTypes,
        }
      })
    }
    if (preview !== '1') {
      getMemberLevel()
    }
    if (isSync === 'true') {
      addSchemaAction.setFieldState('inventory', (state) => {
        state.props['x-component-props'] = {
          disabled: true,
        }
      })
    }
    getAllShopList()
  }, [])

  useEffect(() => {
    async function getInitValue() {
      const { data } = await getProductFreightSpaceDetails({ id: id })
      if (data.isAllMemberShare === 0) {
        const res = await getBindingMember({ id: id.toString(), current: '1', pageSize: '10' })
        setInitialValue({ ...data, applyMember: res.data })
      } else {
        setInitialValue(data)
      }
    }
    if (id != '') {
      getInitValue()
    }
  }, [id])

  // 拿到绑定会员
  const getBindingMember = async ({ id = '1', current = '1', pageSize = '10' }) => {
    const res = await getProductFreightSpaceMamberList({ id, current, pageSize })
    return res.data
  }

  const fetchProductList = async (params) => {
    const warehouseId = addSchemaAction.getFieldValue('warehouseId')
    const _paramse = {
      ...params,
      shopType: 1,
      environment: 1,
      priceTypeList: [],
    }

    if (params.priceTypeList && params.priceTypeList.length > 0) {
      _paramse.priceTypeList = params.priceTypeList.map((item) => item[0])
    }
    if (warehouseId) {
      _paramse.warehouseIdList = [warehouseId]
    }
    const res = await postProductCommodityCommonGetCommodityListByStock(_paramse, { ctlType: 'none' })
    return res.data
  }

  // 会员选择后的表格
  const handleDeleteTable = (id) => {
    const value = addSchemaAction.getFieldValue('applyMember')
    const res = value.filter((item) => item.memberId != id)
    addSchemaAction.setFieldValue('applyMember', res)
  }

  const handleAddMemberBtn = () => {
    const itemNo = addSchemaAction.getFieldValue('productId')
    if (!itemNo) {
      message.error(intl.formatMessage({ id: 'repositories.components.positionSetting.error.2' }))
      return
    }
    const checkBoxs = addSchemaAction.getFieldValue('applyMember')
    memberRowCtl.setSelectedRowKeys(checkBoxs.map((v) => v.memberId))
    memberRowCtl.setSelectRow(checkBoxs)
    setVisibleChannelMember(true)
  }

  // 弹出商品选择
  const handleAddProductBtn = () => {
    setVisibleChannelRroduct(true)
  }
  // 新增会员
  const tableAddButton =
    preview !== '1' ? (
      <Button style={{ marginBottom: 16 }} block icon={<PlusOutlined />} onClick={handleAddMemberBtn} type="dashed">
        {intl.formatMessage({ id: 'repositories.components.positionSetting.tableAddButton' })}
      </Button>
    ) : null

  const tableColumns = [
    { dataIndex: 'memberId', title: 'ID', align: 'center' },
    {
      dataIndex: 'name',
      align: 'center',
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.tableColumns.name' }),
    },
    {
      dataIndex: 'memberTypeName',
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.tableColumns.memberTypeName' }),
      align: 'center',
    },
    {
      dataIndex: 'ctl',
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.tableColumns.ctl' }),
      align: 'center',
      render: (_, record) => (
        <Button type="link" onClick={() => handleDeleteTable(record.memberId)}>
          {intl.formatMessage({ id: 'repositories.components.positionSetting.tableColumns.ctl.button' })}
        </Button>
      ),
    },
  ]

  const connectProduct = pageStatus !== PageStatus.PREVIEW && (
    <div className="connectBtn" onClick={handleAddProductBtn}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'repositories.components.positionSetting.connectProduct' })}
    </div>
  )

  // 仓位设置表单提交
  const handleSubmit = async (values) => {
    formSubmit && formSubmit(values)
  }

  // 会员添加弹窗控制
  const handleOkAddMember = () => {
    setVisibleChannelMember(false)
    clearModalParams()
    setMembersLength(memberRowCtl.selectRow.length)
    addSchemaAction.setFieldValue('applyMember', memberRowCtl.selectRow)
  }

  const handleCancelAddMember = () => {
    setVisibleChannelMember(false)
    clearModalParams()
  }

  // 商品添加弹窗控制
  const handleOkAddProduct = async () => {
    setVisibleChannelRroduct(false)
    clearModalParams()
    const selectResult = productRowCtl.selectRow[0]
    if (!selectResult) {
      return null
    }
    const goodsId = selectResult.materielId
    setProductState(selectResult)
    addSchemaAction.setFieldValue('productSkuName', selectResult.commodityAttribute)
    addSchemaAction.setFieldValue('productName', selectResult.name)
    addSchemaAction.setFieldValue('category', selectResult.customerCategoryName)
    addSchemaAction.setFieldValue('brand', selectResult.brandName)
    addSchemaAction.setFieldValue('unit', selectResult.unitName)
    addSchemaAction.setFieldValue('productId', selectResult.id)
    addSchemaAction.setFieldValue('upperMemberName', selectResult.upperMemberName)
    addSchemaAction.setFieldValue('upperStockCount', selectResult.upperStockCount)
    addSchemaAction.setFieldState('inventory', (state) => {
      state.props['x-props'] = {
        addonAfter: <div style={{ marginLeft: 4 }}>{selectResult.unitName}</div>,
      }
    })

    // 商品有可能没有货品, 没有货品时不请求
    if (goodsId) {
      // 查询到的货品id
      const { data } = await getProductMaterielGetMateriel({
        id: goodsId,
      })
      // 设置货品名称
      addSchemaAction.setFieldValue('goodsName', data?.name || '')
      addSchemaAction.setFieldValue('itemNo', data?.code || '')
    }
    addSchemaAction.setFieldValue('goodsId', goodsId)
  }

  const fetchMemberList = async (params) => {
    const { members } = productState
    const data = {
      ...params,
      shopType: 1,
      members: members,
    }
    const res = await postMemberManageAllPageByshoptype(data, { ctlType: 'none' })
    return res.data
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

  const columnsSetMember: any[] = [
    {
      title: 'ID',
      dataIndex: 'memberId',
      align: 'center',
      key: 'memberId',
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetMember.name' }),
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetMember.memberTypeName' }),
      dataIndex: 'memberTypeName',
      align: 'center',
      key: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetMember.roleName' }),
      dataIndex: 'roleName',
      align: 'center',
      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetMember.levelTag' }),
      dataIndex: 'levelTag',
      align: 'center',
      key: 'levelTag',
    },
  ]

  const columnsSetProduct: any[] = [
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetProduct.skuId' }),
      dataIndex: 'id',
      align: 'center',
      key: 'id',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetProduct.name' }),
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      width: 210,
    },
    {
      title: translate('web.resource.commodity.shanpinguige'),
      dataIndex: 'commodityAttribute',
      align: 'center',
      key: 'commodityAttribute',
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'repositories.components.positionSetting.columnsSetProduct.customerCategoryName',
      }),
      dataIndex: 'customerCategoryName',
      align: 'center',
      key: 'customerCategoryName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetProduct.brandName' }),
      dataIndex: 'brandName',
      align: 'center',
      key: 'brandName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetProduct.unitName' }),
      dataIndex: 'unitName',
      align: 'center',
      key: 'unitName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetProduct.upperMemberName' }),
      dataIndex: 'upperMemberName',
      align: 'center',
      key: 'upperMemberName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'repositories.components.positionSetting.columnsSetProduct.upperStockCount' }),
      dataIndex: 'upperStockCount',
      align: 'center',
      key: 'upperStockCount',
      ellipsis: true,
    },
  ]

  const formSearch: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        'x-component': 'Search',
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'repositories.components.positionSetting.formSearch.name' }),
          align: 'flex-left',
        },
      },
    },
  }
  const formProduct: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        'x-component-props': {
          allowClear: true,
          placeholder: intl.formatMessage({ id: 'repositories.components.positionSetting.formProduct.name' }),
          align: 'flex-left',
        },
      },
      priceTypeList: {
        type: 'string',
        'x-component': 'Cascader',
        'x-component-props': {
          allowClear: true,
          multiple: true,
          placeholder: intl.formatMessage({ id: 'commodity.products.columns.priceType' }),
          style: {
            width: 160,
          },
          options: [
            {
              value: 1,
              label: intl.formatMessage({ id: 'commodity.products.constant.priceTypeLabel.1' }),
            },
            {
              value: 2,
              label: intl.formatMessage({ id: 'commodity.products.constant.priceTypeLabel.2' }),
            },
            {
              value: 3,
              label: intl.formatMessage({ id: 'commodity.products.constant.priceTypeLabel.3' }),
            },
            {
              value: 4,
              label: intl.formatMessage({ id: 'commodity.products.constant.priceTypeLabel.4' }),
            },
          ],
        },
      },
      customerCategoryId: {
        type: 'string',
        'x-component': 'SearchSelect',
        'x-component-props': {
          allowClear: true,
          placeholder: intl.formatMessage({
            id: 'repositories.components.positionSetting.formProduct.customerCategoryId',
          }),
          className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
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
          allowClear: true,
          placeholder: intl.formatMessage({ id: 'repositories.components.positionSetting.formProduct.brandId' }),
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
          children: intl.formatMessage({ id: 'repositories.components.positionSetting.formProduct.submit' }),
        },
      },
    },
  }
  const paginationChange = async (page: number, size: number) => {
    if (id !== '') {
      const result = await getBindingMember({ id, current: page.toString(), pageSize: size.toString() })
      addSchemaAction.setFieldValue('applyMember', result.data)
    }
  }

  return (
    <>
      <NiceForm
        previewPlaceholder=" "
        editable={pageStatus !== PageStatus.PREVIEW}
        value={initValue}
        expressionScope={{
          tableColumns,
          tableAddButton,
          connectProduct,
          paginationChange,
          membersLength,
        }}
        effects={($, { setFieldState, dispatch, setFieldValue, getFieldValue }) => {
          FormEffectHooks.onFormInputChange$().subscribe(() => {
            onFieldChange()
          })
          createAddRepositoryEffect(addSchemaAction)

          // $('onFieldValueChange', 'shopType').subscribe(async (parentState) => {
          //   if (parentState.value) {
          //     const data = await fectchShopListsSource({ type: 1 })
          //     setFieldState('shopIds', (state) => {
          //       state.props['x-component-props'].dataSource = data
          //     })
          //     // 切换商城的时候，指定的会员需要重置
          //     setShopType((prev) => {
          //       if (
          //         (BUSINESS_INTEGRATE.includes(prev) && CANAL.includes(parentState.value)) ||
          //         (CANAL.includes(prev) && BUSINESS_INTEGRATE.includes(parentState.value))
          //       ) {
          //         setFieldState('applyMember', (state) => {
          //           console.log('applyMember')
          //           state.value = []
          //         })
          //       }
          //       return parentState.value
          //     })
          //     // 商城类型修改的时候，就清空商品
          //     if (!id) {
          //       addSchemaAction.setFieldValue('productId', '')
          //       addSchemaAction.setFieldValue('productName', '')
          //     }
          //   }
          // })
        }}
        onSubmit={handleSubmit}
        actions={addSchemaAction}
        schema={schema}
      />
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'repositories.components.positionSetting.modalTable.1' })}
        confirm={handleOkAddMember}
        cancel={handleCancelAddMember}
        visible={visibleChannelMember}
        columns={columnsSetMember}
        rowSelection={memberRowSelection}
        fetchTableData={(params) => fetchMemberList(params)}
        formilyProps={{
          ctx: {
            schema: formSearch,
            components: { ModalSearch: Search, SearchSelect, Submit, Select },
            effects: ($, actions) => {
              actions.reset()
              // useStateFilterSearchLinkageEffect(
              //   $,
              //   actions,
              //   'name',
              //   FORM_FILTER_PATH,
              // );
            },
          },
        }}
        resetModal={{
          destroyOnClose: true,
        }}
        tableProps={{
          rowKey: 'memberId',
        }}
      />
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'repositories.components.positionSetting.modalTable.2' })}
        confirm={handleOkAddProduct}
        cancel={handleCancelAddProduct}
        visible={visibleChannelRroduct}
        columns={columnsSetProduct}
        rowSelection={productRowSelection}
        width={860}
        fetchTableData={(params) => fetchProductList(params)}
        formilyProps={{
          ctx: {
            schema: formProduct,
            components: { ModalSearch: Search, SearchSelect, Submit, Cascader },
            effects: ($, actions) => {
              actions.reset()
            },
          },
        }}
        tableType="normal"
        resetModal={{
          destroyOnClose: true,
        }}
        tableProps={{
          rowKey: 'id',
          tableType: 'normal',
          onRow: (record) => ({
            onClick: () => {
              productRowCtl.setSelectRow([record])
              productRowCtl.setSelectedRowKeys([record.id])
            },
          }),
        }}
      />
    </>
  )
}

PositionSetting.defaultProps = {}

export default PositionSetting

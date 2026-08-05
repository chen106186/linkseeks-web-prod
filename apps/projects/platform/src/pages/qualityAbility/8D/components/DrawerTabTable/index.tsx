import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button, Tabs, Drawer, Cascader, message } from 'antd'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { createFormActions } from '@apps/formily'
import TableLayout from './table'
import { materialSupplyColumns, shopColumns, materialColumns } from './columns'
import { shopSchema, materialSupplySchema, materialSchema } from './schema'
import {
  getProductCommodityCommonGetCommodityListBySellerToQuality,
  postProductMaterielGetMaterialList,
  getProductSelectGetSelectBrand,
} from '@apps/apis'
import { getOrderQualityGetQualityOrderTo8DPage } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import MemberRegisterAreaField from '@/components/MemberRegisterAreaField'

const subShopActions = createFormActions()
const materialSupplyActions = createFormActions()

export interface MemberModalTableProps {
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?: () => any
  setLik: any
  mode?: 'checkbox' | 'radio'
  customizeRadio?: boolean
  customKey?: string
  /** 搜索的schema */
  schema?: any
  /** schema搜索第一个的name */
  effects?: string
  /** 是否可选 */
  ctl?: boolean
  rowSelection?: any
  searchParams: {
    memberId?: string
    memberRoleId?: string
  }
  roleType: string | number
}

type DrawerType = {
  width?: number | string
  title?: string
}

type ShopSearchFormValuesType = {
  memberId: string
  customerCategoryId: string
  brandId: string
}

const NewMemberModalTable: React.FC<MemberModalTableProps> = ({
  schemaAction,
  currentRef,
  confirmModal,
  setLik,
  searchParams = {},
  roleType = '1',
}) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [drawer, setDrawer] = useState<DrawerType>({})
  const ref = useRef<any>({})

  const intl = useIntl()
  // 确定
  const handleConfirm = useCallback(() => {
    // 获取到选中的列表选项rowItem
    const rowItem = ref.current.RowCtl.selectRow[0]
    if (rowItem) {
      schemaAction.setFieldValue('materialsInformation', rowItem.name || rowItem.productName)
    }
    if (confirmModal) confirmModal()
    // 参数1：选中的数据，参数2是否是质检单
    setLik(rowItem, { quality: currentRef.current.tabKey === '2' ? true : false })
    setVisible(false)
  }, [ref.current, currentRef.current.tabKey])

  const checkParamsCategoryId = (params, key) => {
    if (params[key] && Array.isArray(params[key])) {
      Object.assign(params, { [key]: params[key].pop() })
    }
    return params
  }

  /** b2b获取商品列表 */
  const getProductCommodity = async (params) => {
    const query = {
      ...searchParams,
      ...params,
    }
    checkParamsCategoryId(query, 'customerCategoryId')
    const { data } = await getProductCommodityCommonGetCommodityListBySellerToQuality(query)
    return data
  }

  // srm获取物料列表
  const getMaterialList = async (params) => {
    const query = {
      ...searchParams,
      ...params,
    }
    checkParamsCategoryId(query, 'customerCategoryId')
    const { data } = await postProductMaterielGetMaterialList(query)
    return data
  }

  /** 查询质检单列表(列表) */
  const getOrderQuality = async (params) => {
    try {
      const query = {
        qualityType: roleType == 2 ? 1 : 2, //1:b2b,2:srm
        ...searchParams,
        ...params,
      }
      if (query.memberRoleId) {
        delete query.memberRoleId
      }
      checkParamsCategoryId(query, 'category')
      const { data } = await getOrderQualityGetQualityOrderTo8DPage(query)
      // 后端返回的数据没有可以区分的id，table需要key去区分
      data.data =
        data?.data?.map((item, index: number) => {
          item.id = index
          return item
        }) || []
      return data
    } catch (error) {}
  }

  // 质检单的高级搜索初始化数据
  const useStateEffects = ($, actions) => {
    useStateFilterSearchLinkageEffect($, actions, 'qualityNo', 'PRO_LAYOUT')
    // 初始化品类数据
    useCustomerCategoriesBusinessEffects($, actions, {
      fieldName: 'category',
    })
  }

  // 商品和物料搜索初始化数据
  const useShopAndMaterialEffects = ($, actions) => {
    useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
    useAsyncInitSelect(['brandId'], async () => {
      const res = await getProductSelectGetSelectBrand()
      if (res.code === 1000) {
        const { data } = res
        return {
          brandId: data?.map((item) => ({ label: item.name, value: item.id })),
        }
      }
      return {}
    })
    // 初始化品类数据
    useCustomerCategoriesBusinessEffects($, actions, {
      fieldName: 'customerCategoryId',
    })
  }

  // 商品高级搜索
  const handleFormatShopSubmitValues = (params: ShopSearchFormValuesType) => params

  // 物料高级搜索
  const handleFormatMaterialSubmitValues = (params: ShopSearchFormValuesType) => params

  // 质检单高级搜索
  const handleOrderQualitySupplySubmitValues = (params) => {
    const { customerCategoryId, ...rest } = params
    return {
      ...rest,
      customerCategoryId: customerCategoryId ? +customerCategoryId[customerCategoryId.length - 1] : undefined,
    }
  }

  const tabConfig = [
    {
      key: '1',
      width: 1000,
      children: {
        '1': {
          title: 'SRM',
          tabTitle: intl.formatMessage({ id: 'eightD.wuliao', defaultMessage: '物料' }),
          key: '1',
          width: 1000,
          getListApi: getMaterialList,
          schema: materialSchema,
          columns: materialColumns,
          useStateEffect: useShopAndMaterialEffects,
          currRef: ref,
          customKey: 'id',
          tableProps: {
            rowKey: 'id',
          },
          effects: 'name',
          searchFormProps: {
            components: {
              MemberRegisterAreaField,
              Cascader,
            },
            actions: subShopActions,
          },
          onFormatSubmitValues: handleFormatMaterialSubmitValues,
        },
        '2': {
          title: 'b2b',
          tabTitle: intl.formatMessage({ id: 'eightD.shangpin', defaultMessage: '商品' }),
          key: '2',
          width: 1000,
          getListApi: getProductCommodity,
          schema: shopSchema,
          columns: shopColumns,
          useStateEffect: useShopAndMaterialEffects,
          currRef: ref,
          customKey: 'id',
          tableProps: {
            rowKey: 'id',
          },
          effects: 'name',
          searchFormProps: {
            components: {
              MemberRegisterAreaField,
              Cascader,
            },
            actions: subShopActions,
          },
          onFormatSubmitValues: handleFormatShopSubmitValues,
        },
      },
    },
    {
      title: '',
      tabTitle: intl.formatMessage({ id: 'eightD.zhijiandan', defaultMessage: '质检单' }),
      key: '2',
      width: 1000,
      getListApi: getOrderQuality,
      schema: materialSupplySchema,
      columns: materialSupplyColumns(roleType),
      useStateEffect: useStateEffects,
      currRef: ref,
      customKey: 'id',
      tableProps: {
        rowKey: 'id',
      },
      effects: 'name',
      scroll: { x: '100vw' },
      searchFormProps: {
        components: {
          Cascader,
        },
        actions: materialSupplyActions,
      },
      onFormatSubmitValues: handleOrderQualitySupplySubmitValues,
    },
  ]

  const handleChange = useCallback(
    (key: string) => {
      const draw = {}
      currentRef.current.tabKey = key
      tabConfig.forEach((item) => {
        if (item.key === key) {
          draw.width = item.width
          draw.title = item.title
        }
      })
      setDrawer(draw)
    },
    [tabConfig, currentRef.current],
  )

  // 关闭弹窗
  const handleClose = useCallback(() => {
    if (!ref.current.RowCtl.selectRow.length) {
      tabConfig.forEach((item) => {
        if (item.key === currentRef.current.tabKey) {
          const tab = item?.children?.[roleType] || item
          message.warning(`${tab.tabTitle}${intl.formatMessage({ id: 'eightD.weixuanze', defaultMessage: '未选择' })}`)
        }
      })
    }
    setVisible(false)
  }, [currentRef.current, tabConfig, ref.current, roleType])

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        tabKey: '1',
      }
    }
    handleChange('1')
  }, [])

  const otherProps = {
    footer: (
      <div style={{ textAlign: 'right' }} onClick={handleClose}>
        <Button style={{ marginRight: 8 }}>{intl.formatMessage({ id: 'common.button.cancel' })}</Button>
        <Button type="primary" onClick={handleConfirm}>
          {intl.formatMessage({ id: 'common.button.confirm' })}
        </Button>
      </div>
    ),
  }

  return (
    <Drawer
      destroyOnClose
      placement="right"
      title={drawer?.title}
      visible={visible}
      onClose={handleClose}
      width={drawer?.width}
      {...otherProps}
    >
      <Tabs onChange={handleChange}>
        {tabConfig.map((item) => {
          let value = item
          if (item.children) {
            value = item.children[roleType]
          }
          return (
            <Tabs.TabPane tab={value.tabTitle} key={item.key}>
              <TableLayout
                currRef={value.currRef}
                customKey={value.customKey}
                tableProps={value.tableProps}
                effects={value.effects}
                columns={value.columns}
                fetchdata={(params) => value.getListApi({ ...params })}
                searchFormProps={value.searchFormProps}
                schema={value.schema}
                scroll={value.scroll ?? {}}
                useBusinessEffects={value.useStateEffect}
                onFormatSubmitValues={value.onFormatSubmitValues}
              />
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </Drawer>
  )
}
export default NewMemberModalTable

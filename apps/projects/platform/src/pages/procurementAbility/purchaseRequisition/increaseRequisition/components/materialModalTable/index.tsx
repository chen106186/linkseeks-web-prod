import React, { useEffect, useRef, useState } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import type { ISchema, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { createAsyncFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { addRequesitionMaterialSchema, addRequesitionMaterialSchemaCheckbox } from '../../schema/modal'
import { Cascader, Checkbox, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { clearModalParams } from '@/utils'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import { searchBrandOptionEffect, searchCustomerCategoryOptionEffect } from '../../effects'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { getProductMaterielGetMaterielByMemberList } from '@apps/apis'
import DrawerTable from '@/components/DrawerTable'
import { searchCustomerMaterialGroupOptionEffect } from '@/pages/transaction/effect'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export interface MaterialModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  row: any
  confirmModal?: () => any
}

export const materialColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
    key: 'id',
    className: 'commonHide',
  },
  // 货号 货品名称 规格型号 品类 品牌 单位
  {
    title: getIntl().formatMessage({
      id: 'purchaseRequisition.wuliaobianhao',
      defaultMessage: '物料编号',
    }),
    dataIndex: 'code',
    align: 'center',
    key: 'code',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseRequisition.wuliaomingcheng',
      defaultMessage: '物料名称',
    }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: translate('web.resource.order.wuliaozu'),
    dataIndex: 'materialGroup',
    align: 'center',
    key: 'materialGroup',
    render: (text, record) => {
      return <div>{record.materialGroup ? record.materialGroup.name : ''}</div>
    },
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseRequisition.guigexinghao',
      defaultMessage: '规格型号',
    }),
    dataIndex: 'type',
    align: 'center',
    key: 'type',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' }),
    dataIndex: ['customerCategory', 'name'],
    align: 'center',
    key: ['customerCategory', 'name'],
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
    dataIndex: ['brand', 'name'],
    align: 'center',
    key: ['brand', 'name'],
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' }),
    dataIndex: 'unitName',
    align: 'center',
    key: 'unitName',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseRequisition.shengchangchangjia',
      defaultMessage: '生产厂家',
    }),
    dataIndex: 'manufacturer',
    align: 'center',
    key: 'manufacturer',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.changdi', defaultMessage: '产地' }),
    dataIndex: 'origin',
    align: 'center',
    key: 'origin',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.beizu', defaultMessage: '备注' }),
    dataIndex: 'remake',
    align: 'center',
    key: 'remake',
    render: (text) => {
      const sty: any = {
        width: 200,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
      }
      return (
        <Tooltip title={text}>
          <div style={sty}>{text}</div>
        </Tooltip>
      )
    },
  },
]

const modalSchemaAction = createAsyncFormActions()

const MaterialModalTable: React.FC<MaterialModalTableProps> = (props) => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { schemaAction, confirmModal, row, currentRef, sectionProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = sectionProps
  const [requesitionMaterialSchema, setRequesitionMaterialSchema] = useState<ISchema>(addRequesitionMaterialSchema)

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  const addMaterialProcessField = (value, origin) => {
    const tempOriginData = [...origin]
    // 对选中值去重
    const _value = Object.values(
      value.reduce((item, next) => {
        item[next.id] = next
        return item
      }, {}),
    )
    if (Array.isArray(_value)) {
      const processData = _value.map((v) => {
        const temp: any = {}
        temp.id = v.id
        temp.code = v.code
        temp.name = v.name
        temp.type = v.type
        // 处理两套不同字段
        temp.category = v?.customerCategory?.name || v?.category || null
        temp.categoryId = v?.customerCategory?.id || v?.categoryId || null
        temp.brand = v?.brand?.name || v?.brand || null
        temp.unit = v?.unitName || v?.unit || null
        temp.manuFacturer = v?.manufacturer
        temp.placeOrigin = v?.origin
        temp.goodsGroup = v?.materialGroup?.name
        temp.goodsPic = v.goodsPic
        return temp
      })
      const originIds = tempOriginData.map((item) => item.id)
      processData.map((item) => {
        if (!originIds.includes(item.id)) {
          tempOriginData.push(item)
        }
      })
      return tempOriginData
    }
  }

  const handleConfirm = async () => {
    const materialData = schemaAction.getFieldValue('products')
    schemaAction.setFieldValue('products', addMaterialProcessField(rowSelectionCtl.selectRow, materialData))
    confirmModal?.()
    setVisible(false)
    clearModalParams()
  }

  const handleCancel = () => {
    setVisible(false)
    clearModalParams()
  }

  const otherHandle = (
    <>
      <a
        className="ant-btn"
        href="/commodityAbility/material/materialPendingAdd/add"
        target="_blank"
        style={{ marginRight: 16 }}
      >
        {intl.formatMessage({
          id: 'purchaseRequisition.xinzenghuopin',
          defaultMessage: '新增货品',
        })}
      </a>
      <Tooltip
        title={intl.formatMessage({
          id: 'purchaseRequisition.dianjichaxun',
          defaultMessage: '点击查询，列表可显示新增的物料',
        })}
      >
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )
  const getPurchaseRequesitionMaterielList = async (params) => {
    console.log(row)
    if (Object.keys(row).length) {
      params.memberId = row.memberId
      params.memberRoleId = row.roleId || row.memberRoleId
    }
    params.materialGroupId = params.materialGroupId ? params.materialGroupId?.pop() : null
    const { data } = await getProductMaterielGetMaterielByMemberList(params)
    return data
  }

  return (
    // 抽屉
    <DrawerTable
      drawerTitle={intl.formatMessage({ id: 'purchaseRequisition.xuanzewuliao' })}
      confirm={handleConfirm}
      cancel={handleCancel}
      visible={visible}
      columns={materialColumns}
      rowSelection={rowSelection}
      fetchTableData={getPurchaseRequesitionMaterielList}
      formilyLayouts={{
        justify: 'space-between',
      }}
      currentRef={ref}
      formilyChilds={{
        children: otherHandle,
        layouts: {
          order: 1,
          span: 4,
        },
      }}
      formilyProps={{
        ctx: {
          schema: requesitionMaterialSchema,
          components: {
            Submit,
            CustomInputSearch,
            CustomCategorySearch,
            Cascader,
            Checkbox,
          },
          actions: modalSchemaAction,
          effects: ($, actions) => {
            actions.reset()
            useStateFilterSearchLinkageEffect($, actions, 'materialsTrademark', FORM_FILTER_PATH)
            $('onFormMount').subscribe(() => {
              const supplyMember = schemaAction.getFieldValue('vendorMemberId')
              if (supplyMember) {
                setRequesitionMaterialSchema(addRequesitionMaterialSchemaCheckbox)
              } else {
                setRequesitionMaterialSchema(addRequesitionMaterialSchema)
              }
            })
            FormEffectHooks.onFieldChange$('brandId').subscribe(() => {
              searchBrandOptionEffect(actions, 'brandId')
            })
            FormEffectHooks.onFieldChange$('customerCategoryId').subscribe(() => {
              searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
            })
            FormEffectHooks.onFieldChange$('materialGroupId').subscribe(() => {
              searchCustomerMaterialGroupOptionEffect(actions, 'materialGroupId')
            })

            $('onFieldInputChange', 'watch').subscribe(() => {
              ref.current.reloadCurrent()
            })
          },
        },
        layouts: {
          order: 2,
          span: 20,
        },
      }}
      resetDrawer={{
        destroyOnClose: true,
      }}
      tableProps={{
        rowKey: 'id',
      }}
    />
  )
}

MaterialModalTable.defaultProps = {}

export default MaterialModalTable

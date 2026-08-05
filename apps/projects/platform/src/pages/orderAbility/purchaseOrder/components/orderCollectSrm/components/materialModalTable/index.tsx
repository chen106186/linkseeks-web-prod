import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { addContractOrderModalSchema } from '@/components/ModalTable/schema'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { getIntl } from '@linkseeks/i18n'
import type { TableColumnProps } from 'antd'
import { Input } from 'antd'

export interface MaterialModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  confirmModal?: () => any
}

export const materialColumns: TableColumnProps<any>[] = [
  {
    title: 'ID',
    dataIndex: 'id',

    key: 'id',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.productNo' }),
    dataIndex: 'materielNo',

    key: 'materielNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.spec' }),
    dataIndex: 'type',

    key: 'type',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.name' }),
    dataIndex: 'materielName',

    key: 'materielName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.category' }),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.brand' }),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.unit' }),
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.contractColumns.contractFreeCount',
    }),
    dataIndex: 'contractFreeCount',

    key: 'contractFreeCount',
  },
]

export const materialColumnsByRequisition: TableColumnProps<any>[] = [
  {
    title: 'ID',
    dataIndex: 'id',

    key: 'id',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.productNo' }),
    dataIndex: 'materielNo',

    key: 'materielNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.spec' }),
    dataIndex: 'type',

    key: 'type',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.name' }),
    dataIndex: 'materielName',

    key: 'materielName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.category' }),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.brand' }),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.unit' }),
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.contractColumns.contractFreeCount',
    }),
    dataIndex: 'contractFreeCount',

    key: 'contractFreeCount',
  },
  {
    title: '关联请购单',
    dataIndex: 'value1',
    align: 'center',
    key: 'value1',
  },
  {
    title: '请购单剩余',
    dataIndex: 'value2',
    align: 'center',
    key: 'value2',
  },
  {
    title: '下单数量',
    dataIndex: 'value3',
    align: 'center',
    key: 'value3',
    width: 80,
    render: () => <Input type="number" onClick={(e) => e.stopPropagation()} />,
  },
]

const MaterialModalTable: React.FC<MaterialModalTableProps> = (props) => {
  const { schemaAction, confirmModal, currentRef, sectionProps, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = sectionProps

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
        temp.code = v.materielNo
        temp.name = v.materielName
        temp.type = v.type
        temp.category = v.category
        temp.brand = v.brand
        temp.unit = v.unit
        temp.relevanceProductId = v.associatedDataId
        temp.relevanceProductName = v.associatedGoods
        temp.relevanceProductType = v.associatedType
        temp.relevanceProductCategory = v.associatedCategory
        temp.relevanceProductBrand = v.associatedBrand
        temp.price = v.price
        temp.stock = v.supplierInventory
        temp.tax = v.isHasTax
        temp.taxRate = v.taxRate
        // @ 配送方式 默认物流
        temp.logistics = 1
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
    const productData = schemaAction.getFieldValue('products')
    schemaAction.setFieldValue('products', addMaterialProcessField(rowSelectionCtl.selectRow, productData))
    confirmModal?.()
    setVisible(false)
  }

  const fetchMaterialList = (values) => {
    const contract = schemaAction.getFieldValue('contract')
    const contractId = contract.id || contract.contractId
    const params = {
      ...values,
      contractId,
    }
    return fetchOrderApi.getContractPurchaseMaterielList(params)
  }

  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.button' })}
      width={900}
      visible={visible}
      columns={materialColumns}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={fetchMaterialList}
      rowSelection={rowSelection}
      resetModal={{ destroyOnClose: true }}
      modalType="none"
      tableProps={{
        rowKey: 'id',
        onRow: (record) => ({
          onClick: () => {
            rowSelectionCtl.appendSelectRow(record)
            rowSelectionCtl.appendSelectRowKeys(record.id)
          },
        }),
      }}
      formilyProps={{
        ctx: {
          schema: addContractOrderModalSchema('productNo'),
          components: { ModalSearch: Search, Submit },
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'productNo', FORM_FILTER_PATH)
          },
        },
      }}
      {...restProps}
    />
  )
}

MaterialModalTable.defaultProps = {}

export default MaterialModalTable

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

export interface MaterialModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  confirmModal?: () => any
  canRepeat?: boolean
}

export const materialColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'productId',

    key: 'productId',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.productNo' }),
    dataIndex: 'productNo',

    key: 'productNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.name' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.spec' }),
    dataIndex: 'spec',

    key: 'spec',
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
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.quantity' }),
    dataIndex: 'quantity',

    key: 'quantity',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.materialColumns.quantifiable',
    }),
    dataIndex: 'quantifiable',

    key: 'quantifiable',
  },
]

const MaterialModalTable: React.FC<MaterialModalTableProps> = (props) => {
  const { schemaAction, confirmModal, currentRef, sectionProps, canRepeat, ...restProps } = props
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
      value.map((item, next) => {
        item[next.id] = next
        return item
      }),
    )
    if (Array.isArray(_value)) {
      const vendorMemberName = schemaAction.getFieldValue('vendorMemberName')
      const vendorMemberId = schemaAction.getFieldValue('vendorMemberId')
      const vendorRoleId = schemaAction.getFieldValue('vendorRoleId')
      const processData = _value.map((v) => ({
        ...v,
        tax: true,
        // @ 配送方式 默认物流
        logistics: 1,
        // 冗余会员信息
        vendorMemberName,
        vendorMemberId,
        vendorRoleId,
      }))
      const originIds = tempOriginData.map((item) => item.productId)
      processData.map((item) => {
        if (!originIds.includes(item.productId)) {
          tempOriginData.push(item)
        }
      })
      return tempOriginData
    }
  }

  const handleConfirm = async () => {
    const productData = schemaAction.getFieldValue('products') || []
    const mergedValue = // canRepeat
      //   ?
      //   rowSelectionCtl.selectRow.concat(productData)
      //   :
      addMaterialProcessField(rowSelectionCtl.selectRow, productData).map((item) => ({
        ...item,
        // 重新赋值 剩余可请购数量
        // fix: http://chandao.shushangyun.com/index.php?m=bug&f=view&bugID=26050
        quantity: item.quantifiable,
      }))
    schemaAction.setFieldValue('products', mergedValue)
    // if(canRepeat){
    //   rowSelectionCtl.setSelectRow([]);
    //   rowSelectionCtl.setSelectedRowKeys(undefined);
    // }
    confirmModal?.()
    setVisible(false)
  }

  const fetchMaterialList = (values) => {
    const requisitionId = schemaAction.getFieldValue('requisitionId')
    const params = {
      ...values,
      requisitionId,
    }
    return fetchOrderApi.getRequisitionPurchaseMaterielList(params)
  }

  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.button' })}
      width={900}
      columns={materialColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={fetchMaterialList}
      rowSelection={rowSelection}
      resetModal={{ destroyOnClose: true }}
      modalType="none"
      tableProps={{
        rowKey: 'productId',
        onRow: (record) => ({
          onClick: () => {
            rowSelectionCtl.appendSelectRow(record)
            rowSelectionCtl.appendSelectRowKeys(record.productId)
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

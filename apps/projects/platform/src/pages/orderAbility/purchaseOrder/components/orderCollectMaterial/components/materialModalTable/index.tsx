import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { addContractOrderModalSchema } from '@/components/ModalTable/schema'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { getIntl } from '@linkseeks/i18n'
import { getProductMaterielGetConfirmedMaterielList } from '@apps/apis'

export interface MaterialModalTableProps extends ModalTableProps {
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  canRepeat?: boolean
  confirmModal?: () => any
}

export const materialColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.productNo' }),
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.name' }),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.spec' }),
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.category' }),
    dataIndex: ['customerCategory', 'name'],
    key: 'customerCategory',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.brand' }),
    dataIndex: ['brand', 'name'],
    key: 'brand',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialColumns.unit' }),
    dataIndex: 'unitName',
    key: 'unitName',
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
    console.log(value, origin, 'ma')
    const tempOriginData = [...origin]
    // 对选中值去重
    const _value = Object.values(
      value.reduce((item, next) => {
        item[next.productId] = next
        return item
      }, {}),
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

  const transformFieldKey = (initData) => {
    console.log(initData, 'initData')
    if (initData?.length) {
      return initData.map((item) => ({
        ...item,
        productId: item.productId,
        // lineNumber: @todo
        productNo: item.code || item.productNo,
        category: item?.customerCategory?.name || item?.category,
        brand: item?.brand?.name || item.brand,
        spec: item.type || item.spec,
        unit: item.unitName || item.unit,
        price: item.costPrice || item.price,
      }))
    } else {
      return []
    }
  }

  const handleConfirm = async () => {
    const productData = schemaAction.getFieldValue('products')
    console.log(productData, 'productData')
    schemaAction.setFieldValue(
      'products',
      addMaterialProcessField(transformFieldKey(rowSelectionCtl.selectRow), transformFieldKey(productData)),
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    confirmModal && confirmModal()
    setVisible(false)
  }

  const fetchMaterialList = (values) => {
    return new Promise((resovle) => {
      getProductMaterielGetConfirmedMaterielList({ ...values }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res
        resovle({
          data: data?.data?.map((_item) => ({
            ..._item,
            productId: _item?.id,
          })),
          totalCount: data?.totalCount,
        })
      })
    })
  }

  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.button' })}
      width={900}
      columns={materialColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) => fetchMaterialList(params)}
      rowSelection={rowSelection}
      resetModal={{ destroyOnClose: true }}
      modalType="none"
      tableProps={{
        rowKey: 'productId',
        onRow: (record) => ({
          onClick: () => {
            console.log(record)
            rowSelectionCtl.appendSelectRow(record)
            rowSelectionCtl.appendSelectRowKeys(record.productId)
          },
        }),
      }}
      formilyProps={{
        ctx: {
          schema: addContractOrderModalSchema(),
          components: { ModalSearch: Search, Submit },
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
          },
        },
      }}
      {...restProps}
    />
  )
}

MaterialModalTable.defaultProps = {}

export default MaterialModalTable

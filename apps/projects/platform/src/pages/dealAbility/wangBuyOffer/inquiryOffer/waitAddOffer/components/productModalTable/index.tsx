import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import { ModalFormTable, StandardFormTable, ModalFormTableRef } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { getProductCommodityCommonGetPageCommoditySku } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { FormInstance, message } from 'antd'
import { authService } from '@apps/services'

const intl = getIntl()

export interface ProductModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  searchSelectMaps?: any
  form: FormInstance<any>
  currentRef?: any
  sectionProps: any
  confirmModal?: () => any
  tableRef: React.MutableRefObject<ModalFormTableRef>
  selectedIds: number[]
  onConfirm: (value: any) => void
}

export const productColumns = StandardFormTable.createColumns([
  {
    title: intl.formatMessage({ id: 'commodity.products.schema.productSchema.productId', defaultMessage: '商品ID' }),
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: intl.formatMessage({ id: 'commodity.products.schema.productSchema.name', defaultMessage: '商品名称' }),
    dataIndex: 'name',
    key: 'name',
    searchField: {
      main: true,
    },
  },
  {
    title: intl.formatMessage({ id: 'commodity.checkProduct.customerCategory.name', defaultMessage: '品类' }),
    dataIndex: 'customerCategoryName',
    key: 'customerCategoryName',
    searchField: {
      type: 'Select',
      name: 'customerCategoryId',
    },
  },
  {
    title: intl.formatMessage({ id: 'commodity.checkProduct.brand.name', defaultMessage: '品牌' }),
    dataIndex: 'brandName',
    key: 'brandName',
    searchField: {
      type: 'Select',
      name: 'brandId',
    },
  },
  {
    title: intl.formatMessage({ id: 'commodity.checkProduct.unitName', defaultMessage: '单位' }),
    dataIndex: 'unitName',
    key: 'unitName',
  },
])

const ProductModalTable: React.FC<ProductModalTableProps> = (props) => {
  const { selectedIds, tableRef, searchSelectMaps, onConfirm } = props
  const translate = useWebIntl()
  const userInfo = authService.getAuth()

  const handleConfirmProduct = async () => {
    const selectionItems = tableRef.current?.getSelectionItems()
    if (selectionItems.length > 0) {
      onConfirm(selectionItems[0])
    } else {
      message.info(translate('web.common.selectOneRequest'))
    }
  }

  const fetchProductList = (values) => {
    return getProductCommodityCommonGetPageCommoditySku({
      ...values,
      priceTypeList: '1',
      statusList: '5',
      memberId: userInfo?.memberId,
      memberRoleId: userInfo?.memberRoleId,
    })
  }

  return (
    <ModalFormTable
      modalTitle={getIntl().formatMessage({
        id: 'purchaseOrder.orderCollect.productModalTable.title',
        defaultMessage: '选择订单商品',
      })}
      actionRef={tableRef}
      width={900}
      columns={productColumns}
      isRowSelection
      rowSelectionType="radio"
      request={fetchProductList}
      searchSelectMaps={searchSelectMaps}
      onOk={handleConfirmProduct}
      onClose={() => {
        tableRef.current?.clearSelection()
      }}
      getCheckboxProps={(record) => {
        return {
          disabled: selectedIds.includes(record.id),
        }
      }}
    />
  )
}

ProductModalTable.defaultProps = {}

export default ProductModalTable

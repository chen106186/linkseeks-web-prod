import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { addOrderModalSchema } from '@/components/ModalTable/schema'
import Search from '@/components/NiceForm/components/Search'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Submit from '@/components/NiceForm/components/Submit'
import DateSelect from '@/components/NiceForm/components/DateSelect'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'

export interface ProductModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  confirmModal?()
}

export const productColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.id' }),
    dataIndex: 'productId',

    key: 'productId',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.name' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.customerCategoryName' }),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.brandName' }),
    dataIndex: 'brand',

    key: 'brand',
  },
]

export const filterProductDataById = (data, targetData) => {
  return targetData.reduce(async (prev: any[], next) => {
    // 由于自选发货单商品和物流单单商品字段不一致，需手动同步

    next.id = next.id || next.productId
    next.productId = next.id || next.productId
    next.brand = next.brand || next.brandName
    next.category = next.category || next.customerCategoryName
    next.unit = next.unit || next.unitName
    next.productName = next.productName || next.name
    next.amount = next.quantity || next.amount
    next.weight = next.weight || null

    // id 存在集合中， 采用target中的数据， 否则采用data中的数据
    const findResult = data.find((v) => v.productId === next.productId)

    // 由于迭代时，会出现promise的 已完成状态， 需转换一下，实现异步转同步化
    if (!Array.isArray(prev)) {
      prev = await prev
    }
    if (findResult) {
      // 已经选中过这一项, 则需要采用原有的商品列表
      prev.push(findResult)
    } else {
      prev.push(next)
    }

    return prev
  }, [])
}

const ProductModalTable: React.FC<ProductModalTableProps> = (props) => {
  const { type = 'checkbox', schemaAction, confirmModal, currentRef, sectionProps, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = sectionProps
  const { id } = useQuery()

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  const handleConfirmProduct = async () => {
    const newData = [...rowSelectionCtl.selectRow]
    schemaAction.setFieldValue('detailList', await filterProductDataById([], newData))
    confirmModal && confirmModal()
    setVisible(false)
  }

  const fetchProductList = (values) => {
    const params = {
      ...values,
      orderId: id,
    }
    return fetchOrderApi.getProductList(params)
  }

  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.title' })}
      width={900}
      columns={productColumns}
      visible={visible}
      confirm={handleConfirmProduct}
      cancel={() => setVisible(false)}
      fetchTableData={fetchProductList}
      rowSelection={rowSelection}
      resetModal={{ destroyOnClose: true, forceRender: true }}
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
          schema: addOrderModalSchema,
          components: {
            ModalSearch: Search,
            SearchSelect,
            Submit,
            DateSelect,
            CustomCategorySearch,
            CustomInputSearch,
          },
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
          },
        },
      }}
      {...restProps}
    />
  )
}

ProductModalTable.defaultProps = {}

export default ProductModalTable

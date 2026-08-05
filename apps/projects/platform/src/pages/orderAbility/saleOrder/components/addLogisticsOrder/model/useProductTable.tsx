import { useRef, useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button } from 'antd'
import { PriceComp, productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'

/**
 * @param ctx schemaAction
 */
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { pageStatus, preview = null } = usePageStatus()
  const productRef = useRef<any>({})
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({
    type: 'checkbox',
    customKey: 'productId',
  })
  const intl = useIntl()

  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('detailList')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)

    // 删除选中的项
    rowSelectionCtl.setSelectRow(newData)
    rowSelectionCtl.setSelectedRowKeys(newData.map((v) => v.id))
    ctx.setFieldValue('detailList', newData)
  }

  const [productColumns, setProductColumns] = useState(() => {
    // 渲染操作
    productInfoColumns[productInfoColumns.length - 1].render = (text, record) => (
      <Button type="link" onClick={() => handleDelete(record)}>
        {intl.formatMessage({ id: 'saleOrder.delete' })}
      </Button>
    )

    // 渲染单价
    productInfoColumns[5].render = (t, r) => {
      return r.price ? (
        <span style={{ color: 'red' }}>
          {intl.formatMessage({ id: 'common.money' })} {r.price}
        </span>
      ) : (
        <PriceComp priceSection={r.unitPrice} />
      )
    }
    // 渲染商品ID
    productInfoColumns[0].render = (t, r) => {
      return r.id
    }

    return productInfoColumns
  })

  const handleShowProduct = () => {
    productRef.current.setVisible(true)
  }

  const productAddButton = !preview && (
    <Button onClick={handleShowProduct} block type="default" style={{ margin: '24px auto' }}>
      {intl.formatMessage({ id: 'saleOrder.xuanzeshangpin', defaultMessage: '选择商品' })}
    </Button>
  )

  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    const { pageStatus } = usePageStatus()
    // 商品采购数量变动 清空之前的支付信息
    if (pageStatus === PageStatus.ADD) {
      ctx.setFieldValue('payments', [])
    }
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('detailList')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('detailList', newData)
      resolve({ item, newData })
    })
  }

  const productMergeColumns = productColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: ctx.getFormState().editable === false ? false : col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItem: col.formItem,
        formItemProps: col.formItemProps,
        handleSave,
      }),
    }
  })

  return {
    productRef,
    productAddButton,
    productColumns: productMergeColumns,
    productComponents,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}

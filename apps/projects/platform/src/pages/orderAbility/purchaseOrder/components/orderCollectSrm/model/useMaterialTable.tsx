import React, { useRef, useState } from 'react'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message } from 'antd'
import { materialInfoColumns, materialInfoColumnsByRequisition } from '../constant'
import MaterialTableCell, { MaterialEditableRow } from '../components/materialTableCell'
import { useModalTable } from './useModalTable'
// import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'
import { OrderModalType } from '@/constants/order'
import type { RequisitionModalTableRef } from '../components/requisitionModalTable'
import { CaretRightOutlined } from '@ant-design/icons'
import ExpandedRowRender from '../components/expandedRowRender'
import plusIcon from '../images/plus.png'

// 对象按key排序（运用于商城传过来的阶梯价格排序）
export const sortByKey = (params) => {
  const keys = Object.keys(params).sort((x, y) => parseInt(x) - parseInt(y))
  const newParams = {}
  keys.forEach((key) => {
    newParams[key] = params[key]
  })
  return newParams
}

export const getUnitPriceTotal = (record) => {
  const purchaseCount = Number(record.quantity) || 0
  return Number((record.price * purchaseCount).toFixed(2))
}

/**
 * @param ctx schemaAction
 */
export const useMaterialTable = (
  ctx: ISchemaFormActions | ISchemaFormAsyncActions,
  orderMode = ctx.getFieldValue('orderMode'),
  requisitionRef?: React.MutableRefObject<RequisitionModalTableRef>,
  onClickAdd?: () => void,
  onDeleteRecord?: (record: any) => void,
) => {
  const materialRef = useRef<any>({})
  const intl = useIntl()
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })

  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('products')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)

    // 删除选中的项
    rowSelectionCtl.setSelectRow(newData)
    rowSelectionCtl.setSelectedRowKeys(newData.map((v) => v.id))
    ctx.setFieldValue('products', newData)
    onDeleteRecord?.(record)
  }

  const [materialColumns] = useState(() => {
    // const { pageStatus } = usePageStatus()
    const tempColumn = [
      ...(orderMode === OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER
        ? materialInfoColumnsByRequisition
        : materialInfoColumns),
    ]
    // if (pageStatus === PageStatus.ADD || pageStatus === PageStatus.VARIATION) {
    // 渲染操作
    tempColumn[tempColumn.length - 1].render = (_text, record) => (
      <Button type="link" onClick={() => handleDelete(record)}>
        {intl.formatMessage({ id: 'purchaseOrder.delete' })}
      </Button>
    )
    // } else {
    //   tempColumn[tempColumn.length - 1].render = () => null
    //   // tempColumn.pop()
    // }
    // 渲染关联单据
    const associatedIndex = tempColumn.findIndex((column) => column.dataIndex === 'relative')
    if (tempColumn[associatedIndex]) {
      tempColumn[associatedIndex].render = (text, record) => (
        <Button type="link" onClick={() => requisitionRef.current?.show(record.requisitions || [])}>
          关联请购单
        </Button>
      )
    }
    return tempColumn
  })
  const handleShowMaterial = () => {
    const supplyMembersId = ctx.getFieldValue('vendorMemberId')
    const products = ctx.getFieldValue('products')
    if (supplyMembersId) {
      if (onClickAdd) {
        onClickAdd?.()
        return
      }
      materialRef.current.setVisible(true)
      materialRef.current.rowSelectionCtl.setSelectedRowKeys(() => products.map((item) => item.id))
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.model.message1' }))
    }
  }

  const materialAddButton = (() => {
    const buttonStyles: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 32,
      margin: '24px auto',
      color: '#5C626A',
      fontSize: 12,
      background: '#FAFBFC',
      border: '1px solid #EDEEEF',
      borderRadius: '4px',
    }
    return (
      <Button type="default" block style={{ ...buttonStyles }} onClick={handleShowMaterial}>
        <img
          src={plusIcon}
          style={{
            width: 16,
            height: 16,
            marginRight: '8px',
          }}
        />
        选择物料
      </Button>
    )
  })()
  const materialComponents = {
    body: {
      row: MaterialEditableRow,
      cell: MaterialTableCell,
    },
  }
  const expandedRowRender = (material) => <ExpandedRowRender material={material} />
  const expandIcon = (props) => {
    return props.record?.relevanceProductId ? (
      <div
        style={{
          transform: `rotate(${props.expanded ? 90 : 0}deg)`,
          opacity: props.expanded ? 1 : 0.5,
          transition: 'all .3s',
        }}
        onClick={(e) => props.onExpand(props.record, e)}
      >
        <CaretRightOutlined />
      </div>
    ) : null
  }
  const rowExpandable = (material) => !!material.relevanceProductId

  const handleSave = (row) => {
    return new Promise((resolve) => {
      const newData = [...ctx.getFieldValue('products')]
      const index = newData.findIndex((item) => row.productId === item.productId)
      if (index === -1) {
        return
      }
      const item = newData[index]
      // 算单行价格
      row.amount = getUnitPriceTotal(row)
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('products', newData)
      resolve({ item, newData })
    })
  }

  const materialMergeColumns = materialColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        ctx,
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
    materialRef,
    materialAddButton,
    materialColumns: materialMergeColumns,
    materialComponents,
    expandedRowRender,
    expandIcon,
    rowExpandable,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}

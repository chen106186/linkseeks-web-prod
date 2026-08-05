/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useRef, useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, Row, Col, Spin } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { materialInfoColumns } from '../constant'
import MaterialTableCell, { MaterialEditableRow } from '../components/materialTableCell'
import { useModalTable } from './useModalTable'
import style from '../index.less'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
export const getUnitPriceTotal = (record) => {
  const purchaseCount = Number(record['quantity']) || 0
  return Number(((record.price || 0) * purchaseCount).toFixed(2))
}

/**
 * @param ctx schemaAction
 */
export const useMaterialTable = (
  ctx: ISchemaFormActions | ISchemaFormAsyncActions,
  handleRelationSaleOrderEdit?: (record: any) => void,
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
  }

  const [materialColumns, setMaterialColumns] = useState(() => {
    // 渲染操作
    materialInfoColumns[materialInfoColumns.length - 1].render = (text, record) => (
      <Button type="link" onClick={() => handleDelete(record)}>
        {intl.formatMessage({ id: 'purchaseRequisition.shanchu', defaultMessage: '删除' })}
      </Button>
    )
    materialInfoColumns[materialInfoColumns.length - 3].render = (text, record) => (
      <Button type="link" onClick={() => handleRelationSaleOrderEdit?.(record)}>
        {intl.formatMessage({ id: 'purchaseRequisition.associatedSalesOrder' })}
      </Button>
    )
    materialInfoColumns[materialInfoColumns.length - 4].render = (t, r) =>
      r.amount && (
        <span style={{ color: 'red' }}>
          {translate('web.common.currencySymbol')} {Number(r.amount).toFixed(2)}
        </span>
      )
    return materialInfoColumns
  })
  const handleShowMaterial = () => {
    const products = ctx.getFieldValue('products')
    materialRef.current.setVisible(true)
    if (products && products.length) {
      materialRef.current.rowSelectionCtl.setSelectedRowKeys(() => products.map((item) => item.id))
    }
  }

  const materialAddButton = (
    <Button onClick={handleShowMaterial} block type="default" style={{ margin: '24px auto' }}>
      {intl.formatMessage({ id: 'common.button.select', defaultMessage: '选择' })}
    </Button>
  )
  const materialComponents = {
    body: {
      row: MaterialEditableRow,
      cell: MaterialTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('products')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      // 算单行价格
      row['amount'] = getUnitPriceTotal(row)
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
        editable: ctx.getFormState().editable === false ? false : col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItem: col.formItem,
        formItemProps: col.formItemProps,
        handleSave,
      }),
    }
  })

  const renderDescription = (record) => {
    const newData = [...ctx.getFieldValue('products')]
    const index = newData.findIndex((item) => record.id === item.id)
    const item = newData[index]

    newData[index] = item
    item.description = (
      <div className={style.childrenWrap}>
        <Row>
          <Col span={3}>
            <div className={style.childrenTitle}>
              <p>{intl.formatMessage({ id: 'purchaseRequisition.wuliao' })}</p>
              <p>{intl.formatMessage({ id: 'purchaseRequisition.xinxi' })}</p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>
                  {intl.formatMessage({
                    id: 'purchaseRequisition.guigexinghao',
                    defaultMessage: '规格型号',
                  })}
                  :
                </span>
                {record.type}
              </p>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' })}:</span>
                {record.category}
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' })}:</span>
                {record.brand}
              </p>
              <p>
                <span>{intl.formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' })}:</span>
                {record.unit}
              </p>
            </div>
          </Col>
          <Col span={6}>
            <div className={style.childrenContent}>
              <p>
                <span>
                  {intl.formatMessage({
                    id: 'purchaseRequisition.shengchangchangjia',
                    defaultMessage: '生产厂家',
                  })}
                  :
                </span>
                {record.manuFacturer}
              </p>
              <p>
                <span>
                  {intl.formatMessage({
                    id: 'purchaseRequisition.changdi',
                    defaultMessage: '产地',
                  })}
                  :
                </span>
                {record.placeOrigin}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    )
    ctx.setFieldValue('products', [...newData])
  }

  // 嵌套子表格
  const materialChildren = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        {record?.id ? record.description || <Spin size="small" style={{ margin: '15px auto', width: '100%' }} /> : null}
      </p>
    ),
    rowExpandable: (record) => record.name !== 'Not Expandable',
    expandIcon: ({ expanded, onExpand, record }) =>
      expanded ? (
        <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
      ) : (
        <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
      ),
    onExpand: (expanded, record) => {
      if (expanded) {
        renderDescription(record)
      }
    },
  }

  return {
    materialRef,
    materialAddButton,
    materialColumns: materialMergeColumns,
    materialComponents,
    materialChildren,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
    handleSave,
  }
}

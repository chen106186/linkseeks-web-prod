import React, { useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button } from 'antd'
import { materialInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'

/**
 * @param ctx 页面表单schemaAction
 * @param goodRef 生成货品抽屉的ref
 * @param drawerSchemaAction 抽屉表单action
 */
export const useMaterialTable = (
  ctx: ISchemaFormActions | ISchemaFormAsyncActions,
  goodRef: any,
  drawerSchemaAction: ISchemaFormActions | ISchemaFormAsyncActions,
) => {
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })
  const { pageStatus } = usePageStatus()
  const intl = getIntl()

  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('materielList')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)

    // 删除选中的项
    rowSelectionCtl.setSelectRow(newData)
    rowSelectionCtl.setSelectedRowKeys(newData.map((v) => v.id))
    ctx.setFieldValue('materielList', newData)

    // // 商品行数变动 清空之前的支付信息
    // if (pageStatus === PageStatus.ADD) {
    //   let paymentInfo = ctx.getFieldValue('paymentInformationResponses').map(item => {
    //     let _item = {...item}
    //     delete _item.channel
    //     delete _item.payWay
    //     delete _item.payRatio
    //     return _item
    //   })
    //   ctx.setFieldValue('paymentInformationResponses', [])
    //   // ctx.setFieldValue('paymentInformationResponses', paymentInfo)
    // }
  }

  const handleEdit = async (record) => {
    console.log(record, '编辑物料')
    goodRef.current.setVisible(true)
    setTimeout(async () => {
      await ctx.setFieldValue('isEdit', true)
      await drawerSchemaAction.setFieldValue('id', record['id'])
      await drawerSchemaAction.setFieldValue('code', record['code'])
      await drawerSchemaAction.setFieldValue('name', record['name'])
      await drawerSchemaAction.setFieldValue('type', record['type'])
      await drawerSchemaAction.setFieldValue('categoryId', record['categoryId'])
      await drawerSchemaAction.setFieldValue('categoryName', record['categoryName'])
      await drawerSchemaAction.setFieldValue('brandName', record['brandName'])
      await drawerSchemaAction.setFieldValue('unitId', record['unitId'])
      await drawerSchemaAction.setFieldValue('unitName', record['unitName'])
      await drawerSchemaAction.setFieldValue('count', record['count'])
      await drawerSchemaAction.setFieldValue('has', record['has'])
      await drawerSchemaAction.setFieldState('code', (state) => {
        state.props['x-component-props'].disabled = true
        state.props['x-component-props'].addonAfter = ''
      })
    }, 200)
    if (pageStatus === PageStatus.EDIT) {
      await drawerSchemaAction.setFieldValue('file', record['file'])
    }
  }

  const handlePreive = (record) => {
    console.log(record, '查看')
  }

  const [materialColumns, setMaterialColumns] = useState(() => {
    materialInfoColumns[materialInfoColumns.length - 1].render = (text, record) => (
      <>
        <Button type="link" onClick={() => handleEdit(record)}>
          {intl.formatMessage({ id: 'detail.purchase.edit' })}
        </Button>
        <Button type="link" onClick={() => handleDelete(record)}>
          {intl.formatMessage({ id: 'detail.purchase.detele' })}
        </Button>
      </>
    )

    // // 渲染查看
    // materialInfoColumns[1].render = (text, record) => <>
    //   <Button type='link' onClick={() => handlePreive(record)}>{text} <EyeOutlined /></Button>
    // </>

    return materialInfoColumns
  })
  const handleShowProduct = () => {
    ctx.setFieldValue('isEdit', false)
    goodRef.current.setVisible(true)
  }

  const materialAddButton = (
    <Button onClick={handleShowProduct} block icon={<PlusOutlined />} type="dashed" style={{ marginBottom: 16 }}>
      {intl.formatMessage({ id: 'detail.purchase.added' })}
    </Button>
  )

  const materialComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('materielList')]
      const index = newData.findIndex((item) => row.code === item.code)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('materielList', newData)
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

  return {
    // materialRef,
    materialAddButton,
    materialColumns: materialMergeColumns,
    materialComponents,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}

/**
 * @Description 自定义配置表格Columns弹窗组件
 */
import React, { useState, useImperativeHandle, useMemo } from 'react'
import { Modal, Checkbox, message } from 'antd'
import { CloseOutlined, HolderOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { ReactSortable, ItemInterface } from 'react-sortablejs'
import { useWebIntl } from '@apps/locales'
import { SortableColumnType } from '../interface'
import './index.less'

const filterUndraggableColumn = (dataSource: SortableColumnType[]) => dataSource.filter((item) => item.draggable)

export interface CustomColumnsConfigureModalProps {
  /**
   * Table columns data
   * 表格默认的 columns，只在初始时生效。
   * 如果 columns 是异步获取的，可使用 resetDefaultColumns 方法重置 defaultColumns
   */
  defaultColumns: SortableColumnType<any>[]
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 点击关闭触发事件
   */
  onClose: () => void
  /**
   * 点击确认触发事件
   */
  onConfirm: (newColumns: ColumnType<any>[]) => void
}

export interface CustomColumnsConfigureModalRef {
  resetDefaultColumns: (newColumns: ColumnType<any>[]) => void
}

const CustomColumnsConfigureModal: React.ForwardRefRenderFunction<
  CustomColumnsConfigureModalRef,
  CustomColumnsConfigureModalProps
> = (props, ref) => {
  const { defaultColumns, visible, onClose, onConfirm } = props
  const filteredDefaultColumns = useMemo(() => filterUndraggableColumn(defaultColumns) || [], [defaultColumns])
  const [columnsSource, setColumnsSource] = useState<SortableColumnType<any>[]>(defaultColumns || [])
  const [innerColumns, setInnerColumns] = useState<SortableColumnType<any>[]>(defaultColumns || [])
  const [checks, setChecks] = useState<CheckboxValueType[]>(
    filteredDefaultColumns.map((item) => item.dataIndex as string),
  )
  const translate = useWebIntl()

  const resetDefaultColumns = (newColumns: SortableColumnType<any>[]) => {
    if (!Array.isArray(newColumns)) {
      return
    }
    setColumnsSource(newColumns)
    setInnerColumns(newColumns)
    setChecks(newColumns.map((item) => item.dataIndex as string))
  }

  useImperativeHandle(ref, () => ({
    resetDefaultColumns,
  }))

  const handleCheckboxChange = (value: CheckboxValueType[]) => {
    const newInnerColumns = value
      .map((item) => {
        const index = innerColumns.findIndex((column) => column.dataIndex === item)
        if (index !== -1) {
          return innerColumns[index]
        }
        return columnsSource.find((column) => column.dataIndex === item)!
      })
      .filter(Boolean)
    const fixedLeftItems: SortableColumnType<any>[] = []
    const fixedRightItems: SortableColumnType<any>[] = []
    const fixedNormalItems: SortableColumnType<any>[] = []

    // 重现排序
    for (let i = 0; i < newInnerColumns.length; i++) {
      const item = newInnerColumns[i]
      if (item.fixed && item.fixed === 'left') {
        fixedLeftItems.push(item)
        continue
      }
      if (item.fixed && item.fixed === 'right') {
        fixedRightItems.push(item)
        continue
      }
      fixedNormalItems.push(item)
    }

    const compouned = [...fixedLeftItems, ...fixedNormalItems, ...fixedRightItems]

    setChecks(value)
    setInnerColumns(compouned)
  }

  const handleClose = (dataIndex: string) => {
    const newChecks = [...checks]
    const newInnerColumns = [...innerColumns]
    const checkIndex = newChecks.findIndex((item) => item === dataIndex)
    const columnIndex = innerColumns.findIndex((item) => item.dataIndex === dataIndex)
    if (checkIndex !== -1) {
      newChecks.splice(checkIndex, 1)
    }
    if (columnIndex !== -1) {
      newInnerColumns.splice(columnIndex, 1)
    }
    setChecks(newChecks)
    setInnerColumns(newInnerColumns)
  }

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    onClose?.()
  }

  const handleOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    if (!innerColumns.length) {
      message.warning(translate('web.common.tableColumnLessRequired'))
      return
    }
    onConfirm?.(innerColumns)
  }

  const filteredColumnsSource = useMemo(() => filterUndraggableColumn(columnsSource), [columnsSource])
  const filtered = useMemo(() => filterUndraggableColumn(innerColumns), [innerColumns])

  return (
    <Modal
      title={translate('web.common.customColumnsConfigure')}
      cancelText={translate('web.common.cancel')}
      okText={translate('web.common.confirm')}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      width={800}
      bodyStyle={{
        padding: 0,
      }}
      wrapClassName="columns-configure-modal"
    >
      <div className="columns-configure-wrapper">
        <div className="columns-configure-cell">
          <div className="columns-configure-cell-title">
            {translate('web.common.canSelectField')} ({filteredColumnsSource.length})
          </div>
          <div className="columns-configure-cell-content">
            <Checkbox.Group value={checks} onChange={handleCheckboxChange}>
              {columnsSource.map((item) => (
                <div
                  className="columns-configure-checkbox-item"
                  key={item.dataIndex as string}
                  style={{
                    display: item.draggable ? 'block' : 'none',
                  }}
                >
                  <Checkbox value={item.dataIndex}>{item.title}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        </div>
        <div className="columns-configure-cell">
          <div className="columns-configure-cell-title">
            {translate('web.common.selectedField')} ({checks.length})
          </div>
          <div className="columns-configure-cell-content">
            <ReactSortable
              list={innerColumns as ItemInterface[]}
              setList={setInnerColumns}
              handle=".columns-draggable-handle"
            >
              {filtered.map((item) => (
                <div className="columns-configure-draggable-item" key={item.dataIndex as string}>
                  <div className={`columns-configure-draggable-item-handle columns-draggable-handle`}>
                    <HolderOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                  </div>
                  <div className="columns-configure-draggable-item-txt">{item.title}</div>
                  <div
                    className="columns-configure-draggable-item-close"
                    onClick={() => handleClose(item.dataIndex as string)}
                  >
                    <CloseOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const CustomColumnsConfigureModalForWard = React.forwardRef<
  CustomColumnsConfigureModalRef,
  CustomColumnsConfigureModalProps
>(CustomColumnsConfigureModal)

export default CustomColumnsConfigureModalForWard

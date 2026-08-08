import React, { useEffect, useRef, useState } from 'react'
import { ISchema } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import { Modal, Row, Col, Drawer, Button } from 'antd'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { ColumnsType } from 'antd/es/table'
import NiceForm from '@/components/NiceForm'

const formActions = createFormActions()

interface Iprops {
  modalType?: 'Modal' | 'Drawer'
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * Modal 标题
   */
  title: string
  /**
   * 搜索schema
   */
  schema: ISchema
  /**
   * table Ccolumn
   */
  columns: ColumnsType
  footer?: React.ReactNode
  tableProps?: {
    rowKey: string | ((record) => any)
    expandable?: any
  }
  width?: number
  mode: 'checkbox' | 'radio'
  customizeRadio?: boolean
  /** 回显值 */
  value?: { [key: string]: any }[]
  /**
   * onChange
   */
  expressionScope?: { [key: string]: any }
  /**
   * format话参数
   */
  format?: ((value) => any) | null
  components?: { [key: string]: any }
  effects?: ($, actions) => void
  fetchData: (params: any) => any
  onClose: () => void
  onOk: (selectRow: number[] | string[], selectedRows: { [key: string]: any }[]) => void
  /**
   * 勾选前操作，
   */
  beforeChecked?:
    | ((record: any, selected: boolean, selectedRows: any[]) => boolean)
    | ((record: any, selected: boolean, selectedRows: any[]) => Promise<any>)
  /**
   * rowSelection
   */
  rowSelection?: {
    getCheckboxProps?: (record) => any
  }
}

const TableModal: React.FC<Iprops> = (props: Iprops) => {
  const {
    title,
    visible,
    schema,
    columns,
    effects,
    tableProps,
    mode,
    expressionScope,
    fetchData,
    onClose,
    onOk,
    value,
    format,
    customizeRadio,
    modalType,
    footer,
    width,
    components,
    beforeChecked,
    rowSelection,
  } = props

  const ref = useRef<any>({})
  const isFirstLoad = useRef<boolean>(true)
  const [selectRow, setSelectRow] = useState<number[] | string[]>(() => {
    return value.map((_row) =>
      typeof tableProps.rowKey === 'string' ? _row[tableProps.rowKey as string] : tableProps.rowKey(_row),
    )
  })
  const [selectRowRecord, setSelectRowRecord] = useState<{ [key: string]: any }[]>([])

  const intl = useIntl()

  useEffect(() => {
    if (!visible) {
      return
    }
    let list = value
    const currentMode = customizeRadio || mode === 'radio'
    if (currentMode) {
      list = list.slice(-1)
    }

    const keys = list.map((_row) => {
      // console.log(typeof tableProps.rowKey === 'string' && tableProps.rowKey(_row))
      return typeof tableProps.rowKey === 'string' ? _row[tableProps.rowKey as string] : tableProps.rowKey(_row)
    })
    setSelectRow(keys)
    setSelectRowRecord(value)
  }, [visible, value, mode, customizeRadio])

  const handleEffects = ($: any, actions: any) => {
    effects?.($, actions)
  }

  const handleOnClose = () => {
    onClose?.()
  }

  const handleOk = () => {
    onOk?.(selectRow, selectRowRecord)
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    if (!isFirstLoad.current) {
      ref.current?.reloadCurrent?.()
    }
    isFirstLoad.current = false
  }, [visible])

  const onSelectChange = async (record, selected: boolean, selectedRows) => {
    const recordRows = customizeRadio || mode === 'radio' ? selectedRows.slice(-1) : selectedRows
    const keys = recordRows.map((_item) =>
      typeof tableProps.rowKey === 'string' ? _item[tableProps.rowKey as string] : tableProps.rowKey(_item),
    )

    // if (selected) {
    const returnValue = await beforeChecked(record, selected, recordRows)
    if (returnValue === false) {
      return
    }
    // }
    setSelectRowRecord(recordRows)
    setSelectRow(keys)
  }

  const onSelectAll = async (selected: boolean, selectedRows: any[], changeRows: any[]) => {
    const keys = selectedRows.map((_item) =>
      typeof tableProps.rowKey === 'string' ? _item[tableProps.rowKey as string] : tableProps.rowKey(_item),
    )
    setSelectRowRecord(selectedRows)
    setSelectRow(keys)
  }

  const handleSearch = (params: any) => {
    const res = (format && format(params)) || params
    ref.current?.reload(res)
  }

  const Component = modalType === 'Modal' ? Modal : Drawer

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button onClick={handleOnClose} style={{ marginRight: 8 }}>
          {intl.formatMessage({ id: 'member.actions.cancel' })}
        </Button>
        <Button onClick={handleOk} type="primary">
          {intl.formatMessage({ id: 'member.actions.confirm' })}
        </Button>
      </div>
    )
  }

  const otherProps =
    modalType === 'Drawer' ? { footer: renderFooter(), maskClosable: true, onClose: handleOnClose } : { onOk: handleOk }

  return (
    <Component
      title={title}
      visible={visible}
      onCancel={handleOnClose}
      // onOk={handleOk}
      width={width}
      {...otherProps}
    >
      <StandardTable
        columns={columns}
        tableProps={{
          ...tableProps,
          pagination: false,
        }}
        keepAlive={false}
        fetchTableData={fetchData}
        currentRef={ref}
        rowSelection={{
          type: customizeRadio && mode === 'radio' ? 'checkbox' : mode,
          onSelect: onSelectChange,
          onSelectAll: onSelectAll,
          selectedRowKeys: selectRow,
          hideSelectAll: customizeRadio,
          ...rowSelection,
        }}
        formRender={(child, ps) => (
          // <div style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}>
          //   <div>{child}</div>
          //   <div>{ps}</div>
          // </div>
          <div style={{ position: 'relative' }}>
            <div>{child}</div>
            <div style={{ position: 'absolute', right: 0, top: 4 }}>{ps}</div>
          </div>
        )}
        controlRender={
          <NiceForm
            schema={schema}
            components={components}
            actions={formActions}
            onSubmit={handleSearch}
            expressionScope={expressionScope}
            effects={($, actions) => handleEffects($, actions)}
          />
        }
      ></StandardTable>
    </Component>
  )
}

TableModal.defaultProps = {
  rowSelection: {},
  mode: 'radio',
  tableProps: {
    rowKey: 'memberId',
  },
  value: [],
  expressionScope: {},
  format: null,
  customizeRadio: false,
  modalType: 'Modal',
  footer: null,
  width: 840,
  components: {},
  beforeChecked: () => true,
}

export default TableModal

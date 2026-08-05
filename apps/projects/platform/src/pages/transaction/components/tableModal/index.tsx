import type { ISchema } from '@apps/formily'
import React, { useEffect, useRef } from 'react'
import { Modal, Row, Col, Drawer, Button, Cascader } from 'antd'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import type { ColumnsType } from 'antd/es/table'
import NiceForm from '@/components/NiceForm'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getIntl } from '@linkseeks/i18n'

const formActions = createFormActions()
const intl = getIntl()
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
  }
  mode?: 'checkbox' | 'radio'
  customizeRadio?: boolean
  /**
   * rowSelection
   */
  value?: Record<string, any>[]
  /**
   * onChange
   */
  expressionScope?: Record<string, any>
  /**
   * format话参数
   */
  format?: ((value) => any) | null
  effects?: ($, actions) => void
  fetchData: (params: any) => any
  onClose: () => void
  onOk: (selectRow: number[] | string[], selectedRows: Record<string, any>[]) => void
  /** customKey */
  customKey?: string
  /** 宽度 */
  width?: number
  /** 是否可选 */
  ctl?: boolean
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
    customKey,
    width,
    ctl,
  } = props
  const ref = useRef<any>({})
  const [rowSelection, RowCtl] = useRowSelectionTable({
    type: customizeRadio && mode === 'radio' ? 'checkbox' : mode,
    customKey: customKey,
  })
  const isFirstLoad = useRef<boolean>(true)

  useEffect(() => {
    if (!visible) {
      return
    }
    RowCtl.setSelectRow(value)
    RowCtl.setSelectedRowKeys(value.map((v) => v[customKey]))
  }, [visible])

  const handleEffects = ($: any, actions: any) => {
    effects?.($, actions)
  }

  const handleOnClose = () => {
    onClose?.()
  }

  const handleOk = () => {
    onOk?.(RowCtl.selectedRowKeys, RowCtl.selectRow)
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    if (!isFirstLoad.current) {
      ref.current?.reloadCurrent()
    }
    isFirstLoad.current = false
  }, [visible])

  const handleSearch = (params: any) => {
    const res = (format && format(params)) || params
    ref.current.reload(res)
  }

  const Component = modalType === 'Modal' ? Modal : Drawer

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button onClick={handleOnClose} style={{ marginRight: 8 }}>
          {intl.formatMessage({ id: 'transaction_components.quxiao' })}
        </Button>
        <Button onClick={handleOk} type="primary">
          {intl.formatMessage({ id: 'transaction_components.tijiao' })}
        </Button>
      </div>
    )
  }

  const otherProps = modalType === 'Drawer' && ctl && { footer: renderFooter() }

  return (
    <Component
      title={title}
      visible={visible}
      onClose={handleOnClose}
      onCancel={handleOnClose}
      // onOk={handleOk}
      width={width}
      destroyOnClose
      {...otherProps}
    >
      <StandardTable
        keepAlive={false}
        columns={columns}
        tableProps={{
          ...tableProps,
          pagination: false,
        }}
        tableType="small"
        fetchTableData={fetchData}
        currentRef={ref}
        rowSelection={
          ctl && {
            ...rowSelection,
            hideSelectAll: customizeRadio,
          }
        }
        formRender={(child, ps) => (
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col span={24} style={{ zIndex: 99 }}>
              {child}
            </Col>
            <Col style={{ marginTop: 4, position: 'absolute', right: 0, zIndex: 100 }}>{ps}</Col>
          </Row>
        )}
        controlRender={
          <NiceForm
            components={{ Cascader }}
            schema={schema}
            actions={formActions}
            onSubmit={handleSearch}
            expressionScope={expressionScope}
            effects={($, actions) => handleEffects($, actions)}
          />
        }
      />
    </Component>
  )
}

TableModal.defaultProps = {
  // rowSelection: null,
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
  width: 900,
  ctl: true,
}

export default TableModal

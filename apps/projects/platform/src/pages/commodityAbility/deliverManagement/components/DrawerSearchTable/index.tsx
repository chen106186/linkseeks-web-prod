import React, { useState, useEffect, useRef } from 'react'
import { Input, Button, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import DrawerTable from '@/components/DrawerTable'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { useIntl } from '@linkseeks/i18n'
const RowStyleLayout = styled((props) => <div {...props} />)`
  width: 100%;

  .relevance {
    height: 100%;
    background: #909399;
    border-radius: 0;
    &[disabled] {
      background: #f4f5f7;
    }
  }

  .ant-input-group-addon {
    padding: 0;
    border: none;
  }
`
const formActions = createFormActions()

const DrawerSearchTable = (props) => {
  const { editable, value = [] } = props
  const intl = useIntl()

  const {
    modalProps = {
      title: intl.formatMessage({ id: 'components.biaoti' }),
      width: 960,
    },
    selectionType = 'radio',
    columns,
    formilyProps = {},
    tableProps = {},
    fetchTableData,
    title = intl.formatMessage({ id: 'components.xuanze' }),
    tip = '',
    cancelTip = intl.formatMessage({ id: 'eightD.weixuanze', defaultMessage: '未选择' }), // 点击按钮前的提示，用于前提需要提示的场景
    disabled = false,
    layoutClassName = {},
    showScreen = false,
  } = props.props['x-component-props'] || props

  const tableRowKey = tableProps.rowKey || 'id'
  const tableRowLableKey = tableProps.lableKey || '' // Input展示用的 key val

  const [visible, setVisible] = useState(false)
  const [rowSelection, rowCtl] = useRowSelectionTable({
    type: selectionType,
    customKey: tableRowKey,
  })
  const molalRef = useRef<any>({})

  useEffect(() => {
    // Table 只能缓存 keys
    const rowKeys = value?.map?.((item) => item[tableRowKey]) || []
    rowCtl.setSelectedRowKeys(rowKeys)
    rowCtl.setSelectRow(value)
  }, [props.value, tableProps.rowKey])

  const search = (values: any) => {
    // 调用fetchdata方法
    molalRef.current.reload(values)
  }

  const handleConfirm = () => {
    const rows = rowCtl.selectRow
    const keys = rows.map((item) => item[tableRowKey])

    if (props.mutators) {
      if (rows && rows.length) {
        props.mutators.change(rows)
      }
      setVisible(false)
      return
    }
    rowCtl.setSelectedRowKeys(keys)
    setVisible(false)
  }

  const handleCancel = () => {
    if (!rowCtl.selectRow.length && cancelTip) {
      message.warning(cancelTip)
    }
    setVisible(false)
  }

  const handleModalVisible = () => {
    if (!fetchTableData) {
      message.warning(tip || intl.formatMessage({ id: 'components.qingchuanrufetchTableDatashuxing' }))
      return
    }
    setVisible(true)
  }

  return (
    <RowStyleLayout className={layoutClassName}>
      <Input
        value={tableRowLableKey ? value?.map?.((item) => item[tableRowLableKey]).join(',') || '' : ''}
        addonAfter={
          <>
            {editable && (
              <Button
                type="primary"
                className="relevance"
                icon={<LinkOutlined />}
                onClick={handleModalVisible}
                disabled={disabled}
                block
              >
                {title}
              </Button>
            )}
          </>
        }
        disabled
      />

      <DrawerTable
        confirm={handleConfirm}
        cancel={handleCancel}
        currentRef={molalRef}
        visible={visible}
        width={1000}
        drawerTitle={modalProps.title}
        rowSelection={rowSelection}
        columns={columns}
        fetchTableData={fetchTableData}
        formilyProps={formilyProps}
        tableProps={tableProps}
        confirmText={intl.formatMessage({ id: 'commodity.deliverManagement.queding', defaultMessage: '确定' })}
        resetModal={{
          destroyOnClose: true,
        }}
        controlRender={
          showScreen ? (
            <NiceForm actions={formActions} onSubmit={(values) => search(values)} {...formilyProps?.ctx} />
          ) : null
        }
        {...modalProps}
      />
    </RowStyleLayout>
  )
}

DrawerSearchTable.defaultProps = {}

DrawerSearchTable.isFieldComponent = true

export default DrawerSearchTable

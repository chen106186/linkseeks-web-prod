import React, { useEffect, useImperativeHandle, useRef } from 'react'
import { Space } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import Card from '../card'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useIntl } from '@linkseeks/i18n'

export interface ListLayoutIProps {
  /** 锚点 */
  anchor?: string
  /** 标题 */
  title: string
  /** columns */
  columns: ColumnType<any>[]
  /** 静态数据 */
  dataSource?: any
  /** 接口数据 */
  fetchTableData?: any
  /** 是否多选 */
  selectedRow?: boolean
  /** 刷新 */
  reload?: any
  /** 选择的keyId */
  activeKey?: string
  /** 禁用 */
  getCheckboxProps?: (record: any) => void
  /** 多选返回 */
  fetchRowkeys?(e: any)
  /** 操作 */
  controllerBtns?: React.ReactNode
}

const ListLayout: React.FC<ListLayoutIProps> = (props: any) => {
  const {
    anchor,
    fetchTableData,
    dataSource,
    title,
    columns,
    selectedRow,
    reload,
    activeKey,
    getCheckboxProps,
    fetchRowkeys,
    controllerBtns,
  } = props
  const currentRef = useRef<any>({})
  const intl = useIntl()

  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: activeKey || 'id',
    extendsSelection: {
      getCheckboxProps: (record) => getCheckboxProps && getCheckboxProps(record),
      fixed: true,
    },
  })

  useImperativeHandle(reload, () => ({
    reload: () => {
      currentRef.current.reloadCurrent()
      selectRowFns.setSelectRow([])
      selectRowFns.setSelectedRowKeys([])
    },
  }))

  useEffect(() => {
    fetchRowkeys && fetchRowkeys(selectRowFns.selectedRowKeys)
  }, [selectRowFns])

  const tableData = !dataSource
    ? {
        fetchTableData: (params: any) => fetchTableData(params),
        tableProps: {
          rowKey: 'id',
          scroll: { x: '100%' },
        },
      }
    : {
        tableProps: {
          dataSource: dataSource,
          rowKey: 'id',
          scroll: { x: '100%' },
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            size: 'small',
            pageSizeOptions: ['10', '20', '50', '100'],
            total: dataSource.length,
            showTotal: () => intl.formatMessage({ id: 'componnets.standardTablePages', totalPage: dataSource.length }),
          },
        },
      }

  return (
    <Card id={anchor} title={title}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {controllerBtns && <>{controllerBtns}</>}
        <StandardTable
          currentRef={currentRef}
          columns={columns}
          rowSelection={selectedRow && selectRow}
          // tableProps={{
          //   rowKey: 'id',
          //   scroll: { x: '100%' }
          // }}
          // fetchTableData={(params: any) => fetchTableData(params)}
          {...tableData}
        />
      </Space>
    </Card>
  )
}

export default ListLayout

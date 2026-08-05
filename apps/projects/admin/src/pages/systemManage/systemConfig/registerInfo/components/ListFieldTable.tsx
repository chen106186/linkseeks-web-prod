import React from 'react'
import type { TableProps as RcTableProps, ColumnType } from 'antd/lib/table'
import { Button, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { GetMemberListResponseDetail } from '@apps/apis'

type GetMemberListResponseDetailWithIndex = GetMemberListResponseDetail & { index: number }

interface I_ListFieldTable_Props {
  dataSource: RcTableProps<any>['data']
  isEditMode: boolean
  onListFieldInsert: () => void
  onListFieldEdit: (record: GetMemberListResponseDetailWithIndex) => void
  onListFieldDelete: (record: GetMemberListResponseDetailWithIndex) => void
}

/** 新增会员注册资料，字段类型为list，列表字段 表格 */
const ListFieldTable: React.FC<I_ListFieldTable_Props> & { isFieldComponent: boolean } = (props) => {
  const { dataSource, isEditMode, onListFieldInsert, onListFieldEdit, onListFieldDelete } = props

  const fieldColumns: ColumnType<GetMemberListResponseDetailWithIndex>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      key: 'index',
      width: 96,
      render: (text) => text + 1,
    },
    {
      title: '列表中文名称',
      dataIndex: 'fieldLocalName',
      align: 'center',
      key: 'fieldLocalName',
      width: 196,
      render: (text, record) => <span style={{ color: text ? undefined : '#C8CACD' }}>{text || '待修改'}</span>,
    },
    {
      title: '排序',
      dataIndex: 'fieldOrder',
      align: 'center',
      key: 'fieldOrder',
      width: 96,
      render: (text, record) => <span style={{ color: text ? undefined : '#C8CACD' }}>{text || '待修改'}</span>,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      width: 196,
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="link" onClick={() => onListFieldEdit(record)}>
            {isEditMode ? '修改' : '查看'}
          </Button>
          {isEditMode && (
            <Button type="link" onClick={() => onListFieldDelete(record)}>
              删除
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      {isEditMode && (
        <Button style={{ marginBottom: 16 }} icon={<PlusOutlined />} onClick={() => onListFieldInsert()}>
          新增列表字段
        </Button>
      )}
      <Table dataSource={dataSource} columns={fieldColumns} pagination={false} rowKey="index" bordered />
    </div>
  )
}

ListFieldTable.isFieldComponent = true

export default ListFieldTable

import type { MutableRefObject } from 'react'
import React, { useImperativeHandle, useState } from 'react'
import { Button, Table, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table'
import type { GetMemberListResponseDetail } from '@apps/apis'

type GetMemberListResponseDetailWithIndex = GetMemberListResponseDetail & { index: number }

interface I_EnumFieldTable_Props {
  ref: MutableRefObject<{
    enumFieldTableDataSource: any[]
  }>
  initialDataSource: any[]
  isEditMode: boolean
}

/** 新增会员注册资料，字段类型为checkbox/radio/select，字段类型值 表格 */
const EnumFieldTable: React.ForwardRefRenderFunction<any, I_EnumFieldTable_Props> & { isFieldComponent: boolean } = (
  props,
  refs,
) => {
  const { initialDataSource = [], isEditMode } = props

  const [enumFieldTableDataSource, setEnumFieldTableDataSource] = useState<any[]>([...initialDataSource])

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
      title: '字段类型值',
      dataIndex: 'label',
      align: 'center',
      key: 'label',
      width: 196,
      render: (text, record) =>
        isEditMode ? (
          <Input
            value={text}
            onChange={({ target }) => {
              setEnumFieldTableDataSource((dataSource) => {
                const _dataSource = [...dataSource]
                _dataSource[record.index].label = target.value || ''
                return _dataSource
              })
            }}
          />
        ) : (
          text
        ),
    },
    // {
    //   title: '排序',
    //   dataIndex: 'sort',
    //   align: 'center',
    //   key: 'sort',
    //   width: 96,
    //   render: (text, record) => (
    //     isEditMode
    //       ? (
    //         <InputNumber
    //           min={ 1 }
    //           value={ initialDataSource[record.index].index }
    //           onChange={ value => {
    //             setEnumFieldTableDataSource(dataSource => {
    //               dataSource[record.index].sort = parseInt(`${value || 1}`)
    //               return dataSource
    //             })
    //           } }
    //         />
    //       )
    //       : text
    //   )
    // },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      width: 196,
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setEnumFieldTableDataSource((dataSource) => {
              const _dataSource = [...dataSource]
              _dataSource.splice(record.index, 1)
              return _dataSource.map((item, index) => ({ ...item, index }))
            })
          }}
        >
          删除
        </Button>
      ),
    },
  ]

  useImperativeHandle(refs, () => ({
    enumFieldTableDataSource,
  }))

  return (
    <div>
      {isEditMode && (
        <Button
          style={{ marginBottom: 16 }}
          icon={<PlusOutlined />}
          onClick={() =>
            setEnumFieldTableDataSource((dataSource) => [
              ...dataSource,
              {
                index: dataSource.length,
                label: '',
                sort: undefined,
              },
            ])
          }
        >
          新增字段类型值
        </Button>
      )}
      <Table
        dataSource={enumFieldTableDataSource}
        columns={fieldColumns.slice(0, fieldColumns.length - Number(!isEditMode))}
        pagination={false}
        rowKey="index"
        bordered
      />
    </div>
  )
}

EnumFieldTable.isFieldComponent = true

export default React.forwardRef(EnumFieldTable)

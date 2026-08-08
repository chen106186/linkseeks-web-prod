import React, { useRef } from 'react'
import { Table } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { Card } from '@linkseeks/ui'
import { isEmpty } from 'lodash'

export interface ListLayoutIProps {
  /** 锚点 */
  anchor?: string
  /** id */
  id?: string | number
  /** 标题 */
  title: string
  /** columns */
  columns: ColumnType<any>[]
  /** 接口 */
  fetch?: () => Promise<unknown>
  /** 是否不发送请求 */
  done?: boolean
  /** 展示的数据 */
  data?: any[]
  /** ids */
  ids?: Object
  children?: React.ReactNode
  pagination?: any
  topBtn?: React.ReactNode
}

const ListLayout: React.FC<ListLayoutIProps> = (props: any) => {
  const { anchor, id, title, columns, fetch, done, data, ids, children, pagination = { size: 'small' }, topBtn } = props
  const currentRef = useRef({})

  const fetchTableData = (params: any) => {
    return new Promise((resolve) => {
      if (fetch && (ids || id)) {
        fetch({ id, ...ids, ...params }).then((res: any) => {
          resolve(res.data)
        })
      } else {
        resolve({
          code: 1000,
          data: [],
        })
      }
    })
  }

  return (
    <Card id={anchor} title={title}>
      {topBtn && <div>{topBtn}</div>}
      {!done && (
        <StandardTable
          currentRef={currentRef}
          columns={columns}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchTableData(params)}
        />
      )}
      {done && <Table rowKey={(record) => record.id} columns={columns} dataSource={data} pagination={pagination} />}
      {children}
    </Card>
  )
}

export default ListLayout

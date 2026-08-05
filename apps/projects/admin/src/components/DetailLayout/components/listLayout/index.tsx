import React, { useRef } from 'react'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { StandardFormTable } from '@apps/components'
import { Card } from '@linkseeks/ui'

export interface ListLayoutIProps {
  /** 锚点 */
  anchor?: string
  /** id */
  id?: string | number
  /** 标题 */
  title: string
  /** columns */
  columns: any
  /** 接口 */
  fetch?: () => Promise<unknown>
  /** 是否不发送请求 */
  done?: boolean
  /** 展示的数据 */
  data?: []
  /** ids */
  ids?: Object
}

const ListLayout: React.FC<ListLayoutIProps> = (props: any) => {
  const { anchor, id, title, columns, fetch, done, data, ids } = props
  const currentRef = useRef({} as ActionType)

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
      {!done && (
        <StandardFormTable columns={columns} autoScrollX rowKey="id" actionRef={currentRef} request={fetchTableData} />
      )}
      {done && (
        <StandardFormTable
          columns={columns}
          autoScrollX
          rowKey="id"
          tableProps={{
            dataSource: data,
            pagination: {
              size: 'small',
            },
          }}
          request={() => ({ data: [] })}
        />
      )}
    </Card>
  )
}

export default ListLayout

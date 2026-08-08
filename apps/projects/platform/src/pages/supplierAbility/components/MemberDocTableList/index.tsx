/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-11 16:40:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-18 17:01:46
 * @Description: Card 列表组件
 */
import React, { useEffect, useState } from 'react'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'

const PAGE_SIZE = 5

export type ParamsType = {
  current: string
  pageSize: string
}

export type ReponseType<T> = {
  totalCount: number
  data: T[]
}

interface IProps<T> {
  /**
   * Card 标题
   */
  title: string
  /**
   * Table 列
   */
  columns: EditableColumns<T>[]
  /**
   * 获取列表数据方法
   */
  fetchList: (params: ParamsType) => Promise<ReponseType<T>>
}

const MemberDocTableList = <T,>(props: IProps<T>) => {
  const { title, columns, fetchList, ...rest } = props
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ReponseType<T>>({
    totalCount: 0,
    data: [],
  })

  const getList = (params?: ParamsType) => {
    if (fetchList) {
      setLoading(true)
      const nextPage = params?.current || page
      const nextSize = params?.pageSize || size
      fetchList({
        current: `${nextPage}`,
        pageSize: `${nextSize}`,
      })
        .then((res) => {
          if (res.data) {
            setList(res)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    getList()
  }, [])

  const handlePaginationChange = (page: number, size: number) => {
    setPage(page)
    setSize(size)
    getList({
      current: `${page}`,
      pageSize: `${size}`,
    })
  }

  return (
    <MellowCard title={title} {...rest}>
      <PolymericTable
        rowKey="inspectTime"
        dataSource={list.data}
        columns={columns}
        loading={loading}
        pagination={{
          current: page,
          pageSize: size,
          total: list.totalCount,
        }}
        onPaginationChange={handlePaginationChange}
      />
    </MellowCard>
  )
}

export default MemberDocTableList

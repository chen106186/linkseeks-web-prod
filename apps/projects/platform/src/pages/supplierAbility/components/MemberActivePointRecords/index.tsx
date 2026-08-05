/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-20 14:48:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:09:00
 * @Description: 会员活跃分获取记录
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'

const PAGE_SIZE = 8

export interface ListItem {
  /**
   * 数据id
   */
  id: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 规则名称
   */
  ruleName: string
  /**
   * 分数
   */
  score: number
  /**
   * 备注
   */
  remark: string
}

export interface FetchParams {
  current: number
  pageSize: number
}

interface IProps {
  /**
   * 获取数据方法
   */
  fetchList?: (params: FetchParams) => Promise<{ data: ListItem[]; totalCount: number }>
}

const MemberActivePointRecords: React.FC<IProps> = (props: IProps) => {
  const { fetchList, ...rest } = props
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [listLoading, setListLoading] = useState(false)

  const intl = useIntl()

  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'member.components.MemberActivePointRecords.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberActivePointRecords.columns.ruleName' }),
      dataIndex: 'ruleName',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberActivePointRecords.columns.score' }),
      dataIndex: 'score',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberActivePointRecords.columns.createTime' }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberActivePointRecords.columns.remark' }),
      dataIndex: 'remark',
      ellipsis: true,
    },
  ]

  const getList = (params?) => {
    if (fetchList) {
      setListLoading(true)
      fetchList({
        current: page,
        pageSize: size,
        ...(params || {}),
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setList(data)
          setTotal(totalCount)
        })
        .finally(() => {
          setListLoading(false)
        })
    }
  }

  useEffect(() => {
    getList()
  }, [])

  const handlePaginationChange = (current: number, pageSize: number) => {
    setPage(current)
    setSize(pageSize)
    getList({
      current,
      pageSize,
    })
  }

  return (
    <MellowCard title={intl.formatMessage({ id: 'member.components.MemberActivePointRecords.record.title' })} {...rest}>
      <PolymericTable
        dataSource={list}
        columns={columns}
        loading={listLoading}
        pagination={{
          pageSize: size,
          total,
        }}
        onPaginationChange={handlePaginationChange}
      />
    </MellowCard>
  )
}

export default MemberActivePointRecords

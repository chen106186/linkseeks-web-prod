/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 17:53:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:52:28
 * @Description: 会员考察信息
 */
import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'

const PAGE_SIZE = 5

export type ListItemType = {
  /**
   * 主键id
   */
  id: number
  /**
   * 考察主题
   */
  subject: string
  /**
   * 考察类型枚举1-入库考察2-整改考察3-计划考察4-其他考察
   */
  inspectType: number
  /**
   * 考察类型名称
   */
  inspectTypeName: string
  /**
   * 考察日期，格式为yyyy-MM-dd
   */
  inspectTime: string
  /**
   * 考察评分
   */
  score: string
}

export type ParamsType = {
  current: string
  pageSize: string
}

export type ReponseType = {
  totalCount: number
  data: ListItemType[]
}

interface IProps {
  /**
   * 获取列表数据方法
   */
  fetchList: (params: ParamsType) => Promise<ReponseType>
}

const MemberDocInspection: React.FC<IProps> = (props: IProps) => {
  const { fetchList, ...rest } = props
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ReponseType>({
    totalCount: 0,
    data: [],
  })

  const intl = useIntl()

  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberDocInspection.columns.id',
        defaultMessage: '序号',
      }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberDocInspection.columns.subject',
        defaultMessage: '考察主题',
      }),
      dataIndex: 'subject',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberDocInspection.columns.inspectTypeName',
        defaultMessage: '考察类型',
      }),
      dataIndex: 'inspectTypeName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberDocInspection.columns.inspectTime',
        defaultMessage: '考察日期',
      }),
      dataIndex: 'inspectTime',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberDocInspection.columns.score',
        defaultMessage: '考察评分',
      }),
      dataIndex: 'score',
    },
  ]

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
    <MellowCard
      title={intl.formatMessage({
        id: 'customerAbility.components.MemberDocInspection.title',
        defaultMessage: '考察信息',
      })}
      {...rest}
    >
      <PolymericTable
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

export default MemberDocInspection

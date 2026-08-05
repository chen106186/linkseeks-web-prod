/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 18:01:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:02:20
 * @Description: 会员考评信息
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
   * 考评主题
   */
  subject: string
  /**
   * 下级会员名称
   */
  name: string
  /**
   * 考评时间开始，格式为yyyy-MM-dd
   */
  appraisalDayStart: string
  /**
   * 考评时间结束，格式为yyyy-MM-dd
   */
  appraisalDayEnd: string
  /**
   * 考评完成时间，格式为yyyy-MM-dd
   */
  completeDay: string
  /**
   * 总得分
   */
  totalScore: string
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

const MemberDocScoredInfo: React.FC<IProps> = (props: IProps) => {
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
      title: intl.formatMessage({ id: 'member.components.MemberDocScoredInfo.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberDocScoredInfo.columns.subject' }),
      dataIndex: 'subject',
      ellipsis: true,
      render: (text, record) => `${text}-${record.name}`,
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberDocScoredInfo.columns.appraisalDayStart' }),
      dataIndex: 'appraisalDayStart',
      render: (text, record) => `${text}`,
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberDocScoredInfo.columns.completeDay' }),
      dataIndex: 'completeDay',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberDocScoredInfo.columns.totalScore' }),
      dataIndex: 'totalScore',
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
    <MellowCard title={intl.formatMessage({ id: 'member.components.MemberDocScoredInfo.title' })} {...rest}>
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

export default MemberDocScoredInfo

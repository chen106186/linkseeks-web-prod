/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 13:52:12
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:19:22
 * @Description: 会员反馈记录
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard from '@/components/MellowCard'
import ButtonSwitch from '@/components/ButtonSwitch'

const PAGE_SIZE = 5

export interface AnalysisData {
  last7days: number
  last30days: number
  last180days: number
  before180days: number
  sum: number
}

export interface FetchParams {
  current?: number
  pageSize?: number
}

export interface ListItem {
  /**
   * 主键id
   */
  id: number
  /**
   * 业务类型1-投诉2-建议
   */
  type: number
  /**
   * 业务类型名称
   */
  typeName: string
  /**
   * 事件分类
   */
  classify: number
  /**
   * 事件分类名称
   */
  classifyName: string
  /**
   * 投诉建议方
   */
  name: string
  /**
   * 事件描述
   */
  subject: string
  /**
   * 事件时间，格式为yyyy-MM-ddHH:mm:ss
   */
  eventTime: string
  /**
   * 处理时间，格式为yyyy-MM-ddHH:mm:ss
   */
  handleTime: string
  /**
   * 处理结果
   */
  result: string
}

interface IProps {
  /**
   * 数据源
   */
  analysis: AnalysisData
  /**
    投诉历史记录
  */
  fetchList?: (params: FetchParams) => Promise<{ data: ListItem[]; totalCount: number }>
}

const MemberFeedbackRecords: React.FC<IProps> = (props: IProps) => {
  const { analysis, fetchList, ...rest } = props
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [total, seTotal] = useState(0)
  const [list, seList] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [radioValue, setRadioValue] = useState(0)

  const intl = useIntl()

  const recordColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.columns.typeName',
        defaultMessage: '业务类型',
      }),
      dataIndex: 'typeName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.columns.classifyName',
        defaultMessage: '事件分类',
      }),
      dataIndex: 'classifyName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.columns.name',
        defaultMessage: '投诉建议方',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.columns.subject',
        defaultMessage: '事件描述',
      }),
      dataIndex: 'subject',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.columns.eventTime',
        defaultMessage: '事件时间',
      }),
      dataIndex: 'eventTime',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.columns.handleTime',
        defaultMessage: '处理时间',
      }),
      dataIndex: 'handleTime',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.columns.result',
        defaultMessage: '处理结果',
      }),
      dataIndex: 'result',
      ellipsis: true,
    },
  ]

  // 获取反馈列表
  const getList = (params?: FetchParams) => {
    if (fetchList) {
      setListLoading(true)
      fetchList({
        current: page,
        pageSize: size,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          seList(data)
          seTotal(totalCount)
        })
        .finally(() => {
          setListLoading(false)
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
      current: page,
      pageSize: size,
    })
  }

  const handleRadioChange = (value: number) => {
    setRadioValue(value)
  }

  const options = [
    {
      label: `${intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.options.sum',
        defaultMessage: '全部',
      })}(${analysis?.sum})`,
      value: 0,
    },
    {
      label: `${intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.options.last7days',
        defaultMessage: '最近7天',
      })}(${analysis?.last7days})`,
      value: 1,
    },
    {
      label: `${intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.options.last30days',
        defaultMessage: '最近30天',
      })}(${analysis?.last30days})`,
      value: 2,
    },
    {
      label: `${intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.options.last180days',
        defaultMessage: '最近180天',
      })}(${analysis?.last180days})`,
      value: 3,
    },
    {
      label: `${intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.options.before180days',
        defaultMessage: '180天前',
      })}(${analysis?.before180days})`,
      value: 4,
    },
  ]

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'customerAbility.components.MemberFeedbackRecords.title',
        defaultMessage: '反馈记录',
      })}
      // extra={(
      //   <ButtonSwitch
      //     options={options}
      //     onChange={handleRadioChange}
      //     value={radioValue}
      //   />
      // )}
      {...rest}
    >
      <PolymericTable
        rowKey="id"
        dataSource={list}
        columns={recordColumns}
        loading={listLoading}
        pagination={{
          pageSize: size,
          total: total,
        }}
        onPaginationChange={handlePaginationChange}
      />
    </MellowCard>
  )
}

export default MemberFeedbackRecords

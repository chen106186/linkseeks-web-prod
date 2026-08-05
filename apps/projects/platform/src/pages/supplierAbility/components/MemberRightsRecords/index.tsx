/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-20 17:00:11
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:50:58
 * @Description: 会员权益记录
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import ButtonSwitch from '@/components/ButtonSwitch'

const PAGE_SIZE = 8

export interface ReceivedData {
  /**
   * 记录Id
   */
  id: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 权益名称
   */
  rightTypeName: string
  /**
   * 获取的数量（返现金额、积分）
   */
  point: string
  /**
   * 备注
   */
  remark: string
}

export interface UsageData {
  /**
   * 记录Id
   */
  id: number
  /**
   * 使用时间
   */
  createTime: string
  /**
   * 权益名称
   */
  rightTypeName: string
  /**
   * 使用类型
   */
  spendTypeName: string
  /**
   * 使用的数量（积分）
   */
  point: number
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
   * 获取获取记录
   */
  fetchReceivedList: (params: FetchParams) => Promise<{ data: ReceivedData[]; totalCount: number }>
  /**
   * 获取使用记录
   */
  fetchUsageList: (params: FetchParams) => Promise<{ data: UsageData[]; totalCount: number }>
}

const MemberRightsRecords: React.FC<IProps> = (props: IProps) => {
  const { fetchReceivedList, fetchUsageList, ...rest } = props
  const [receivedPage, setReceivedPage] = useState(1)
  const [receivedSize, setReceivedSize] = useState(PAGE_SIZE)
  const [receivedTotal, setReceivedTotal] = useState(0)
  const [receivedList, setReceivedList] = useState<ReceivedData[]>([])
  const [receivedListLoading, setReceivedListLoading] = useState(false)

  const [usagePage, setUsagePage] = useState(1)
  const [usageSize, setUsageSize] = useState(PAGE_SIZE)
  const [usageTotal, setUsageTotal] = useState(0)
  const [usageList, setUsageList] = useState<UsageData[]>([])
  const [usageListLoading, setUsageListLoading] = useState(false)

  const [radioValue, setRadioValue] = useState<'received' | 'usage'>('received')

  const intl = useIntl()

  const receivedColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.receivedColumns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.receivedColumns.rightTypeName' }),
      dataIndex: 'rightTypeName',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.receivedColumns.point' }),
      dataIndex: 'point',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.receivedColumns.createTime' }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.receivedColumns.remark' }),
      dataIndex: 'remark',
      ellipsis: true,
    },
  ]

  const usageColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.usageColumns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.usageColumns.rightTypeName' }),
      dataIndex: 'rightTypeName',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.usageColumns.spendTypeName' }),
      dataIndex: 'spendTypeName',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.usageColumns.point' }),
      dataIndex: 'point',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.usageColumns.createTime' }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberRightsRecords.usageColumns.remark' }),
      dataIndex: 'remark',
      ellipsis: true,
    },
  ]

  const getReceivedList = (params?) => {
    if (fetchReceivedList) {
      setReceivedListLoading(true)
      fetchReceivedList({
        current: receivedPage,
        pageSize: receivedSize,
        ...(params || {}),
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setReceivedList(data)
          setReceivedTotal(totalCount)
        })
        .finally(() => {
          setReceivedListLoading(false)
        })
    }
  }

  const getUsageList = (params?) => {
    if (fetchUsageList) {
      setUsageListLoading(true)
      fetchUsageList({
        current: usagePage,
        pageSize: usageSize,
        ...(params || {}),
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setUsageList(data)
          setUsageTotal(totalCount)
        })
        .finally(() => {
          setUsageListLoading(false)
        })
    }
  }

  useEffect(() => {
    getReceivedList()
  }, [])

  const handleReceivedPaginationChange = (page: number, size: number) => {
    setReceivedPage(page)
    setReceivedSize(size)
    getReceivedList({
      current: page,
      pageSize: size,
    })
  }

  const handleUsagePaginationChange = (page: number, size: number) => {
    setUsagePage(page)
    setUsageSize(size)
    getUsageList({
      current: page,
      pageSize: size,
    })
  }

  const handleRadioChange = (value: 'received' | 'usage') => {
    setRadioValue(value)

    switch (value) {
      case 'received':
        getReceivedList()
        break

      case 'usage':
        getUsageList()
        break

      default:
        break
    }
  }

  const options = [
    {
      label: intl.formatMessage({ id: 'member.components.MemberRightsRecords.options.received' }),
      value: 'received',
    },
    {
      label: intl.formatMessage({ id: 'member.components.MemberRightsRecords.options.usage' }),
      value: 'usage',
    },
  ]

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'member.components.MemberRightsRecords.title' })}
      extra={<ButtonSwitch options={options} onChange={handleRadioChange} value={radioValue} />}
      {...rest}
    >
      {radioValue === 'received' ? (
        <PolymericTable
          dataSource={receivedList}
          columns={receivedColumns}
          loading={receivedListLoading}
          pagination={{
            pageSize: receivedSize,
            total: receivedTotal,
          }}
          onPaginationChange={handleReceivedPaginationChange}
        />
      ) : null}
      {radioValue === 'usage' ? (
        <PolymericTable
          dataSource={usageList}
          columns={usageColumns}
          loading={usageListLoading}
          pagination={{
            pageSize: usageSize,
            total: usageTotal,
          }}
          onPaginationChange={handleUsagePaginationChange}
        />
      ) : null}
    </MellowCard>
  )
}

export default MemberRightsRecords

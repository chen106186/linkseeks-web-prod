/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-18 18:30:50
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-04 13:48:09
 * @Description: 内、外部流传记录
 */
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import ButtonSwitch from '@/components/ButtonSwitch'

const PAGE_SIZE = 10

export interface ListRes {
  /**
   * 数据
   */
  data: { [key: string]: any }[]
  /**
   * 总计
   */
  totalCount: number
}

export interface FetchListParams {
  /**
   * 当前页
   */
  current: number
  /**
   * 当前页数
   */
  pageSize: number
}

export interface IProps extends MellowCardProps {
  /**
   * 外部流转记录数据源，与 fetchOuterList 不能共存
   * 如果两个同时存在 outerDataSource 优先
   */
  outerDataSource?: { [key: string]: any }[]
  /**
   * 内部流转记录数据源，与 fetchInnerList 不能共存
   * 如果两个同时存在 innerDataSource 优先
   */
  innerDataSource?: { [key: string]: any }[]
  /**
   * 外部流转记录列数据
   */
  outerColumns?: EditableColumns[]
  /**
   * 内部流转记录列数据
   */
  innerColumns?: EditableColumns[]
  /**
   * 外部 rowkey
   */
  outerRowkey?: string | (<T = unknown>(record: T, index?: number) => string)
  /**
   * 内部 rowkey
   */
  innerRowkey?: string | (<T = unknown>(record: T, index?: number) => string)
  /**
   * 获取外部流转记录方法，与 outerDataSource 不能共存
   * 如果两个同时存在 outerDataSource 优先
   */
  fetchOuterList?: (params: FetchListParams) => Promise<ListRes>
  /**
   * 获取内部流转记录方法，与 innerDataSource 不能共存
   * 如果两个同时存在 innerDataSource 优先
   */
  fetchInnerList?: (params: FetchListParams) => Promise<ListRes>
}

export type FlowRecordsRefHandle = {
  /**
   * 重新请求外部流转记录
   */
  refreshOuterList: () => void
  /**
   * 重新请求外部流转记录
   */
  refreshInnerList: () => void
}

const FlowRecords: React.ForwardRefRenderFunction<FlowRecordsRefHandle, IProps> = (props: IProps, ref) => {
  const {
    outerDataSource = undefined,
    innerDataSource = undefined,
    outerColumns = [],
    innerColumns = [],
    outerRowkey,
    innerRowkey,
    fetchOuterList = undefined,
    fetchInnerList = undefined,
    ...rest
  } = props
  const [outerPage, setOuterPage] = useState(1)
  const [outerSize, setOuterSize] = useState(PAGE_SIZE)
  const [innerPage, setInnerPage] = useState(1)
  const [innerSize, setInnerSize] = useState(PAGE_SIZE)
  const [outerList, setOuterList] = useState<ListRes | null>(null)
  const [innerList, setInnerList] = useState<ListRes | null>(null)
  const [outerLoading, setOuterLoading] = useState(false)
  const [innerLoading, setInnerLoading] = useState(false)
  const [radioValue, setRadioValue] = useState<'inner' | 'outer'>('inner')

  const mounted = useRef(false)

  const getOuterList = (params: FetchListParams) => {
    if (outerDataSource) {
      setOuterList({ data: outerDataSource, totalCount: outerDataSource.length })
      return
    }
    if (fetchOuterList) {
      setOuterLoading(true)
      fetchOuterList(params)
        .then((res) => {
          if (res) {
            mounted.current && setOuterList(res)
          }
        })
        .finally(() => {
          mounted.current && setOuterLoading(false)
        })
    }
  }

  const getInnerList = (params: FetchListParams) => {
    if (innerDataSource) {
      setInnerList({ data: innerDataSource, totalCount: innerDataSource.length })
      return
    }
    if (fetchInnerList) {
      setInnerLoading(true)
      fetchInnerList(params)
        .then((res) => {
          if (res) {
            mounted.current && setInnerList(res)
          }
        })
        .finally(() => {
          mounted.current && setInnerLoading(false)
        })
    }
  }

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    getOuterList({
      current: outerPage,
      pageSize: outerSize,
    })
  }, [outerDataSource])

  useEffect(() => {
    getInnerList({
      current: innerPage,
      pageSize: innerSize,
    })
  }, [innerDataSource])

  useEffect(() => {
    // 这里判断如果只有外部步骤，没有内部步骤的时候，默认设置 radioValue 为 outer
    if ((Array.isArray(outerDataSource) || fetchOuterList) && !Array.isArray(innerDataSource) && !fetchInnerList) {
      setRadioValue('outer')
    }
  }, [outerDataSource, fetchOuterList])

  const handleOuterPaginationChange = (current: number, pageSize: number) => {
    setOuterPage(current)
    setOuterSize(pageSize)
    getOuterList({
      current,
      pageSize,
    })
  }

  const handleInnerPaginationChange = (current: number, pageSize: number) => {
    setInnerPage(current)
    setInnerSize(pageSize)
    getInnerList({
      current,
      pageSize,
    })
  }

  const handleRadioChange = (value: 'inner' | 'outer') => {
    setRadioValue(value)
  }

  const handleRefreshOuterList = () => {
    setOuterPage(1)
    getOuterList({
      current: 1,
      pageSize: outerSize,
    })
  }

  const handleRefreshInnerList = () => {
    setInnerPage(1)
    getInnerList({
      current: 1,
      pageSize: innerSize,
    })
  }

  useImperativeHandle(ref, () => ({
    refreshOuterList: handleRefreshOuterList,
    refreshInnerList: handleRefreshInnerList,
  }))

  const options = [
    outerList && outerList.data
      ? {
          label: '外部状态',
          value: 'outer',
        }
      : null,
    innerList && innerList.data
      ? {
          label: '内部状态',
          value: 'inner',
        }
      : null,
  ].filter(Boolean) as []

  return (
    <MellowCard
      title="流转记录"
      extra={<ButtonSwitch options={options} onChange={handleRadioChange} value={radioValue} />}
      {...rest}
    >
      {radioValue === 'outer' ? (
        <PolymericTable
          rowKey={outerRowkey}
          dataSource={outerList ? outerList.data : []}
          columns={outerColumns}
          loading={outerLoading}
          pagination={
            fetchOuterList
              ? {
                  current: outerPage,
                  pageSize: outerSize,
                  total: outerList?.totalCount,
                }
              : null
          }
          onPaginationChange={handleOuterPaginationChange}
        />
      ) : null}
      {radioValue === 'inner' ? (
        <PolymericTable
          rowKey={innerRowkey}
          dataSource={innerList ? innerList.data : []}
          columns={innerColumns}
          loading={innerLoading}
          pagination={
            fetchInnerList
              ? {
                  current: innerPage,
                  pageSize: innerSize,
                  total: innerList?.totalCount,
                }
              : null
          }
          onPaginationChange={handleInnerPaginationChange}
        />
      ) : null}
    </MellowCard>
  )
}

const FlowRecordsForWard = React.forwardRef<FlowRecordsRefHandle, IProps>(FlowRecords)

export default FlowRecordsForWard

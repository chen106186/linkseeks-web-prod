import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getContractManagePageInnerRecordList, getContractManagePageOuterRecordList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

export interface Iprops {
  contractId: any
  listIndex: any
}

const intl = getIntl()

const TableList: React.FC<Iprops> = ({ contractId, listIndex }) => {
  const [index, setIndex] = useState(1)
  /* 外部 */
  const [ListData, setListData] = useState<any>([]) // 外部数据
  const [page, setPage] = useState(1) // 当前页
  const [size, setSize] = useState(10) // 页大小
  const [total, setTotal] = useState(0) // 外部总条数
  /* 内部 */
  const [List, setList] = useState<any>([]) // 内部数据
  const [innerpage] = useState(1) // 当前页
  const [innersize] = useState(10) // 页大小
  const [innertotal, setinnerTotal] = useState(0) // 内部总条数
  const [listLoading] = useState(false)
  /* 流转列表 */
  const CirculationList: any = [
    {
      title: intl.formatMessage({ id: 'contract.xuhao' }),
      dataIndex: 'name',
      render: (_, record, k) => k + 1,
    },
    { title: intl.formatMessage({ id: 'contract.caozuojuese' }), dataIndex: 'roleName' },
    { title: intl.formatMessage({ id: 'contract.zhuangtai' }), dataIndex: 'statusName' },
    { title: intl.formatMessage({ id: 'contract.caozuo' }), dataIndex: 'operate' },
    { title: intl.formatMessage({ id: 'contract.caozuoshijian' }), dataIndex: 'operateTime' },
    { title: intl.formatMessage({ id: 'contract.shenheyijian' }), dataIndex: 'opinion' },
  ]
  /* 内部 */
  const fetchDataListcolumns: any = [
    {
      title: intl.formatMessage({ id: 'contract.caozuoren' }),
      dataIndex: 'name',
      render: (_, record, k) => k + 1,
    },
    { title: intl.formatMessage({ id: 'contract.bumen' }), dataIndex: 'department' },
    { title: intl.formatMessage({ id: 'contract.zhiwei' }), dataIndex: 'jobTitle' },
    { title: intl.formatMessage({ id: 'contract.zhuangtai' }), dataIndex: 'statusName' },
    { title: intl.formatMessage({ id: 'contract.caozuo' }), dataIndex: 'operate' },
    { title: intl.formatMessage({ id: 'contract.caozuoshijian' }), dataIndex: 'operateTime' },
    { title: intl.formatMessage({ id: 'contract.shenheyijian' }), dataIndex: 'opinion' },
  ]

  /* 外部 */
  const PageOuterRecordList = (data) => {
    getContractManagePageOuterRecordList({
      contractId,
      ...data,
    })
      .then((res) => {
        console.log(res)
        if (res.code === 1000) {
          const list = res.data.data.map((i, k) => ({
            ...i,
            id: i.operateTime + k,
          }))
          setListData(list)
          setTotal(res.data.totalCount)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  /* 内部 */
  const InnerRecordList = (innerData) => {
    getContractManagePageInnerRecordList({
      contractId,
      ...innerData,
    })
      .then((res) => {
        if (res.code === 1000) {
          const list = res.data.data.map((i, k) => ({
            ...i,
            id: i.operateTime + k,
          }))
          setList(list)
          setinnerTotal(res.data.totalCount)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /*分页 */
  const handlePaginationChange = (current: number, pageSize: number) => {
    const data = {
      current,
      pageSize,
    }
    setPage(current)
    setSize(pageSize)
    if (index == 1) {
      PageOuterRecordList(data)
    } else {
      InnerRecordList(data)
    }
  }

  useEffect(() => {
    setIndex(listIndex)

    setPage(1)
    setSize(10)

    const data = {
      current: 1,
      pageSize: 10,
    }
    if (listIndex == 1) {
      PageOuterRecordList(data)
    } else {
      InnerRecordList(data)
    }
  }, [listIndex])

  useEffect(() => {
    if (contractId) {
      const data = {
        pageSize: size,
        current: page,
      }
      PageOuterRecordList(data)
      const innerData = {
        pageSize: innersize,
        current: innerpage,
      }
      InnerRecordList(innerData)
    }
  }, [contractId])

  return (
    <>
      {index == 1 ? (
        <Table
          columns={CirculationList}
          rowKey="id"
          loading={listLoading}
          dataSource={ListData}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            onChange: handlePaginationChange,
          }}
          style={{
            width: '100%',
          }}
        />
      ) : (
        <Table
          columns={fetchDataListcolumns}
          rowKey="id"
          loading={listLoading}
          dataSource={List}
          pagination={{
            current: page,
            pageSize: size,
            total: innertotal,
            showSizeChanger: true,
            onChange: handlePaginationChange,
          }}
          style={{
            width: '100%',
          }}
        />
      )}
    </>
  )
}

export default TableList

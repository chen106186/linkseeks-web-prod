import { useIntl } from '@linkseeks/i18n'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Input, Select, Table } from 'antd'

const AllQuery = () => {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(1)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const intl = useIntl()

  const fetchData = useCallback(async (page: number, pageSize: number) => {
    setDataSource([
      {
        no: 1,
        value: '1',
        level: 1,
      },
    ])
  }, [])

  useEffect(() => {
    fetchData(page, pageSize)
  }, [])

  const handleSetValue = (params: { dataIndex: string; value: string; index: number }) => {
    const { index, dataIndex, value } = params
    const newData = dataSource.map((_item, currentIndex) => {
      if (index === currentIndex) {
        return {
          ..._item,
          [dataIndex]: value,
        }
      }
      return _item
    })
    setDataSource(newData)
  }

  const paginationOnChange = useCallback(
    (page: number, pageSize: number) => {
      setPage(page)
      setPageSize(pageSize)
      fetchData(page, pageSize)
    },
    [fetchData],
  )

  const columns = [
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
      dataIndex: 'no',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberWarning.ruleSetting.index.warnCondition' })}`,
      dataIndex: 'memberName',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnTip' })}`,
      dataIndex: 'project',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnTip' })}`,
      dataIndex: 'notice',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberWarning.ruleSetting.index.warnValue' })}`,
      dataIndex: 'value',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            onChange={(e) => handleSetValue({ dataIndex: 'value', value: e.target.value, index: index })}
          />
        )
      },
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnLevel' })}`,
      dataIndex: 'level',
      render: (text, record) => {
        return <Select value={text} />
      },
    },
  ]

  return (
    <PageHeaderWrapper title={`${intl.formatMessage({ id: 'member.memberWarning.ruleSetting.index.warnRuleSet' })}`}>
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="no"
          pagination={{
            onChange: paginationOnChange,
          }}
        ></Table>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AllQuery

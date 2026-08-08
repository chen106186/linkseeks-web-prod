import React, { memo, useEffect, useState } from 'react'
import type { IAntdSchemaFormProps } from '@apps/formily'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { getContractExecutePageListForSummaryByPartyA } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { Table, Tabs } from 'antd'
import { Card } from '@linkseeks/ui'

const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  contractId: number
  TabList: any
}
const DetailedList: React.FC<Iprops> = ({ contractId, TabList = [] }) => {
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [listLoading, setListLoading] = useState(false)
  const [data, setData] = useState<any>()
  const [page, setPage] = useState(1)
  const columnsList: any = [
    {
      title: intl.formatMessage({ id: 'contract.qingkuancishu' }),
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (text: any, record: any, index: number) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.qingkuandanhaozhaiyao' }),
      dataIndex: 'applyNo',
      align: 'left',
      render: (text: any, record: any) => {
        return (
          <div>
            <EyeAuthButton url={`/balance/businessRequestFunds/search/preview?id=${record.id}&no=${record.applyNo}`}>
              {text}
            </EyeAuthButton>
            <p>{record.applyAbstract}</p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.qingkuandanzhuangtai' }),
      dataIndex: 'statusName',
      key: 'statusName',
      align: 'left',
      render: (text: any) => {
        return <span>{text}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.qingkuanshijian' }),
      dataIndex: 'applyTime',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.qingkuanjine' }),
      dataIndex: 'applyAmount',
      align: 'left',
      render: (text: any) => {
        return (
          <span>
            {intl.formatMessage({ id: 'common.money' })}
            {text}
          </span>
        )
      },
    },

    {
      title: intl.formatMessage({ id: 'contract.fukuanshijian' }),
      dataIndex: 'payTime',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanjine' }),
      dataIndex: 'payAmount',
      align: 'left',
      render: (text: any) => {
        return (
          <span>
            {intl.formatMessage({ id: 'common.money' })}
            {text}
          </span>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanfangshi' }),
      dataIndex: 'payWayName',
      align: 'left',
    },
  ]

  const [executeTabKey, setExecuteTabKey] = useState<string>(String(contractId))

  /* 请款统计 */
  const fetchData = (params: any) => {
    setListLoading(true)
    getContractExecutePageListForSummaryByPartyA({
      contractId: contractId,
      ...params,
    })
      .then((res) => {
        if (res.code === 1000) {
          setTotal(res.data.totalCount)
          setData(res.data.data)
        } else {
        }
      })
      .finally(() => {
        setListLoading(false)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  useEffect(() => {
    fetchData({
      contractId: contractId,
      current: 1,
      pageSize: 10,
    })
  }, [contractId])

  const handleTabChange = (i) => {
    setPage(1)
    setSize(10)
    setExecuteTabKey(i)
    fetchData({
      current: 1,
      pageSize: 10,
      contractId: i,
    })
  }

  // 分页
  const handlePaginationChange = (current: number, pageSize: number) => {
    setPage(current)
    const datas = {
      contractId: executeTabKey,
      current: current,
      pageSize: pageSize,
    }
    setSize(pageSize)
    fetchData(datas)
  }

  return (
    <Card id="record" title={intl.formatMessage({ id: 'contract.hetongqingkuanqingkuangtongji' })}>
      {TabList?.length ? (
        <Tabs size="small" activeKey={String(executeTabKey)} onChange={(e) => handleTabChange(e)}>
          {TabList.map((item) => (
            <Tabs.TabPane tab={item.contractNo} key={String(item.contractId)}>
              <Table
                rowKey="id"
                columns={columnsList}
                dataSource={data}
                loading={listLoading}
                pagination={{
                  current: page,
                  showSizeChanger: true,
                  pageSize: size,
                  total,
                  onChange: handlePaginationChange,
                }}
                style={{
                  width: '100%',
                }}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : null}
    </Card>
  )
}
export default memo(DetailedList)

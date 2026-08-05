import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import {
  postOrderMemberSalesAchievementCountMemberSalesInformation,
  getOrderMemberSalesAchievementCountExportMemberSalesInformation,
} from '@apps/apis'
import { authService } from '@apps/services'
import { getDateTimeListCurrentMonth } from './utils'
import { getMemberAbilitySalesOrganizationList } from '@apps/apis'
import { exportFile } from '@apps/utils'

const SalesPerformanceStatistics: React.FC = () => {
  const intl = getIntl()
  const { token } = authService.getAuth() || {}
  const ref = useRef<any>({})
  const [organizationList, setOrganizationList] = useState<Array<{ value: number; label: string }>>()
  const [paramsData, setParamsData] = useState<{
    name: string
    time: string
    organization: number
    pageSize: number
    current: number
  }>()
  const currentDateRef = useRef(getDateTimeListCurrentMonth(1)[0].value)

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.name' }),
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.organization',
      }),
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.juniorMembership',
      }),
      dataIndex: 'memberCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.orderNumber',
      }),
      dataIndex: 'orderCount',
      align: 'center',
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.amountPayable',
      }),
      dataIndex: 'amountPayable',
      align: 'center',
      sorter: (a, b) => a.amountPayable - b.amountPayable,
      render: (text) =>
        `${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text}`,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.amountPaid',
      }),
      dataIndex: 'amountPaid',
      align: 'center',
      sorter: (a, b) => {
        return a.amountPaid - b.amountPaid
      },
      render: (text) =>
        `${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text}`,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.afterSaleAmount',
      }),
      dataIndex: 'refundAmount',
      align: 'center',
      render: (text) =>
        `${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text}`,
    },
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.operation' }),
      dataIndex: 'option',
      align: 'center',
      width: 260,
      render: (text, record) => (
        <>
          {/* <Link
            to={`/orderAbility/salesPerformanceStatistics/statisticsDetail?id=${record.userId}&time=${currentDate}`}
          >
          </Link> */}
          <Button type="link" onClick={() => linkTo('statisticsDetail', record.userId)}>
            {intl.formatMessage({ id: 'salesPerformanceStatistics.view' })}
          </Button>
          {/* <Link
            to={`/orderAbility/salesPerformanceStatistics/performanceDetail?id=${record.userId}&time=${currentDate}`}
          >
          </Link> */}
          <Button type="link" onClick={() => linkTo('performanceDetail', record.userId)}>
            {intl.formatMessage({
              id: 'salesPerformanceStatistics.orderDetail',
            })}
          </Button>
        </>
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    let { ...rest } = params

    return new Promise((resolve, reject) => {
      postOrderMemberSalesAchievementCountMemberSalesInformation(
        {
          ...rest,
        },
        { ctlType: 'none' },
      )
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            message.error(res.message)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  /** 获取机构列表 */
  const getOrganizationList = async () => {
    let res = await getMemberAbilitySalesOrganizationList()
    const list = res.data?.map((i, k) => ({
      value: k,
      label: i,
    }))
    setOrganizationList(list)
  }

  const linkTo = (type: 'statisticsDetail' | 'performanceDetail', id: string) => {
    switch (type) {
      case 'statisticsDetail':
        history.push(
          `/orderAbility/salesPerformanceStatistics/statisticsDetail?id=${id}&time=${currentDateRef.current}`,
        )
        break

      case 'performanceDetail':
        history.push(
          `/orderAbility/salesPerformanceStatistics/performanceDetail?id=${id}&time=${currentDateRef.current}`,
        )
        break

      default:
        console.log('Tips --- type :>> ', type)
        break
    }
  }

  useEffect(() => {
    getOrganizationList()
  }, [])

  /**导出 */
  const handleExport = async () => {
    const p = { ...paramsData }
    delete p.current
    delete p.pageSize
    exportFile(getOrderMemberSalesAchievementCountExportMemberSalesInformation, p)
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'userId',
          }}
          // keepAlive={false}
          columns={columns}
          currentRef={ref}
          rowKey="userId"
          fetchTableData={(params: any) => {
            console.log('params:', params)
            delete params.account
            let num = Number(params.title)
            if (num > -1 && organizationList?.length) {
              params.title = organizationList[params.title].label
            }
            setParamsData({ ...params })
            return fetchListData(params)
          }}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyChilds={{
            layouts: {
              order: 2,
            },
            children: (
              <Button style={{ width: 80 }} onClick={handleExport}>
                {intl.formatMessage({ id: 'salesPerformanceStatistics.export' })}
              </Button>
            ),
          }}
          formilyProps={{
            layouts: {
              order: 3,
            },
            ctx: {
              effects: ($) => {
                $('onFieldInputChange', 'title').subscribe(() => {
                  ref.current.reload()
                })
                $('onFieldInputChange', 'startTime').subscribe((e) => {
                  currentDateRef.current = e.value
                  ref.current.reload()
                })
              },
              initialValues: {
                startTime: getDateTimeListCurrentMonth(1)[0].value,
              },
              schema: {
                type: 'object',
                properties: {
                  startTime: {
                    type: 'string',
                    enum: getDateTimeListCurrentMonth(12),
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.time' }),
                    },
                  },
                  title: {
                    type: 'string',
                    enum: organizationList,
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.organization' }),
                      allowClear: true,
                    },
                  },
                  name: {
                    type: 'Search',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.name' }),
                      allowClear: true,
                    },
                  },
                },
              },
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default SalesPerformanceStatistics

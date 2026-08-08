import React, { useState, useRef, useEffect } from 'react'
import { Card, Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import moment from 'moment'
import { postOrderMemberSalesAchievementCountOrderDetails } from '@apps/apis'
import { authService } from '@apps/services'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberAbilitySalesChannelList, getOrderMemberSalesAchievementCountExportOrderDetails } from '@apps/apis'
import ReturnEle from '@/components/ReturnEle'
import { getDateTimeListCurrentMonth } from '../utils'
import { exportFile } from '@apps/utils'

const formActions = createFormActions()
const intl = getIntl()
const { token } = authService.getAuth() || {}

const PerformanceDetail: React.FC = () => {
  const { id, skuId, subMemberId, subMemberRoleId, time, memberName, commodityName } = usePageStatus()
  const ref = useRef<any>({})
  const [organizationList, setOrganizationList] = useState<Array<{ value: number; label: string }>>()
  const [paramsData, setParamsData] = useState<{
    name: string
    time: 'string'
    organization
    current: number
    pageSize: number
    commodityName: string
  }>()
  const [skuIdLock, setSkuIdLock] = useState<boolean>(false)
  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.salesOrder',
      }),
      dataIndex: 'orderNo',
      sorter: (a, b) => a.orderId - b.orderId,
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.commodity' }),
      dataIndex: 'commodityName',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <>
          <div>{record.commodityName}</div>
          <div>{record.spec}</div>{' '}
        </>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.category',
      }),
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.quantity',
      }),
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.unitPrice',
      }),
      dataIndex: 'price',
      align: 'center',
      render: (text) =>
        `${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text || '0.00'}`,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.preferentialReduction',
      }),
      dataIndex: 'preferentialRelief',
      align: 'center',
      render: (text) => (
        <span style={{ color: '#ce586c' }}>{`-${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text || '0.00'}`}</span>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.commodityAmountPayable',
      }),
      dataIndex: 'refPrice',
      align: 'center',
      render: (text) =>
        `${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text || '0.00'}`,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.commodityAmountReceived',
      }),
      dataIndex: 'paidAmount',
      align: 'center',
      render: (text) =>
        `${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text || '0.00'}`,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.commodityAfterSaleAmount',
      }),
      dataIndex: 'returnAmount',
      align: 'center',
      render: (text) =>
        `${intl.formatMessage({
          id: 'salesPerformanceStatistics.currency',
        })}${text || '0.00'}`,
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.subordinateSalesman',
      }),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.orderMemberName',
      }),
      dataIndex: 'buyMemberName',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'salesPerformanceStatistics.orderCompletionTime',
      }),
      dataIndex: 'finishTime',
      align: 'center',
      sorter: (a, b) => moment(a.finishTime).valueOf() - moment(b.finishTime).valueOf(),
    },
  ]
  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    let { ...rest } = params

    return new Promise((resolve, reject) => {
      postOrderMemberSalesAchievementCountOrderDetails(
        {
          skuId: params.commodityName && !skuIdLock && params.commodityName == commodityName ? skuId : null,
          subMemberId: params.subMemberName ? subMemberId : null,
          subMemberRoleId: params.subMemberName ? subMemberRoleId : null,
          ...rest,
        },
        { ctlType: 'none' },
      )
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  /**业务员列表 */
  const getOrganizationList = async () => {
    let res = await getMemberAbilitySalesChannelList()
    const list = res.data?.map((i) => ({
      value: i.userId,
      label: i.userName,
    }))
    setOrganizationList(list || [])
  }

  useEffect(() => {
    getOrganizationList()
  }, [])

  /** 导出 */
  const handleExport = async () => {
    const p: any = { ...paramsData }
    if (paramsData?.commodityName && !skuIdLock && paramsData.commodityName == commodityName) p.skuId = skuId
    delete p.current
    delete p.pageSize

    exportFile(getOrderMemberSalesAchievementCountExportOrderDetails, p)
  }

  if (!organizationList) {
    return <></>
  }
  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'salesPerformanceStatistics.performanceOrderDetails',
        defaultMessage: '业绩订单明细',
      })}
    >
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'orderById',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => {
            delete params.account
            if (params.commodityName != commodityName) {
              setSkuIdLock(true)
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
              <Button style={{ width: 80 }} onClick={(e) => handleExport(e)}>
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
                $('onFieldInputChange', 'userId').subscribe(() => {
                  ref.current.reload()
                })
                $('onFieldInputChange', 'countTime').subscribe(() => {
                  ref.current.reload()
                })
              },
              initialValues: {
                countTime: time,
                userId: organizationList?.filter((i) => i.value == Number(id)).length ? Number(id) : null,
                commodityName: commodityName,
                subMemberName: memberName,
              },
              schema: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',
                    enum: organizationList,
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.salesman' }),
                      allowClear: true,
                    },
                  },
                  countTime: {
                    type: 'string',
                    enum: getDateTimeListCurrentMonth(12),
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.time' }),
                    },
                  },
                  subMemberName: {
                    type: 'Search',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.memberName' }),
                      allowClear: true,
                    },
                  },
                  commodityName: {
                    type: 'Search',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.productName' }),
                      allowClear: true,
                    },
                  },
                  category: {
                    type: 'Search',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'salesPerformanceStatistics.placeholder.categoryName' }),
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

export default PerformanceDetail

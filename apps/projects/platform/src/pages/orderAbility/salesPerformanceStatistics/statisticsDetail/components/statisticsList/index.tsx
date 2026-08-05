import React, { useState, useRef, useEffect } from 'react'
import { Card, Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import {
  postOrderMemberSalesAchievementCountMemberInformation,
  postOrderMemberSalesAchievementCountCommodityInformation,
  getOrderMemberSalesAchievementCountExportMemberInformation,
  getOrderMemberSalesAchievementCountExportCommodityInformation,
} from '@apps/apis'
import { getManageMemberColumnPage } from '@apps/apis'
import { authService } from '@apps/services'
import { getDateTimeListCurrentMonth } from '../../../utils'
import styles from './index.less'
import { exportFile } from '@apps/utils'

const intl = getIntl()
const { token } = authService.getAuth() || {}

const StatistticsList: React.FC<{ searchType: string; id: number; time: string }> = ({ searchType, id, time }) => {
  const memberref = useRef<any>({})
  const productref = useRef<any>({})
  const memberTimeRef = useRef<string>()
  const prodcutTimeRef = useRef<string>()

  const [organizationList, setOrganizationList] = useState<Array<{ value: number; label: string }>>()
  const [paramsData, setParamsData] = useState<{
    memberName: string
    memberTime: string
    commodityName: string
    productTime: string
    category: string
  }>()

  const defaultColumns: ColumnType<any>[] =
    searchType === 'membership'
      ? [
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.menmberId',
            }),
            dataIndex: 'memberId',
            align: 'center',
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.menmberName',
            }),
            dataIndex: 'memberName',
            align: 'center',
            width: 200,
            // ellipsis: true,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.role',
            }),
            dataIndex: 'roleName',
            align: 'center',
            render: (text, record) => <>{text}</>,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.orderQuantity',
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
            // sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: (text) =>
              `${intl.formatMessage({
                id: 'salesPerformanceStatistics.currency',
              })}${text || '0'}`,
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
              })}${text || '0'}`,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.afterSaleAmount',
            }),
            dataIndex: 'refundAmount',
            align: 'center',
            sorter: (a, b) => a.refundAmount - b.refundAmount,
            render: (text) =>
              `${intl.formatMessage({
                id: 'salesPerformanceStatistics.currency',
              })}${text || '0'}`,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.operation',
            }),
            dataIndex: 'option',
            align: 'center',
            width: 260,
            render: (text, record) => (
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/orderAbility/salesPerformanceStatistics/performanceDetail?id=${id}&subMemberId=${
                      record.memberId
                    }&subMemberRoleId=${record.memberRoleId}&memberName=${record.memberName}&time=${
                      memberTimeRef.current || time
                    }`,
                  )
                }
              >
                {intl.formatMessage({
                  id: 'salesPerformanceStatistics.orderDetail',
                })}
              </Button>
            ),
          },
        ]
      : [
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.productId',
            }),
            dataIndex: 'skuId',
            align: 'center',
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.productDetail',
            }),
            dataIndex: 'digest',
            align: 'center',
            // ellipsis: true,
            width: 200,
            render: (text, record) => (
              <>
                <div>{record.commodityName}</div>
                <div>{record.spec}</div>
              </>
            ),
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.category',
            }),
            dataIndex: 'category',
            align: 'center',
            // render: (text, record) => <>{text}</>,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.number',
            }),
            dataIndex: 'quantity',
            align: 'center',
            sorter: (a, b) => a.quantity - b.quantity,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.sale',
            }),
            dataIndex: 'amount',
            align: 'center',
            sorter: (a, b) => a.amount - b.amount,
            render: (text) =>
              `${intl.formatMessage({
                id: 'salesPerformanceStatistics.currency',
              })}${text || '0'}`,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.amountReceived',
            }),
            dataIndex: 'paidAmount',
            align: 'center',
            sorter: (a, b) => {
              return a.paidAmount - b.paidAmount
            },
            render: (text) =>
              `${intl.formatMessage({
                id: 'salesPerformanceStatistics.currency',
              })}${text || '0'}`,
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
              })}${text || '0'}`,
          },
          {
            title: intl.formatMessage({
              id: 'salesPerformanceStatistics.operation',
            }),
            dataIndex: 'option',
            align: 'center',
            width: 260,
            render: (text, record) => (
              <Link
                to={`/orderAbility/salesPerformanceStatistics/performanceDetail?id=${id}&skuId=${
                  record.skuId
                }&commodityName=${record.commodityName}&time=${prodcutTimeRef.current || time}`}
              >
                <Button type="link">
                  {intl.formatMessage({
                    id: 'salesPerformanceStatistics.orderDetail',
                  })}
                </Button>
              </Link>
            ),
          },
        ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    let { memberTime, productTime, ...rest } = params

    const api =
      searchType === 'membership'
        ? postOrderMemberSalesAchievementCountMemberInformation
        : postOrderMemberSalesAchievementCountCommodityInformation
    return new Promise((resolve, reject) => {
      api(
        {
          userId: id,
          ...rest,
          countTime: searchType === 'membership' ? memberTime : productTime,
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

  const getOrganizationList = async () => {
    let res = await getManageMemberColumnPage()
    const list = res.data?.data?.map((i) => ({
      value: i.id,
      label: i.name,
    }))
    setOrganizationList(list)
  }

  useEffect(() => {
    getOrganizationList()
  }, [])

  const handleExport = async () => {
    let param
    let api
    if (searchType === 'membership') {
      param = {
        userId: id,
        countTime: paramsData?.memberTime,
        memberName: paramsData?.memberName,
      }
      api = getOrderMemberSalesAchievementCountExportMemberInformation
    } else {
      param = {
        userId: id,
        countTime: paramsData?.productTime,
        commodityName: paramsData?.commodityName,
        category: paramsData?.category,
      }
      api = getOrderMemberSalesAchievementCountExportCommodityInformation
    }

    const p = { ...param }
    delete p.current
    delete p.pageSize
    exportFile(api, p)
  }

  const schema = {
    type: 'object',
    properties:
      searchType === 'membership'
        ? {
            memberTime: {
              type: 'string',
              enum: getDateTimeListCurrentMonth(12),
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'salesPerformanceStatistics.placeholder.time',
                }),
              },
            },
            memberName: {
              type: 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'salesPerformanceStatistics.placeholder.memberName',
                }),
                allowClear: true,
              },
            },
          }
        : {
            productTime: {
              type: 'string',
              enum: getDateTimeListCurrentMonth(12),
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'salesPerformanceStatistics.placeholder.time',
                }),
              },
            },
            commodityName: {
              type: 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'salesPerformanceStatistics.placeholder.productName',
                }),
                allowClear: true,
              },
            },
            category: {
              type: 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'salesPerformanceStatistics.placeholder.categoryName',
                }),
                allowClear: true,
              },
            },
          },
  }

  return (
    <Card className={styles.tableStyle}>
      <StandardTable
        tableProps={{
          rowKey: 'orderNo',
        }}
        keepAlive
        columns={columns}
        currentRef={searchType === 'membership' ? memberref : productref}
        fetchTableData={(params: any) => {
          delete params.account
          setParamsData({ ...params })
          let newParam
          if (searchType === 'membership') {
            memberTimeRef.current = params.memberTime
            newParam = {
              memberTime: params.memberTime,
              memberName: params.memberName,
              current: params.current,
              pageSize: params.pageSize,
            }
          } else {
            prodcutTimeRef.current = params.productTime
            newParam = {
              productTime: params.productTime,
              commodityName: params.commodityName,
              category: params.category,
              current: params.current,
              pageSize: params.pageSize,
            }
          }
          return fetchListData(newParam)
        }}
        formilyLayouts={
          {
            // justify: 'space-between',
          }
        }
        formilyProps={{
          layouts: {
            order: 3,
          },
          ctx: {
            effects: ($) => {
              $('onFieldInputChange', 'memberTime').subscribe(() => {
                memberref.current.reload()
              })

              $('onFieldInputChange', 'productTime').subscribe(() => {
                productref.current.reload()
              })
            },
            initialValues: {
              memberTime: time,
              productTime: time,
            },
            schema: schema,
          },
        }}
        formilyChilds={{
          layouts: {
            order: 2,
          },
          children: (
            <div className={styles.info}>
              <div className={styles.title}>
                {searchType === 'membership'
                  ? intl.formatMessage({
                      id: 'salesPerformanceStatistics.membershipStatistics',
                    })
                  : intl.formatMessage({
                      id: 'salesPerformanceStatistics.CommodityStatistics',
                    })}
              </div>
              <Button style={{ width: 80, marginRight: 10 }} onClick={handleExport}>
                {intl.formatMessage({
                  id: 'salesPerformanceStatistics.export',
                })}
              </Button>
            </div>
          ),
        }}
      />
    </Card>
  )
}

export default StatistticsList

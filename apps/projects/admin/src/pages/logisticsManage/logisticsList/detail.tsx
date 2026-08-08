import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Space, Typography } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import { Context } from '@/components/DetailLayout/components/context'
import ProgressLayout from '@/components/DetailLayout/components/progressLayout'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import LogisticsBillLayout from '@/components/DetailLayout/components/listLayout'
import FreightLayout from '@/components/DetailLayout/components/generalLayout'
import RecordLyout from '@/components/DetailLayout/components/recordLyout'
import { formatTimeString } from '@/utils'
import type { ColumnType } from 'antd/lib/table/interface'
import { getLogisticsPlatformOrderGet } from '@apps/apis'

const TABLINK = [
  { key: 'progressLayout', label: '流转进度' },
  { key: 'basicLayout', label: '基本信息' },
  { key: 'logisticsBillLayout', label: '物流单明细' },
  { key: 'freightLayout', label: '运费' },
  { key: 'recordLyout', label: '流转记录' },
]

const LogisticsDetailLayout = () => {
  const { id } = useQuery()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [freightEffect, setFreightEffect] = useState<any>([])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '物流单号', extra: data.logisticsOrderNo },
          { label: '单据摘要', extra: data.digest },
          { label: '外部状态', extra: data.statusName },
        ],
      },
      {
        col: [
          { label: '对应发货单号', extra: data.shipmentOrderCode },
          { label: '对应订单/售后单', extra: data.relevanceOrderCode },
          { label: '发货方', extra: data.shipperMemberName },
          { label: '发货地址', extra: data.shipperFullAddress },
        ],
      },
      {
        col: [
          { label: '收货方', extra: data.receiverName },
          { label: '收货地址', extra: data.receiverFullAddress },
          { label: '单据时间', extra: formatTimeString(data.invoicesTime) },
        ],
      },
    ])
  }

  const handleFreightEffect = (data: any) => {
    setFreightEffect([
      {
        col: [
          { label: '含税/税率', extra: `${data.taxInclusive ? '是' : '-'}/${data.taxRate ? data.taxRate : '-'}` },
          { label: '运费', extra: `￥${data.freightPrice ? Number(data.freightPrice).toFixed(2) : '-'}` },
          { label: '结算方式', extra: data.settlementWay },
        ],
      },
    ])
  }

  const detailFetch = useCallback(async () => {
    await getLogisticsPlatformOrderGet({ id }).then((res: any) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
      const externalLogs: any = []
      const externalLogStates: any = []
      data.externalList.forEach((item: any) => {
        externalLogStates.push({
          state: item.step,
          stateName: null,
          isExecute: item.isExecute,
          operationalProcess: item.stepName,
          roleName: item.roleName,
        })
      })
      data.logisticsOrderLogList.forEach((item: any) => {
        externalLogs.push({
          id: item.id,
          roleName: item.operatorRoleName,
          state: item.status,
          stateName: item.statusName,
          operation: item.operation,
          createTime: item.createTime,
          auditOpinion: item.remark,
        })
      })
      data.externalLogs = externalLogs
      data.externalLogStates = externalLogStates
      handleBasicEffect(data)
      handleFreightEffect(data)
      setDataSource(data)
    })
  }, [])

  useEffect(() => {
    detailFetch()
  }, [])

  const columns: ColumnType<any>[] = [
    {
      title: '商品ID/名称',
      key: 'productId',
      dataIndex: 'productId',
      render: (text: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{text}</Typography.Text>
          <Typography.Text>{record.productName}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '品类',
      key: 'categoryName',
      dataIndex: 'categoryName',
    },
    {
      title: '品牌',
      key: 'brandName',
      dataIndex: 'brandName',
    },
    {
      title: '数量/单位',
      key: 'amount',
      dataIndex: 'amount',
      render: (text: any, record: any) => <Typography.Text>{`${text}/${record.unitName}`}</Typography.Text>,
    },
    {
      title: (
        <>
          箱数
          <br />
          合计:{dataSource.totalCarton}
        </>
      ),
      key: 'carton',
      dataIndex: 'carton',
    },
    {
      title: (
        <>
          重量(KG)
          <br />
          合计:{dataSource.totalWeight}
        </>
      ),
      key: 'weight',
      dataIndex: 'weight',
    },
    {
      title: (
        <>
          体积(M3)
          <br />
          合计:{dataSource.totalVolume}
        </>
      ),
      key: 'volume',
      dataIndex: 'volume',
    },
  ]

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper subTitle={dataSource.logisticsOrderNo} title={dataSource.digest} isAnchor items={TABLINK}>
        <Fragment>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <LogisticsBillLayout
            title="物流单明细"
            anchor="logisticsBillLayout"
            columns={columns}
            done={true}
            data={dataSource.detailList}
          />
          <FreightLayout anchor="freightLayout" title="运费" effect={freightEffect} />
          <RecordLyout />
        </Fragment>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}

export default LogisticsDetailLayout

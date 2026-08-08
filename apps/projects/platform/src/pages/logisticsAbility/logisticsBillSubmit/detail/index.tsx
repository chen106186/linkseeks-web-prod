import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Typography, Space } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { formatTimeString } from '@/utils'
import ProgressLayout from '@/pages/transaction/components/detailLayout/components/progressLayout'
import BasicLayout from '@/pages/transaction/components/detailLayout/components/basicLayout'
import ListLayout from '@/pages/transaction/components/detailLayout/components/listLayout'
import RecordLyout from '@/pages/transaction/components/detailLayout/components/recordLyout'
import FreightLayout from '@/pages/transaction/components/detailLayout/components/generalLayout'
import { getLogisticsOrderWaitSubmitGet } from '@apps/apis'
const intl = getIntl()
const TABLINK = [
  { key: 'progressLayout', label: intl.formatMessage({ id: 'logistics.liuzhuanjindu' }) },
  { key: 'basicLayout', label: intl.formatMessage({ id: 'logistics.jibenxinxi' }) },
  { key: 'logisticsBillLayout', label: intl.formatMessage({ id: 'logistics.wuliudanmingxi' }) },
  { key: 'freightLayout', label: intl.formatMessage({ id: 'logistics.yunfei' }) },
  { key: 'recordLyout', label: intl.formatMessage({ id: 'logistics.liuzhuanjilu' }) },
]

const LogisticsBillSubmitDetail = () => {
  const { id, code } = useQuery()
  const { pathname } = useLocation()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [freightEffect, setFreightEffect] = useState<any>([])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'logistics.wuliudanhao' }), extra: data.logisticsOrderNo },
          { label: intl.formatMessage({ id: 'logistics.danjuzhaiyao' }), extra: data.digest },
          { label: intl.formatMessage({ id: 'logistics.wuliufuwushang' }), extra: data.companyName },
          { label: intl.formatMessage({ id: 'logistics.waibuzhuangtai' }), extra: data.statusName },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'logistics.duiyingfahuodanhao' }), extra: data.shipmentOrderCode },
          { label: intl.formatMessage({ id: 'logistics.duiyingdingdanshouhoudan' }), extra: data.relevanceOrderCode },
          { label: intl.formatMessage({ id: 'logistics.fahuodizhi' }), extra: data.shipperFullAddress },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'logistics.shouhuofang' }), extra: data.receiverName },
          { label: intl.formatMessage({ id: 'logistics.shouhuodizhi' }), extra: data.receiverFullAddress },
          { label: intl.formatMessage({ id: 'logistics.danjushijian' }), extra: formatTimeString(data.invoicesTime) },
        ],
      },
    ])
  }

  const handleFreightEffect = (data: any) => {
    setFreightEffect([
      {
        col: [
          {
            label: intl.formatMessage({ id: 'logistics.hanshuishuil' }),
            extra: data.taxRate
              ? `${
                  data.taxInclusive
                    ? intl.formatMessage({ id: 'logistics.shi' })
                    : intl.formatMessage({ id: 'logistics.fou' })
                }/${data.taxRate}%`
              : '-/-',
          },
          {
            label: intl.formatMessage({ id: 'logistics.yunfei' }),
            extra: `${intl.formatMessage({ id: 'common.money' })}${
              data.freightPrice ? data.freightPrice.toFixed(2) : '-'
            }`,
          },
          {
            label: intl.formatMessage({ id: 'logistics.jiesuanfangshi' }),
            extra: data.settlementWay ? data.settlementWay : '-',
          },
        ],
      },
    ])
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'logistics.shangpinIDmingcheng' }),
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
      title: intl.formatMessage({ id: 'logistics.pinlei' }),
      key: 'categoryName',
      dataIndex: 'categoryName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.pinpai' }),
      key: 'brandName',
      dataIndex: 'brandName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.shuliangdanwei' }),
      key: 'amount',
      dataIndex: 'amount',
      render: (text: any, record: any) => <Typography.Text>{`${text}/${record.unitName}`}</Typography.Text>,
    },
    {
      title: (
        <>
          {intl.formatMessage({ id: 'logistics.xiangshu' })}
          <br />
          {intl.formatMessage({ id: 'logistics.heji' })}:{dataSource.totalCarton}
        </>
      ),
      key: 'carton',
      dataIndex: 'carton',
    },
    {
      title: (
        <>
          {intl.formatMessage({ id: 'logistics.zhongliangKG' })}
          <br />
          {intl.formatMessage({ id: 'logistics.heji' })}:{dataSource.totalWeight}
        </>
      ),
      key: 'weight',
      dataIndex: 'weight',
    },
    {
      title: (
        <>
          {intl.formatMessage({ id: 'logistics.tijiM3' })}
          <br />
          {intl.formatMessage({ id: 'logistics.heji' })}:{dataSource.totalVolume}
        </>
      ),
      key: 'volume',
      dataIndex: 'volume',
    },
  ]

  const fetchData = useCallback(async () => {
    await getLogisticsOrderWaitSubmitGet({ id, code })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        let { data }: any = res
        let externalLogs: any = []
        let externalLogStates: any = []
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
        setDataSource(data)
        handleBasicEffect(data)
        handleFreightEffect(data)
      })
      .catch((error) => {
        console.warn(error)
      })
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper subTitle={dataSource.logisticsOrderNo} title={dataSource.digest} items={TABLINK}>
        <Fragment>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <ListLayout
            title={intl.formatMessage({ id: 'logistics.wuliudanmingxi' })}
            anchor="logisticsBillLayout"
            columns={columns}
            done={true}
            data={dataSource.detailList}
          />
          <FreightLayout
            anchor="freightLayout"
            title={intl.formatMessage({ id: 'logistics.yunfei' })}
            effect={freightEffect}
          />
          <RecordLyout />
        </Fragment>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}

export default LogisticsBillSubmitDetail

import React, { Fragment, useEffect, useState, useMemo, useRef } from 'react'
import { Row, Col } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'

import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'
import PeripheralLayout from '@/pages/procurementAbility/components/detail'
import { Card } from '@linkseeks/ui'
import ProgressLayout from '@/pages/procurementAbility/components/detail/components/progressCommonLayout'
import CommonLayout from '@/pages/procurementAbility/components/detail/components/bidCommonLayout'

import {
  getSettlementBusinessReconciliationDetailReconciliation,
  getSettlementBusinessReconciliationReconciliationRowList,
} from '@apps/apis'
import BusinessFileLayout from '../../components/BusinessFileLayout'
import RecordCommonLayout from '../../components/RecordCommonLayout'
import BusinessInvoiceCard from '../../components/BusinessInvoiceCard'
import { useQuery, useLocation } from '@linkseeks/router-core'
const intl = getIntl()
const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'balance.liuzhuanjindu' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'balance.jibenxinxi' }) },
  { id: 'billLayout', title: intl.formatMessage({ id: 'balance.duizhangdanmingxi' }) },
  { id: 'fileLayout', title: intl.formatMessage({ id: 'balance.fujian' }) },
  { id: 'invoiceLayout', title: intl.formatMessage({ id: 'balance.fapiaoxinxi' }) },
  { id: 'recordLayout', title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.recordLayout' }) },
]

const SearchDetail = () => {
  const { id, no } = useQuery()
  const { pathname } = useLocation()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [dataSource, setDataSource] = useState<any>({})
  const currentRef = useRef({})
  const [basicEffect, setBasicEffect] = useState<any>([])

  const _tabs = useMemo(() => {
    let _list = []
    TABLINK.forEach((item) => {
      _list.push(item)
    })
    return _list
  }, [pathPci])

  const _getDetail = () => {
    const _param: any = {
      reconciliationId: id,
      reconciliationNo: no,
    }
    getSettlementBusinessReconciliationDetailReconciliation(_param).then((res) => {
      if (res.code === 1000) {
        const data = res.data
        setDataSource(data)
        setBasicEffect([
          {
            col: [
              {
                label: intl.formatMessage({ id: 'balance.duizhangdanhao' }),
                extra: data.reconciliationNo,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.danjuzhaiyao' }),
                extra: data.reconciliationAbstract,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.duizhangdanleixing' }),
                extra: data.reconciliationType,
                type: 'text',
              },
              { label: intl.formatMessage({ id: 'balance.beizhu' }), extra: data.remark, type: 'text' },
              {
                label: intl.formatMessage({ id: 'balance.zhuangtai' }),
                extra: <StatusTag type="primary" title={data.statusName} />,
                type: 'text',
              },
            ],
          },
          {
            col: [
              { label: intl.formatMessage({ id: 'balance.shoukuanfang' }), extra: data.payee, type: 'text' },
              { label: intl.formatMessage({ id: 'balance.fukuanfang' }), extra: data.payer, type: 'text' },
              {
                label: intl.formatMessage({ id: 'balance.faqiduizhangfang' }),
                extra: data.launchReconciliation,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.duizhangzongjine' }),
                extra: `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(data.reconciliationMoneyAmount)}`,
                type: 'text',
              },
              { label: intl.formatMessage({ id: 'balance.danjushijian' }), extra: data.createTime, type: 'text' },
            ],
          },
        ])
      }
    })
  }

  useEffect(() => {
    _getDetail()
  }, [])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.orderNo' }),
      key: 'orderNo',
      dataIndex: 'orderNo',
      fixed: 'left',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.expectPayTime' }),
      key: 'expectPayTime',
      dataIndex: 'expectPayTime',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.deliveryBatch' }),
      key: 'deliveryBatch',
      dataIndex: 'deliveryBatch',
      width: 150,
      render: (text: any, record: any) =>
        intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.deliveryBatch.text', data: text }),
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.deliveryNo' }),
      key: 'deliveryNo',
      dataIndex: 'deliveryNo',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.receiveNo' }),
      key: 'receiveNo',
      dataIndex: 'receiveNo',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.productNo' }),
      key: 'productNo',
      dataIndex: 'productNo',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.productName' }),
      key: 'productName',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.spec' }),
      key: 'spec',
      dataIndex: 'spec',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.category' }),
      key: 'category',
      dataIndex: 'category',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.brand' }),
      key: 'brand',
      dataIndex: 'brand',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.unit' }),
      key: 'unit',
      dataIndex: 'unit',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.taxRate' }),
      key: 'taxRate',
      dataIndex: 'taxRate',
      width: 150,
      render: (text: any) => {
        return text > 0
          ? `${intl.formatMessage({ id: 'balance.shi' })}/${text}%`
          : intl.formatMessage({ id: 'balance.fou' })
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.price' }),
      key: 'price',
      dataIndex: 'price',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.reconciliationQuantity' }),
      key: 'reconciliationQuantity',
      dataIndex: 'reconciliationQuantity',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.reconciliationMoneyAmount' }),
      key: 'reconciliationMoneyAmount',
      dataIndex: 'reconciliationMoneyAmount',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.currentReconciliationQuantity' }),
      key: 'currentReconciliationQuantity',
      dataIndex: 'currentReconciliationQuantity',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.columns.currentMoney' }),
      key: 'currentMoney',
      dataIndex: 'currentMoney',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
  ]

  const loadingTableData = async (params) => {
    const _params = { ...params }
    _params.reconciliationId = id
    _params.reconciliationNo = no
    const { data } = await getSettlementBusinessReconciliationReconciliationRowList(_params)
    return data
  }

  return (
    <PeripheralLayout
      no={dataSource?.reconciliationNo}
      detail={dataSource?.reconciliationAbstract}
      tabLink={_tabs}
      components={
        <Fragment>
          <ProgressLayout
            effect={[
              {
                title: intl.formatMessage({ id: 'balance.businessReconciliation.detail.progressLayout.title' }),
                state: 1,
                logs: dataSource?.externalLogStates,
              },
            ]}
          />
          <CommonLayout
            layoutId="basicLayout"
            title={intl.formatMessage({ id: 'balance.jibenxinxi' })}
            effect={basicEffect}
            commonSpan={12}
          />
          <Card id="billLayout" title={intl.formatMessage({ id: 'balance.duizhangdanmingxi' })}>
            <StandardTable
              keepAlive={false}
              currentRef={currentRef}
              columns={columns}
              tableProps={{ rowKey: 'reconciliationRowId', scroll: { x: 2600 } }}
              fetchTableData={(params: any) => loadingTableData(params)}
            />
          </Card>
          <BusinessFileLayout fetchdata={dataSource?.files} editAble={false} />
          <Card id="invoiceLayout" title={intl.formatMessage({ id: 'balance.fapiaoxinxi' })}>
            {dataSource?.invoiceMessages?.numbers.length > 0 ? (
              <Row gutter={[8, 8]}>
                {dataSource?.invoiceMessages?.numbers.map((item, index) => (
                  <Col span={6} key={`BusinessInvoiceCard_${index}`}>
                    <BusinessInvoiceCard data={item} />
                  </Col>
                ))}
              </Row>
            ) : (
              '-'
            )}
          </Card>
          <RecordCommonLayout effect={{ externalLogs: dataSource?.records ?? [] }} />
        </Fragment>
      }
    />
  )
}
export default SearchDetail

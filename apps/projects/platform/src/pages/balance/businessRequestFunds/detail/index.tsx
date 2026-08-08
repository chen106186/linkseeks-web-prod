import React, { Fragment, useEffect, useState, useMemo, useRef } from 'react'
import { Button, message } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'

import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'

import PeripheralLayout from '@/pages/procurementAbility/components/detail'
import { Card } from '@linkseeks/ui'
import CommonLayout from '@/pages/procurementAbility/components/detail/components/bidCommonLayout'

import {
  getSettlementBusinessApplyAmountDetailApplyAmount,
  getSettlementBusinessApplyAmountApplyAmountRowList,
  postSettlementBusinessApplyAmountFindCanApplyAmountRos,
  postSettlementBusinessApplyAmountApplyAmountExamine1,
  postSettlementBusinessApplyAmountGoodsExamine2,
  postSettlementBusinessApplyAmountGoodsExamine3,
} from '@apps/apis'

import WriteOffDrawer from '../../components/WriteOffDrawer'
import { CheckCircleOutlined } from '@ant-design/icons'
import ModalAudit from '@/components/ModalAudit'
import { useQuery, useLocation } from '@linkseeks/router-core'
/** 是否含税 */
enum HASTAX {
  YES = 1,
}

/** 是否含税 */
enum HASTAX {
  YES = 1,
}

const intl = getIntl()
const TABLINK = [
  { id: 'basicLayout', title: intl.formatMessage({ id: 'balance.jibenxinxi' }) },
  { id: 'billLayout', title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.billLayout' }) },
]

const SearchDetail = () => {
  const { id, no } = useQuery()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [writeOffVisible, setWriteOffVisible] = useState<any>(false)
  const [dataSource, setDataSource] = useState<any>({})
  const currentRef = useRef({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [writeOffRecord, setWriteOffRecord] = useState<any>({})
  const [visible, setVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const _tabs = useMemo(() => {
    let _list = []
    TABLINK.forEach((item) => {
      _list.push(item)
    })
    return _list
  }, [pathPci])

  const _returnPayWay = (data) => {
    let _text = data.payWayName
    switch (data.payWay) {
      case 2:
        _text += intl.formatMessage({
          id: 'balance.businessRequestFunds.detail.returnPayWay.2',
          payMonth: data.payMonth,
          payDate: data.payDate,
        })
        break
      case 3:
        _text += intl.formatMessage({ id: 'balance.businessRequestFunds.detail.returnPayWay.3', payDate: data.payDate })
        break
      case 4:
        _text += intl.formatMessage({ id: 'balance.businessRequestFunds.detail.returnPayWay.4', payDate: data.payDate })
        break
    }
    return _text
  }

  const _getDetail = () => {
    const _params: any = {
      applyAmountId: id,
      applyNo: no,
    }
    getSettlementBusinessApplyAmountDetailApplyAmount(_params).then((res) => {
      if (res.code === 1000) {
        const data = res.data
        setDataSource(data)
        setBasicEffect([
          {
            col: [
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.applyNo' }),
                extra: data.applyNo,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.applyAbstract' }),
                extra: data.applyAbstract,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.applyTypeName' }),
                extra: data.applyTypeName,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.moneyPayWayName' }),
                extra: data.moneyPayWayName,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.remark' }),
                extra: data.remark,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.reconciliationNo' }),
                extra: data?.reconciliationNo ? (
                  <Link
                    to={`/balance/businessReconciliationCollaboration/search/detail?id=${data.reconciliationId}&no=${data.reconciliationNo}`}
                  >
                    {data.reconciliationNo}
                  </Link>
                ) : (
                  '-'
                ),
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.invoiceMessages' }),
                extra: data?.invoiceMessages ? (
                  <>
                    {data?.invoiceMessages?.numbers.map((item) => (
                      <div>
                        {item.invoiceNumber} | {item.invoiceDate.slice(0, 10)} |{' '}
                        {intl.formatMessage({ id: 'common.money' })}
                        {item.invoiceMoney}
                      </div>
                    ))}
                  </>
                ) : (
                  '-'
                ),
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.statusName' }),
                extra: <StatusTag type="primary" title={data.statusName} />,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.createTime' }),
                extra: data.createTime,
                type: 'text',
              },
            ],
          },
          {
            col: [
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.payee' }),
                extra: data.payee,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.accountName' }),
                extra: data.accountName,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.bankAccount' }),
                extra: data.bankAccount,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.bankDeposit' }),
                extra: data.bankDeposit,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.applyAmount' }),
                extra: `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(data.applyAmount)}`,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.writeOffAmount' }),
                extra: `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(data.writeOffAmount)}`,
                type: 'text',
              },
              {
                label: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.col.expectPayTime' }),
                extra: formatTimeString(data.expectPayTime, 'YYYY-MM-DD'),
                type: 'text',
              },
              { label: intl.formatMessage({ id: 'balance.jiesuanfangshi' }), extra: _returnPayWay(data), type: 'text' },
              {
                label: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.settlementDate' }),
                extra: formatTimeString(data.settlementTime, 'YYYY-MM-DD'),
                type: 'text',
              },
            ],
          },
        ])
      }
    })
  }

  const _openWriteOff = (record: any, type: number) => {
    if (type === 1) {
      setWriteOffRecord(record)
      setWriteOffVisible(true)
    } else {
      const _params = {
        billId: record.billId,
        sourceContractId: record.sourceContractId,
        notQueryDetailId: 0,
        taxRate: record.taxRate,
        current: 1,
        pageSize: 99999,
      }
      postSettlementBusinessApplyAmountFindCanApplyAmountRos(_params).then((res) => {
        if (res.code === 1000) {
          const _record = { ...record }
          _record.writeOffRecords = res.data.data
          setWriteOffRecord(_record)
          setWriteOffVisible(true)
        }
      })
    }
  }

  useEffect(() => {
    _getDetail()
  }, [])

  const _handleOpen = (record: any) => {
    if (record.billType === 1) {
      history.open(`/orderAbility/purchaseOrder/orderList/detail?id=${record.billId}`)
    } else if (record.billType === 2) {
      history.open(`/contract/manage/QueryList/QueryListdetails?contractId=${record.billId}`)
    } else {
      history.open(`/afterAbility/returnApplication/returnQuery/detail?id=${record.billId}`)
    }
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.billNo' }),
      key: 'billNo',
      dataIndex: 'billNo',
      render: (text: any, record: any) => (
        <Button
          type="link"
          onClick={() => {
            _handleOpen(record)
          }}
          style={{ padding: 0 }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.billAbstract' }),
      key: 'billAbstract',
      dataIndex: 'billAbstract',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.billTypeName' }),
      key: 'billTypeName',
      dataIndex: 'billTypeName',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.billTime' }),
      key: 'billTime',
      dataIndex: 'billTime',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.billStatus' }),
      key: 'billStatus',
      dataIndex: 'billStatus',
      render: (text: any) => <StatusTag type="primary" title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.billAmount' }),
      key: 'billAmount',
      dataIndex: 'billAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.taxRate' }),
      key: 'hasTax',
      dataIndex: 'hasTax',
      render: (text: any, record) =>
        text === HASTAX.YES ? `${record?.hasTaxName}/${record?.taxRate}%` : record?.hasTaxName,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.paid' }),
      key: 'paid',
      dataIndex: 'paid',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.appliedUnpaid' }),
      key: 'appliedUnpaid',
      dataIndex: 'appliedUnpaid',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.reconciliationAmount' }),
      key: 'reconciliationAmount',
      dataIndex: 'reconciliationAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.applyPayment' }),
      key: 'applyPayment',
      dataIndex: 'applyPayment',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.writeOffAmount' }),
      key: 'writeOffAmount',
      dataIndex: 'writeOffAmount',
      render: (text: any, record: any) =>
        text > 0 && (
          <Button
            type="link"
            onClick={() => {
              _openWriteOff(record, 1)
            }}
          >
            {intl.formatMessage({ id: 'common.money' })} {priceFormat(text)}
          </Button>
        ),
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.detail.columns.canWriteOffAmount' }),
      key: 'canWriteOffAmount',
      dataIndex: 'canWriteOffAmount',
      render: (text: any, record: any) =>
        text > 0 && (
          <Button
            type="link"
            onClick={() => {
              _openWriteOff(record, 2)
            }}
          >
            {intl.formatMessage({ id: 'common.money' })} {priceFormat(text)}
          </Button>
        ),
    },
  ]

  const loadingTableData = async (params) => {
    const _params = { ...params }
    _params.applyAmountId = id
    _params.applyNo = no
    const { data } = await getSettlementBusinessApplyAmountApplyAmountRowList(_params)
    return data
  }

  /** 单据审核 */
  const handleSubmit = () => {
    let fetchApi = null
    switch (pathPci) {
      case 'one':
        fetchApi = postSettlementBusinessApplyAmountApplyAmountExamine1
        break
      case 'two':
        fetchApi = postSettlementBusinessApplyAmountGoodsExamine2
        break
      default:
        fetchApi = postSettlementBusinessApplyAmountGoodsExamine3
        break
    }
    setConfirmLoading(true)
    ref.current
      .formref()
      .validateFields()
      .then((values) => {
        fetchApi({ ...values, id }).then((res) => {
          if (res.code !== 1000) {
            message.error(res.message)
            setConfirmLoading(false)
            return
          }
          setVisible(false)
          setConfirmLoading(false)
          history.goBack()
        })
      })
  }

  return (
    <>
      <PeripheralLayout
        no={dataSource?.applyNo}
        detail={dataSource?.applyAbstract}
        tabLink={_tabs}
        effect={
          <>
            {path === 'detail' && (
              <Button onClick={() => setVisible(true)} icon={<CheckCircleOutlined />} type="primary">
                {intl.formatMessage({ id: 'dealAbility.danjushenhe', defaultMessage: '单据审核' })}
              </Button>
            )}
          </>
        }
        components={
          <Fragment>
            <CommonLayout
              layoutId="basicLayout"
              title={intl.formatMessage({ id: 'balance.jibenxinxi' })}
              effect={basicEffect}
              commonSpan={12}
            />
            <Card id="billLayout" title={intl.formatMessage({ id: 'balance.businessRequestFunds.detail.billLayout' })}>
              <StandardTable
                keepAlive={false}
                currentRef={currentRef}
                columns={columns}
                tableProps={{ rowKey: 'id' }}
                fetchTableData={(params: any) => loadingTableData(params)}
              />
            </Card>
          </Fragment>
        }
      />
      <WriteOffDrawer
        visible={writeOffVisible}
        record={writeOffRecord}
        onClose={() => {
          setWriteOffVisible(false)
        }}
      />
      <ModalAudit
        formref={ref}
        modalTypes={{
          title: intl.formatMessage({ id: 'dealAbility.danjushenhe', defaultMessage: '单据审核' }),
          visible: visible,
          destroyOnClose: true,
          onOk: () => handleSubmit(),
          onCancel: () => setVisible(false),
          confirmLoading: confirmLoading,
        }}
      />
    </>
  )
}
export default SearchDetail

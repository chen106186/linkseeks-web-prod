import React, { useRef, useState, useEffect } from 'react'
import { Drawer, Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { authService } from '@apps/services'
import { priceFormat } from '@/utils/numberFomat'
import { getSettlementBusinessApplyAmountFindApplyAmountRosSourceOrders } from '@apps/apis'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { getIntl } from '@linkseeks/i18n'

interface RequestFundsDrawerProps {
  visible: boolean
  applyType: number
  onClose?: () => void
  onOk?: (rows: any[]) => void
}
const intl = getIntl()
const formActions = createFormActions()

const RequestFundsDrawer: React.FC<RequestFundsDrawerProps> = (props: RequestFundsDrawerProps) => {
  const { visible, applyType, onClose, onOk } = props
  const ref = useRef<any>({})
  const { memberId, memberRoleId } = authService.getAuth() || {}

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])

  const loadingTableData = async (params) => {
    const _params = { ...params, orderType: applyType, buyerMemberId: memberId, buyerRoleId: memberRoleId }
    const { data } = await getSettlementBusinessApplyAmountFindApplyAmountRosSourceOrders(_params)
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.billNo' }),
      key: 'billNo',
      dataIndex: 'billNo',
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.billAbstract',
      }),
      key: 'billAbstract',
      dataIndex: 'billAbstract',
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.billTypeName',
      }),
      key: 'billTypeName',
      dataIndex: 'billTypeName',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.billTime' }),
      key: 'billTime',
      dataIndex: 'billTime',
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.billStatus',
      }),
      key: 'billStatus',
      dataIndex: 'billStatus',
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.billAmount',
      }),
      key: 'billAmount',
      dataIndex: 'billAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.paid' }),
      key: 'paid',
      dataIndex: 'paid',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.taxRate' }),
      key: 'taxRate',
      dataIndex: 'taxRate',
      width: 150,
      render: (text: any) => {
        return text > 0
          ? `${intl.formatMessage({ id: 'balance.shi' })}/${text}%`
          : intl.formatMessage({ id: 'balance.shi' })
      },
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.appliedUnpaid',
      }),
      key: 'appliedUnpaid',
      dataIndex: 'appliedUnpaid',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.components.requestFundsDrawer.columns.applyPayment',
      }),
      key: 'applyPayment',
      dataIndex: 'applyPayment',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
  ]

  const handleSelectChange = (record, selected, selectedRow, nativeEvent) => {
    let childArr = [...selectedRowKeys]
    let childRowArr = [...selectedRows]
    const _key = `requestFunds_${record['billNo']}_${record['taxRate']}`
    if (selected) {
      childArr.push(_key)
      childRowArr.push(record)
    } else {
      childArr.splice(
        childArr.findIndex((item) => item === _key),
        1,
      )
      childRowArr.splice(
        childRowArr.findIndex((item) => `requestFunds_${item['billNo']}_${item['taxRate']}` === _key),
        1,
      )
    }
    setSelectedRowKeys(childArr)
    setSelectedRows(childRowArr)
  }

  const handleSelectAll = (selected, selectedRow, changeRows) => {
    let childArr = [...selectedRowKeys]
    let childRowArr = [...selectedRows]
    if (selected) {
      childArr = Array.from(
        new Set([...childArr, ...changeRows.map((item) => `requestFunds_${item['billNo']}_${item['taxRate']}`)]),
      )
      childRowArr = Array.from(new Set([...childRowArr, ...changeRows]))
    } else {
      childArr = childArr.filter(
        (item) => !changeRows.some((e) => `requestFunds_${e['billNo']}_${e['taxRate']}` === item),
      )
      childRowArr = childRowArr.filter(
        (item) =>
          !changeRows.some(
            (e) =>
              `requestFunds_${e['billNo']}_${e['taxRate']}` === `requestFunds_${item['billNo']}_${item['taxRate']}`,
          ),
      )
    }
    setSelectedRowKeys(childArr)
    setSelectedRows(childRowArr)
  }

  const _onOk = () => {
    const _rows = [...selectedRows]
    if (_rows.length <= 0) {
      message.error(intl.formatMessage({ id: 'balance.businessRequestFunds.components.requestFundsDrawer.message' }))
      return
    }
    setSelectedRows([])
    setSelectedRowKeys([])
    onOk?.(_rows)
  }

  useEffect(() => {
    setSelectedRows([])
    setSelectedRowKeys([])
  }, [applyType])

  return (
    <Drawer
      title={intl.formatMessage({ id: 'balance.businessRequestFunds.components.requestFundsDrawer.title' })}
      placement={'right'}
      onClose={onClose}
      visible={visible}
      key={`requestFunds_${applyType}`}
      width={'80%'}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'balance.quxiao' })}
          </Button>
          <Button onClick={_onOk} type="primary">
            {intl.formatMessage({ id: 'balance.businessRequestFunds.components.requestFundsDrawer.ok' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        keepAlive={false}
        key={`requestFunds_${applyType}`}
        tableProps={{
          rowKey: (record) => {
            return `requestFunds_${record['billNo']}_${record['taxRate']}`
          },
        }}
        fetchTableData={(params) => loadingTableData(params)}
        columns={columns}
        currentRef={ref}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onSelect: handleSelectChange,
          onSelectAll: handleSelectAll,
        }}
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
            }}
            schema={{
              type: 'object',
              properties: {
                mageLayout: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    grid: true,
                  },
                  properties: {
                    orderNo: {
                      type: 'string',
                      'x-component': 'Search',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'balance.businessRequestFunds.components.requestFundsDrawer.schema.orderNo',
                        }),
                        align: 'flex-start',
                        allowClear: true,
                      },
                    },
                  },
                },
                [FORM_FILTER_PATH]: {
                  type: 'object',
                  'x-component': 'flex-layout',
                  'x-component-props': {
                    rowStyle: {
                      flexWrap: 'nowrap',
                      justifyContent: 'flex-start',
                    },
                    colStyle: {
                      marginRight: 16,
                    },
                  },
                  properties: {
                    digest: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'balance.businessRequestFunds.components.requestFundsDrawer.schema.digest',
                        }),
                        allowClear: true,
                      },
                    },
                    '[startDate,endDate]': {
                      type: 'string',
                      'x-component': 'daterange',
                      'x-component-props': {
                        placeholder: [
                          intl.formatMessage({
                            id: 'balance.businessRequestFunds.components.requestFundsDrawer.schema.startDate',
                          }),
                          intl.formatMessage({
                            id: 'balance.businessRequestFunds.components.requestFundsDrawer.schema.endDate',
                          }),
                        ],
                        allowClear: true,
                      },
                    },
                    submit: {
                      'x-component': 'Submit',
                      'x-component-props': {
                        children: intl.formatMessage({ id: 'balance.chaxun' }),
                      },
                    },
                  },
                },
              },
            }}
            components={{
              Submit,
            }}
          />
        }
      />
    </Drawer>
  )
}
export default RequestFundsDrawer

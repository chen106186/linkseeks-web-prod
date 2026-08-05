import React, { useRef, useState, useEffect } from 'react'
import { Drawer, Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { priceFormat } from '@/utils/numberFomat'
import { getSettlementBusinessApplyAmountFindApplyAmountRosSourceContracts } from '@apps/apis'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { getIntl } from '@linkseeks/i18n'

interface ContractDrawerProps {
  visible: boolean
  applyType: number
  partyBMemberId?: number
  partyBRoleId?: number
  onClose?: () => void
  onOk?: (rows: any[]) => void
}
const intl = getIntl()
const formActions = createFormActions()

const ContractDrawer: React.FC<ContractDrawerProps> = (props: ContractDrawerProps) => {
  const { visible, applyType, partyBMemberId, partyBRoleId, onClose, onOk } = props
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])

  const loadingTableData = async (params) => {
    const _params = { ...params, sourceType: applyType, partyBMemberId, partyBRoleId }
    const { data } = await getSettlementBusinessApplyAmountFindApplyAmountRosSourceContracts(_params)
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.columns.billNo' }),
      key: 'billNo',
      dataIndex: 'billNo',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.columns.billAbstract' }),
      key: 'billAbstract',
      dataIndex: 'billAbstract',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.columns.billTime' }),
      key: 'billTime',
      dataIndex: 'billTime',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.columns.billEndTime' }),
      key: 'billEndTime',
      dataIndex: 'billEndTime',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.columns.taxRate' }),
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
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.columns.billAmount' }),
      key: 'billAmount',
      dataIndex: 'billAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.columns.remainAmount' }),
      key: 'remainAmount',
      dataIndex: 'remainAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
  ]

  const handleSelectChange = (record, selected, selectedRow, nativeEvent) => {
    let childArr = [...selectedRowKeys]
    let childRowArr = [...selectedRows]
    const _key = `contract_${record['billNo']}_${record['taxRate']}`
    if (selected) {
      childArr.push(_key)
      childRowArr.push(record)
    } else {
      childArr.splice(
        childArr.findIndex((item) => item === _key),
        1,
      )
      childRowArr.splice(
        childRowArr.findIndex((item) => `contract_${item['billNo']}_${item['taxRate']}` === _key),
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
        new Set([...childArr, ...changeRows.map((item) => `contract_${item['billNo']}_${item['taxRate']}`)]),
      )
      childRowArr = Array.from(new Set([...childRowArr, ...changeRows]))
    } else {
      childArr = childArr.filter((item) => !changeRows.some((e) => `contract_${e['billNo']}_${e['taxRate']}` === item))
      childRowArr = childRowArr.filter(
        (item) =>
          !changeRows.some(
            (e) => `contract_${e['billNo']}_${e['taxRate']}` === `contract_${item['billNo']}_${item['taxRate']}`,
          ),
      )
    }
    setSelectedRowKeys(childArr)
    setSelectedRows(childRowArr)
  }

  const _onOk = () => {
    const _rows = [...selectedRows]
    if (_rows.length <= 0) {
      message.error(intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.message' }))
      return
    }
    setSelectedRows([])
    setSelectedRowKeys([])
    onOk?.(_rows)
  }

  useEffect(() => {
    setSelectedRows([])
    setSelectedRowKeys([])
  }, [applyType, partyBMemberId])

  return (
    <Drawer
      title={intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.title' })}
      placement={'right'}
      onClose={onClose}
      visible={visible}
      key={`contract_${partyBMemberId}`}
      width={'80%'}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'balance.quxiao' })}
          </Button>
          <Button onClick={_onOk} type="primary">
            {intl.formatMessage({ id: 'balance.businessRequestFunds.components.contractDrawer.ok' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        keepAlive={false}
        fetchTableData={(params) => loadingTableData(params)}
        columns={columns}
        currentRef={ref}
        key={`contract_${partyBMemberId}_${applyType}`}
        tableProps={{
          rowKey: (record) => {
            return `contract_${record['billNo']}_${record['taxRate']}`
          },
        }}
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
              useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
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
                    contractNo: {
                      type: 'string',
                      'x-component': 'Search',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'balance.businessRequestFunds.components.contractDrawer.schema.contractNo',
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
                    contractAbstract: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'balance.businessRequestFunds.components.contractDrawer.schema.contractAbstract',
                        }),
                        allowClear: true,
                      },
                    },
                    '[startTime,endTime]': {
                      type: 'string',
                      'x-component': 'daterange',
                      'x-component-props': {
                        placeholder: [
                          intl.formatMessage({
                            id: 'balance.businessRequestFunds.components.contractDrawer.schema.startTime',
                          }),
                          intl.formatMessage({
                            id: 'balance.businessRequestFunds.components.contractDrawer.schema.endTime',
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

export default ContractDrawer

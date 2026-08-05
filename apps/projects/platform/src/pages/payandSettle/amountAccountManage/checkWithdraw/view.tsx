import React, { useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Card, Space, Button, Modal, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { encodeURLBase64 } from '@linkseeks/crypto'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSchema } from './schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import StatusTag from '@/components/StatusTag'
import { statusMap } from '../../constant'
import moment from 'moment'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getPayMemberAssetAccountGetCheckCashOutList, postPayMemberAssetAccountBatchCheck } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'

const { confirm } = Modal
const formActions = createFormActions()

const CheckWithdraw: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [withdrawRowSelection, withdrawRowCtl] = useRowSelectionTable()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.memberName' }),
      dataIndex: ['memberAssetAccount', 'memberName'],
      key: 'memberAssetAccount',
      className: 'commonPickColor',
      render: (text, record) => (
        <EyeAuthButton
          type="button"
          handleClick={() => clickUp({ ...record, preview: true })}
          // url={`/payandSettle/amountAccountManage/memberAccountManage/detail?id=${record.memberAssetAccount.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.bankAccountName' }),
      dataIndex: 'bankAccountName',
      key: 'bankAccountName',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.bankAccount' }),
      dataIndex: 'bankAccount',
      key: 'bankAccount',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.tradeMoney' }),
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) => t.toFixed(2),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.tradeTime' }),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (t, r) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
      // sorter: (a, b) =>  b.tradeTime - a.tradeTime,
      // defaultSortOrder: "ascend"
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (t, r) => <StatusTag title={statusMap[t]['title']} type={statusMap[t]['type']} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.option' }),
      dataIndex: 'option',
      render: (t, r) => (
        <>
          {r.status === 1 && (
            <AuthButton type="custom" code="examine">
              <Button type="link" onClick={() => clickUp(r)}>
                {intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.columns.option.1' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const fetchData = (params: any) => {
    console.log(params)
    return new Promise((resolve, reject) => {
      let obj = { ...params }
      getPayMemberAssetAccountGetCheckCashOutList(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  const clickUp = (r: any) => {
    let params = {
      tradeCode: r.tradeCode,
      id: r.memberAssetAccount.id,
      tradeId: r.id,
      amount: r.tradeMoney,
      preview: r.preview,
      status: r.status,
    }
    if (AuthUrl('detail')) {
      history.push(
        `/payandSettle/amountAccountManage/checkWithdraw/detail?detailinfo=${encodeURLBase64(JSON.stringify(params))}`,
      )
    }
  }

  const handleBatchCheck = () => {
    if (withdrawRowCtl.selectedRowKeys.length > 0) {
      confirm({
        title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.handleBatchCheck.title' }),
        icon: <ExclamationCircleOutlined />,
        onOk() {
          postPayMemberAssetAccountBatchCheck({ idList: withdrawRowCtl.selectedRowKeys }).then((res) => {
            ref.current.reloadCurrent()
          })
        },
        okType: 'danger',
        onCancel() {
          console.log('Cancel')
        },
        okText: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.handleBatchCheck.okText' }),
        cancelText: intl.formatMessage({
          id: 'payandSettle.amountAccountManage.checkWithdraw.handleBatchCheck.cancelText',
        }),
      })
    } else {
      message.error(intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.handleBatchCheck.error' }))
    }
  }

  const controllerBtns = () => (
    <Space>
      <Button onClick={handleBatchCheck}>
        {intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.controllerBtns' })}
      </Button>
    </Space>
  )

  const processWithdrawRowSelection = {
    getCheckboxProps: (record) => ({
      disabled: record.status !== 1,
      name: record.name,
    }),
    ...withdrawRowSelection,
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          rowSelection={processWithdrawRowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              components={{
                DateRangePickerUnix,
                controllerBtns,
              }}
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
              }}
              schema={searchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CheckWithdraw

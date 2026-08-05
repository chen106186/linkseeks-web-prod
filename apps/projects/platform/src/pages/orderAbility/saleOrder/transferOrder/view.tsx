import React, { useRef, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { EyeAuthButton } from '@apps/components'
import { StandardTableProps } from './types/table-props'
import { createFormActions, Submit } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { TableListSchema } from './schemas/table'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getOrderVendorPage } from '@apps/apis'
import { Button, Card, Space } from 'antd'
import { useWebIntl } from '@apps/locales'

function TransferOrder() {
  const { pathname } = useLocation()
  const intl = useIntl()
  const translate = useWebIntl()
  const [columns] = useState<StandardTableProps[]>(() => [
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        return <EyeAuthButton url={`${pathname}/detail?id=${record.orderId}`}>{text}</EyeAuthButton>
      },
    },
    {
      title: translate('web.resource.order.caigouhuiyuan'),
      dataIndex: 'purchasingMember',
      key: 'purchasingMember',
    },
    {
      title: translate('web.resource.order.dingdanzongjine'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: translate('web.resource.order.xiadanshijian'),
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: translate('web.resource.order.dingdanzhaiyao'),
      dataIndex: 'abstract',
      key: 'abstract',
    },
    {
      title: translate('web.resource.order.dingdanleixing'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: translate('web.resource.order.songhuodizhi'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: translate('web.resource.order.zhuandanzhuangtai'),
      dataIndex: 'TurnSingleState',
      key: 'TurnSingleState',
    },
    {
      title: translate('web.common.neibuzhuangtai'),
      dataIndex: 'internalState',
      key: 'internalState',
    },
    {
      title: translate('web.common.waibuzhuangtai'),
      dataIndex: 'outternalState',
      key: 'outternalState',
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => {
        return <></>
      },
    },
  ])

  const ref = useRef<any>({})
  const formActions = createFormActions()

  const fetchParams = useRef<any>({})
  const loadingTableData = (params) => {
    fetchParams.current = { ...params }
    return fetchTableData(params)
  }

  async function fetchTableData(params: any) {
    const { data } = await getOrderVendorPage(params)
    return data
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([])
  const selectRef = useRef([])
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
      selectRef.current = selectedRowKeys
    },
    getCheckboxProps: (record) => ({
      disabled: !record.showTransfer,
      name: record.name,
    }),
  }

  const controllerBtns = (
    <Space>
      <Button style={{ width: 140 }} type="default">
        {intl.formatMessage({ id: 'saleOrder.daochu', defaultMessage: '导出' })}
      </Button>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(parmas) => loadingTableData(parmas)}
          columns={columns}
          rowKey="orderId"
          currentRef={ref}
          rowSelection={rowSelection}
          controlRender={
            <NiceForm
              actions={formActions}
              schema={TableListSchema()}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
              }}
              components={{
                DateRangePickerUnix,
                Submit,
              }}
            />
          }
        ></StandardTable>
      </Card>
    </PageHeaderWrapper>
  )
}

export default TransferOrder

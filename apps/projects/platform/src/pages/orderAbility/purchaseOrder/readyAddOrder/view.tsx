import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Space, Menu, message } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import DropDeleteDown from '@/components/DropDeleteDown'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { useSelfTable } from './model/useReadyAddOrder'
import { OrderModalType } from '@/constants/order'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../index.less'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import {
  getOrderBuyerCreatePage,
  getOrderBuyerCreatePageItems,
  postOrderBuyerCreateDeleteBatch,
  postOrderBuyerCreateSubmitBatch,
} from '@apps/apis'

// 待新增订单
const approvedActions = createFormActions()

export interface ReadyAddOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderBuyerCreatePage(params)
  return data
}

// 获取下单模式
const fetchOrderMode = async () => {
  const { data } = await getOrderBuyerCreatePageItems()
  const { orderModes } = data
  return orderModes
}

const ReadyAddOrder: React.FC<ReadyAddOrderProps> = (props) => {
  const intl = useIntl()
  const { run: deleteRun } = useHttpRequest(postOrderBuyerCreateDeleteBatch)
  const { loading: submitLoading, run: submitRun } = useHttpRequest(postOrderBuyerCreateSubmitBatch)
  const currentRef = useRef<any>({})
  const { columns, ref, rowSelection, rowSelectionCtl } = useSelfTable()
  const handleMenuClick = async (e) => {
    switch (e.key) {
      case '1': {
        // 批量删除
        if (rowSelectionCtl.selectRow.length) {
          const { code } = await deleteRun(rowSelectionCtl.selectedRowKeys.map((item) => ({ orderId: item })))
          if (code === 1000) {
            ref.current.reloadCurrent()
            rowSelectionCtl.setSelectRow([])
            rowSelectionCtl.setSelectedRowKeys([])
          }
        } else {
          message.error(intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.error1' }))
        }
        break
      }
    }
  }

  const handleBitchPush = async () => {
    if (rowSelectionCtl.selectRow.length) {
      const { code } = await submitRun(rowSelectionCtl.selectedRowKeys.map((item) => ({ orderId: item })))
      if (code === 1000) {
        ref.current.reloadCurrent()
        rowSelectionCtl.setSelectRow([])
        rowSelectionCtl.setSelectedRowKeys([])
      }
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.error1' }))
    }
  }

  const onConfirm = () => {
    approvedActions.submit().then(async ({ values }) => {
      console.log(values)
      currentRef.current.setVisible(false)
      if (values.orderMode === OrderModalType.INQUIRY_QUOTATION_ORDER) {
        history.push(`/orderAbility/purchaseOrder/readyAddOrder/b2b/add?modelType=${values.orderMode}`)
      } else {
        history.push(`/orderAbility/purchaseOrder/readyAddOrder/srm/add?modelType=${values.orderMode}`)
      }
    })
  }

  const clickAdd = () => {
    currentRef.current.setVisible(true)
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          rowSelection={rowSelection}
          columns={columns}
          currentRef={ref}
          rowKey="orderId"
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema(),
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
            layouts: {
              order: 2,
              span: 16,
            },
          }}
          formilyChilds={{
            children: (
              <Space>
                <Button icon={<PlusCircleOutlined />} type="primary" onClick={clickAdd}>
                  {intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.button1' })}
                </Button>
                <Button onClick={handleBitchPush} loading={submitLoading}>
                  {intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.button2' })}
                </Button>
                <DropDeleteDown>
                  <Menu>
                    <Menu.Item key="1" icon={<DeleteOutlined />} onClick={(e) => handleMenuClick({ key: '1' })}>
                      {intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.button3' })}
                    </Menu.Item>
                  </Menu>
                </DropDeleteDown>
              </Space>
            ),
            layouts: {
              span: 8,
            },
          }}
          tableProps={{
            scroll: { x: 1200 },
          }}
        />
      </Card>

      <ModalForm
        modalTitle={intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.modalTitle' })}
        confirm={onConfirm}
        currentRef={currentRef}
        actions={approvedActions}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
              },
              properties: {
                orderMode: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.modalTitle' }),
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.modalTitle' }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'common.bitian' }),
                    },
                  ],
                },
              },
            },
          },
        }}
        effects={($, ctx) => {
          useAsyncSelect('orderMode', fetchOrderMode, ['text', 'id'])
        }}
      />
    </PageHeaderWrapper>
  )
}

ReadyAddOrder.defaultProps = {}

export default ReadyAddOrder

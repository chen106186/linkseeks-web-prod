import React from 'react'
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
import { useHttpRequest } from '@/hooks/useHttpRequest'
import '../index.less'
import {
  getOrderBuyerCreateRequisitionPage,
  postOrderBuyerCreateDeleteBatch,
  postOrderBuyerCreateSubmitBatch,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
/**
 * 待新增请购采购订单
 */

export interface ReadyAddRequisitionOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderBuyerCreateRequisitionPage(params)
  return data
}

const ReadyAddRequisitionOrder: React.FC<ReadyAddRequisitionOrderProps> = () => {
  const intl = useIntl()
  const { run: deleteRun } = useHttpRequest(postOrderBuyerCreateDeleteBatch)
  const { loading: submitLoading, run: submitRun } = useHttpRequest(postOrderBuyerCreateSubmitBatch)
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

  const clickAdd = () => {
    // 采购请购下单
    history.push(`/orderAbility/purchaseOrder/readyAddRequisitionOrder/add`)
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
                <AddAuthButton>
                  <Button icon={<PlusCircleOutlined />} type="primary" onClick={clickAdd}>
                    {intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.button1' })}
                  </Button>
                </AddAuthButton>
                <AuthButton type="custom" code="submitBatch">
                  <Button onClick={handleBitchPush} loading={submitLoading}>
                    {intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.button2' })}
                  </Button>
                </AuthButton>
                <DropDeleteDown>
                  <Menu>
                    <AuthButton type="custom" code="deleteBatch">
                      <Menu.Item key="1" icon={<DeleteOutlined />} onClick={(e) => handleMenuClick({ key: '1' })}>
                        {intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.button3' })}
                      </Menu.Item>
                    </AuthButton>
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
    </PageHeaderWrapper>
  )
}

ReadyAddRequisitionOrder.defaultProps = {}

export default ReadyAddRequisitionOrder

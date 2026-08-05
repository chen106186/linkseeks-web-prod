import React from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Card, Button, Space, message, Modal } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { PlusCircleOutlined } from '@ant-design/icons'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { useSelfTable } from './model'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../../utils/index.less'
import {
  postPurchaseInviteTenderApplyCheckInviteTender,
  postPurchaseInviteTenderDeleteInviteTender,
  postPurchaseInviteTenderGetAddInviteTenderList,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { postCommodityWebMemberPurchaseWebExitMemberPurchase } from '@apps/apis'
import { authService } from '@apps/services'
const intl = getIntl()
// 待新增招标

export interface ReadyAddBidProps {}

const fetchTableData = async (params) => {
  const { data } = await postPurchaseInviteTenderGetAddInviteTenderList(
    {
      ...params,
      shopType: 1,
    },
    { ctlType: 'none' },
  )
  return data
}

const ReadyAddBid: React.FC<ReadyAddBidProps> = (props) => {
  const { memberId, memberRoleId } = authService.getAuth()
  // 删除api
  const { run: deleteRun } = useHttpRequest(postPurchaseInviteTenderDeleteInviteTender)
  // 提交审核api
  const { loading: submitLoading, run: submitRun } = useHttpRequest(postPurchaseInviteTenderApplyCheckInviteTender)

  const { columns, ref, rowSelection, rowSelectionCtl } = useSelfTable()
  // // {intl.formatMessage({ id: 'table.purchase.deleteBatch' })}
  // const handleMenuClick = async (e) => {
  //   switch(e.key) {
  //     case '1': {
  //       // {intl.formatMessage({ id: 'table.purchase.deleteBatch' })}
  //       const canDelete = !rowSelectionCtl.selectRow.some(v => v.inviteTenderInStatus !== BidInsideWorkState.Not_Submitted_Check_Invite_Tender)
  //       if (canDelete) {
  //         const { code } = await deleteRun({idList: rowSelectionCtl.selectedRowKeys})
  //         if (code === 1000) {
  //           ref.current.reloadCurrent()
  //           rowSelectionCtl.setSelectRow([])
  //           rowSelectionCtl.setSelectedRowKeys([])
  //         }
  //       } else {
  //         message.error('只能删除内部状态为待提交审核且从未提交过审核的招标')
  //       }
  //       break;
  //     }
  //   }
  // }

  const handleBitchRemove = async () => {
    if (!rowSelectionCtl.selectRow.length)
      return message.error(intl.formatMessage({ id: 'table.purchase.qingxuanzezhaobiao' }))
    const { code } = await deleteRun({ idList: rowSelectionCtl.selectedRowKeys })
    if (code === 1000) {
      ref.current.reloadCurrent()
      rowSelectionCtl.setSelectRow([])
      rowSelectionCtl.setSelectedRowKeys([])
    }
  }

  // 批量审核
  const handleBitchPush = async () => {
    if (!rowSelectionCtl.selectedRowKeys.length) {
      return message.error(intl.formatMessage({ id: 'table.purchase.qingxuanzezhaobiao' }))
    }
    const { code } = await submitRun({ idList: rowSelectionCtl.selectedRowKeys })
    if (code === 1000) {
      ref.current.reloadCurrent()
      rowSelectionCtl.setSelectRow([])
      rowSelectionCtl.setSelectedRowKeys([])
    }
  }

  const clickAdd = async () => {
    try {
      const { code, data } = await postCommodityWebMemberPurchaseWebExitMemberPurchase(
        { memberId, memberRoleId },
        { ctlType: 'none' },
      )
      if (code === 1000) {
        if (data) {
          history.push('/procurementAbility/callForBids/readyAddMallBid/add')
          return
        }
        // Modal.confirm({
        //   title: intl.formatMessage({ id: 'table.purchase.qingchuangjiancaigoumenhu' }),
        //   onOk: () => history.push('/procurementAbility/purchasDoor/purchasInfo')
        // })
        Modal.warning({
          title: '当前生命周期阶段暂不允许发布寻源信息！',
          okText: intl.formatMessage({ id: 'detail.purchase.confirm' }),
        })
      }
    } catch (error) {}
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          rowSelection={rowSelection}
          columns={columns}
          currentRef={ref}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'inviteTenderCode', FORM_FILTER_PATH)
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
                <AuthButton type="custom" code="add">
                  <Button icon={<PlusCircleOutlined />} type="primary" onClick={clickAdd}>
                    {intl.formatMessage({ id: 'table.purchase.added' })}
                  </Button>
                </AuthButton>
                <AuthButton type="custom" code="batchsubmit">
                  <Button onClick={handleBitchPush} loading={submitLoading}>
                    {intl.formatMessage({ id: 'table.purchase.submitBatch' })}
                  </Button>
                </AuthButton>
                <AuthButton type="custom" code="batchdel">
                  <Button onClick={handleBitchRemove} loading={submitLoading}>
                    {intl.formatMessage({ id: 'table.purchase.deleteBatch' })}
                  </Button>
                </AuthButton>

                {/* <DropDeleteDown>
              <Menu onClick={(e) => handleMenuClick(e)}>
                <Menu.Item key="1" icon={<DeleteOutlined />}>
                  {intl.formatMessage({ id: 'table.purchase.deleteBatch' })}
                </Menu.Item>
              </Menu>
            </DropDeleteDown> */}
              </Space>
            ),
            layouts: {
              span: 8,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

ReadyAddBid.defaultProps = {}

export default ReadyAddBid

import React, { useRef } from 'react'
import { message } from 'antd'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import TableOperation from '@/components/TableOperation'
import StatusColors from '@/components/StatusColors'
import { formatTimeString } from '@/utils'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { postPurchaseRequisitionCheckMemberLifecycleRuleConfigure } from '@apps/apis'
import { lifecyclePhaseRules } from '@/constants/order'
import { useWebIntl } from '@apps/locales'

// 请购单转订单 Hook
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()
  const handleSubmit = async (record) => {
    const params = {
      memberId: record.vendorMemberId,
      roleId: record.vendorRoleId,
      lifeCycleStageRuleId: lifecyclePhaseRules.SUPPLIER_ORDER,
    }
    postPurchaseRequisitionCheckMemberLifecycleRuleConfigure(params, { ctlType: 'none' }).then((res) => {
      if (res.data) {
        history.push(`${pathname}/detail?id=${record.id}&action=1`)
      } else {
        message.error(
          intl.formatMessage({ id: 'purchaseRequisition.tip', defaultMessage: '当前生命周期阶段不允许转换' }),
        )
      }
    })
  }

  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const buttonGroup = {
      [intl.formatMessage({ id: 'purchaseRequisition.zhuancaigoudingdan', defaultMessage: '转采购订单' })]: true,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'purchaseRequisition.zhuancaigoudingdan', defaultMessage: '转采购订单' })]: () =>
        handleSubmit(record),
    }

    const buttonPermissionsMap = {
      [intl.formatMessage({ id: 'purchaseRequisition.zhuancaigoudingdan', defaultMessage: '转采购订单' })]: 'detail',
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={buttonPermissionsMap}
      />
    )
  }

  const baseOrderListColumns: any = (code: string) => {
    return [
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggoudanhao', defaultMessage: '请购单号' }),
        align: 'center',
        dataIndex: 'requisitionNo',
        key: 'requisitionNo',
        width: 96,
        render: (text, record) => {
          const { pathname } = useLocation()
          return (
            <DetailAuthButton>
              <EyeAuthButton type={AuthUrl(code) ? 'link' : 'button'} url={`${pathname}/preview?id=${record.id}`}>
                {text}
              </EyeAuthButton>
            </DetailAuthButton>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggoudanzhaiyao', defaultMessage: '请购单摘要' }),
        align: 'center',
        dataIndex: 'digest',
        key: 'digest',
        width: 160,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.gongyinghuiyuan', defaultMessage: '供应会员' }),
        align: 'center',
        dataIndex: 'vendorMemberName',
        key: 'vendorMemberName',
        width: 160,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.yujiaoriqi', defaultMessage: '预交日期' }),
        align: 'center',
        dataIndex: 'advanceDeliveryDate',
        key: 'advanceDeliveryDate',
        width: 104,
        render: (text) => formatTimeString(text, 'YYYY-MM-DD'),
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggoubumen', defaultMessage: '请购部门' }),
        align: 'center',
        dataIndex: 'department',
        key: 'department',
        width: 88,
      },
      {
        title: translate('web.resource.order.qinggouren'),
        align: 'center',
        dataIndex: 'requisitioner',
        key: 'requisitioner',
        width: 88,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggouyongtu', defaultMessage: '请购用途' }),
        align: 'center',
        dataIndex: 'purpose',
        key: 'purpose',
        width: 152,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggoushuliang', defaultMessage: '请购数量' }),
        align: 'center',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 112,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.yizhuandingdanshu', defaultMessage: '已转订单数量' }),
        align: 'center',
        dataIndex: 'transferQuantity',
        key: 'transferQuantity',
        width: 112,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.danjushijian', defaultMessage: '单据时间' }),
        align: 'center',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 128,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.neibuzhuangtai', defaultMessage: '内部状态' }),
        align: 'center',
        dataIndex: 'innerStatus',
        key: 'innerStatus',
        width: 128,
        render: (text, record) => (
          <StatusColors status={text} type="saleInside" mode="Badge" text={record['innerStatusName']} />
        ),
      },
    ]
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns('preview')
    if (alreadyColumns) {
      return alreadyColumns.concat([
        {
          title: [intl.formatMessage({ id: 'purchaseRequisition.caozuo', defaultMessage: '操作' })],
          align: 'center',
          dataIndex: 'ctl',
          key: 'ctl',
          width: 128,
          fixed: 'right',
          render: (text: any, record: any) => renderOptionButton(record),
        },
      ])
    }
  }

  return {
    columns: secondColumns(),
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}

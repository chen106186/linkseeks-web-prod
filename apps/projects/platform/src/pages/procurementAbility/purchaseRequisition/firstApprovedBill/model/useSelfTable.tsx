import { useRef } from 'react'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { useWebIntl } from '@apps/locales'

// 待审核请购单 一级 Hook
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })
  const intl = useIntl()
  const translate = useWebIntl()

  const handleSubmit = (id) => {
    history.push(`/procurementAbility/purchaseRequisition/firstApprovedBill/detail?id=${id}`)
  }

  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = {
      [intl.formatMessage({ id: 'purchaseRequisition.shenhe', defaultMessage: '审核' })]: 'shenhe',
    }
    const buttonGroup = { [intl.formatMessage({ id: 'purchaseRequisition.shenhe', defaultMessage: '审核' })]: true }

    const operationHandler = {
      [intl.formatMessage({ id: 'purchaseRequisition.shenhe', defaultMessage: '审核' })]: () => handleSubmit(record.id),
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }

  const baseOrderListColumns: any = (code: string) => {
    const { pathname } = useLocation()
    return [
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggoudanhao', defaultMessage: '请购单号' }),
        align: 'left',
        dataIndex: 'requisitionNo',
        key: 'requisitionNo',
        width: 128,
        render: (text, record) => {
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
        align: 'left',
        dataIndex: 'digest',
        key: 'digest',
        width: 150,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.gongyinghuiyuan', defaultMessage: '供应会员' }),
        align: 'left',
        dataIndex: 'vendorMemberName',
        key: 'vendorMemberName',
        width: 192,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.yujiaoriqi', defaultMessage: '预交日期' }),
        align: 'left',
        dataIndex: 'advanceDeliveryDate',
        key: 'advanceDeliveryDate',
        width: 128,
        render: (text) => formatTimeString(text, 'YYYY-MM-DD'),
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggoubumen', defaultMessage: '请购部门' }),
        align: 'left',
        dataIndex: 'department',
        key: 'department',
        width: 128,
      },
      {
        title: translate('web.resource.order.qinggouren'),
        align: 'left',
        dataIndex: 'requisitioner',
        key: 'requisitioner',
        width: 88,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.qinggouyongtu', defaultMessage: '请购用途' }),
        align: 'left',
        dataIndex: 'purpose',
        key: 'purpose',
        width: 160,
      },
      // {
      //   title: intl.formatMessage({ id: 'purchaseRequisition.qinggoushuliang', defaultMessage: '请购数量' }),
      //   align: 'left',
      //   dataIndex: 'quantity',
      //   key: 'quantity',
      //   width: 112,
      // },
      // {
      //   title: intl.formatMessage({ id: 'purchaseRequisition.yizhuandingdanshu', defaultMessage: '已转订单数量' }),
      //   align: 'left',
      //   dataIndex: 'transferQuantity',
      //   key: 'transferQuantity',
      //   width: 112,
      // },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.danjushijian', defaultMessage: '单据时间' }),
        align: 'left',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
      },
      {
        title: intl.formatMessage({ id: 'purchaseRequisition.neibuzhuangtai', defaultMessage: '内部状态' }),
        align: 'left',
        dataIndex: 'innerStatus',
        key: 'innerStatus',
        width: 160,
        render: (text, record) => (
          <StatusColors status={text} type="saleInside" mode="Badge" text={record['innerStatusName']} />
        ),
      },
    ]
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns('firstApprovedBill.see')
    if (alreadyColumns) {
      return alreadyColumns.concat([
        {
          title: intl.formatMessage({ id: 'purchaseRequisition.caozuo', defaultMessage: '操作' }),
          align: 'left',
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

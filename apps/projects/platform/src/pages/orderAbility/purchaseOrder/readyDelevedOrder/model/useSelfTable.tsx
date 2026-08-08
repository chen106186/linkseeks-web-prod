import { useRef } from 'react'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
// 业务hooks, 待支付订单
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()

  const customOrderColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),
      width: 160,
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        // 查看订单, 需根据状态显示不同schema
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/orderAbility/purchaseOrder/readyDelevedOrder/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({
        id: 'saleOrder.dingdanzhaiyao',
        defaultMessage: '订单摘要/下单时间',
      }),
      width: 200,
      ellipsis: true,
      dataIndex: 'digest',
      key: 'digest',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <div>
            <FieldTimeOutlined />
            {formatTimeString(record.createTime)}
          </div>
        </>
      ),
    },
    {
      title: translate('web.resource.order.versionNo'),
      key: 'versionName',
      dataIndex: 'versionName',
      width: 112,
    },
    {
      title: intl.formatMessage({ id: 'order.gongyingshang', defaultMessage: '供应商' }),
      align: 'left',
      dataIndex: 'memberName',
      key: 'memberName',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.zongjine', defaultMessage: '总金额' }),
      width: 160,
      dataIndex: 'amount',
      key: 'amount',
      render: (t, r) => t,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanleixing', defaultMessage: '订单类型' }),
      width: 160,
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
      width: 192,
      dataIndex: 'outerStatus',
      key: 'outerStatus',
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.neibuzhuangtai', defaultMessage: '内部状态' }),
      width: 192,
      dataIndex: 'innerStatus',
      key: 'innerStatus',
      render: (text, record) => <StatusColors status={text} type="saleInside" text={record.innerStatusName} />,
    },
    // {
    //   title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
    //
    //   dataIndex: 'ctl',
    //   key: 'ctl',
    //   render: (text, record) => <>
    //   {
    //     record.showInvite &&
    //     <Button type='link' onClick={() => handleConfirm(record)}>{intl.formatMessage({ id: 'saleOrder.haoyoupintuan', defaultMessage: '邀请好友拼团' })}</Button>
    //   }
    //   {
    //     record.showAfterSales &&
    //     <Button type='link' onClick={() => handleConfirm(record)}>{intl.formatMessage({ id: 'saleOrder.shouhou', defaultMessage: '售后' })}</Button>
    //   }
    //   </>
    // }
  ]

  return {
    columns: customOrderColumns,
  }
}

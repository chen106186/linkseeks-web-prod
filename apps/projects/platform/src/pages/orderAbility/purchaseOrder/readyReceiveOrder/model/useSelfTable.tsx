import React from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
// import { ORDER_TYPE_CHANNEL_POINTS, ORDER_TYPE_POINTS } from '@/constants/order'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

// 业务hooks
export const useSelfTable = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()
  const handleConfirm = async (record) => {
    history.push(`/orderAbility/purchaseOrder/readyReceiveOrder/edit?id=${record.orderId}&batchNo=${record.batchNo}`)
  }
  const customOrderColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanhao', defaultMessage: '订单号' }),
      width: 160,
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/orderAbility/purchaseOrder/readyReceiveOrder/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanzhaiyao', defaultMessage: '订单摘要' }),
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
      title: intl.formatMessage({
        id: 'purchaseOrder.gongyinghuiyuan',
        defaultMessage: '供应会员',
      }),
      align: 'left',
      dataIndex: 'memberName',
      key: 'memberName',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.zongjine', defaultMessage: '总金额' }),
      width: 160,
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.yifahuopici', defaultMessage: '已发货批次' }),
      width: 160,
      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (text) =>
        text
          ? `${intl.formatMessage({
              id: 'purchaseOrder.di',
              defaultMessage: '第',
            })} ${text} ${intl.formatMessage({ id: 'purchaseOrder.ci', defaultMessage: '次' })}`
          : '',
    },
    // {
    //   title: '收货单号',
    //
    //   dataIndex: 'receiptNo',
    //   key: 'receiptNo',
    //   render: (t, r) => r.orderDeliveryDetailsId ? <Link to={`/orderAbility/stockSellStorage/bills/detail?id=${r.orderDeliveryDetailsId}&preview=1`}>{t}</Link> : <a href={`https://www.kuaidi100.com/chaxun?nu=${t}`} target="blank">{t}</a>
    // },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanleixing', defaultMessage: '订单类型' }),
      width: 160,
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
      width: 192,
      dataIndex: 'outerStatus',
      key: 'outerStatus',
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.neibuzhuangtai', defaultMessage: '内部状态' }),
      width: 192,
      dataIndex: 'innerStatus',
      key: 'innerStatus',
      render: (text, record) => <StatusColors status={text} type="inside" text={record.innerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),
      width: 160,
      fixed: 'right',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleConfirm(record)}>
            {intl.formatMessage({ id: 'purchaseOrder.querenshouhuo', defaultMessage: '确认收货' })}
          </Button>
        </EditAuthButton>
      ),
    },
  ]

  return {
    columns: customOrderColumns,
  }
}

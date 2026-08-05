import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Tooltip } from 'antd'
import { formatTimeString } from '@/utils'
import StatusColors from '../components/statusColors'
import { EyeAuthButton } from '@apps/components'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
export const baseOrderListColumns: any = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()

  return [
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanhao', defaultMessage: '订单号' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`${pathname}/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
      width: 160,
    },
    {
      title: intl.formatMessage({
        id: 'purchaseRequisition.dingdanzhaiyao',
        defaultMessage: '订单摘要',
      }),
      dataIndex: 'digest',
      key: 'digest',
      ellipsis: true,
      width: 224,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
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
      dataIndex: 'vendorMemberName',
      key: 'vendorMemberName',
      render: (t, r) => (t ? t : r.memberName),
      width: 224,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.xiadanshijian', defaultMessage: '下单时间' }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => formatTimeString(text),
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanzonge', defaultMessage: '订单总额' }),
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanleixing', defaultMessage: '订单类型' }),
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
      width: 160,
    },
    // {
    //   title: '送货地址',
    //   dataIndex: 'deliverAddress',
    //   key: 'deliverAddress',
    //   width: 164,
    //   ellipsis: true,
    // },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.neibuzhuangtai', defaultMessage: '内部状态' }),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => <StatusColors status={text} type="inside" text={record.innerStatusName} />,
      width: 192,
    },
  ]
}

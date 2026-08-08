import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import {
  COLUMNS_ACTION_WIDTH,
  COLUMNS_LARGE_WIDTH,
  COLUMNS_MEDIUM_WIDTH,
  COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
  COLUMNS_SMALL_WIDTH,
} from '@/constants/table'
import { useWebIntl } from '@apps/locales'

// 业务hooks, 待支付订单
export const useSelfTable = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()
  const handleConfirm = async (record) => {
    history.push(`/orderAbility/saleOrder/readyConfirmDelevedOrder/edit?id=${record.orderId}&batchNo=${record.batchNo}`)
  }

  const customOrderColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),
      width: COLUMNS_MEDIUM_WIDTH,
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        // 查看订单, 需根据状态显示不同schema
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/orderAbility/saleOrder/readyConfirmDelevedOrder/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanzhaiyao', defaultMessage: '订单摘要' }),
      width: COLUMNS_LARGE_WIDTH,
      dataIndex: 'digest',
      key: 'digest',
    },
    {
      title: translate('web.resource.order.versionNo'),
      key: 'versionName',
      dataIndex: 'versionName',
      width: COLUMNS_SMALL_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caigouhuiyuan', defaultMessage: '采购会员' }),
      align: 'left',
      dataIndex: 'memberName',
      key: 'memberName',
      width: COLUMNS_LARGE_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.xiadanshijian', defaultMessage: '下单时间' }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => (
        <>
          <div>
            <FieldTimeOutlined />
            {formatTimeString(record.createTime)}
          </div>
        </>
      ),
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.zongjine', defaultMessage: '总金额' }),
      width: COLUMNS_MEDIUM_WIDTH,
      dataIndex: 'amount',
      key: 'amount',
      render: (t, record) => {
        // 如果是积分兑换订单，总金额显示为0
        if (record.orderTypeName === '积分兑换') {
          return 0
        }
        return t
      },
    },
    {
      title: '积分',
      width: COLUMNS_MEDIUM_WIDTH,
      dataIndex: 'points',
      key: 'points',
      render: (t, record) => {
        // 如果是积分兑换订单且总金额为0，积分列显示总金额的值
        if (record.orderTypeName === '积分兑换') {
          return record.amount
        }
        return t
      },
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.yifahuopici', defaultMessage: '已发货批次' }),
      width: COLUMNS_ACTION_WIDTH,
      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (text) => (text ? `${text}${intl.formatMessage({ id: 'saleOrder.ci', defaultMessage: '次' })}` : ''),
    },
    // @todo 发货单号跳转
    {
      title: intl.formatMessage({ id: 'saleOrder.fahuodanhao', defaultMessage: '发货单号' }),
      width: COLUMNS_MEDIUM_WIDTH,
      dataIndex: 'deliveryNo',
      key: 'deliveryNo',
      // render: (text, record) => <Link to={`/orderAbility/stockSellStorage/bills/detail?id=${record.orderDeliveryDetailsId}&preview=1`}>{text}</Link>
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanleixing', defaultMessage: '订单类型' }),
      width: COLUMNS_MEDIUM_WIDTH,
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
      dataIndex: 'outerStatus',
      key: 'outerStatus',
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.neibuzhuangtai', defaultMessage: '内部状态' }),
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
      dataIndex: 'innerStatus',
      key: 'innerStatus',
      render: (text, record) => <StatusColors status={text} type="saleInside" text={record.innerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleConfirm(record)}>
            {intl.formatMessage({ id: 'saleOrder.querenfahuo', defaultMessage: '确认发货' })}
          </Button>
        </EditAuthButton>
      ),
    },
  ]

  return {
    columns: customOrderColumns,
  }
}

import React from 'react'
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
  COLUMNS_NORMAL_WIDTH,
  COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
  COLUMNS_SMALL_WIDTH,
} from '@/constants/table'
import { useWebIntl } from '@apps/locales'

export const useSelfTable = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()
  const handleConfirm = async (record) => {
    history.push(`/orderAbility/saleOrder/readyCheckoutOrder/edit?id=${record.orderId}`)
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
            url={`/orderAbility/saleOrder/readyCheckoutOrder/detail?id=${record.orderId}`}
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
      dataIndex: 'buyerMemberName',
      key: 'buyerMemberName',
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
      title: intl.formatMessage({ id: 'saleOrder.dingdanzonge', defaultMessage: '订单总额' }),
      dataIndex: 'amount',
      key: 'amount',
      width: COLUMNS_NORMAL_WIDTH,
      render: (t, r) => t,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanleixing', defaultMessage: '订单类型' }),
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
      width: COLUMNS_MEDIUM_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.songhuodizhi', defaultMessage: '送货地址' }),
      dataIndex: 'deliverAddress',
      key: 'deliverAddress',
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.neibuzhuangtai', defaultMessage: '内部状态' }),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
      render: (text, record) => <StatusColors status={text} type="saleInside" text={record.innerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
      width: COLUMNS_ACTION_WIDTH,
      dataIndex: 'ctl',
      key: 'ctl',
      fixed: 'right',
      render: (text, record) => (
        <AuthButton type="custom" code="edit">
          <Button type="link" onClick={() => handleConfirm(record)}>
            {intl.formatMessage({
              id: 'saleOrder.hexiaozitidingdan',
              defaultMessage: '核销自提订单',
            })}
          </Button>
        </AuthButton>
      ),
    },
  ]

  return {
    columns: customOrderColumns,
  }
}

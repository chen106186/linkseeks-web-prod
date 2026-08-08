import { useRef, useState } from 'react'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { EyeAuthButton } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getSaleOrderAuditPageSelectOption } from '@/pages/transaction/effect'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useModalTable } from '../../purchaseOrder/components/orderCollectB2b/model/useModalTable'
import { Button, Tooltip } from 'antd'
import {
  COLUMNS_NORMAL_WIDTH,
  COLUMNS_LARGE_WIDTH,
  COLUMNS_SMALL_WIDTH,
  COLUMNS_MEDIUM_WIDTH,
  COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
} from '@/constants/table'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
/** 订单审核各个页面 只有订单类型查询的Schema */
export const tableListSchema: any = (align?: string, colStyle?: Object) => {
  const intl = useIntl()
  const res = getSaleOrderAuditPageSelectOption()
  if (res) {
    const { orderTypes: OrderType } = res

    return {
      type: 'object',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'SearchFilter',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'saleOrder.qingshurudingdanOrderNo',
              defaultMessage: '请输入订单编号',
            }),
            align: align || 'flex-start',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            inline: true,
            colStyle: colStyle || { marginRight: 20 },
          },
          properties: {
            digest: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'saleOrder.qingshurudingdanDigest',
                  defaultMessage: '请输入订单摘要',
                }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'saleOrder.qingshurucaigou',
                  defaultMessage: '请输入采购会员名称',
                }),
              },
            },
            orderType: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'saleOrder.qingxuanzedingdanOrderType',
                  defaultMessage: '请选择订单类型',
                }),
              },
              enum: OrderType.map((item) => ({
                label: item.text,
                value: item.id,
              })),
            },
            '[startDate,endDate]': {
              type: 'daterange',
              // "x-component": 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'saleOrder.kaishishijian', defaultMessage: '开始时间' }),
                  intl.formatMessage({ id: 'saleOrder.jieshushijian', defaultMessage: '结束时间' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-component-props': {
                children: intl.formatMessage({ id: 'saleOrder.chaxun', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    }
  }
}

export const baseOrderListColumns: any = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const translate = useWebIntl()

  return [
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),
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
      width: COLUMNS_MEDIUM_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanzhaiyao', defaultMessage: '订单摘要' }),
      dataIndex: 'digest',
      key: 'digest',
      width: COLUMNS_LARGE_WIDTH,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: translate('web.resource.order.versionNo'),
      key: 'versionName',
      dataIndex: 'versionName',
      width: COLUMNS_SMALL_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caigouhuiyuan', defaultMessage: '采购会员' }),
      dataIndex: 'memberName',
      key: 'memberName',
      render: (t, r) => (r.memberName ? t : r.buyerMemberName),
      width: COLUMNS_LARGE_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.xiadanshijian', defaultMessage: '下单时间' }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => formatTimeString(text),
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanzonge', defaultMessage: '订单总额' }),
      dataIndex: 'amount',
      key: 'amount',
      width: COLUMNS_NORMAL_WIDTH,
      render: (text, record) => {
        // 积分兑换订单显示积分
        if (record.orderTypeName === '积分兑换') {
          return '0'
        }
        return text
      },
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      width: COLUMNS_NORMAL_WIDTH,
      render: (text, record) => {
        // 如果是积分兑换订单且总金额为0，积分列显示总金额的值
        if (record.orderTypeName === '积分兑换') {
          return record.amount
        }
        return text || '-'
      },
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanleixing', defaultMessage: '订单类型' }),
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
      width: COLUMNS_MEDIUM_WIDTH,
    },
    // {
    //   title: '送货地址',
    //   dataIndex: 'deliverAddress',
    //   key: 'deliverAddress',
    //   width: 164,
    //   ellipsis: true,
    // },
    // {
    //   title: intl.formatMessage({
    //     id: 'saleOrder.zhuandandingdanhao',
    //     defaultMessage: '转单订单号',
    //   }),
    //   dataIndex: 'relationNo',
    //   key: 'relationNo',
    //   width: COLUMNS_MEDIUM_WIDTH,
    // },
    {
      title: intl.formatMessage({ id: 'saleOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.neibuzhuangtai', defaultMessage: '内部状态' }),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => <StatusColors status={text} type="saleInside" text={record.innerStatusName} />,
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
    },
  ]
}

// 转单适用
export const useTransformOrderTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const transformRef = useRef<any>({})
  const { pathname } = useLocation()
  const { visible, setVisible } = useModalTable()
  const intl = useIntl()
  const handleDelete = (record) => {
    const orders = ctx.getFieldValue('orders')
    const data = orders.filter((item) => item.orderId !== record.orderId)
    ctx.setFieldValue('orders', [...data])
  }

  const [orderColumns] = useState(() => {
    const orderInfoColumns = [
      {
        title: intl.formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),

        dataIndex: 'orderNo',
        key: 'orderNo',
        render: (text, record) => {
          return <EyeAuthButton url={`${pathname}/detail?id=${record.orderId}`}>{text}</EyeAuthButton>
        },
        ellipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'saleOrder.dingdanzhaiyao', defaultMessage: '订单摘要' }),

        dataIndex: 'digest',
        key: 'digest',
        ellipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'saleOrder.gongyinghuiyuan', defaultMessage: '供应会员' }),

        dataIndex: 'supplyMemberName',
        key: 'supplyMemberName',
        ellipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'saleOrder.dingdanzonge', defaultMessage: '订单总额' }),

        dataIndex: 'amount',
        key: 'amount',
        ellipsis: true,
        render: (t) => `${intl.formatMessage({ id: 'common.money' })}${t}`,
      },
      {
        title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
        key: 'operation',
        dataIndex: 'operation',
      },
    ]
    // 渲染操作
    orderInfoColumns[orderInfoColumns.length - 1].render = (text, record) => (
      <Button type="link" size="small" onClick={() => handleDelete(record)}>
        {intl.formatMessage({ id: 'saleOrder.shanchu', defaultMessage: '删除' })}
      </Button>
    )

    return orderInfoColumns
  })

  return {
    transformRef,
    orderColumns,
    visible,
    setVisible,
  }
}

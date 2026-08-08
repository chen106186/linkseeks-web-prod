import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
import TableOperation from '@/components/TableOperation'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
// 待新增物流单
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const buttonGroup = {
      [intl.formatMessage({ id: 'saleOrder.xinzengwuliudan', defaultMessage: '新增物流单' })]: true,
      [intl.formatMessage({ id: 'saleOrder.zhakanwuliudan', defaultMessage: '查看物流单' })]: true,
      [intl.formatMessage({ id: 'saleOrder.xiugaiwuliudan', defaultMessage: '修改物流单' })]: true,
    }
    const operationHandler = {
      [intl.formatMessage({ id: 'saleOrder.xinzengwuliudan', defaultMessage: '新增物流单' })]: () =>
        handleConfirm(record),
      [intl.formatMessage({ id: 'saleOrder.zhakanwuliudan', defaultMessage: '查看物流单' })]: () =>
        handlePreview(record),
      [intl.formatMessage({ id: 'saleOrder.xiugaiwuliudan', defaultMessage: '修改物流单' })]: () =>
        handleModify(record),
    }

    const buttonPermissionsMap = {
      [intl.formatMessage({ id: 'saleOrder.xinzengwuliudan', defaultMessage: '新增物流单' })]: 'add',
      [intl.formatMessage({ id: 'saleOrder.zhakanwuliudan', defaultMessage: '查看物流单' })]: 'detail',
      [intl.formatMessage({ id: 'saleOrder.xiugaiwuliudan', defaultMessage: '修改物流单' })]: 'edit',
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={buttonPermissionsMap}
      />
    )
  }

  const customOrderColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),

      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        // 查看订单
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/orderAbility/saleOrder/orderList/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanzhaiyao', defaultMessage: '订单摘要/下单时间' }),

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
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caigouhuiyuan', defaultMessage: '采购会员' }),
      align: 'left',
      dataIndex: 'buyerMemberName',
      key: 'buyerMemberName',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.zongjine', defaultMessage: '总金额' }),

      dataIndex: 'amount',
      key: 'amount',
      render: (text) => intl.formatMessage({ id: 'common.money' }) + text,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.yifahuopici', defaultMessage: '已发货批次' }),

      dataIndex: 'shipmentBatch',
      key: 'shipmentBatch',
      render: (text) => (text ? `${text}${intl.formatMessage({ id: 'saleOrder.ci', defaultMessage: '次' })}` : ''),
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.fahuodanhao', defaultMessage: '发货单号' }),

      dataIndex: 'deliverNo',
      key: 'deliverNo',
      render: (text, record) => (
        <Link to={`/orderAbility/saleOrder/readyAddLogisticsOrder/detail?id=${record.orderId}&preview=1`}>{text}</Link>
      ),
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanleixing', defaultMessage: '订单类型' }),

      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.waibuzhuangtai', defaultMessage: '外部状态' }),

      dataIndex: 'outerStatus',
      key: 'outerStatus',
      render: (text, record) => <StatusColors status={text} type="out" text={record['outerStatusName']} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.neibuzhuangtai', defaultMessage: '内部状态' }),

      dataIndex: 'innerStatus',
      key: 'innerStatus',
      render: (text, record) => <StatusColors status={text} type="saleInside" text={record['innerStatusName']} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),

      dataIndex: 'ctl',
      key: 'ctl',
      render: (text: any, record: any) => renderOptionButton(record),
    },
  ]

  const handleConfirm = async (record) => {
    history.push(`/orderAbility/saleOrder/readyAddLogisticsOrder/add?id=${record.orderId}`)
  }

  const handlePreview = async (record) => {
    history.push(`/orderAbility/saleOrder/readyAddLogisticsOrder/detail?id=${record.orderId}&preview=1`)
  }

  const handleModify = async (record) => {
    const logisticsId = record.logisticsId
    history.push(`/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/edit?id=${logisticsId}`)
  }

  return {
    columns: customOrderColumns,
  }
}

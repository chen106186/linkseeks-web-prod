import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
import TableOperation from '@/components/TableOperation'
import { postOrderVendorValidateSellDelivery } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
// 待新增销售发货单
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const buttonGroup = {
      [intl.formatMessage({ id: 'saleOrder.xinzengfahuodan', defaultMessage: '新增发货单' })]: true,
      [intl.formatMessage({ id: 'saleOrder.shenhe', defaultMessage: '审核' })]: true,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'saleOrder.shenhe', defaultMessage: '审核' })]: () => handleConfirm(record),
      [intl.formatMessage({ id: 'saleOrder.xinzengfahuodan', defaultMessage: '新增发货单' })]: () => handleAdd(record),
    }

    const buttonPermissionsMap = {
      [intl.formatMessage({ id: 'saleOrder.shenhe', defaultMessage: '审核' })]: 'examine',
      [intl.formatMessage({ id: 'saleOrder.xinzengfahuodan', defaultMessage: '新增发货单' })]: 'add',
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
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: `${translate('web.resource.order.zongjine')}(${translate('web.common.currencySymbol')})`,

      dataIndex: 'amount',
      key: 'amount',
      render: (text) => intl.formatMessage({ id: 'common.money' }) + text,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.yifahuopici', defaultMessage: '已发货批次' }),

      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (text) => (text ? `${text}${intl.formatMessage({ id: 'saleOrder.ci', defaultMessage: '次' })}` : ''),
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.fahuodanhao', defaultMessage: '发货单号' }),

      dataIndex: 'deliveryNo',
      key: 'deliveryNo',
      render: (text, record) => (
        <Link to={`/orderAbility/saleOrder/readyAddDelevedOrder/detail?id=${record.orderId}&preview=1`}>{text}</Link>
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
      render: (text, record) => renderOptionButton(record),
    },
  ]

  const handleConfirm = async (record) => {
    const modal = Modal.confirm({
      title: intl.formatMessage({ id: 'saleOrder.querenshenhecao', defaultMessage: '确认审核操作' }),
      content: `${intl.formatMessage({ id: 'saleOrder.shifouquerenshen', defaultMessage: '是否确认审核发货单号为' })}${
        record.deliverNo
      }${intl.formatMessage({ id: 'saleOrder.dexiaoshoufahuo', defaultMessage: '的销售发货单' })}?`,
      onOk: async () => {
        const { code } = await postOrderVendorValidateSellDelivery({
          orderId: record.id,
        })
        if (code === 1000) {
          modal.destroy()
          ref.current.reloadCurrent()
        }
      },
    })
  }

  const handleAdd = async (record) => {
    history.push(`/orderAbility/saleOrder/readyAddDelevedOrder/add?id=${record.orderId}`)
  }

  return {
    columns: customOrderColumns,
    ref,
  }
}

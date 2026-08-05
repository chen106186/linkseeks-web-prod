import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
import TableOperation from '@/components/TableOperation'
import { postOrderBuyerValidateReceive } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const translate = useWebIntl()
  const { pathname } = useLocation()

  const handleConfirm = async (record) => {
    const modal = Modal.confirm({
      title: intl.formatMessage({
        id: 'purchaseOrder.querenshenhecao',
        defaultMessage: '确认审核操作',
      }),
      content: `${intl.formatMessage({
        id: 'purchaseOrder.shifouquerenshen',
        defaultMessage: '是否确认审核收货单号为',
      })}${record.invoiceNumber}${intl.formatMessage({
        id: 'purchaseOrder.decaigouruku',
        defaultMessage: '的采购收货单?',
      })}`,
      onOk: async () => {
        const { code } = await postOrderBuyerValidateReceive({
          orderId: record.orderId,
        })
        if (code === 1000) {
          modal.destroy()
          ref.current.reloadCurrent()
        }
      },
    })
  }

  const handleAdd = async (record) => {
    history.push(`/orderAbility/purchaseOrder/readyAddPurchaseReceiveOrder/add?id=${record.orderId}`)
  }

  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const buttonPermissionsMap = {
      [intl.formatMessage({ id: 'purchaseOrder.shenhe', defaultMessage: '审核' })]: 'examine',
      [intl.formatMessage({
        id: 'purchaseOrder.xinzengcaigoushouhuodan',
        defaultMessage: '新增采购收货单',
      })]: 'add',
    }

    const buttonGroup = {
      [intl.formatMessage({ id: 'purchaseOrder.shenhe', defaultMessage: '审核' })]: true,
      [intl.formatMessage({
        id: 'purchaseOrder.xinzengcaigoushouhuodan',
        defaultMessage: '新增采购收货单',
      })]: true,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'purchaseOrder.shenhe', defaultMessage: '审核' })]: () => handleConfirm(record),
      [intl.formatMessage({
        id: 'purchaseOrder.xinzengcaigoushouhuodan',
        defaultMessage: '新增采购收货单',
      })]: () => handleAdd(record),
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
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanhao', defaultMessage: '订单号' }),
      width: 160,
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/orderAbility/purchaseOrder/orderList/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({
        id: 'purchaseOrder.dingdanzhaiyao',
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
      title: intl.formatMessage({ id: 'purchaseOrder.caigouhuiyuan', defaultMessage: '供应会员' }),
      align: 'left',
      dataIndex: 'vendorMemberName',
      key: 'vendorMemberName',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanzonge', defaultMessage: '订单总额' }),
      width: 160,
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `${translate('web.common.currencySymbol')}` + text,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.yifahuopici', defaultMessage: '已发货批次' }),
      width: 160,
      dataIndex: 'shipmentBatch',
      key: 'shipmentBatch',
      render: (text) => (text ? `${text}${intl.formatMessage({ id: 'purchaseOrder.ci', defaultMessage: '次' })}` : ''),
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.rukudanhao', defaultMessage: '入库单号' }),
      width: 160,
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text, record) => (
        <Link to={`/orderAbility/purchaseOrder/readyAddPurchaseReceiveOrder/detail?id=${record.orderId}&preview=1`}>
          {text}
        </Link>
      ),
    },
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
      render: (text: any, record: any) => renderOptionButton(record),
    },
  ]

  return {
    columns: customOrderColumns,
    ref,
  }
}

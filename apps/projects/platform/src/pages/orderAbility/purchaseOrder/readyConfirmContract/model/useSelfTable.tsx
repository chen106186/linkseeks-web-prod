import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Modal } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { getContractSignatureAuthAuthStatus } from '@apps/apis'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'

// 业务hooks, 待新增订单
export const useSelfTable = () => {
  const intl = useIntl()
  const [isSign, setIsSign] = useState(false)

  const popConfirm = () => {
    history.push(`/contract/ElectronicSignature/apply`)
  }

  const handleConfirm = async (record) => {
    //@todo 是否签约电子签章, 如果没有，需跳转至签约页面
    if (isSign) {
      history.push(`/orderAbility/purchaseOrder/readyConfirmContract/edit?id=${record.orderId}`)
    } else {
      // 未认证
      Modal.confirm({
        title: intl.formatMessage({ id: 'purchaseOrder.tishi', defaultMessage: '提示' }),
        content: intl.formatMessage({
          id: 'purchaseOrder.weiqianyuedianzi',
          defaultMessage: '未签约电子合同, 是否要立即前往?',
        }),
        onOk: popConfirm,
        maskClosable: true,
      })
    }
  }

  useEffect(() => {
    getContractSignatureAuthAuthStatus().then(({ data }) => {
      setIsSign(data)
    })
  }, [])
  const secondColumns: any[] = baseOrderListColumns().concat([
    {
      title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),

      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleConfirm(record)}>
            {intl.formatMessage({
              id: 'purchaseOrder.querendianzihetong',
              defaultMessage: '确认电子合同',
            })}
          </Button>
        </>
      ),
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
    },
  ])

  return {
    columns: secondColumns,
  }
}

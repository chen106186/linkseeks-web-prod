/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-04 17:22:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:56:15
 * @Description:
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesRepairGoodsConfirmVerify } from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  REPAIR_INNER_STATUS_FAILED_2,
  REPAIR_INNER_STATUS_COMMIT_FAILED,
  REPAIR_INNER_STATUS_FAILED_1,
} from '@/constants/afterService'
import DetailInfo from '../components/DetailInfo'
import VerifyModal from '../../components/VerifyModal'

const RepairPrConfirmVerify: React.FC = () => {
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [rejected, setRejected] = useState(false)

  const intl = useIntl()

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setConfirmLoading(true)
    postAftersalesRepairGoodsConfirmVerify({
      applyId: id,
      ...values,
    })
      .then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }

  const handleVerify = (info) => {
    if (
      info.innerStatus === REPAIR_INNER_STATUS_FAILED_2 ||
      info.innerStatus === REPAIR_INNER_STATUS_COMMIT_FAILED ||
      info.innerStatus === REPAIR_INNER_STATUS_FAILED_1
    ) {
      setRejected(true)
    }
    setVisible(true)
  }

  return (
    <>
      <DetailInfo
        id={id}
        target="/afterAbility/repairManage/repairPrConfirm"
        headExtra={(info) => (
          <Button type="primary" icon={<FormOutlined />} onClick={() => handleVerify(info)}>
            {intl.formatMessage({ id: 'afterService.common.confirmVerify', defaultMessage: '确认单据' })}
          </Button>
        )}
      />

      <VerifyModal
        visible={visible}
        rejected={rejected}
        confirmLoading={confirmLoading}
        onSubmit={handleSubmit}
        onVisible={() => setVisible(false)}
      />
    </>
  )
}

export default RepairPrConfirmVerify

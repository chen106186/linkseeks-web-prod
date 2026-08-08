/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-18 11:11:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 10:19:18
 * @Description:
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postPayCreditHandleConfirmVerifyCreditApply } from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  CREDIT_INNER_STATUS_COMMITTED_FAILED,
  CREDIT_INNER_STATUS_FAILED_1,
  CREDIT_INNER_STATUS_FAILED_2,
  CREDIT_INNER_STATUS_FAILED_3,
} from '@/constants/payment'
import DetailInfo from '../../components/DetailInfo'
import VerifyModal from '../../components/VerifyModal'

const QuotaPrConfirmVerify: React.FC = () => {
  const intl = useIntl()
  const { id, creditId } = usePageStatus()
  const [modalVisible, setModalVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [rejected, setRejected] = useState(false)

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setSubmitLoading(true)
    postPayCreditHandleConfirmVerifyCreditApply({
      applyId: +id,
      isPass: values.agree,
      opinion: values.reason,
    })
      .then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  const handleVisible = (flag) => {
    setModalVisible(!!flag)
  }

  const handleVerify = (info) => {
    if (
      info?.member?.innerStatus === CREDIT_INNER_STATUS_COMMITTED_FAILED ||
      info?.member?.innerStatus === CREDIT_INNER_STATUS_FAILED_1 ||
      info?.member?.innerStatus === CREDIT_INNER_STATUS_FAILED_2 ||
      info?.member?.innerStatus === CREDIT_INNER_STATUS_FAILED_3
    ) {
      setRejected(true)
    }
    handleVisible(true)
  }

  return (
    <>
      <DetailInfo
        id={id}
        creditId={creditId}
        target="/payandSettle/creditManage/quotaPrConfirm/history"
        headExtra={(info) => (
          <Button type="primary" icon={<FormOutlined />} onClick={() => handleVerify(info)}>
            {intl.formatMessage({ id: 'payandSettle.creditManage.quotaPrConfirm.verify' })}
          </Button>
        )}
      />
      <VerifyModal
        visible={modalVisible}
        rejected={rejected}
        confirmLoading={submitLoading}
        onSubmit={handleSubmit}
        onVisible={handleVisible}
      />
    </>
  )
}

export default QuotaPrConfirmVerify

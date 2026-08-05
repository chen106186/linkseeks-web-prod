/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-18 11:11:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 10:18:41
 * @Description:
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postPayCreditHandleVerifyStepThree } from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../../components/DetailInfo'
import VerifyModal from '../../components/VerifyModal'

const QuotaPr3Verify: React.FC = () => {
  const intl = useIntl()
  const { id, creditId } = usePageStatus()
  const [modalVisible, setModalVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setSubmitLoading(true)
    postPayCreditHandleVerifyStepThree({
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

  return (
    <>
      <DetailInfo
        id={id}
        creditId={creditId}
        target="/payandSettle/creditManage/quotaPr3/history"
        headExtra={() => (
          <Button type="primary" icon={<FormOutlined />} onClick={() => handleVisible(true)}>
            {intl.formatMessage({ id: 'payandSettle.creditManage.quotaPr3.verify' })}
          </Button>
        )}
      />
      <VerifyModal
        visible={modalVisible}
        confirmLoading={submitLoading}
        onSubmit={handleSubmit}
        onVisible={handleVisible}
      />
    </>
  )
}

export default QuotaPr3Verify

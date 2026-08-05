/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-04 17:22:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:05:35
 * @Description:
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesReturnGoodsVerifyStepTwo } from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'
import VerifyModal from '../../components/VerifyModal'

const ReturnPr2Verify: React.FC = () => {
  const { id, creditId } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const intl = useIntl()

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setConfirmLoading(true)
    postAftersalesReturnGoodsVerifyStepTwo({
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

  return (
    <>
      <DetailInfo
        id={id}
        target="/afterAbility/returnManage/returnPr2"
        headExtra={() => (
          <Button type="primary" icon={<FormOutlined />} onClick={() => setVisible(true)}>
            {intl.formatMessage({ id: 'afterService.common.applyVerify', defaultMessage: '单据审核' })}
          </Button>
        )}
      />

      <VerifyModal
        visible={visible}
        confirmLoading={confirmLoading}
        onSubmit={handleSubmit}
        onVisible={() => setVisible(false)}
      />
    </>
  )
}

export default ReturnPr2Verify

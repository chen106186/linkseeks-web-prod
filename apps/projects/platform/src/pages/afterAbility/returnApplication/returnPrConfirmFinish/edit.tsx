/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:59:11
 * @Description:
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesReturnGoodsConfirmComplete } from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'
import FinishedModal from '../../components/FinishedModal'

const ReturnPrConfirmFinishVerify: React.FC = () => {
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const intl = useIntl()

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setConfirmLoading(true)
    postAftersalesReturnGoodsConfirmComplete({
      returnId: +id,
      evaluate: values,
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
        headExtra={() => (
          <Button type="primary" icon={<FormOutlined />} onClick={() => setVisible(true)}>
            {intl.formatMessage({ id: 'afterService.common.commit', defaultMessage: '提交' })}
          </Button>
        )}
        target="/afterAbility/returnApplication/returnPrConfirmFinish"
      />

      <FinishedModal
        visible={visible}
        confirmLoading={confirmLoading}
        onSubmit={handleSubmit}
        onVisible={() => setVisible(false)}
      />
    </>
  )
}

export default ReturnPrConfirmFinishVerify

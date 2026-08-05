/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 17:21:54
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:43:14
 * @Description: 确认售后完成
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postAftersalesReplaceGoodsConfirmComplete } from '@apps/apis'
import { FormOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'
import FinishedModal from '../../components/FinishedModal'

const ExchangePrFinishedDetailVerify: React.FC = () => {
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const intl = useIntl()

  const handleSubmit = (values) => {
    if (!id) {
      return
    }
    setConfirmLoading(true)
    postAftersalesReplaceGoodsConfirmComplete({
      replaceId: +id,
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
        target="/afterAbility/exchangeApplication/exchangePrFinished"
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

export default ExchangePrFinishedDetailVerify

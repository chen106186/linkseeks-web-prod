/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-13 13:46:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 10:05:27
 * @Description: 上传凭证弹窗
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { Modal, message, Upload } from 'antd'
import styled from 'styled-components'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'
import { uploadVoucherModalSchema } from './schema'
import styles from './index.less'

const uploadVoucherFormActions = createFormActions()

const Wrap = styled((props) => <div {...props} />)`
  .ant-form-item {
    margin-bottom: 2px;
  }
`

interface UploadVoucherModalProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 确认按钮loading
   */
  confirmLoading: boolean
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员角色
   */
  memberRoleId: number
  /**
   * 提交事件
   */
  onSubmit: (values: any) => void
  /**
   * 隐藏事件
   */
  onCancel: () => void
}

interface BankAccountData {
  id: number
  name: string
  bankAccount: string
  bankDeposit: string
}

const UploadVoucherModal: React.FC<UploadVoucherModalProps> = (props: UploadVoucherModalProps) => {
  const { visible, confirmLoading, memberId, memberRoleId, onSubmit, onCancel } = props
  const intl = useIntl()
  const translate = useWebIntl()
  const [bankAccount, setBankAccount] = useState<BankAccountData>({
    id: 0,
    name: '',
    bankAccount: '',
    bankDeposit: '',
  })
  const [loading, setLoading] = useState(false)

  // 获取对公账户信息
  const fetchSettleAccountsGetMemberAccountConfig = (memberId: number, memberRoleId: number) => {
    if (!memberId || !memberRoleId || loading) {
      return
    }
    setLoading(true)
    getSettlementGetMemberAccountConfig({
      memberId: `${memberId}`,
      roleId: `${memberRoleId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setBankAccount(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (visible) {
      fetchSettleAccountsGetMemberAccountConfig(memberId, memberRoleId)
    }
  }, [visible])

  const beforeUploadVoucher = (file) => {
    if (file.size / 1024 > 5120) {
      message.warning(translate('web.resource.payment.tupiandaxiaochaoguowuzhao'))
      return Upload.LIST_IGNORE
    }
    return Promise.resolve()
  }

  const handleUploadVoucherSubmit = (values) => {
    if (onSubmit) {
      if (!bankAccount || !bankAccount.id || !bankAccount.bankAccount || !bankAccount.bankDeposit) {
        message.error(
          intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.error',
          }),
        )
        return
      }

      onSubmit(values)
    }
  }

  return (
    <Modal
      title={intl.formatMessage({
        id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.title',
      })}
      width={576}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => uploadVoucherFormActions.submit()}
      onCancel={onCancel}
      destroyOnClose
    >
      <Wrap>
        <NiceForm
          previewPlaceholder=""
          value={bankAccount}
          effects={($, { setFieldState }) => {}}
          expressionScope={{
            beforeUpload: beforeUploadVoucher,
          }}
          actions={uploadVoucherFormActions}
          schema={uploadVoucherModalSchema}
          onSubmit={handleUploadVoucherSubmit}
          colon
        />
      </Wrap>
    </Modal>
  )
}

export default UploadVoucherModal

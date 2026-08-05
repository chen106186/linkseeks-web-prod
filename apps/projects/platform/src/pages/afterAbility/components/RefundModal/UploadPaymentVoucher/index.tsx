/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-09 10:34:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:37:45
 * @Description: 上传支付凭证
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { message, Spin, Modal, Upload } from 'antd'
import styled from 'styled-components'
import { createFormActions } from '@apps/formily'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'
import { FileData } from '@/utils'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'

const formActions = createFormActions()

const Wrap = styled((props) => <div {...props} />)`
  .ant-form-item {
    margin-bottom: 4px;
  }
`

interface BankAccount {
  /**
   * 还款账户名称
   */
  name: string
  /**
   * 银行账号
   */
  bankAccount: string
  /**
   * 开户行
   */
  bankDeposit: string
  /**
   * 数据id
   */
  id: number
}

export type ValueType = {
  /**
   * 账户id
   */
  id: number
  /**
   * 还款账户名称
   */
  name: string
  /**
   * 银行账号
   */
  bankAccount: string
  /**
   * 开户行
   */
  bankDeposit: string
  /**
   * 退款凭证
   */
  fileList: FileData[]
}

export type SubmitValueType = {
  /**
   * 支付凭证 ,PayProveBO
   */
  payProve?: {
    /**
     * 账户名称
     */
    name?: string
    /**
     * 银行账号
     */
    bankAccount?: string
    /**
     * 开户行
     */
    bankDeposit?: string
    /**
     * 支付凭证文件 ,PayProveFileBO
     */
    fileList?: {
      /**
       * 证明名称
       */
      name: string
      /**
       * 证明地址
       */
      proveUrl: string
    }[]
  }
}

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 提交事件
   */
  onSubmit: (value: SubmitValueType) => Promise<void>
  /**
   * 采购商id
   */
  purchaserId: number
  /**
   * 采购商角色id
   */
  purchaserRoleId: number
  /**
   * 弹窗提交 loading
   */
  submitLoading: boolean
}

const UploadPaymentVoucher: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose, onSubmit, purchaserId, purchaserRoleId, submitLoading } = props
  const [bankAccount, setBankAccount] = useState<BankAccount>({
    name: '',
    bankAccount: '',
    bankDeposit: '',
    id: 0,
  })
  const [loading, setLoading] = useState(false)
  const [refundDisabled, setRefundDisabled] = useState(false)
  const translate = useWebIntl()
  const intl = useIntl()

  // 获取对公账户信息
  const fetchSettleAccountsGetMemberAccountConfig = () => {
    if (!purchaserId || !purchaserRoleId) {
      return
    }
    setLoading(true)
    getSettlementGetMemberAccountConfig({
      memberId: `${purchaserId}`,
      roleId: `${purchaserRoleId}`,
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
      fetchSettleAccountsGetMemberAccountConfig()
    }
  }, [visible, purchaserId, purchaserRoleId])

  const handleModalVisible = () => {
    if (onClose) {
      onClose()
    }
  }

  const beforeUploadVoucher = (file) => {
    setRefundDisabled(true)
    if (file.size / 1024 > 5120) {
      message.warning(translate('web.resource.payment.tupiandaxiaochaoguowuzhao'))
      return Upload.LIST_IGNORE
    }
    return Promise.resolve()
  }

  const handleUploadChange = (file) => {
    setRefundDisabled(false)
  }

  const handleSubmit = (values: ValueType) => {
    const { fileList = [], id, ...rest } = values

    if (onSubmit) {
      if (!bankAccount || !bankAccount.id) {
        message.error(
          intl.formatMessage({
            id: 'afterService.components.UploadPaymentVoucher.nothing',
            defaultMessage: '没有收款账户相关信息，无法退款',
          }),
        )
        return
      }
      onSubmit({
        payProve: {
          ...rest,
          fileList: fileList
            .map(
              (item) =>
                item.status === 'done' && {
                  name: item.name,
                  proveUrl: item.url,
                },
            )
            .filter(Boolean),
        },
      })
    }
  }

  return (
    <Modal
      width={600}
      title={intl.formatMessage({
        id: 'afterService.components.UploadPaymentVoucher.title',
        defaultMessage: '上传支付凭证',
      })}
      visible={visible}
      onCancel={() => handleModalVisible()}
      onOk={() => formActions.submit()}
      okButtonProps={{
        disabled: refundDisabled,
        loading: submitLoading,
      }}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Wrap>
          <NiceForm
            previewPlaceholder=""
            value={bankAccount}
            effects={($, { setFieldState }) => {}}
            expressionScope={{
              beforeUpload: beforeUploadVoucher,
              onUploadChange: handleUploadChange,
            }}
            actions={formActions}
            schema={schema}
            onSubmit={handleSubmit}
            colon
          />
        </Wrap>
      </Spin>
    </Modal>
  )
}

export default UploadPaymentVoucher

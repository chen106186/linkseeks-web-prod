/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-13 15:37:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-13 17:23:25
 * @Description: 余额支付弹窗
 */
import React, { useState, useEffect } from 'react'
import { Modal, Input, Spin, Space, Button, message } from 'antd'
import classNames from 'classnames'
import { encryptedByAES } from '@linkseeks/crypto'
import styles from './index.less'
import { getPayAssetAccountGetUserBalance } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
interface BalancePayModalProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 隐藏事件
   */
  onCancel: () => void
  /**
   * 确认按钮 loading
   */
  confirmLoading?: boolean
  /**
   * 提交事件
   */
  onSubmit: (values: any) => void
  /**
   * 上级会员id
   */
  parentMemberId: number
  /**
   * 上级会员角色id
   */
  parentMemberRoleId: number
  /**
   * 需要支付的金额
   */
  payAmount: number
}

const PWD_LEN = 6
const NUMBER_ARR = [0, 1, 2, 3, 4, 5]

const BalancePayModal: React.FC<BalancePayModalProps> = (props: BalancePayModalProps) => {
  const intl = useIntl()
  const { visible, confirmLoading, onCancel, onSubmit, parentMemberId, parentMemberRoleId, payAmount } = props
  const [pwd, setPwd] = useState('')
  const [step, setStep] = useState(0)
  const [userBalance, setUserBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  const getBalance = () => {
    if (!parentMemberId || !parentMemberRoleId || loading) {
      return
    }
    setLoading(true)
    getPayAssetAccountGetUserBalance({
      parentMemberId: `${parentMemberId}`,
      parentMemberRoleId: `${parentMemberRoleId}`,
      payType: `${2}`, // 会员支付
    })
      .then((res) => {
        if (res.code === 1000) {
          setUserBalance(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (visible) {
      getBalance()
    }
  }, [visible])

  const handleConfirmPay = () => {
    if (payAmount > userBalance) {
      message.error(intl.formatMessage({ id: 'components.yuebuzu' }))
      return
    }
    if (!pwd) {
      message.error(intl.formatMessage({ id: 'components.qingshuruzhifumima' }))
      return
    }
    if (pwd.length !== PWD_LEN) {
      message.error(intl.formatMessage({ id: 'components.qingshuruwanzhengdezhifu' }))
      return
    }
    if (onSubmit) {
      onSubmit({
        passWord: encryptedByAES(pwd),
      })
    }
  }

  const handleCancel = () => {
    setStep(0)

    if (onCancel) {
      onCancel()
    }
  }

  const handlePwdChange = (e) => {
    setPwd(e.target.value)
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'components.yuezhifu' })}
      width={576}
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={
        <>
          {step === 0 && (
            <Space>
              <Button onClick={onCancel}>{intl.formatMessage({ id: 'components.quxiao' })}</Button>
              <Button type="primary" onClick={() => setStep(1)} disabled={loading || userBalance === 0}>
                {intl.formatMessage({ id: 'components.zhifu' })}
              </Button>
            </Space>
          )}
          {step === 1 && (
            <Button type="primary" onClick={handleConfirmPay} loading={confirmLoading} block>
              {intl.formatMessage({ id: 'components.querenzhifu' })}
            </Button>
          )}
        </>
      }
    >
      <Spin spinning={loading}>
        {step === 0 && (
          <>
            <p style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'components.zhanghuyue' })}</p>
            <p>
              <span className={styles.title}>
                {translate('web.common.zhanghukeyongyue')}
                {translate('web.common.currencySymbol')}：
              </span>
              <span className={styles.amount}>{userBalance}</span>
            </p>
            <p>
              <span className={styles.title}>
                {translate.formatCurrencyWith(translate('web.resource.order.bencixuzhifu'))}：
              </span>
              <span className={classNames(styles.amount, styles.amount2)}>{payAmount}</span>
            </p>
          </>
        )}
        {step === 1 && (
          <div className={styles.payContainer}>
            <p className={styles.title}>{intl.formatMessage({ id: 'components.qingshuruzhifumima' })}</p>
            <div className={styles.inputBox}>
              {NUMBER_ARR.map((item, index) => (
                <div className={styles.codeItem} key={index}>
                  {pwd[index]?.replace(/[0-9]/g, '·')}
                </div>
              ))}
              <Input.Password
                className={styles.codeInput}
                value={pwd}
                maxLength={PWD_LEN}
                onChange={handlePwdChange}
                visibilityToggle={false}
                id="balancePay"
                autoFocus
              />
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  )
}

export default BalancePayModal

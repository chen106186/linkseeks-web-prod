import React, { useState, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal, message, Steps, Row, Col, Spin, Button, Input, Form } from 'antd'
import { history } from '@linkseeks/router-manager'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { getOrderCommonPayChannels } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { BillDetailData } from '../IntroduceRow'
import { repaymentModalSchema } from './schema'
import { createEffects } from './effects'
import { ScanOutlined } from '@ant-design/icons'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { encryptedByAES } from '@linkseeks/crypto'
import QRCode from 'qrcode'
import {
  postPayCreditApplyCreditRepay,
  getPayCreditApplyGetCreditRepayResult,
  getPayEAccountAllInPayGetAccountDetail,
  getPayEAccountAllInPayGetUserBalance,
  getPayEAccountAllInPayReSendPayCode,
  postPayEAccountAllInPayConfirmPay,
} from '@apps/apis'
import useCountDown from '@/hooks/useCountDown'
import { authService } from '@apps/services'
import styles from './index.less'

const { onFormInit$ } = FormEffectHooks

const repaymentFormActions = createFormActions()

interface RefundModalProps {
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
   * 账单信息
   */
  billInfo: BillDetailData | null
  /**
   * 账单ID
   */
  billId: number | string
  /**
   * 提交事件
   */
  onSubmit: (values: any) => void
}

const HeaderTitle = ({ current }: { current: number }) => {
  const intl = useIntl()
  return (
    <div style={{ padding: '0 40px' }}>
      <Steps size="small" current={current}>
        <Steps.Step title={intl.formatMessage({ id: 'transaction_components.xuanzezhifufangshi' })} />
        <Steps.Step title={intl.formatMessage({ id: 'transaction_components.jinhangzhifu' })} />
      </Steps>
    </div>
  )
}

const RefundModal: React.FC<RefundModalProps> = (props) => {
  const { visible, onCancel, confirmLoading, billInfo, billId, onSubmit } = props
  const intl = useIntl()

  // 通联支付相关状态
  const [tonglianPayVisible, setTonglianPayVisible] = useState(false)
  const [repayAmount, setRepayAmount] = useState(0)
  const [current, setCurrent] = useState(0) // 0选择方式 4微信支付 6支付宝 99通联余额
  const [payStep, setPayStep] = useState(0) // 支付模态框的步骤 0选方式 1下一步的具体操作 2输入支付密码
  const mobilePayFlag = useRef(0) // 用于判断移动支付类型 4微信6支付宝
  const [qrLoading, setQrLoading] = useState(false)
  const [qrCodeInfo, setQrCodeInfo] = useState({ generateCharacter: '', qrUrl: '' }) // 微信qrcode
  const [qrCodeIframe, setQrCodeIframe] = useState('') // 支付宝iframe
  const [isSpin, setIsSpin] = useState<boolean>(false)
  const [balanceInfo, setBalanceInfo] = useState<any>()
  const [phoneEndNumber, setPhoneEndNumber] = useState('')
  const [tradeNo, setTradeNo] = useState<string>() // 需要轮询支付结果的交易号
  const [formCode] = Form.useForm()
  const [verificationCode, setVerificationCode] = useState('')

  const { run, loading } = useHttpRequest(postPayCreditApplyCreditRepay)

  // 倒计时hook
  const { count, start } = useCountDown({
    maxTime: 60,
  })

  // 生成二维码
  const generateQrCode = () => {
    if (qrCodeInfo.generateCharacter) {
      QRCode.toDataURL(qrCodeInfo.generateCharacter)
        .then((url) => {
          setQrCodeInfo((prev) => ({ ...prev, qrUrl: url }))
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  // 提交支付
  const handleSubmitPay = async (tradeChannel: number, tradeType: number, values: any) => {
    try {
      const params = {
        billId: +billId, // 使用 + 转换，与线下支付保持一致
        ...values, // 传递所有表单值，包括 amountSlide
      }

      const res = await run(params)

      if (res.code === 1000) {
        setTonglianPayVisible(true)

        if (mobilePayFlag.current === 4) {
          const qrCodeData = res.data.payQRCode
          setQrCodeInfo({
            generateCharacter: qrCodeData,
            qrUrl: '',
          })
          QRCode.toDataURL(qrCodeData).then((url) => {
            setQrCodeInfo((prev) => ({ ...prev, qrUrl: url }))
          })
        } else if (mobilePayFlag.current === 6) {
          const qrCodeData = res.data.payQRCode
          setQrCodeInfo({
            generateCharacter: qrCodeData,
            qrUrl: '',
          })
          QRCode.toDataURL(qrCodeData).then((url) => {
            setQrCodeInfo((prev) => ({ ...prev, qrUrl: url }))
          })
        }
        const recordId = res.data.recordId
        setTradeNo(recordId)
        startPollPayResult(recordId)
      } else {
        message.error(res.message || '支付失败')
      }
    } catch (error) {
      message.error('支付失败')
    } finally {
      setQrLoading(false)
    }
  }

  // 轮询定时器引用
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 轮询支付结果
  const startPollPayResult = (recordId: string) => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
    }

    pollTimerRef.current = setInterval(() => {
      getPayCreditApplyGetCreditRepayResult({
        recordId: recordId,
      }).then((res) => {
        if (res.code === 1000) {
          const paySuccess = res.data?.status === 3
          if (paySuccess) {
            stopPollPayResult()
            message.success('支付成功')
            setTimeout(() => {
              if (onSubmit) {
                onSubmit({ refresh: true })
              }
              handleTonglianCancel()
              onCancel()
            }, 1000)
          }
        }
      })
    }, 3000)

    // 60秒后自动停止轮询
    setTimeout(() => {
      stopPollPayResult()
    }, 60000)
  }

  // 停止轮询
  const stopPollPayResult = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  // 获取供应商支付渠道
  const getPayChannels = (payType?: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      if (payType === 2) {
        resolve([])
        return
      }

      // 根据选择的支付方式动态获取支付渠道
      if (!billInfo) {
        reject()
        return
      }

      getOrderCommonPayChannels({
        payType: `${payType || 1}`, // 使用传入的支付方式，默认为线上支付
        memberId: `${billInfo?.memberId}`, // 使用收款人信息
        roleId: `${billInfo?.memberRoleId}`, // 使用收款人信息
      })
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data
              ? res.data.map((item) => ({
                  label: item.payChannelName,
                  value: item.payChannel,
                }))
              : []
            resolve(options)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const handleRepaymentSubmit = (values) => {
    // 验证通联支付时还款金额不能大于100000
    if (values.tradeType === 6 && +values.repayQuota > 100000) {
      message.error('通联支付时还款金额不能大于100000元')
      return
    }

    if (values.tradeType === 6) {
      const tradeChannel = values.tradeChannel

      if (tradeChannel === 11) {
        setRepayAmount(values.repayQuota)
        setCurrent(4)
        setPayStep(1)
        setQrLoading(true)
        mobilePayFlag.current = 4
        handleSubmitPay(11, values.tradeType, values)
      } else if (tradeChannel === 12) {
        setRepayAmount(values.repayQuota)
        setCurrent(6)
        setPayStep(1)
        setQrLoading(true)
        mobilePayFlag.current = 6
        handleSubmitPay(12, values.tradeType, values)
      } else if (tradeChannel === 15) {
        setRepayAmount(values.repayQuota)
        setTonglianPayVisible(true)
        setCurrent(99)
        setPayStep(1)
        setIsSpin(true)
        mobilePayFlag.current = 0

        const params = {
          billId: +billId,
          ...values,
        }
        postPayCreditApplyCreditRepay(params, { ctlType: 'none' }).then((res) => {
          if (res.code === 1000) {
            const tradeCode = res.data.tradeCode || res.data.recordId
            setTradeNo(String(tradeCode))
          }
        })

        // 查询余额
        getPayEAccountAllInPayGetUserBalance({}, { ctlType: 'none' }).then((res) => {
          if (res.code === 1000) {
            setBalanceInfo(res.data.availableAmount)
          }
          setIsSpin(false)
        })

        // 查询e账户手机尾号
        getPayEAccountAllInPayGetAccountDetail({}, { ctlType: 'none' }).then((res) => {
          if (res.code === 1000) {
            setPhoneEndNumber(res.data.phone)
          }
        })
      } else {
        message.error('请选择支付渠道')
        return
      }
      return
    }

    if (onSubmit) {
      onSubmit(values)
    }
  }

  // 处理通联支付确认
  const handleTonglianConfirm = () => {
    if (current === 99) {
      // 通联余额支付确认
      if (repayAmount <= balanceInfo) {
        // 检查验证码
        if (!verificationCode) {
          message.error('请输入验证码')
          return
        }

        // 调用支付确认接口
        if (!tradeNo) {
          message.error('交易号不存在')
          return
        }

        postPayEAccountAllInPayConfirmPay({
          verificationCode: verificationCode,
          tradeCode: tradeNo, // 使用交易号
        }).then((res) => {
          if (res.code === 1000) {
            if (res.data?.payStatus === 'success') {
              message.success('支付成功')
              setTimeout(() => {
                // 先触发父组件刷新数据
                if (onSubmit) {
                  onSubmit({ refresh: true })
                }
                // 然后关闭弹窗和清理状态
                handleTonglianCancel()
                onCancel()
              }, 1000)
            } else {
              // 支付失败，显示失败信息
              const failMessage = res.data?.payFailMessage || '支付失败'
              message.error(failMessage)
            }
          } else {
            message.error(res.message || '支付失败')
          }
        })
      } else {
        message.error('余额不足')
      }
    }
  }

  // 处理支付密码确认
  const handlePasswordConfirm = () => {
    formCode.validateFields().then((values) => {
      const { payPassword } = values
      if (!payPassword) {
        message.error('请输入支付密码')
        return
      }

      // 提交支付确认
      postPayEAccountAllInPayConfirmPay({
        payPassword: encryptedByAES(payPassword),
        // 其他必要参数
      }).then((res) => {
        if (res.code === 1000) {
          message.success('支付成功')
          handleTonglianCancel()
          onCancel()
        } else {
          message.error(res.message || '支付失败')
        }
      })
    })
  }

  // 处理通联支付取消
  const handleTonglianCancel = () => {
    // 停止轮询
    stopPollPayResult()

    setTonglianPayVisible(false)
    setCurrent(0)
    setPayStep(0)
    setQrLoading(false)
    setQrCodeInfo({ generateCharacter: '', qrUrl: '' })
    setQrCodeIframe('')
    setIsSpin(false)
    setBalanceInfo(undefined)
    setPhoneEndNumber('')
    setTradeNo(undefined)
    setRepayAmount(0)
    setVerificationCode('')
    mobilePayFlag.current = 0
  }

  // 处理返回
  const handleBack = () => {
    setPayStep(0)
    setCurrent(0)
  }

  // 发送验证码
  const handleSendSMS = () => {
    getPayEAccountAllInPayReSendPayCode().then((res) => {
      if (res.code === 1000) {
        message.success('验证码已发送')
        start()
      } else {
        message.error(res.message || '发送失败')
      }
    })
  }

  // 渲染通联支付模态框底部
  const renderTonglianModalFooter = () => {
    if (payStep === 1) {
      return (
        <div>
          <Button onClick={handleTonglianCancel}>取消</Button>
          {current === 99 && (
            <Button
              type="primary"
              onClick={handleTonglianConfirm}
              disabled={repayAmount > balanceInfo || !verificationCode}
            >
              确认支付
            </Button>
          )}
        </div>
      )
    } else if (payStep === 2) {
      return (
        <div>
          <Button onClick={handleBack}>返回</Button>
          <Button type="primary" onClick={handlePasswordConfirm}>
            确认
          </Button>
        </div>
      )
    }
    return null
  }

  return (
    <>
      <Modal
        title={intl.formatMessage({
          id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.title',
        })}
        width={576}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={() => repaymentFormActions.submit()}
        onCancel={onCancel}
        className={styles.modal}
        destroyOnClose
      >
        <NiceForm
          previewPlaceholder=""
          effects={($, actions) => {
            const { setFieldState, setFieldValue } = actions

            onFormInit$().subscribe(() => {
              // 初始化数据
              if (!billInfo) return

              setFieldState('repayQuota', (fileState) => {
                fileState.value = billInfo.residueRepayQuota

                fileState.rules = fileState.rules.concat({
                  validator(value) {
                    return +value > billInfo.residueRepayQuota
                      ? intl.formatMessage({
                          id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.validator',
                        })
                      : ''
                  },
                })
              })
              setFieldState('amountSlide', (fileState) => {
                fileState.value = billInfo.residueRepayQuota
                fileState.props['x-component-props'].max = billInfo.residueRepayQuota
                fileState.props['x-component-props'].marks = {
                  0: {
                    label: 0,
                  },
                  [billInfo.residueRepayQuota]: {
                    label: billInfo.residueRepayQuota,
                  },
                }
              })
            })

            createEffects($, actions, billInfo)
            // 移除useAsyncSelect，改为在effects中处理初始化和动态更新
          }}
          expressionScope={{}}
          actions={repaymentFormActions}
          schema={repaymentModalSchema}
          onSubmit={handleRepaymentSubmit}
        />
      </Modal>

      {/* 通联支付模态框 */}
      <Modal
        title="支付"
        visible={tonglianPayVisible}
        onCancel={handleTonglianCancel}
        footer={renderTonglianModalFooter()}
        width={576}
        destroyOnClose
      >
        <Spin spinning={isSpin}>
          {payStep === 1 && (
            <div>
              {current === 4 && (
                <div style={{ textAlign: 'center' }}>
                  {qrLoading ? (
                    <div>正在生成二维码...</div>
                  ) : (
                    <div>
                      {qrCodeInfo.qrUrl && (
                        <img src={qrCodeInfo.qrUrl} alt="微信支付二维码" style={{ width: 200, height: 200 }} />
                      )}
                      <div style={{ marginTop: 16 }}>
                        <p>请使用微信扫描二维码完成支付</p>
                        <p>支付金额：¥{repayAmount}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {current === 6 && (
                <div style={{ textAlign: 'center' }}>
                  {qrLoading ? (
                    <div>正在生成二维码...</div>
                  ) : (
                    <div>
                      {qrCodeInfo.qrUrl && (
                        <img src={qrCodeInfo.qrUrl} alt="支付宝支付二维码" style={{ width: 200, height: 200 }} />
                      )}
                      <div style={{ marginTop: 16 }}>
                        <p>请使用支付宝扫描二维码完成支付</p>
                        <p>支付金额：¥{repayAmount}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {current === 99 && (
                <div>
                  <p style={{ marginBottom: 12 }}>
                    <span style={{ display: 'inline-block', width: 122, fontWeight: 400 }}>账户可用余额：</span>
                    <span style={{ fontSize: 24, fontWeight: 500, color: '#172B4D' }}>¥{balanceInfo}</span>
                  </p>
                  <p style={{ marginBottom: 12 }}>
                    <span style={{ display: 'inline-block', width: 122, fontWeight: 400 }}>本次需支付：</span>
                    <span style={{ fontSize: 16, color: '#E63F3B' }}>¥{repayAmount}</span>
                  </p>

                  {repayAmount > balanceInfo ? (
                    <div style={{ color: '#ff4d4f', marginBottom: 16 }}>余额不足，请选择其他支付方式</div>
                  ) : (
                    /* 验证码输入框 - 只在余额充足时显示 */
                    <div style={{ marginTop: 24 }}>
                      <p style={{ fontSize: 14, fontWeight: 400, color: '#6B778C', marginBottom: 16 }}>
                        请输入手机验证码
                      </p>
                      <Input
                        placeholder="请输入验证码"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        style={{ width: 200 }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {payStep === 2 && (
            <div>
              <h3>输入支付密码</h3>
              <Form form={formCode}>
                <Form.Item name="payPassword" label="支付密码" rules={[{ required: true, message: '请输入支付密码' }]}>
                  <Input.Password placeholder="请输入支付密码" />
                </Form.Item>
              </Form>
            </div>
          )}

          {payStep === 3 && (
            <div>
              <h3>输入手机验证码</h3>
              <div style={{ marginBottom: 16 }}>
                <p>手机尾号：{phoneEndNumber}</p>
                <p>支付金额：¥{repayAmount}</p>
                <p>当前步骤：{payStep}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Input
                  placeholder="请输入验证码"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  style={{ flex: 1 }}
                  maxLength={6}
                />
                <Button onClick={handleSendSMS} disabled={count > 0}>
                  {count > 0 ? `${count}s` : '发送验证码'}
                </Button>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    </>
  )
}

export default RefundModal

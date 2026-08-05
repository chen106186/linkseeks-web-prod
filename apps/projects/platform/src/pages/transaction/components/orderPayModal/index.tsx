import React, { useState, useEffect, useContext, useRef } from 'react'
import { Modal, Steps, Row, Col, Spin, message, Upload, Button, Input, Form } from 'antd'
import style from './index.less'
import { OrderDetailContext } from '../../_public/order/context'
import cx from 'classnames'
import { ScanOutlined, UploadOutlined } from '@ant-design/icons'
import { UPLOAD_TYPE } from '@/constants'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { encryptedByAES } from '@linkseeks/crypto'
import QRCode from 'qrcode'
import { getOrderBuyerValidatePayResult, postOrderBuyerValidatePay } from '@apps/apis'
import { getSettlementCommonCorporateAccountDetail } from '@apps/apis'
import {
  getPayAssetAccountBalance,
  getPayCreditGetCredit,
  getPayEAccountAllInPayGetAccountDetail,
  getPayEAccountAllInPayGetUserBalance,
  getPayEAccountAllInPayReSendPayCode,
  postPayEAccountAllInPayConfirmPay,
} from '@apps/apis'
import useCountDown from '@/utils/hooks'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
export interface OrderPayModalProps {
  currentRef: any
  confirm?: () => any
}

const HeaderTitle = ({ current }) => {
  return (
    <div style={{ padding: '0 40px' }}>
      <Steps size="small" current={current}>
        <Steps.Step title={intl.formatMessage({ id: 'transaction_components.xuanzezhifufangshi' })} />
        <Steps.Step title={intl.formatMessage({ id: 'transaction_components.jinhangzhifu' })} />
      </Steps>
    </div>
  )
}

let timeChange // Tiemr

const OrderPayModal: React.FC<OrderPayModalProps> = (props) => {
  const formRef = useRef<any>({})
  const { id } = usePageStatus()
  const {
    formContext: { data, payList, currentPayInfoId },
  } = useContext(OrderDetailContext)
  const [formCode] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState<any>({})
  const [current, setCurrent] = useState(0) // 0选择方式 1线下支付方式 2授信支付 3余额支付 4微信支付(通联微信) 5货到付款 6支付宝(通联支付宝) 9账期 8月结 99通联 100建行 1000清除
  const [tonglian, setTonglian] = useState<boolean>(false) // 是否通联标识
  const [payStep, setPayStep] = useState(0) // 支付模态框的步骤 0选方式 1下一步的具体操作 2输入支付密码 3验证码确认支付
  const mobilePayFlag = useRef(0) // 用于判断移动支付类型 4微信6支付宝
  const [qrLoading, setQrLoading] = useState(false)
  const [code, setCode] = useState('')
  const [qrCodeInfo, setQrCodeInfo] = useState({ generateCharacter: '', qrUrl: '' }) // 微信qrcode
  const [qrCodeIframe, setQrCodeIframe] = useState('') // 支付宝iframe
  const [number] = useState([0, 1, 2, 3, 4, 5])
  const { currentRef, confirm } = props
  const [isSpin, setIsSpin] = useState<boolean>(false)
  const [creditInfo, setCreditInfo] = useState<any>()
  const [balanceInfo, setBalanceInfo] = useState<any>()
  const [currentPaymentInfo, setCurrentPaymentInfo] = useState<any>() // 当前支付信息
  const [blankAccountInfo, setBlankAccountInfo] = useState<any>()
  const { run, loading } = useHttpRequest(postOrderBuyerValidatePay)
  const [settleAccountsError, setSettleAccountsError] = useState<boolean>(true)
  const [paymentAmount, setPaymentAmount] = useState<string>()
  const [tradeNo, setTradeNo] = useState<string>() // 需要轮询支付结果的交易号
  const [fileLists, setFileLists] = useState<any>([])
  const [tradeCode, setTradeCode] = useState<string>('') // 交易号
  const [payResultVisible, setPayResultVisible] = useState<boolean>(false)
  const [phoneEndNumber, setPhoneEndNumber] = useState('')
  const [openTimer, setOpenTimer] = useState(0) // timer

  const pollPayResult = () => {
    if (qrCodeInfo.qrUrl || qrCodeIframe) {
      getOrderBuyerValidatePayResult({
        orderId: id,
        batchNo: currentPaymentInfo.batchNo,
        tradeNo,
      } as any).then((res) => {
        const _code = res.code
        const _data = res.data
        if (_code === 1000) {
          if (_data && _data.paySuccess) {
            setOpenTimer(0)
            message.success(intl.formatMessage({ id: 'transaction_components.zhifuchenggong' }))
            setTimeout(() => {
              history.goBack()
            }, 1000)
          }
        }
        // else {
        //   message.error(res.message)
        // }
      })
    }
  }

  const runTimerJump = () => {
    timeChange = setInterval(() => pollPayResult(), 3000)
  }

  const generateQrCode = () => {
    // 微信 生成二维码
    if (mobilePayFlag.current === 4) {
      QRCode.toDataURL(qrCodeInfo.generateCharacter)
        .then((url: any) => {
          setQrCodeInfo({ ...qrCodeInfo, qrUrl: url })
          // 轮询支付结果
          setOpenTimer(1)
        })
        .catch((err: any) => {
          console.error(err)
        })
    } else if (mobilePayFlag.current === 6) {
      // 支付宝 生成iframe 【通联支付宝 走原有微信生成二维码模式 标识为tonglian】
      if (tonglian) {
        QRCode.toDataURL(qrCodeInfo.generateCharacter)
          .then((url: any) => {
            setQrCodeInfo({ ...qrCodeInfo, qrUrl: url })
            // 轮询支付结果
            setOpenTimer(1)
          })
          .catch((err: any) => {
            console.error(err)
          })
      } else {
        setQrCodeIframe(qrCodeInfo.generateCharacter)
        // 轮询支付结果
        setOpenTimer(1)
      }
    }
    // 轮询支付结果
    // setOpenTimer(1)
  }

  const handleSubmitPay = async () => {
    const vouchers = formRef.current.urlList
    // 当前选中的支付信息
    const payInfoObj = data.payments.filter((item) => item.paymentId === Number(currentPayInfoId))[0]
    const params: any = {
      orderId: Number(id),
      batchNo: payInfoObj.batchNo,
      paymentInformationId: payInfoObj.id,
      payType: checked.payType,
      payChannel: checked.id,
      fundMode: checked.fundMode,
    }
    if (payStep === 2) {
      if (code.length != number.length) {
        return message.error(intl.formatMessage({ id: 'transaction_components.qingshuruzhifumima' }))
      }
      params.payPassword = encryptedByAES(code)
    } else if (current === 1) {
      params.vouchers = vouchers
    }

    if (!settleAccountsError) {
      return message.error(intl.formatMessage({ id: 'transaction_components.qingxianwanchengduigongzhanghu' }))
    }

    const res = await run(
      params,
      mobilePayFlag.current === 4 || mobilePayFlag.current === 6 ? { ctlType: 'message' } : null,
    )
    if (res.code === 1000) {
      if (mobilePayFlag.current === 4 || mobilePayFlag.current === 6) {
        // 微信 支付宝
        setQrCodeInfo({ ...qrCodeInfo, generateCharacter: res.data.codeUrl })
        setTradeNo(res.data.tradeNo)
        setQrLoading(false)
      } else if (tonglian && (checked.id === 15 || checked.id === 13)) {
        // 快捷/余额走验证码模式
        console.log(current, checked, '通联验证码')
        setPayStep(3)
        setTradeCode(res.data.tradeNo)
        setCurrent(1000)
        start()
      } else if (tonglian && checked.id === 14) {
        console.log(current, checked, '通联快捷跳转')
        setCurrent(1000)
        setVisible(false)
        setPayResultVisible(true)
        window.open(res.data.codeUrl, '_blank')
      } else if (checked.id === 16) {
        console.log(current, checked, '建行b2b跳转')
        setCurrent(1000)
        setVisible(false)
        setPayResultVisible(true)
        window.open(res.data.codeUrl, '_blank')
      } else {
        history.goBack()
      }
    } else {
      setCode('')
      // 支付密码未设置
      if (res.code === 33334) {
        setTimeout(() => {
          history.push('/systemAbility/accountSetting/paycode')
        }, 1000)
      }
    }
  }

  const handleConfirm = () => {
    console.log(current, checked, 'confirm')
    const payPrice = data.payments.filter((item) => item.paymentId === Number(currentPayInfoId))[0].payAmount
    setPaymentAmount(payPrice)
    if (current === 0) {
      if (checked?.id) {
        if (checked.id === 5) {
          // 线下支付
          console.log(intl.formatMessage({ id: 'transaction_components.xuanzelexianxiazhixianshang' }))
          setTonglian(false)
          mobilePayFlag.current = 0
          setCurrent(1)
          setPayStep(1)
          // 获取对公账户信息
          getSettlementCommonCorporateAccountDetail({
            memberId: data.vendorMemberId,
            roleId: data.vendorRoleId,
            type: checked.fundMode,
          }).then((res) => {
            if (res.code === 1000) {
              setBlankAccountInfo(res.data)
              setSettleAccountsError(true)
            } else {
              setSettleAccountsError(false)
            }
          })
        } else if (checked.id === 6) {
          // 授信额度支付
          console.log(intl.formatMessage({ id: 'transaction_components.xuanzeleshouxinzhifu' }))
          setTonglian(false)
          mobilePayFlag.current = 0
          setIsSpin(true)
          getPayCreditGetCredit({
            parentMemberId: data.vendorMemberId,
            parentMemberRoleId: data.vendorRoleId,
          })
            .then((res) => {
              if (res.code === 1000) {
                setCreditInfo(res.data)
              } else {
                message.destroy()
                message.error(res.message)
              }
            })
            .finally(() => {
              setIsSpin(false)
            })
          setCurrent(2)
          setPayStep(1)
        } else if (checked.id === 4) {
          // 余额支付
          console.log(intl.formatMessage({ id: 'transaction_components.xuanzeleyuezhifu' }))
          setTonglian(false)
          mobilePayFlag.current = 0
          setIsSpin(true)
          getPayAssetAccountBalance({
            fundMode: checked.fundMode,
            vendorMemberId: data.vendorMemberId,
            vendorRoleId: data.vendorRoleId,
          })
            .then((res) => {
              if (res.code === 1000) {
                setBalanceInfo(res.data)
              } else {
                message.destroy()
                message.error(res.message)
              }
            })
            .finally(() => {
              setIsSpin(false)
            })
          setCurrent(3)
          setPayStep(1)
        } else if (checked.id === 7) {
          console.log(intl.formatMessage({ id: 'transaction_components.xuanzelehuodaofukuan' }))
          setTonglian(false)
          mobilePayFlag.current = 0
          setCurrent(5)
          setPayStep(1)
        } else if (checked.id === 2) {
          console.log(intl.formatMessage({ id: 'transaction_components.xuanzeleweixinzhifu' }))
          setTonglian(false)
          // 生成微信扫码支付
          mobilePayFlag.current = 4
          setCurrent(4)
          setPayStep(1)
          setQrLoading(true)
          handleSubmitPay()
        } else if (checked.id === 1) {
          console.log(intl.formatMessage({ id: 'transaction_components.xuanzelezhifubaozhifu' }))
          setTonglian(false)
          // 生成支付宝扫码支付
          mobilePayFlag.current = 6
          setCurrent(6)
          setPayStep(1)
          setQrLoading(true)
          handleSubmitPay()
        } else if (checked.id === 9) {
          console.log('选择了账期结算模式')
          setTonglian(false)
          mobilePayFlag.current = 0
          setCurrent(9)
          setPayStep(1)
        } else if (checked.id === 8) {
          console.log('选择了月结结算模式')
          setTonglian(false)
          mobilePayFlag.current = 0
          setCurrent(8)
          setPayStep(1)
        } else if (checked.id === 11) {
          console.log('选择了通联【微信】模式')
          setTonglian(true)
          mobilePayFlag.current = 4
          setCurrent(4)
          setPayStep(1)
          setQrLoading(true)
          handleSubmitPay()
        } else if (checked.id === 12) {
          console.log('选择了通联【支付宝】模式')
          setTonglian(true)
          setQrCodeIframe('')
          mobilePayFlag.current = 6
          setCurrent(6)
          setPayStep(1)
          setQrLoading(true)
          handleSubmitPay()
        } else if (checked.id === 13 || checked.id === 15) {
          console.log('选择了通联【快捷/余额】模式')
          setTonglian(true)
          mobilePayFlag.current = 0
          setIsSpin(true)
          if (checked.id === 15) {
            // 余额模式查阅余额
            getPayEAccountAllInPayGetUserBalance().then((res) => {
              if (res.code === 1000) {
                setBalanceInfo(res.data.availableAmount)
              }
              setIsSpin(false)
            })
          }
          // 查询e账户手机尾号
          getPayEAccountAllInPayGetAccountDetail().then((res) => {
            if (res.code === 1000) {
              setPhoneEndNumber(res.data.phone)
            }
          })
          setCurrent(99)
          setPayStep(1)
        } else if (checked.id === 14) {
          console.log('选择了通联【网银】模式')
          setTonglian(true)
          mobilePayFlag.current = 0
          setCurrent(99)
          setPayStep(1)
        } else if (checked.id === 16) {
          console.log('选择了建行【b2b】模式')
          setTonglian(false)
          mobilePayFlag.current = 0
          setCurrent(100)
          setPayStep(1)
        } else if (checked.id === 17) {
          console.log('选择了建行【数字人民币】模式')
          setTonglian(true)
          setQrCodeIframe('')
          mobilePayFlag.current = 6
          setCurrent(6)
          setPayStep(1)
          setQrLoading(true)
          handleSubmitPay()
        } else if (checked.id === 18) {
          console.log('选择了跨境电商模式')
          setTonglian(false)
          setQrCodeIframe('')
          mobilePayFlag.current = 0
          setCurrent(0)
          setPayStep(0)
          setQrLoading(false)
          handleSubmitPay()
        }
      } else {
        message.error(intl.formatMessage({ id: 'transaction_components.qingxianxuanzezhifufangshi' }))
      }
      return
    }

    // 开始提交线下支付数据
    if (current === 1) {
      const vouchers = formRef.current.urlList
      const checkedId = checked.id
      if (!vouchers || vouchers.length === 0 || vouchers.includes('')) {
        message.error(intl.formatMessage({ id: 'transaction_components.qingxianshangchuanpingzheng' }))
        return
      }
      if (!checkedId) {
        message.error(intl.formatMessage({ id: 'transaction_components.weixuanzezhifufangshi' }))
        return
      }
      handleSubmitPay()
    } else if (current === 2) {
      // 开始提交授信支付数据 (需要输入支付密码)
      if (payPrice <= creditInfo.canUseQuota) {
        setPayStep(2)
        setCurrent(1000)
      } else {
        message.error(intl.formatMessage({ id: 'transaction_components.nindeshouxinkeyongedu' }))
      }
    } else if (current === 3) {
      // 开始提交余额支付数据 (需要输入支付密码)
      if (payPrice <= balanceInfo) {
        setPayStep(2)
        setCurrent(1000)
      } else {
        message.error(intl.formatMessage({ id: 'transaction_components.nindezhanghuyuebuzu' }))
      }
    } else if (current === 5) {
      // 开始提交货到付款数据
      handleSubmitPay()
    } else if (current === 9) {
      // 开始提交账期结算数据
      handleSubmitPay()
    } else if (current === 8) {
      // 开始提交月结结算数据
      handleSubmitPay()
    } else if (current === 4 || current === 6) {
      // 微信 支付宝 提示扫码支付
      return message.info(intl.formatMessage({ id: 'transaction_components.qingsaomawanchengzhifu' }))
    } else if (current === 99) {
      // 提交通联支付
      handleSubmitPay()
    } else if (current === 100) {
      // 提交建行支付
      handleSubmitPay()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    confirm && confirm()
  }

  const handleCancel = () => {
    if (current === 0) {
      setVisible(false)
    } else {
      setCurrent(0)
      setPayStep(0)
      setOpenTimer(0)
    }
    setCode('')
    mobilePayFlag.current = 0
  }

  const handleUploadChange = (e) => {
    const { file, fileList } = e

    if (file.status === 'done') {
      if (file.response && file.response.code !== 1000) {
        message.error(file.response.message)
        const newList = [...fileLists]
        newList.pop()
        setFileLists(newList)
        return
      }
    }
    const urlList = fileList.map((v) => (v.response && v.response.code === 1000 ? v.response.data : ''))
    formRef.current.urlList = urlList
    setFileLists(() => {
      return fileList.map((v: any) => {
        if (v.response) {
          v.url = v.response.data
        }
        return v
      })
    })
  }

  const handleBack = () => {
    setCurrent(0)
    setPayStep(0)
    setOpenTimer(0)
  }

  const onChange = (e) => {
    const v = e.target.value.replace(/\D/g, '')
    setCode(v)
  }

  const { text, isActive, start } = useCountDown({
    maxTime: 60,
    minTime: 0,
    initText: intl.formatMessage({
      id: 'payandSettle.eAccountApprove.components.personal.initText',
    }),
    onEnd: () => {
      console.log('end')
    },
    decayRate: 1,
    delay: 1 * 1000,
  })

  const handleSendSMS = () => {
    // 发送验证码
    getPayEAccountAllInPayReSendPayCode({ tradeCode }).then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res.code === 1000 && start()
    })
  }

  const handleConfirmAllPay = () => {
    formCode.submit()
  }

  const submitFormCode = async (values) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { code } = await postPayEAccountAllInPayConfirmPay({ ...values, tradeCode })
    if (code === 1000) {
      setVisible(false)
      history.goBack()
    }
  }

  const renderModalFooter = () => {
    let footer = null
    if (current) {
      if (payStep === 1) {
        footer = [
          <Button key="back" onClick={handleBack}>
            {intl.formatMessage({ id: 'transaction_components.shangyibu' })}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleConfirm}>
            {intl.formatMessage({ id: 'transaction_components.queren' })}
          </Button>,
        ]
      } else if (payStep === 2) {
        footer = [
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmitPay} style={{ width: '100%' }}>
            {intl.formatMessage({ id: 'transaction_components.querenzhifu' })}
          </Button>,
        ]
      } else if (payStep === 3) {
        footer = [
          <Button key="submit" type="primary" loading={loading} onClick={handleConfirmAllPay} style={{ width: '100%' }}>
            {intl.formatMessage({ id: 'transaction_components.querenzhifu' })}
          </Button>,
        ]
      }
    } else {
      footer = [
        <Button key="back" onClick={handleCancel}>
          {intl.formatMessage({ id: 'transaction_components.quxiao' })}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleConfirm}>
          {intl.formatMessage({ id: 'transaction_components.xiayibu' })}
        </Button>,
      ]
    }
    return footer
  }

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        visible,
        setVisible,
      }
    }
  }, [])

  useEffect(() => {
    if (openTimer === 1) runTimerJump()
    else clearInterval(timeChange)
  }, [openTimer])

  useEffect(() => {
    if (!visible) {
      setCurrent(0)
      setPayStep(0)
      setChecked(null)
    } else {
      if (data?.payments?.length) {
        const currentPayment = data.payments.filter((item) => item.paymentId === currentPayInfoId)[0]
        setCurrentPaymentInfo(currentPayment)
      }
    }
  }, [visible])

  useEffect(() => {
    if (qrCodeInfo.generateCharacter) {
      generateQrCode()
    }
  }, [qrCodeInfo.generateCharacter])

  return (
    <>
      <Modal
        width={704}
        title={<HeaderTitle current={current} />}
        visible={visible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        footer={renderModalFooter()}
        destroyOnClose={true}
        maskClosable={false}
      >
        {current === 0 &&
          payList &&
          payList.map((item, index) => (
            <Row key={index} style={{ marginBottom: 24 }}>
              <Col span={6} style={{ color: '#909399', fontSize: 12 }}>
                {item.payTypeName}
              </Col>
              <Col style={{ flex: 1 }}>
                <div className={style.radioBox}>
                  {(item.payChannels as any[]).map((v) => (
                    <div
                      key={v.payChannel}
                      className={cx(style.payRadio, checked && v.payChannel === checked.id ? style.active : '')}
                      onClick={() =>
                        setChecked({
                          id: v.payChannel,
                          channel: v.payChannelName,
                          payType: item.payType,
                          payTypeName: item.payTypeName,
                          fundMode: item.fundMode,
                        })
                      }
                    >
                      {v.payChannelName}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          ))}
        {/* 线下支付线上确认 */}
        {current === 1 && (
          <div>
            <p>
              {intl.formatMessage({ id: 'transaction_components.zhanghaomingcheng' })}：{blankAccountInfo?.name}
            </p>
            <p>
              {intl.formatMessage({ id: 'transaction_components.yinhangzhanghao' })}：{blankAccountInfo?.bankAccount}
            </p>
            <p>
              {intl.formatMessage({ id: 'transaction_components.kaihuhang' })}：{blankAccountInfo?.bankDeposit}
            </p>
            <p style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'transaction_components.shangchuanzhifupingzheng' })}
            </p>
            <Upload
              name="file"
              action="/api/support/file/upload"
              headers={{
                authorization: 'authorization-text',
              }}
              data={{
                fileType: UPLOAD_TYPE,
              }}
              onChange={handleUploadChange}
              showUploadList
              fileList={fileLists}
            >
              <Button icon={<UploadOutlined />} type="dashed">
                {intl.formatMessage({ id: 'transaction_components.shangchuanpingzheng' })}
              </Button>
            </Upload>
          </div>
        )}
        {/* 授信支付 */}
        {current === 2 && (
          <Spin spinning={isSpin}>
            <p style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'transaction_components.shouxinedu' })}</p>
            <p>
              <span className={style.title}>
                {intl.formatMessage({ id: 'transaction_components.keyongshouxineduyuan' })}：
              </span>
              <span className={style.amount}>{creditInfo?.canUseQuota?.toFixed(2)}</span>
            </p>
            <p>
              <span className={style.title}>
                {intl.formatMessage({ id: 'transaction_components.zongshouxineduyuan' })}：
              </span>
              <span className={cx(style.amount, style.amount1)}>{creditInfo?.quota?.toFixed(2)}</span>
            </p>
            <p>
              <span className={style.title}>
                {intl.formatMessage({ id: 'transaction_components.yiyongshouxineduyuan' })}：
              </span>
              <span className={cx(style.amount, style.amount1)}>{creditInfo?.useQuota?.toFixed(2)}</span>
            </p>
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.resource.order.bencixuzhifu'))}：
              </span>
              <span className={cx(style.amount, style.amount2)}>{Number(paymentAmount).toFixed(2)}</span>
            </p>
          </Spin>
        )}
        {/* 余额支付 */}
        {current === 3 && (
          <Spin spinning={isSpin}>
            <p style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'transaction_components.zhanghuyue' })}</p>
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.common.zhanghukeyongyue'))}：
              </span>
              <span className={style.amount}>{balanceInfo?.toFixed(2)}</span>
            </p>
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.resource.order.bencixuzhifu'))}：
              </span>
              <span className={cx(style.amount, style.amount2)}>{Number(paymentAmount).toFixed(2)}</span>
            </p>
          </Spin>
        )}
        {/* 货到付款 */}
        {current === 5 && (
          <div>
            <p style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'transaction_components.huodaofukuanzhifuqueren' })}
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifufangshi' })}：</span>
              <span className={style.amount}>{intl.formatMessage({ id: 'transaction_components.huodaofukuan' })}</span>
            </p>
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.resource.payment.zhifujine'))}：
              </span>
              <span className={cx(style.amount, style.amount2)}>{Number(paymentAmount).toFixed(2)}</span>
            </p>
          </div>
        )}
        {/* 微信扫码支付 */}
        {current === 4 && (
          <div>
            <Spin spinning={qrLoading}>
              <div className={style.qrCodeImage}>
                {qrCodeInfo.qrUrl && (
                  <>
                    <img src={qrCodeInfo.qrUrl} alt={intl.formatMessage({ id: 'transaction_components.saomazhifu' })} />
                    <div className={style.scanTips}>
                      <ScanOutlined className={style.scanIcon} />
                      <span>
                        {intl.formatMessage({ id: 'transaction_components.dakai' })}{' '}
                        {mobilePayFlag.current === 4
                          ? intl.formatMessage({ id: 'transaction_components.weixin' })
                          : intl.formatMessage({ id: 'transaction_components.zhifubao' })}
                        App
                        <br />
                        {intl.formatMessage({ id: 'transaction_components.saomawanchengzhifu' })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Spin>
          </div>
        )}
        {/* 支付宝模式 */}
        {current === 6 && (
          <div>
            <Spin spinning={qrLoading}>
              <div className={style.qrCodeAlipayImage}>
                <div style={{ width: 600, height: 300, margin: '0 auto' }}>
                  {
                    // 原支付宝
                    qrCodeIframe && (
                      <>
                        <iframe id="alipayIframe" srcDoc={qrCodeIframe} width={600} height={300} frameBorder={0} />
                      </>
                    )
                  }
                  {
                    // 通联支付宝
                    tonglian && checked.id === 12 && (
                      <>
                        <img
                          src={qrCodeInfo.qrUrl}
                          alt={intl.formatMessage({ id: 'transaction_components.saomazhifu' })}
                        />
                        <div className={style.scanTips}>
                          <ScanOutlined className={style.scanIcon} />
                          <span>
                            {intl.formatMessage({ id: 'transaction_components.dakai' })}{' '}
                            {intl.formatMessage({ id: 'transaction_components.zhifubao' })}App
                            <br />
                            {intl.formatMessage({
                              id: 'transaction_components.saomawanchengzhifu',
                            })}
                          </span>
                        </div>
                      </>
                    )
                  }
                  {
                    // 建行 数字人民币
                    tonglian && checked.id === 17 && (
                      <>
                        <img
                          src={qrCodeInfo.qrUrl}
                          alt={intl.formatMessage({ id: 'transaction_components.saomazhifu' })}
                        />
                        <div className={style.scanTips}>
                          <ScanOutlined className={style.scanIcon} />
                          <span>
                            {intl.formatMessage({ id: 'transaction_components.dakai' })}{' '}
                            {intl.formatMessage({ id: 'transaction_components.jianhang' })}App
                            <br />
                            {intl.formatMessage({
                              id: 'transaction_components.saomawanchengzhifu',
                            })}
                          </span>
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </Spin>
          </div>
        )}
        {/* 输入支付密码 payStep===2 */}
        {payStep === 2 && (
          <div className={style.payContainer}>
            <p className={style.title}>{intl.formatMessage({ id: 'transaction_components.qingshuruzhifumima' })}</p>
            <div className={style.inputBox}>
              {number.map((item, index) => (
                <div className={style.codeItem} key={index}>
                  {code[index]?.replace(/[0-9]/g, '·')}
                </div>
              ))}
              <Input.Password
                className={style.codeInput}
                value={code}
                maxLength={number.length}
                onChange={onChange}
                visibilityToggle={false}
                readOnly={true}
                autoComplete="new-password"
                onFocus={(e) => e.target.removeAttribute('readonly')}
                onBlur={(e) => e.target.setAttribute('readonly', 'true')}
              />
            </div>
          </div>
        )}
        {/* 账期结算 */}
        {current === 9 && (
          <div>
            <p style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'transaction_components.zhangqizhifuqueren' })}
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifufangshi' })}：</span>
              <span className={style.amount}>{intl.formatMessage({ id: 'transaction_components.zhangqi' })}</span>
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifuqudao' })}：</span>
              <span className={style.amount}>{checked?.channel}</span>
            </p>
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.resource.payment.zhifujine'))}：
              </span>
              <span className={cx(style.amount, style.amount2)}>{Number(paymentAmount).toFixed(2)}</span>
            </p>
          </div>
        )}
        {/* 月结结算 */}
        {current === 8 && (
          <div>
            <p style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'transaction_components.yuejiezhifuqueren' })}
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifufangshi' })}：</span>
              <span className={style.amount}>{intl.formatMessage({ id: 'transaction_components.yuejie' })}</span>
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifuqudao' })}：</span>
              <span className={style.amount}>{checked?.channel}</span>
            </p>
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.resource.payment.zhifujine'))}：
              </span>
              <span className={cx(style.amount, style.amount2)}>{Number(paymentAmount).toFixed(2)}</span>
            </p>
          </div>
        )}
        {/* 通联（快捷/网银/余额）*/}
        {current === 99 && (
          <div>
            <p style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'transaction_components.liantongzhifuqueren' })}
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifufangshi' })}：</span>
              <span className={style.amount}>{intl.formatMessage({ id: 'transaction_components.liantongzhifu' })}</span>
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifuqudao' })}：</span>
              <span className={style.amount}>{checked?.channel}</span>
            </p>
            {checked.id === 15 && (
              <p>
                <span className={style.title}>
                  {translate.formatCurrencyWith(translate('web.common.zhanghukeyongyue'))}：
                </span>
                <span className={style.amount}>{balanceInfo?.toFixed(2)}</span>
              </p>
            )}
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.resource.payment.zhifujine'))}：
              </span>
              <span className={cx(style.amount, style.amount2)}>{Number(paymentAmount).toFixed(2)}</span>
            </p>
          </div>
        )}
        {/* 通联验证码 确认支付 payStep===3 */}
        {payStep === 3 && (
          <div className={style.payContainer}>
            <Form
              name="approve-form-Code"
              colon={false}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              form={formCode}
              onFinish={submitFormCode}
            >
              <Form.Item
                label={intl.formatMessage({ id: 'transaction_components.yanzhengma' })}
                extra={
                  phoneEndNumber
                    ? `${intl.formatMessage({
                        id: 'transaction_components.yifasongweihaozhi',
                      })}${phoneEndNumber.substr(7, 4)}${intl.formatMessage({
                        id: 'transaction_components.deshoujihao',
                      })}`
                    : ''
                }
                style={{ textAlign: 'left' }}
              >
                <Row gutter={8}>
                  <Col span={19}>
                    <Form.Item
                      name="verificationCode"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'payandSettle.eAccountApprove.components.company.mellowCard.2.captcha.message',
                          }),
                        },
                      ]}
                    >
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'payandSettle.eAccountApprove.components.company.mellowCard.2.captcha.placeholder',
                        })}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Button disabled={isActive} onClick={handleSendSMS}>
                      {text}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </div>
        )}
        {/* 建行 B2B支付 */}
        {current === 100 && (
          <div>
            <p style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'transaction_components.jianhangzhifuqueren' })}
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifufangshi' })}：</span>
              <span className={style.amount}>{intl.formatMessage({ id: 'transaction_components.jianhangzhifu' })}</span>
            </p>
            <p>
              <span className={style.title}>{intl.formatMessage({ id: 'transaction_components.zhifuqudao' })}：</span>
              <span className={style.amount}>{checked?.channel}</span>
            </p>
            <p>
              <span className={style.title}>
                {translate.formatCurrencyWith(translate('web.resource.payment.zhifujine'))}：
              </span>
              <span className={cx(style.amount, style.amount2)}>{Number(paymentAmount).toFixed(2)}</span>
            </p>
          </div>
        )}
      </Modal>
      <Modal
        title={intl.formatMessage({ id: 'transaction_components.zhifu' })}
        visible={payResultVisible}
        onOk={() => {
          history.goBack()
          setPayResultVisible(false)
        }}
        onCancel={() => setPayResultVisible(false)}
        okText={intl.formatMessage({ id: 'transaction_components.yiwanchengzhifu' })}
        cancelText={intl.formatMessage({ id: 'transaction_components.weiwanchengzhifu' })}
      >
        <p>{intl.formatMessage({ id: 'transaction_components.fukuanqianqingbuyaoguanbi' })}</p>
      </Modal>
    </>
  )
}

OrderPayModal.defaultProps = {}

export default OrderPayModal

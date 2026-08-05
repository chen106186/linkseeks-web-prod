import React, { useState, useEffect } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Result, Button, Form, Input, Row, Col, Alert, Spin, Card, message } from 'antd'
import styles from '../index.less'
import selfStyles from './index.less'
import { AlipaySquareFilled, CheckCircleFilled } from '@ant-design/icons'
import QRCode, { QRCodeToDataURLOptions } from 'qrcode'
import {
  postContractSignatureAuthFaceVerify,
  postContractSignatureAuthLegalRepSignVerify,
  postContractSignatureAuthMobileVerify,
  postContractSignatureAuthMobileVerifyCode,
  postContractSignatureAuthPaymentVerify,
  postContractSignatureAuthPaymentVerifyAmount,
  postContractSignatureAuthReversePayment,
  postContractSignatureAuthReversePaymentProcess,
  getContractSignatureAuthCheckVerifyStatus,
} from '@apps/apis'

interface queryProps {
  payWay: number
  authType: number
  authTypeFn: Function
  data: any
  currentRef?: any
}
const intl = getIntl()
const PublicAccount: React.FC<queryProps> = (props) => {
  const { payWay, authType, authTypeFn, data, currentRef } = props
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [qrCode, setQrCode] = useState<string>('')
  const [paymentVerify, setPaymentVerify] = useState<number>(0) // 0.确认对公银行账号与开户银行 1.输入对公银行账号收到的转账金额
  const [query, setQuery] = useState<any>({})

  useEffect(() => {
    let timer
    if (payWay === 1 && authType !== 2) {
      const options: QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'L',
        margin: 1,
        width: 240,
        height: 240,
        scal: 177,
        color: {
          dark: '#000', // 二维码背景颜色
          // light: '#000' // 二维码前景颜色
        },
        rendererOpts: {
          quality: 0.9,
        },
      }
      postContractSignatureAuthFaceVerify({
        signatureAuthLogId: Number(sessionStorage.getItem('signatureAuthLogId')),
      }).then((res) => {
        QRCode.toDataURL(res.data.authUrl, options)
          .then((url: any) => {
            setQrCode(url)
            console.log(res.data.authUrl)
          })
          .catch((err: any) => {
            console.error(err)
          })
      })
      timer = setInterval(() => {
        getContractSignatureAuthCheckVerifyStatus().then((res) => {
          if (res.code === 1000) {
            if (res.data.success) {
              clearInterval(timer)
              timer = null
              message.success(intl.formatMessage({ id: 'contract.publicAccount.mes.1' }))
              history.goBack()
            }
          }
        })
      }, 3000)
    }
    if (payWay === 2) {
      postContractSignatureAuthReversePayment({
        signatureAuthLogId: Number(sessionStorage.getItem('signatureAuthLogId')),
      }).then((res) => {
        message.destroy()
        if (res.code === 1000) {
          setQuery(res.data)
        }
      })
    }
    console.log(authType, payWay)
    return () => {
      clearInterval(timer)
      timer = null
    }
  }, [])

  useEffect(() => {
    currentRef.current = {
      paymentVerifyFn: paymentVerifyFn,
      paymentVerifyAmountFn: paymentVerifyAmountFn,
      mobileVerifyFn: mobileVerifyFn,
      paymentVerify: paymentVerify,
    }
  })

  /**发起对公打款验证 */
  // const paymentVerifyFn = () => {
  //   delete query.orgName;
  //   postContractSignatureAuthPaymentVerify(query).then(res => {
  //     if (res.code === 1000) {
  //       setPaymentVerify(1)
  //     }
  //   })
  // }

  const paymentVerifyFn = () => {
    postContractSignatureAuthReversePaymentProcess({
      signatureAuthLogId: Number(sessionStorage.getItem('signatureAuthLogId')),
    }).then((res) => {
      if (res.code === 1000) {
        history.goBack()
      }
    })
  }

  /**对公银行账号收到的转账金额 */
  const paymentVerifyAmountFn = async () => {
    const value = await form.validateFields()
    if (value) {
      const parmas = {
        signatureAuthLogId: Number(sessionStorage.getItem('signatureAuthLogId')),
        amount: value.amount,
      }
      postContractSignatureAuthPaymentVerifyAmount(parmas).then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
    }
  }

  /**发起授权签署实名认证 */
  const mobileVerifyFn = () => {
    const parmas = {
      signatureAuthLogId: Number(sessionStorage.getItem('signatureAuthLogId')),
      legalRepMobile: data.legalRepMobile,
      agentName: data.transactorName,
      agentIdNo: data.transactorIdNumber,
    }
    postContractSignatureAuthLegalRepSignVerify(parmas).then((res) => {
      if (res.code === 1000) {
        setVisible(true)
        console.log('发送成功')
      }
    })
  }

  // 获取验证码，并且倒计时60s
  let time = 60
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [btnContent, setBtnContent] = useState(intl.formatMessage({ id: 'contract.huoquyanzhengma' }))
  // 倒计时fn
  const hanleCountdown = () => {
    if (time > 0 && time <= 60) {
      time -= 1
      setBtnContent(`${time}s${intl.formatMessage({ id: 'contract.houzhongfa' })}`)
      setBtnDisabled(true)
      setTimeout(() => {
        hanleCountdown()
      }, 1000)
    } else {
      time = 60
      setBtnDisabled(false)
      setBtnContent(intl.formatMessage({ id: 'contract.huoquyanzhengma' }))
    }
  }

  /** 发起手机认证*/
  const handleVerifyCode = async () => {
    await postContractSignatureAuthMobileVerify({
      signatureAuthLogId: Number(sessionStorage.getItem('signatureAuthLogId')),
      mobileNo: data.transactorMobile,
    }).then((res) => {
      if (res.code === 1000) {
        hanleCountdown()
      } else {
        console.log(res)
      }
    })
  }

  /**手机认证验证码校验 */
  const onSubmit = async () => {
    const value = await form.validateFields()
    if (value) {
      await postContractSignatureAuthMobileVerifyCode({
        signatureAuthLogId: Number(sessionStorage.getItem('signatureAuthLogId')),
        authcode: value.authcode,
      }).then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
    }
  }

  const link = () => {
    history.goBack('/contract/ElectronicSignature/apply')
  }
  return (
    <>
      {payWay === 1 && (
        <div className={styles.info_wrap}>
          {/** 支付宝认证*/}
          <Result
            title={
              authType !== 3
                ? intl.formatMessage({ id: 'contract.qingshiyongfarenshoujihao' })
                : intl.formatMessage({ id: 'contract.qingshiyongdangqianhuiyuanshou' })
            }
            extra={[
              <div key="key">
                <div className={styles.info_wran}>
                  {intl.formatMessage({ id: 'contract.bingshiyongzhifubaoshouye' })}
                </div>
                <div className={styles.info_wran}>{intl.formatMessage({ id: 'contract.saomiaoxiamiandeerweima' })}</div>
                <div className={styles.alipay_qrcode}>{qrCode ? <img src={qrCode} alt="" /> : <Spin />}</div>
                <div className={styles.alipay_wran}>
                  <AlipaySquareFilled
                    style={{
                      fontSize: '24px',
                      color: '#3f7ed2',
                      marginRight: '8px',
                    }}
                  />
                  {intl.formatMessage({ id: 'contract.zhifubaosaoyisao' })}
                </div>
                {/* <div className={styles.bank_btn} style={{ textAlign: 'center' }}>
                  <Button style={{ marginTop: '24px' }} onClick={() => authTypeFn('', 1, 'stepUp')}>{intl.formatMessage({id: 'contract.shangyibu'})}</Button>
                </div> */}
              </div>,
            ]}
          />
        </div>
      )}
      {authType === 1 && payWay === 2 && (
        <>
          <Card
            title={intl.formatMessage({ id: 'contract.qingquerenningongsidedui' })}
            className={selfStyles.cardBottom}
          >
            <div style={{ color: '#91959B', fontSize: 12, marginBottom: 12 }}>
              打款金额：0.01元（1分钱），请确保打款金额正确，如非1分钱则无法完成认证。
            </div>
            <div style={{ color: '#91959B', fontSize: 12, marginBottom: 12 }}>
              汇款金额作为企业实名专用，不做退还，无法开发票
            </div>
            <div style={{ color: '#91959B', fontSize: 12, marginBottom: 18 }}>汇款方必须使用对公账户进行汇款</div>
            <div>
              <div className={selfStyles.item}>
                <div className={selfStyles.item_label}>{intl.formatMessage({ id: 'contract.zhanghumingcheng' })}：</div>
                <div className={selfStyles.item_text}>{query?.mainAccountName}</div>
              </div>
              <div className={selfStyles.item}>
                <div className={selfStyles.item_label}>{intl.formatMessage({ id: 'contract.yinhangzhanghao' })}：</div>
                <div className={selfStyles.item_text}>{query?.subAccountNo}</div>
              </div>
              <div className={selfStyles.item}>
                <div className={selfStyles.item_label}>{intl.formatMessage({ id: 'contract.kaihuhang' })}：</div>
                <div className={selfStyles.item_text}>{query?.mainAccountBank}</div>
              </div>
              <div className={selfStyles.item}>
                <div className={selfStyles.item_label}>固定金额：</div>
                <div className={selfStyles.item_text}>{query?.paymentAmount}</div>
              </div>
              <div className={selfStyles.item}>
                <div className={selfStyles.item_label}></div>
                <div className={selfStyles.item_text}>
                  <Button type="primary" onClick={paymentVerifyFn}>
                    我已打款
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          {/* <div className={styles.info_wrap}>
            <Result
              title={intl.formatMessage({ id: 'contract.qingquerenningongsidedui' })}
              extra={[
                <div key='key'>
                  <div className={styles.info_wran}>{intl.formatMessage({ id: 'contract.dianjixiayibuhouxi' })}</div>
                  <div className={styles.info_wran}>{intl.formatMessage({ id: 'contract.houxuninxuyaotianxiezhe' })}</div>
                  <div className={styles.bank_info}>
                    <div className={styles.bank_info_item}>
                      <div className={styles.bank_info_label}>{intl.formatMessage({ id: 'contract.zhanghumingcheng' })}：</div>
                      <div className={styles.bank_info_control}>{query.orgName}</div>
                    </div>
                    <div className={styles.bank_info_item}>
                      <div className={styles.bank_info_label}>{intl.formatMessage({ id: 'contract.yinhangzhanghao' })}：</div>
                      <div className={styles.bank_info_control}>{query.cardNo}</div>
                    </div>
                    <div className={styles.bank_info_item}>
                      <div className={styles.bank_info_label}>{intl.formatMessage({ id: 'contract.kaihuhang' })}：</div>
                      <div className={styles.bank_info_control}>{query.bankName}</div>
                    </div>
                  </div>
                  <div className={styles.bank_btn}>
                    <Button type='primary' onClick={paymentVerifyFn}>{intl.formatMessage({ id: 'contract.xiayibu' })}</Button>
                    <Button onClick={() => authTypeFn('', 1, 'stepUp')}>{intl.formatMessage({ id: 'contract.shangyibu' })}</Button>
                  </div>
                </div>
              ]}
            />
          </div> */}
          {
            paymentVerify === 1 && (
              <Card title={intl.formatMessage({ id: 'contract.qingshuruningongsidedui' })}>
                <div style={{ color: '#91959B', fontSize: 12, marginBottom: 18 }}>
                  {intl.formatMessage({ id: 'contract.shouyinhangjiesuanshijiande' })}
                  {intl.formatMessage({ id: 'contract.guodakuanweidaozhangke' })}&nbsp;
                  <span style={{ color: '#00A98F' }}>
                    {intl.formatMessage({ id: 'contract.chongxinshenqingdakuan' })}
                  </span>
                </div>
                <div>
                  <Form form={form} labelCol={{ style: { width: 108, textAlign: 'left' } }}>
                    <Form.Item
                      colon={false}
                      label={intl.formatMessage({ id: 'contract.zhuanzhangjine' })}
                      name="amount"
                      rules={[
                        { required: true, message: intl.formatMessage({ id: 'contract.qingshuruzhuanzhangjine' }) },
                      ]}
                    >
                      <Input
                        placeholder={intl.formatMessage({ id: 'contract.qingshuruninshoudaodezhuan' })}
                        style={{ width: 600, backgroundColor: '#F5F6F7' }}
                      />
                    </Form.Item>
                  </Form>
                  <div className={selfStyles.item}>
                    <div className={selfStyles.item_label}></div>
                    <div className={selfStyles.item_text}>
                      <Button type="primary" onClick={paymentVerifyAmountFn} style={{ marginRight: 16 }}>
                        {intl.formatMessage({ id: 'contract.xiayibu' })}
                      </Button>
                      <Button onClick={() => authTypeFn('', 1, 'stepUp')}>
                        {intl.formatMessage({ id: 'contract.shangyibu' })}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
            // <div className={styles.info_wrap}>
            //   <Result
            //     title={intl.formatMessage({ id: 'contract.qingshuruningongsidedui' })}
            //     extra={[
            //       <div key='key'>
            //         <div className={styles.info_wran}>{intl.formatMessage({ id: 'contract.shouyinhangjiesuanshijiande' })}</div>
            //         <div className={styles.info_wran}>{intl.formatMessage({ id: 'contract.guodakuanweidaozhangke' })}&nbsp;<span style={{ color: '#00A98F' }}>{intl.formatMessage({ id: 'contract.chongxinshenqingdakuan' })}</span></div>
            //         <div className={styles.bank_info_le} style={{ backgroundColor: '#FFF', marginBottom: '0px' }}>
            //           <Form form={form}>
            //             <Form.Item colon={false} label={intl.formatMessage({ id: 'contract.zhuanzhangjine' })} name="amount" rules={[{ required: true, message: intl.formatMessage({ id: 'contract.qingshuruzhuanzhangjine' }) }]}>
            //               <Input placeholder={intl.formatMessage({ id: 'contract.qingshuruninshoudaodezhuan' })} />
            //             </Form.Item>
            //           </Form>
            //         </div>
            //         <div className={styles.bank_btn} style={{ width: '230px' }}>
            //           <Button type='primary' onClick={paymentVerifyAmountFn}>{intl.formatMessage({ id: 'contract.xiayibu' })}</Button>
            //           <Button onClick={() => authTypeFn('', 1, 'stepUp')}>{intl.formatMessage({ id: 'contract.shangyibu' })}</Button>
            //         </div>
            //       </div>
            //     ]}
            //   />
            // </div>
          }
        </>
      )}

      {authType === 2 && payWay === 3 && (
        <div className={styles.info_wrap}>
          {/** 系统将向法人手机号码发送验证短信*/}
          {visible && (
            <Alert
              type="success"
              icon={<CheckCircleFilled style={{ color: '#00A98F', fontSize: 16, marginTop: 4 }} />}
              style={{ margin: 'auto', border: 0, background: '#F5F6F7' }}
              message={intl.formatMessage({ id: 'contract.duanxinfasongchenggong' })}
              description={
                <>
                  <span>{intl.formatMessage({ id: 'contract.qingdengdaifarenzaishouji' })}</span>
                  <br />
                  <span>{intl.formatMessage({ id: 'contract.ninkedianjifanhuianniu' })}</span>
                </>
              }
              showIcon
              closable
            />
          )}
          <Result
            title={intl.formatMessage({ id: 'contract.xitongjiangxiangfarenshouji' })}
            extra={[
              <div key="key">
                <div className={styles.info_wran}>
                  {intl.formatMessage({ id: 'contract.farenshoudaoyanzhengduanxin' })}
                </div>
                <div className={styles.info_phone_number}>
                  <div>{intl.formatMessage({ id: 'contract.farenshoujihao' })}:</div>
                  <div>+86 {data.legalRepMobile}</div>
                </div>
                <div className={styles.bank_btn} style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={mobileVerifyFn} block style={{ marginBottom: 24 }}>
                    {intl.formatMessage({ id: 'contract.fasongshouquanduanxin' })}
                  </Button>
                  <Button onClick={() => authTypeFn('', 1, 'stepUp')} block>
                    {intl.formatMessage({ id: 'contract.shangyibu' })}
                  </Button>
                </div>
              </div>,
            ]}
          />
        </div>
      )}

      {authType === 3 && (
        <div className={styles.info_wrap}>
          {/** 系统将向当前会员手机号码发送短信验证码*/}
          <Result
            title={intl.formatMessage({ id: 'contract.xitongjiangxiangdangqianhuiyuan' })}
            extra={[
              <div key="key">
                <div className={styles.info_wran}>
                  {intl.formatMessage({ id: 'contract.huiyuanshoudaoduanxinyanzheng' })}
                </div>
                <div className={styles.info_phone_number}>
                  <div>{intl.formatMessage({ id: 'contract.farenshoujihao' })}：</div>
                  <div>+86 {data.transactorMobile}</div>
                </div>
                <Form style={{ width: '338px', margin: 'auto' }} form={form}>
                  <Form.Item noStyle>
                    <Row gutter={6}>
                      <Col span={16}>
                        <Form.Item
                          name="authcode"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'contract.qingshuruduanxinyanzhengma' }),
                            },
                          ]}
                        >
                          <Input
                            placeholder={intl.formatMessage({ id: 'contract.qingshuruduanxinyanzhengma' })}
                            style={{ backgroundColor: '#F5F6F7' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Button disabled={btnDisabled} onClick={handleVerifyCode}>
                          {intl.formatMessage({ id: 'contract.huoquyanzhengma' })}
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form>
                <div className={styles.bank_btn} style={{ textAlign: 'center' }}>
                  <Button type="primary" block style={{ marginBottom: 24 }}>
                    {intl.formatMessage({ id: 'contract.kaishirenzheng' })}
                  </Button>
                  <Button onClick={() => authTypeFn('', 1, 'stepUp')} block>
                    {intl.formatMessage({ id: 'contract.shangyibu' })}
                  </Button>
                </div>
              </div>,
            ]}
          />
        </div>
      )}
    </>
  )
}

export default PublicAccount

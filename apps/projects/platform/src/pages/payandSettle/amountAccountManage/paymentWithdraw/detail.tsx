import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Card, Space, Steps, Row, Col, Button, InputNumber, Result, Modal, Input } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import moment from 'moment'
import { decodeURLBase64 } from '@linkseeks/crypto'
import { ColumnType } from 'antd/lib/table/interface'
import { memberStatusMap, operationMap, statusMap } from '../../constant'
import { CheckSquareOutlined } from '@ant-design/icons'
import CapitalCardCheckBox from './components/cardCheckbox'
import confirm_img from '@/assets/imgs/img_confirm.png'
import StandardTable from '@/components/StandardTable'

import alipay from '@/assets/imgs/alipay_icon.png'
import wxpay from '@/assets/imgs/wechat_icon.png'
import {
  getPayMemberAssetAccountGetCashOutRecordList,
  getPayMemberAssetAccountGetMemberAssetAccount,
  postPayMemberAssetAccountPayCashOut,
} from '@apps/apis'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getWebIntl } from '@apps/locales'
const { Step } = Steps
const { TextArea } = Input

const translate = getWebIntl()
const PaymentDetail: React.FC<{}> = () => {
  const refTrade = useRef<any>({})
  const intl = useIntl()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<number>(4)
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [payResult, setPayResult] = useState<number>(2)
  const [payConfirmLoading, setPayConfirmLoading] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const [bankDetail, setBankDetail] = useState<any>()
  const [payParam, setPayParam] = useState<any>()
  const [errorTips, setErrorTips] = useState<any>({ tipMethod: false, tipChannel: false })

  useEffect(() => {
    getAccountInfo()
  }, [])

  const { detailinfo } = useQuery()
  let urlParams: any = detailinfo ? JSON.parse(decodeURLBase64(detailinfo)) : {}

  const getAccountInfo = async () => {
    let res = await getPayMemberAssetAccountGetMemberAssetAccount({ id: urlParams.id })
    const { code, data } = res
    setDetails(data)
    if (code === 1000) {
      let bankRes = await getSettlementGetMemberAccountConfig({
        memberId: data.memberId + '',
        roleId: data.memberRoleId + '',
      })
      setBankDetail(bankRes.data)
    }
  }

  // 获取提现处理记录
  const fetchTradeData = (params) => {
    return new Promise((resolve, reject) => {
      getPayMemberAssetAccountGetCashOutRecordList({ tradeCode: urlParams.tradeCode, ...params }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.columns.tradeCode',
      }),
      dataIndex: 'tradeCode',
      key: 'tradeCode',
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.columns.tradeTime',
      }),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.columns.tradeMoney',
      }),
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) => `${operationMap[r.operation]['operator']} ${t.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.columns.operation',
      }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t, r) => operationMap[t]['title'],
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.columns.status',
      }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => <StatusTag title={statusMap[text]['title']} type={statusMap[text]['type']} />,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.columns.remark',
      }),
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  const handleOK = () => {
    console.log(payParam, '确认支付参数')
    setPayConfirmLoading(true)
    // 1-1 支付成功 1-2确认是否已转账 1-other支付失败
    if (!payParam?.payType) {
      setErrorTips({ ...errorTips, tipMethod: true })
      setPayConfirmLoading(false)
    } else if (!payParam?.payChannel) {
      setErrorTips({ ...errorTips, tipChannel: true })
      setPayConfirmLoading(false)
    } else {
      setErrorTips({ tipMethod: false, tipChannel: false })
      postPayMemberAssetAccountPayCashOut({ id: urlParams.payId, ...payParam }, { ctlType: 'none' }).then((res) => {
        if (res.code === 1000) {
          setCurrentStep(1)
          setPayResult(1)
          getAccountInfo()
          refTrade.current.reloadCurrent()
          setDisableCheck(true)
        } else {
          setCurrentStep(1)
          setPayResult(3)
        }
        setPayConfirmLoading(false)
      })
    }
  }

  const handleCancel = () => {
    setVisibleModal(false)
  }

  const handleConfirm = () => {
    console.log('确认')
    setVisibleModal(false)
  }

  const handleBack = () => {
    setCurrentStep(0)
  }

  const cardChange = (value) => {
    console.log(value)
    setPayParam(() => {
      return {
        ...payParam,
        ...value,
      }
    })
  }

  const renderModalTitle = () => {
    return (
      <Steps size="small" current={currentStep} style={{ width: '382px', margin: '0 auto' }}>
        <Step
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderModalTitle.1',
          })}
        />
        <Step
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderModalTitle.2',
          })}
        />
      </Steps>
    )
  }

  const renderModalFooter = () => {
    let footer = null
    if (currentStep) {
      if (payResult === 2) {
        footer = [
          <Button key="back" onClick={handleBack}>
            {intl.formatMessage({
              id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderModalFooter.button.1',
            })}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleConfirm}>
            {intl.formatMessage({
              id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderModalFooter.button.2',
            })}
          </Button>,
        ]
      } else {
        footer = null
      }
    } else {
      footer = [
        <Button key="back" onClick={handleCancel}>
          {intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderModalFooter.button.3',
          })}
        </Button>,
        <Button key="submit" type="primary" loading={payConfirmLoading} onClick={handleOK}>
          {intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderModalFooter.button.4',
          })}
        </Button>,
      ]
    }
    return footer
  }

  const renderResult = () => {
    let node = null
    if (payResult === 1) {
      node = (
        <Result
          status="success"
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderResult.1.title',
          })}
        />
      )
    } else if (payResult === 2) {
      node = (
        <Result
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderResult.2.title',
          })}
          subTitle={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderResult.2.subTitle',
          })}
          icon={
            <img
              src={confirm_img}
              alt={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderResult.2.alt',
              })}
            />
          }
        />
      )
    } else {
      node = (
        <Result
          status="error"
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderResult.3.title',
          })}
          extra={[
            <Button key="console" onClick={handleBack}>
              {intl.formatMessage({
                id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.renderResult.3.button',
              })}
            </Button>,
          ]}
        />
      )
    }
    return node
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.title' })}
      extra={
        urlParams.preview
          ? []
          : [
              <Button
                icon={<CheckSquareOutlined />}
                key="1"
                type="primary"
                onClick={() => setVisibleModal(true)}
                disabled={disableCheck}
              >
                {intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.extra' })}
              </Button>,
            ]
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.1' })}
        >
          <Steps progressDot current={urlParams.status === 4 || payResult === 1 ? 3 : 2}>
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.1.step.1',
              })}
              description={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.1.step.1.description',
              })}
            />
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.1.step.2',
              })}
              description={details?.parentMemberRoleName}
            />
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.1.step.3',
              })}
              description={details?.parentMemberRoleName}
            />
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.1.step.4',
              })}
              description=""
            />
          </Steps>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.2' })}
        >
          <Row gutter={100} style={{ marginRight: 0 }}>
            <Col span={8}>
              <div className={styles.repayment}>
                <div className={styles['repayment-left']}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.2.statisticTitle',
                      })}
                    </div>
                    <div className={styles['statistic-amount']}>{urlParams.amount}</div>
                  </div>
                  <div className={styles['repayment-end']}>
                    <span className={styles['repayment-time']}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.2.accountBalance',
                      })}
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.currency',
                      })}{' '}
                      {((details.accountBalance * 100 - details.lockBalance * 100) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.infoRight}>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.2.rightTitle.1',
                      })}
                    </p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{bankDetail?.name}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.2.rightTitle.2',
                      })}
                    </p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{bankDetail?.bankAccount}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.2.rightTitle.3',
                      })}
                    </p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{bankDetail?.bankDeposit}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.3' })}
        >
          <Row gutter={100} style={{ marginRight: 0 }}>
            <Col span={8}>
              <div className={cx(styles.repayment, styles.repayinfo)}>
                <div className={styles['repayment-left']}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>
                      {translate.formatCurrencyWith(translate('web.resource.payment.keyongyue'))}
                    </div>
                    <div className={styles['statistic-amount']}>
                      {`${((details.accountBalance * 100 - details.lockBalance * 100) / 100).toFixed(2)}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ',',
                      )}
                    </div>
                  </div>
                  <div className={styles['repayment-end']}>
                    <span className={styles['repayment-time']}>{details?.memberName}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.infoRight}>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.3.rightTitle.1',
                      })}
                    </p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.parentMemberName}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {translate.formatCurrencyWith(translate('web.resource.payment.zhanghuyue'))}
                    </p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.accountBalance?.toFixed(2)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.3.rightTitle.3',
                      })}
                    </p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.lockBalance?.toFixed(2)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.3.rightTitle.4',
                      })}
                    </p>
                  </Col>
                  <Col span={20}>
                    {details?.accountStatus && (
                      <StatusTag
                        title={memberStatusMap[details.accountStatus]['title']}
                        type={memberStatusMap[details.accountStatus]['type']}
                      />
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.card.4' })}
        >
          <StandardTable
            columns={columns}
            currentRef={refTrade}
            fetchTableData={(params: any) => fetchTradeData(params)}
          />
        </Card>
      </Space>
      <Modal
        title={renderModalTitle()}
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        footer={renderModalFooter()}
        destroyOnClose={true}
      >
        {currentStep ? (
          renderResult()
        ) : (
          <>
            <CapitalCardCheckBox
              cardChange={(v) => cardChange(v)}
              name="payType"
              dataSource={[
                {
                  title: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payType',
                  }),
                  items: [
                    {
                      id: 1,
                      name: intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payType.1',
                      }),
                      logoUrl: alipay,
                    },
                    {
                      id: 2,
                      name: intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payType.2',
                      }),
                      logoUrl: wxpay,
                    },
                    {
                      id: 3,
                      name: intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payType.3',
                      }),
                      logoUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    },
                  ],
                },
                // {
                //   title: '支付渠道',
                //   items: [
                //     {id: 4, name: '线下转账线上确认'},
                //   ]
                // },
              ]}
              type="radio"
            />
            {errorTips.tipMethod && (
              <p className={styles.errorTips}>
                {intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payType.errorTips',
                })}
              </p>
            )}
            <CapitalCardCheckBox
              cardChange={(v) => cardChange(v)}
              name="payChannel"
              dataSource={[
                {
                  title: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payChannel',
                  }),
                  items: [
                    {
                      id: 1,
                      name: intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payChannel.1',
                      }),
                    },
                  ],
                },
              ]}
              type="radio"
            />
            {errorTips.tipChannel && (
              <p className={styles.errorTips}>
                {intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.paymentWithdraw.paymentDetail.modal.payChannel.errorTips',
                })}
              </p>
            )}
          </>
        )}
      </Modal>
    </PageHeaderWrapper>
  )
}

export default PaymentDetail

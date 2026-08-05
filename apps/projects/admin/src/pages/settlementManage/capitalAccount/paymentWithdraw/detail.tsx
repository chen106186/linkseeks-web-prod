import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { Card, Space, Steps, Row, Col, Button, Result, Modal } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import { formatTimeString } from '@/utils'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { memberStatusMap, operationMap, statusMap } from '../constant'
import { CheckSquareOutlined } from '@ant-design/icons'
import CapitalCardCheckBox from './components/CardCheckbox'
import confirm_img from '@/assets/img_confirm.png'

import alipay from '@/assets/alipay_icon.png'
import wxpay from '@/assets/wechat_icon.png'
import type { GetSettlementCorporateAccountConfigResponse } from '@apps/apis'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'
import {
  getPayPlatFormAssetAccountGetCashOutRecordList,
  getPayPlatFormAssetAccountGetPlatFormAssetAccount,
  postPayPlatFormAssetAccountPayCashOut,
} from '@apps/apis'

const { Step } = Steps

const PaymentDetail: React.FC = () => {
  const refTrade = useRef({} as ActionType)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [loading] = useState<boolean>(false)
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [payResult, setPayResult] = useState<number>(2)
  const [payConfirmLoading, setPayConfirmLoading] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const [bankDetail, setBankDetail] = useState<GetSettlementCorporateAccountConfigResponse>()
  const [payParam, setPayParam] = useState<any>({ payType: 1 }) // 默认选中支付宝
  const [errorTips, setErrorTips] = useState<any>({ tipMethod: false, tipChannel: false })

  const { detailinfo } = useQuery()
  const urlParams: any = JSON.parse(atob(detailinfo))

  const getAccountInfo = async () => {
    const res = await getPayPlatFormAssetAccountGetPlatFormAssetAccount({ id: urlParams.id })
    const { code, data } = res
    setDetails(data)
    if (code === 1000) {
      const bankRes: any = await getSettlementGetMemberAccountConfig({
        memberId: data.memberId,
        roleId: data.memberRoleId,
      })
      setBankDetail(bankRes.data)
    }
  }

  useEffect(() => {
    getAccountInfo()
  }, [])

  // 获取提现处理记录
  const fetchTradeData = (params) => {
    return new Promise((resolve) => {
      getPayPlatFormAssetAccountGetCashOutRecordList({ tradeCode: urlParams.tradeCode, ...params }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '交易流水号',
      dataIndex: 'tradeCode',
      key: 'tradeCode',
    },
    {
      title: '交易时间',
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '交易金额(元)',
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) => `${operationMap[r.operation]['operator']} ${t.toFixed(2)}`,
    },
    {
      title: '交易项目',
      dataIndex: 'operation',
      key: 'operation',
      render: (t) => operationMap[t]['title'],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any) => <StatusTag title={statusMap[text]['title']} type={statusMap[text]['type']} />,
    },
    {
      title: '意见',
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
      postPayPlatFormAssetAccountPayCashOut({ id: urlParams.payId, ...payParam }, { ctlType: 'none' }).then((res) => {
        if (res.code === 1000) {
          setCurrentStep(1)
          setPayResult(1)
          getAccountInfo()
          refTrade.current.reload()
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
        <Step title="选择支付方式" />
        <Step title="进行支付" />
      </Steps>
    )
  }

  const renderModalFooter = () => {
    let footer: any = null
    if (currentStep) {
      if (payResult === 2) {
        footer = [
          <Button key="back" onClick={handleBack}>
            上一步
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleConfirm}>
            确认
          </Button>,
        ]
      } else {
        footer = null
      }
    } else {
      footer = [
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={payConfirmLoading} onClick={handleOK}>
          下一步
        </Button>,
      ]
    }
    return footer
  }

  const renderResult = () => {
    let node: any = null
    if (payResult === 1) {
      node = <Result status="success" title="支付成功" />
    } else if (payResult === 2) {
      node = (
        <Result
          title="确认是否已转账？"
          subTitle="线下转账线上确认"
          icon={<img src={confirm_img} alt="线下转账线上确认" />}
        />
      )
    } else {
      node = (
        <Result
          status="error"
          title="支付失败"
          extra={[
            <Button key="console" onClick={handleBack}>
              重新选择支付方式
            </Button>,
          ]}
        />
      )
    }
    return node
  }

  return (
    <PageHeaderWrapper
      title="支付提现"
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
                支付
              </Button>,
            ]
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card headStyle={{ borderBottom: 'none' }} title="外部流转">
          <Steps progressDot current={urlParams.status === 4 || payResult === 1 ? 3 : 2}>
            <Step title="申请提现" description="采购商" />
            <Step title="审核提现" description="平台" />
            <Step title="支付提现" description="平台" />
            <Step title="完成" description="" />
          </Steps>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="账户提现">
          <Row gutter={100} style={{ marginRight: 0 }}>
            <Col span={10}>
              <div className={styles.repayment} style={{ height: 240 }}>
                <div className={styles['repayment-left']}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>提现金额(元)：</div>
                    <div className={styles['statistic-amount']}>{urlParams.amount}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={14}>
              <div className={styles.infoRight}>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>账户归属：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{bankDetail?.name}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>银行账号：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{bankDetail?.bankAccount}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>开户行：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{bankDetail?.bankDeposit}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="账户信息">
          <Row gutter={100} style={{ marginRight: 0 }}>
            <Col span={10}>
              <div className={cx(styles.repayment, styles.repayinfo)}>
                <div className={styles['repayment-left']}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>可用余额(元)：</div>
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
            <Col span={14}>
              <div className={styles.infoRight}>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>账户归属：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.parentMemberName}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>账户余额(元)：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.accountBalance?.toFixed(2)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>锁定金额(元)：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.lockBalance?.toFixed(2)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>账户状态：</p>
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
        <Card headStyle={{ borderBottom: 'none' }} title="提现处理记录">
          <StandardFormTable
            columns={columns}
            actionRef={refTrade}
            autoScrollX
            request={(params: any) => fetchTradeData(params)}
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
            {/* 隐藏三个支付方式 */}
            {/* <CapitalCardCheckBox
              cardChange={(v) => cardChange(v)}
              name="payType"
              dataSource={[
                {
                  title: '支付方式',
                  items: [
                    { id: 1, name: '支付宝', logoUrl: alipay },
                    { id: 2, name: '微信', logoUrl: wxpay },
                    {
                      id: 3,
                      name: '银联',
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
            {errorTips.tipMethod && <p className={styles.errorTips}>请选择支付方式</p>} */}
            {/* 支付方式已默认选中支付宝，隐藏选择区域 */}
            <CapitalCardCheckBox
              cardChange={(v) => cardChange(v)}
              name="payChannel"
              dataSource={[
                {
                  title: '支付渠道',
                  items: [{ id: 1, name: '线下转账线上确认' }],
                },
              ]}
              type="radio"
            />
            {errorTips.tipChannel && <p className={styles.errorTips}>请选择支付渠道</p>}
          </>
        )}
      </Modal>
    </PageHeaderWrapper>
  )
}

export default PaymentDetail

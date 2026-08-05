import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { Card, Space, Steps, Row, Col, Button, Form, Modal, Radio, Input } from '@linkseeks/ui'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import { formatTimeString } from '@/utils'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { memberStatusMap, operationMap, statusMap } from '../constant'
import { CheckSquareOutlined } from '@ant-design/icons'
import type { GetSettlementCorporateAccountConfigResponse } from '@apps/apis'
import { getSettlementGetMemberAccountConfig, postPayPlatFormAssetAccountCheck } from '@apps/apis'
import {
  getPayPlatFormAssetAccountGetCashOutRecordList,
  getPayPlatFormAssetAccountGetPlatFormAssetAccount,
} from '@apps/apis'

const { Step } = Steps
const { TextArea } = Input

const CheckDetail: React.FC = () => {
  const refTrade = useRef({} as ActionType)
  const [checkForm] = Form.useForm()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<number>(1)
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const [bankDetail, setBankDetail] = useState<GetSettlementCorporateAccountConfigResponse>()

  const [tempStatus, setTempStatus] = useState<number>(0)

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

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      setConfirmLoading(true)
      postPayPlatFormAssetAccountCheck({ id: urlParams.tradeId, ...values }).then((res) => {
        if (res.code === 1000) {
          setDisableCheck(true)
          getAccountInfo()
          refTrade.current.reload()
          setTempStatus(values.status)
        } else {
          setDisableCheck(false)
        }
        setVisibleModal(false)
      })
    })
  }

  const handleCancel = () => {
    checkForm.resetFields()
    setVisibleModal(false)
  }

  return (
    <PageHeaderWrapper
      title="审核提现"
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
                审核提现
              </Button>,
            ]
      }
    >
      <Space direction="vertical" style={{ width: '100%', display: 'flex' }} size={16}>
        <Card headStyle={{ borderBottom: 'none' }} title="外部流转">
          <Steps progressDot current={urlParams.status === 2 || tempStatus === 1 ? 2 : 1}>
            <Step title="申请提现" description="采购商" />
            <Step title="审核提现" description="平台" />
            <Step title="支付提现" description="平台" />
            <Step title="完成" description="" />
          </Steps>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="账户提现">
          <Row gutter={100} style={{ marginRight: 0 }}>
            <Col span={8}>
              <div className={styles.repayment}>
                <div className={styles['repayment-left']}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>提现金额(元)：</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <div className={styles['statistic-amount']}>{urlParams.amount}</div>
                    </div>
                  </div>
                  <div className={styles['repayment-end']}>
                    <span className={styles['repayment-time']}>
                      最多可以提现：¥ {((details.accountBalance * 100 - details.lockBalance * 100) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={16}>
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
            <Col span={8}>
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
            <Col span={16}>
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
        title="审核提现"
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="status"
            label=""
            rules={[
              {
                required: true,
                message: '请选择审核状态',
              },
            ]}
            initialValue={1}
          >
            <Radio.Group onChange={handleStatusChange}>
              <Radio value={1}>审核通过</Radio>
              <Radio value={2}>审核不通过</Radio>
            </Radio.Group>
          </Form.Item>
          {checkStatus === 2 && (
            <Form.Item
              name="remark"
              label={'审核不通过原因'}
              rules={[
                {
                  required: true,
                  message: '请填写原因',
                },
              ]}
            >
              <TextArea rows={3} placeholder="请填写原因" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default CheckDetail

import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Space, Steps, Row, Col, Button, InputNumber, Form, Modal, Radio, Input } from 'antd'
import { Card } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import { decodeURLBase64 } from '@linkseeks/crypto'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import moment from 'moment'
import { ColumnType } from 'antd/lib/table/interface'
import { memberStatusMap, operationMap, statusMap } from '../../constant'
import { CheckSquareOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import {
  getPayMemberAssetAccountGetCashOutRecordList,
  getPayMemberAssetAccountGetMemberAssetAccount,
  postPayMemberAssetAccountCheck,
} from '@apps/apis'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getWebIntl } from '@apps/locales'
const { Step } = Steps
const { TextArea } = Input

const translate = getWebIntl()
const CheckDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const refTrade = useRef<any>({})
  const [checkForm] = Form.useForm()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<number>(1)
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const [bankDetail, setBankDetail] = useState<any>()

  const [tempStatus, setTempStatus] = useState<number>(0)
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
        resolve(res.data)
      })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.columns.tradeCode' }),
      dataIndex: 'tradeCode',
      key: 'tradeCode',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.columns.tradeTime' }),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.columns.tradeMoney',
      }),
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) => `${operationMap[r.operation]['operator']} ${t.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.columns.operation' }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t, r) => operationMap[t]['title'],
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => <StatusTag title={statusMap[text]['title']} type={statusMap[text]['type']} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.columns.remark' }),
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
      postPayMemberAssetAccountCheck({ id: urlParams.tradeId, ...values }).then((res) => {
        if (res.code === 1000) {
          setDisableCheck(true)
          getAccountInfo()
          refTrade.current.reloadCurrent()
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
      title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.title' })}
      bodyStyle={{
        marginTop: -12,
      }}
      isAnchor
      items={[
        {
          key: 'checkWithdraw1',
          label: intl.formatMessage({
            id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.1',
            defaultMessage: '外部流转',
          }),
        },
        {
          key: 'checkWithdraw2',
          label: intl.formatMessage({
            id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.2',
            defaultMessage: '账户提现',
          }),
        },
        {
          key: 'checkWithdraw3',
          label: intl.formatMessage({
            id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.3',
            defaultMessage: '账户信息',
          }),
        },
        {
          key: 'checkWithdraw4',
          label: intl.formatMessage({
            id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.4',
            defaultMessage: '提现处理记录',
          }),
        },
      ]}
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
                {intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.extra' })}
              </Button>,
            ]
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          id="checkWithdraw1"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.1' })}
        >
          <Steps progressDot current={urlParams.status === 2 || tempStatus === 1 ? 2 : 1}>
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.1.step.1',
              })}
              description={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.1.step.1.description',
              })}
            />
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.1.step.2',
              })}
              description={details?.parentMemberRoleName}
            />
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.1.step.3',
              })}
              description={details?.parentMemberRoleName}
            />
            <Step
              title={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.1.step.4',
              })}
              description=""
            />
          </Steps>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          id="checkWithdraw2"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.2' })}
        >
          <Row gutter={16} style={{ marginRight: 0 }}>
            <Col span={12}>
              <div className={cx(styles.repayment, styles.repayinfo)}>
                <div className={styles['repayment-left']}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.2.statisticTitle',
                      })}
                    </div>
                    <div className={styles['statistic-amount']}>{urlParams.amount}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.infoRight}>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.2.rightTitle.1',
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
                        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.2.rightTitle.2',
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
                        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.2.rightTitle.3',
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
          id="checkWithdraw3"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.3' })}
        >
          <Row gutter={16} style={{ marginRight: 0 }}>
            <Col span={12}>
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
            <Col span={12}>
              <div className={styles.infoRight}>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>
                      {intl.formatMessage({
                        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.3.rightTitle.1',
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
                        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.3.rightTitle.3',
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
                        id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.3.rightTitle.4',
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
          id="checkWithdraw4"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.card.4' })}
        >
          <StandardTable
            columns={columns}
            currentRef={refTrade}
            fetchTableData={(params: any) => fetchTradeData(params)}
          />
        </Card>
      </Space>
      <Modal
        title={intl.formatMessage({ id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.modal.title' })}
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
                message: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.modal.status.message',
                }),
              },
            ]}
            initialValue={1}
          >
            <Radio.Group onChange={handleStatusChange}>
              <Radio value={1}>
                {intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.modal.status.1',
                })}
              </Radio>
              <Radio value={2}>
                {intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.modal.status.2',
                })}
              </Radio>
            </Radio.Group>
          </Form.Item>
          {checkStatus === 2 && (
            <Form.Item
              name="remark"
              label={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.modal.remark',
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.modal.remark.message',
                  }),
                },
              ]}
            >
              <TextArea
                rows={3}
                placeholder={intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.checkWithdraw.checkDetail.modal.remark.placeholder',
                })}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default CheckDetail

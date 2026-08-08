import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Space, Steps, Row, Col, Button, InputNumber, message } from 'antd'
import { Card } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import styles from '../index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import moment from 'moment'
import { ColumnType } from 'antd/lib/table/interface'
import { memberStatusMap, operationMap, statusMap } from '../../../constant'
import StandardTable from '@/components/StandardTable'
import {
  getPayAssetAccountGetAccountTradeRecord,
  getPayAssetAccountGetAssetAccount,
  postPayAssetAccountCashOut,
} from '@apps/apis'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'
import { useQuery } from '@linkseeks/router-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const AccountDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const refTrade = useRef<any>({})
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const [withdrawAmount, setWidthdrawAmount] = useState<any>(0)
  const [bankDetail, setBankDetail] = useState<any>()
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const { id } = useQuery()
  useEffect(() => {
    getAccountInfo()
  }, [])

  const getAccountInfo = async () => {
    let res = await getPayAssetAccountGetAssetAccount({ id })
    const { code, data } = res
    setDetails(data)
    if (code === 1000) {
      let bankRes = await getSettlementGetMemberAccountConfig({
        memberId: data.memberId + '',
        roleId: data.memberRoleId + '',
      })
      if (bankRes.code === 1000) {
        setBankDetail(bankRes.data)
      }
    }
  }

  const fetchTradeData = (params) => {
    return new Promise((resolve, reject) => {
      getPayAssetAccountGetAccountTradeRecord({ memberAssetAccountId: id + '', ...params }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.columns.tradeCode' }),
      dataIndex: 'tradeCode',
      key: 'tradeCode',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.columns.tradeTime' }),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.columns.tradeMoney' }),
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) => `${operationMap[r.operation]['operator']} ${t.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.columns.operation' }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t, r) => operationMap[t]['title'],
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => <StatusTag title={statusMap[text]['title']} type={statusMap[text]['type']} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.columns.remark' }),
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  const handleAllCharge = () => {
    let amount = (details.accountBalance * 100 - details.lockBalance * 100) / 100
    setWidthdrawAmount(amount)
  }

  // 提交提现申请
  const handleSubmitApply = () => {
    setBtnLoading(true)
    let amount = (details.accountBalance * 100 - details.lockBalance * 100) / 100
    if (withdrawAmount > 0 && withdrawAmount <= amount) {
      // 大于0并且小于可用金额
      let params = {
        memberAssetAccountId: details.id,
        money: withdrawAmount,
        bankAccountName: bankDetail.name,
        bankAccount: bankDetail.bankAccount,
        bankName: bankDetail.bankDeposit,
      }
      postPayAssetAccountCashOut(params).then((res) => {
        setBtnLoading(false)
        getAccountInfo()
        setWidthdrawAmount(0)
        refTrade.current.reloadCurrent()
      })
    } else {
      setBtnLoading(false)
      message.error(intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.error' }))
    }
  }

  return (
    <PageHeaderWrapper
      backDom
      title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.title' })}
      bodyStyle={{ marginTop: -12 }}
      isAnchor
      items={[
        {
          key: 'withdraw1',
          label: intl.formatMessage({
            id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.3',
            defaultMessage: '账户信息',
          }),
        },
        {
          key: 'withdraw2',
          label: intl.formatMessage({
            id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2',
            defaultMessage: '账户提现',
          }),
        },
        {
          key: 'withdraw3',
          label: intl.formatMessage({
            id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.4',
            defaultMessage: '提现处理记录',
          }),
        },
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          id="withdraw1"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.3' })}
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
                  <div className={styles.rightTitle}>
                    {intl.formatMessage({
                      id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.3.col.2',
                    })}
                  </div>
                  <div className={styles.rightInfo}>{details?.parentMemberName}</div>
                </Row>
                <Row>
                  <div className={styles.rightTitle}>
                    {translate.formatCurrencyWith(translate('web.resource.payment.zhanghuyue'))}
                  </div>
                  <div className={styles.rightInfo}>{details?.accountBalance?.toFixed(2)}</div>
                </Row>
                <Row>
                  <div className={styles.rightTitle}>
                    {intl.formatMessage({
                      id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.3.col.4',
                    })}
                  </div>
                  <div className={styles.rightInfo}>{details?.lockBalance?.toFixed(2)}</div>
                </Row>
                <Row>
                  <div className={styles.rightTitle}>
                    {intl.formatMessage({
                      id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.3.col.5',
                    })}
                  </div>
                  <div className={styles.rightInfo}>
                    {details?.accountStatus && (
                      <StatusTag
                        title={memberStatusMap[details.accountStatus]['title']}
                        type={memberStatusMap[details.accountStatus]['type']}
                      />
                    )}
                  </div>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          id="withdraw2"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2' })}
        >
          <Row gutter={16} style={{ marginRight: 0 }}>
            <div className={styles.repayment}>
              <div className={styles['repayment-left']}>
                {/* <div className={styles.statistic}>
									<div className={styles['statistic-title']}>
										{intl.formatMessage({
											id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.1',
										})}
									</div>
									<div style={{ display: 'flex', alignItems: 'flex-end' }}>
										<InputNumber
											defaultValue={withdrawAmount}
											value={withdrawAmount}
											formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
											className={styles['statistic-input']}
											onChange={(value) => setWidthdrawAmount(value)}
											precision={2}
											min={0}
										/>
										<Button
											type="text"
											size="small"
											style={{ marginLeft: 24, color: '#fff' }}
											onClick={handleAllCharge}
										>
											{intl.formatMessage({
												id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.1.button',
											})}
										</Button>
									</div>
								</div> */}
                {/* <div className={styles['repayment-end']}>
									<span className={styles['repayment-time']}>
										{intl.formatMessage({
											id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.1.accountBalance',
										})}{' '}
										{((details.accountBalance * 100 - details.lockBalance * 100) / 100).toFixed(2)}
									</span>
								</div> */}
                <div className={styles.infoRight}>
                  <Row>
                    <div className={cx(styles.rightTitle, styles.width154)} style={{ lineHeight: '32px' }}>
                      {intl.formatMessage({
                        id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.1',
                      })}
                    </div>
                    <div className={styles.rightInfo}>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <InputNumber
                          defaultValue={withdrawAmount}
                          value={withdrawAmount}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                          className={styles['statistic-input']}
                          onChange={(value) => setWidthdrawAmount(value)}
                          precision={2}
                          min={0}
                        />
                      </div>
                      <div className={styles['rightInfo-input-bottom']}>
                        <div className={styles['repayment-end']} style={{ marginTop: 0 }}>
                          <span className={styles['repayment-time']}>
                            {intl.formatMessage({
                              id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.1.accountBalance',
                            })}{' '}
                            {((details.accountBalance * 100 - details.lockBalance * 100) / 100).toFixed(2)}
                          </span>
                        </div>
                        <Button type="link" size="small" style={{ marginLeft: 'auto' }} onClick={handleAllCharge}>
                          {intl.formatMessage({
                            id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.1.button',
                          })}
                        </Button>
                      </div>
                    </div>
                  </Row>
                  <Row>
                    <div className={cx(styles.rightTitle, styles.width154)}>
                      {intl.formatMessage({
                        id: 'payandSettle.capitalAccounts.eAccount.modal.2.name',
                      })}
                    </div>
                    <div className={styles.rightInfo}>{bankDetail?.name}</div>
                  </Row>
                  <Row>
                    <div className={cx(styles.rightTitle, styles.width154)}>
                      {intl.formatMessage({
                        id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.3',
                      })}
                    </div>
                    <div className={styles.rightInfo}>{bankDetail?.bankAccount}</div>
                  </Row>
                  <Row>
                    <div className={cx(styles.rightTitle, styles.width154)}>
                      {intl.formatMessage({
                        id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.4',
                      })}
                    </div>
                    <div className={styles.rightInfo}>{bankDetail?.bankDeposit}</div>
                  </Row>
                  <Row>
                    <div className={cx(styles.rightTitle, styles.width154)} />
                    <div className={styles.rightInfo}>
                      <Button
                        type="primary"
                        onClick={handleSubmitApply}
                        loading={btnLoading}
                        disabled={bankDetail ? false : true}
                      >
                        {intl.formatMessage({
                          id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.2.col.1.submit',
                        })}
                      </Button>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          </Row>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          id="withdraw3"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.card.4' })}
        >
          <StandardTable
            columns={columns}
            currentRef={refTrade}
            fetchTableData={(params: any) => fetchTradeData(params)}
          />
        </Card>
      </Space>
    </PageHeaderWrapper>
  )
}

export default AccountDetail

import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Card, Space, Row, Col, Button, Table, Modal, Form, Input } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import moment from 'moment'
import { ColumnType } from 'antd/lib/table/interface'
import { memberStatusMap, moveStatusMap, operationMap, statusMap } from '../../constant'
import { SettingOutlined, StopOutlined } from '@ant-design/icons'
import { validatorByte } from '@/utils/regExp'
import StandardTable from '@/components/StandardTable'
import {
  getPayMemberAssetAccountGetAccountCheckRecord,
  getPayMemberAssetAccountGetAccountTradeRecord,
  getPayMemberAssetAccountGetMemberAssetAccount,
  postPayMemberAssetAccountUpdateMemberAssetAccountEnable,
} from '@apps/apis'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getWebIntl } from '@apps/locales'
const { TextArea } = Input

const translate = getWebIntl()
const AccountDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const refTrade = useRef<any>({})
  const refMove = useRef<any>({})
  const [checkForm] = Form.useForm()
  // const [dealRecord, setDealRecord] = useState<any>()
  const [moveRecord, setMoveRecord] = useState<any>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const { id } = useQuery()

  useEffect(() => {
    getAccountInfo()
  }, [])

  const getAccountInfo = async () => {
    let res = await getPayMemberAssetAccountGetMemberAssetAccount({ id })
    const { code, data } = res
    setDetails(data)
    if (code === 1000) {
      //   let tradeRecord = await getPayMemberAssetAccountGetAccountTradeRecord({memberAssetAccountId: data.id + ''})
      let statusRecord = await getPayMemberAssetAccountGetAccountCheckRecord({ memberAssetAccountId: data.id + '' })
      //   setDealRecord(tradeRecord.data)
      setMoveRecord(statusRecord.data)
    }
  }

  // 获取交易记录
  const fetchTradeData = (params) => {
    return new Promise((resolve, reject) => {
      getPayMemberAssetAccountGetAccountTradeRecord({
        memberAssetAccountId: id + '',
        ...params,
      }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  // // 获取流转记录
  // const fetchMoveData = (params) => {
  //   return new Promise((resolve, reject) => {
  //     getPayMemberAssetAccountGetAccountCheckRecord({memberAssetAccountId: id + ''}).then(res => {
  //       const { data } = res
  //       resolve(data)
  //     })
  //   })
  // }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.columns.tradeCode',
      }),
      dataIndex: 'tradeCode',
      key: 'tradeCode',
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.columns.tradeTime',
      }),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.columns.tradeMoney',
      }),
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) => `${operationMap[r.operation]['operator']} ${t.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.columns.operation',
      }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t, r) => operationMap[t]['title'],
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.columns.status',
      }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => <StatusTag title={statusMap[text]['title']} type={statusMap[text]['type']} />,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.columns.remark',
      }),
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  const moveColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.id',
      }),
      dataIndex: 'id',
      key: 'id',
      render: (t, c, i) => i + 1,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.parentMemberRoleName',
      }),
      dataIndex: ['memberAssetAccount', 'parentMemberRoleName'],
      key: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.status',
      }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <StatusTag title={moveStatusMap[text]['title']} type={moveStatusMap[text]['type']} />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.operation',
      }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t, r) => {
        return t === 1
          ? intl.formatMessage({
              id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.operation.1',
            })
          : intl.formatMessage({
              id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.operation.2',
            })
      },
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.createTime',
      }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.moveColumns.remark',
      }),
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  const handleRelieve = () => {
    setVisibleModal(true)
  }

  const handleCancel = () => {
    setVisibleModal(false)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      setVisibleModal(false)
      postPayMemberAssetAccountUpdateMemberAssetAccountEnable({
        id: details.id,
        status: details.accountStatus === 1 ? 2 : 1,
        ...values,
      }).then((res) => {
        if (res.code === 1000) getAccountInfo()
      })
    })
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.title',
      })}
      extra={[
        <Button
          key="1"
          onClick={handleRelieve}
          type="primary"
          icon={details?.accountStatus === 1 ? <SettingOutlined /> : <StopOutlined />}
          disabled={isDisabled}
        >
          {details?.accountStatus === 1
            ? intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.extra.1',
              })
            : intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.extra.2',
              })}
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.card.1',
          })}
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
                        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.card.1.rightTitle.1',
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
                        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.card.1.rightTitle.3',
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
                        id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.card.1.rightTitle.4',
                      })}
                    </p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>
                      {details?.accountStatus && (
                        <StatusTag
                          title={memberStatusMap[details.accountStatus]['title']}
                          type={memberStatusMap[details.accountStatus]['type']}
                        />
                      )}
                    </p>
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
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.card.2',
          })}
        >
          <StandardTable
            columns={columns}
            currentRef={refTrade}
            fetchTableData={(params: any) => fetchTradeData(params)}
          />
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({
            id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.card.3',
          })}
        >
          <Table columns={moveColumns} dataSource={moveRecord} pagination={false} />
          {/* <StandardTable
            columns={moveColumns}
            currentRef={refMove}
            fetchTableData={(params: any) => fetchMoveData(params)}
            tableProps={{
              pagination: false
            }}
          /> */}
        </Card>
      </Space>
      <Modal
        title={
          details?.accountStatus === 1
            ? intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.modal.title.1',
              })
            : intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.modal.title.2',
              })
        }
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="remark"
            label={
              details?.accountStatus === 1
                ? intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.modal.remark.1',
                  })
                : intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.modal.remark.2',
                  })
            }
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.modal.remark.message',
                }),
              },
              {
                validator: (r, v, c) => validatorByte(r, v, c, 120),
              },
            ]}
          >
            <TextArea
              rows={6}
              placeholder={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.memberAccountDetail.modal.remark.placeholder',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default AccountDetail

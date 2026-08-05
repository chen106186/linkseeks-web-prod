import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { Card, Space, Row, Col, Button, Table, Modal, Form, Input, InputNumber } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import moment from 'moment'
import type { ColumnType } from 'antd/lib/table/interface'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { moveStatusMap } from '../constant'
import { SettingOutlined } from '@ant-design/icons'
import { validatorByte } from '@/utils/regExp'
import dayjs from 'dayjs'
import {
  getPayPlatFormEAccountAllInPayGetEAccountStatusRecord,
  getPayPlatFormEAccountAllInPayGetEAccountTradeRecord,
  getPayPlatFormEAccountAllInPayGetPlatFormEAccount,
  postPayPlatFormEAccountAllInPayFreezeEAccount,
  postPayPlatFormEAccountAllInPayUnfreezeEAccount,
} from '@apps/apis'

const { TextArea } = Input

const EAccountDetail: React.FC = () => {
  const refTrade = useRef({} as ActionType)
  const [checkForm] = Form.useForm()
  const [moveRecord, setMoveRecord] = useState<any>()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const datesRef = useRef<any>([])
  const [accountStatus, setAccountStatus] = useState<number>() // 2冻结 1解冻
  const unfrizeenId = useRef<number>()
  const unfrizeenAmount = useRef<number>(0)

  const { id, memberId } = useQuery()

  const getAccountInfo = async () => {
    const res = await getPayPlatFormEAccountAllInPayGetPlatFormEAccount({ id, memberId } as any)
    const { code, data } = res
    setDetails(data)
    if (code === 1000) {
      const statusRecord = await getPayPlatFormEAccountAllInPayGetEAccountStatusRecord({ id: data.id + '' })
      setMoveRecord(statusRecord.data)
    }
  }

  useEffect(() => {
    getAccountInfo()
  }, [])

  // 获取交易记录
  const fetchTradeData = (params) => {
    const startTime = dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    params.startTime = dayjs(params.startTime).format('YYYY-MM-DD HH:mm:ss')
    params.endTime = dayjs(params.endTime).format('YYYY-MM-DD HH:mm:ss')
    return new Promise((resolve) => {
      getPayPlatFormEAccountAllInPayGetEAccountTradeRecord({ id: id + '', memberId, ...params } as any).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const disabledDate = (current) => {
    if (!datesRef.current || datesRef.current.length === 0) {
      return false
    }
    const tooLate = datesRef.current[0] && current.diff(datesRef.current[0], 'days') > 31
    const tooEarly = datesRef.current[1] && datesRef.current[1].diff(current, 'days') > 31
    return tooEarly || tooLate
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '商户订单号',
      dataIndex: 'bizOrderNo',
      key: 'bizOrderNo',
    },
    {
      title: '交易流水号',
      dataIndex: 'tradeNo',
      key: 'tradeNo',
    },
    {
      title: '交易时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      searchField: {
        type: 'DateRange',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        disabledDate: disabledDate,
        onCalendarChange: (val) => (datesRef.current = val),
      },
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '原始金额',
      dataIndex: 'oriAmount',
      key: 'oriAmount',
    },
    {
      title: '现有金额',
      dataIndex: 'curAmount',
      key: 'curAmount',
    },
    {
      title: '变更金额',
      dataIndex: 'chgAmount',
      key: 'chgAmount',
    },
    {
      title: '交易类型',
      dataIndex: 'tradeType',
      key: 'tradeType',
    },
    {
      title: '交易子类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '分账备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  const handleUnfreeze = (r) => {
    unfrizeenId.current = r.id
    unfrizeenAmount.current = r.amount
    setAccountStatus(1)
    setVisibleModal(true)
    checkForm.setFieldsValue({ amount: r.amount })
  }

  const moveColumns: ColumnType<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (t, c, i) => i + 1,
    },
    {
      title: '操作角色',
      dataIndex: 'memberRoleName',
      key: 'id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <StatusTag title={moveStatusMap[text]['title']} type={moveStatusMap[text]['type']} />,
    },
    {
      title: '操作类型',
      dataIndex: 'operation',
      key: 'operation',
      render: (t) => {
        return t === 2 ? '冻结资金账户' : '解冻资金账户'
      },
    },
    {
      title: '操作金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '意见',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (t, r) => {
        return r.status === 2 ? (
          <Button type="link" className="padLeft0" onClick={() => handleUnfreeze(r)}>
            解冻
          </Button>
        ) : null
      },
    },
  ]

  const handleRelieve = () => {
    setAccountStatus(2)
    setVisibleModal(true)
  }

  const handleCancel = () => {
    setVisibleModal(false)
  }

  // 冻结/解冻金额
  const handleOK = () => {
    setLoading(true)
    checkForm.validateFields().then((values) => {
      if (accountStatus === 1) {
        postPayPlatFormEAccountAllInPayUnfreezeEAccount({ id: unfrizeenId.current, ...values }).then((res) => {
          if (res.code === 1000) {
            getAccountInfo()
          }
          setLoading(false)
          setVisibleModal(false)
        })
      } else {
        postPayPlatFormEAccountAllInPayFreezeEAccount({ id: details.id, ...values }).then((res) => {
          if (res.code === 1000) {
            getAccountInfo()
          }
          setLoading(false)
          setVisibleModal(false)
        })
      }
    })
  }

  const validatorNumber = (rule, value, callback) => {
    try {
      if (value > unfrizeenAmount.current && accountStatus === 1) {
        throw new Error('解冻金额不能大于冻结金额')
      }
      callback()
    } catch (err) {
      callback(err)
    }
  }

  return (
    <PageHeaderWrapper
      title="账户详情"
      extra={[
        <Button key="1" onClick={handleRelieve} type="primary" icon={<SettingOutlined />}>
          冻结
        </Button>,
      ]}
      loading={!details}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card headStyle={{ borderBottom: 'none' }} title="账户信息">
          <Row gutter={100} style={{ marginRight: 0 }}>
            <Col span={8}>
              <div className={cx(styles.repayment, styles.repayinfo)}>
                <div className={styles['repayment-left']}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>可用余额(元)：</div>
                    <div className={styles['statistic-amount']}>
                      {`${(
                        (Number(details?.accountBalance || 0) * 100 - Number(details?.lockBalance || 0) * 100) /
                        100
                      ).toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                    <p className={styles.rightTitle}>可用余额(元)：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.usableBalance}</p>
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
                    <p className={styles.rightTitle}>冻结金额(元)：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.lockBalance?.toFixed(2)}</p>
                  </Col>
                </Row>
                {/* <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>账户状态：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>
                      {
                        details?.accountStatus &&
                        <StatusTag title={memberStatusMap[details.accountStatus]['title']} type={memberStatusMap[details.accountStatus]['type']} />
                      }
                    </p>
                  </Col>
                </Row> */}
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>开户认证：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.isAuth ? '是' : '否'}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <p className={styles.rightTitle}>电子协议签约：</p>
                  </Col>
                  <Col span={20}>
                    <p className={styles.rightInfo}>{details?.isSign ? '是' : '否'}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card headStyle={{ borderBottom: 'none' }} title="交易记录">
          <StandardFormTable
            columns={columns}
            actionRef={refTrade}
            autoScrollX
            rowKey="tradeNo"
            request={(params: any) => fetchTradeData(params)}
          />
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card headStyle={{ borderBottom: 'none' }} title="流转记录">
          <Table columns={moveColumns} dataSource={moveRecord} pagination={false} />
        </Card>
      </Space>
      <Modal
        title={accountStatus === 2 ? '会员冻结' : '会员解冻'}
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        destroyOnClose={true}
        confirmLoading={loading}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="amount"
            label={accountStatus === 2 ? '冻结金额' : '解冻金额'}
            rules={[
              {
                required: true,
                message: `请输入${accountStatus === 2 ? '冻结' : '解冻'}金额`,
              },
              {
                type: 'number',
                min: 0.01,
                message: `请正确输入${accountStatus === 2 ? '冻结' : '解冻'}金额`,
              },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: '金额仅保留两位小数',
              },
              {
                validator: validatorNumber,
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder={`请输入${accountStatus === 2 ? '冻结' : '解冻'}金额`}
            />
          </Form.Item>
          <Form.Item
            name="remark"
            label={accountStatus === 2 ? '会员冻结原因' : '会员解冻原因'}
            rules={[
              {
                required: true,
                message: '请填写原因',
              },
              {
                validator: (r, v, c) => validatorByte(r, v, c, 120),
              },
            ]}
          >
            <TextArea rows={6} placeholder="请填写原因" />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default EAccountDetail

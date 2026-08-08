import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { Card, Space, Row, Col, Button, Table, Modal, Form, Input } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import { formatTimeString } from '@/utils'
import type { ColumnType } from 'antd/lib/table/interface'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { memberStatusMap, moveStatusMap, operationMap, statusMap } from '../constant'
import { SettingOutlined, StopOutlined } from '@ant-design/icons'
import { validatorByte } from '@/utils/regExp'
import {
  getPayPlatFormAssetAccountGetAccountStatusRecord,
  getPayPlatFormAssetAccountGetAccountTradeRecord,
  getPayPlatFormAssetAccountGetPlatFormAssetAccount,
  postPayMemberAssetAccountUpdateMemberAssetAccountEnable,
} from '@apps/apis'

const { TextArea } = Input

const AccountDetail: React.FC = () => {
  const refTrade = useRef({} as ActionType)
  const [checkForm] = Form.useForm()
  const [moveRecord, setMoveRecord] = useState<any>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })

  const { id } = useQuery()

  const getAccountInfo = async () => {
    const res = await getPayPlatFormAssetAccountGetPlatFormAssetAccount({ id })
    const { code, data } = res
    setDetails(data)
    if (code === 1000) {
      const statusRecord = await getPayPlatFormAssetAccountGetAccountStatusRecord({
        memberAssetAccountId: data.id + '',
      })
      setMoveRecord(statusRecord.data)
    }
  }

  useEffect(() => {
    getAccountInfo()
  }, [])

  // 获取交易记录
  const fetchTradeData = (params) => {
    return new Promise((resolve) => {
      getPayPlatFormAssetAccountGetAccountTradeRecord({
        memberAssetAccountId: id + '',
        ...params,
      }).then((res) => {
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

  const moveColumns: ColumnType<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (t, c, i) => i + 1,
    },
    {
      title: '操作角色',
      dataIndex: ['memberAssetAccount', 'parentMemberManageRoleName'],
      key: 'id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any) => <StatusTag title={moveStatusMap[text]['title']} type={moveStatusMap[text]['type']} />,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (t) => {
        return t === 1 ? '冻结资金账户' : '解冻资金账户'
      },
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '意见',
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
      title="账户详情"
      extra={[
        <Button
          key="1"
          onClick={handleRelieve}
          type="primary"
          icon={details?.accountStatus === 1 ? <SettingOutlined /> : <StopOutlined />}
          disabled={isDisabled}
        >
          {details?.accountStatus === 1 ? '冻结' : '解冻'}
        </Button>,
      ]}
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
        title={details?.accountStatus === 1 ? '会员冻结' : '会员解冻'}
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="remark"
            label={details?.accountStatus === 1 ? '会员冻结原因' : '会员解冻原因'}
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

export default AccountDetail

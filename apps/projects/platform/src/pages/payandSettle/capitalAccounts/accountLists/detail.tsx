import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Space, Row, Col, Button, Table, Modal, message } from 'antd'
import { Card } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import defaultAvatar from '@/assets/imgs/default_avatar.svg'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import cx from 'classnames'
import moment from 'moment'
import { ColumnType } from 'antd/lib/table/interface'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import { rechargeSchema } from './schema'
import { memberStatusMap, moveStatusMap, operationMap, statusMap } from '../../constant'
import StandardTable from '@/components/StandardTable'
import QRCode from 'qrcode'
import { ScanOutlined } from '@ant-design/icons'
import {
  getPayAssetAccountGetAccountStatusRecord,
  getPayAssetAccountGetAccountTradeRecord,
  getPayAssetAccountGetAssetAccount,
  getPayAssetAccountGetRechargeResult,
  postPayAssetAccountRecharge,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getWebIntl } from '@apps/locales'
interface rechargeItem {
  codeUrl: string
  tradeRecordId: number
}

const translate = getWebIntl()
const schemaActions = createFormActions()

let timeChange // Tiemr

const AccountDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const modalRef = useRef<any>()
  const refTrade = useRef<any>({})
  const [moveData, setMoveData] = useState<any>()
  const [details, setDetails] = useState<any>({ accountBalance: 0, lockBalance: 0 })
  const [pageId, setPageId] = useState<any>()
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false)
  const [scanVisible, setScanVisible] = useState<boolean>(false)
  const [qrCode, setQrCode] = useState('')
  const [renderCodeCharacter, setRenderCodeCharacter] = useState<rechargeItem>()
  const [rechargeType, setRechargeType] = useState<number>()
  const { id } = useQuery()
  useEffect(() => {
    getAccountInfo()
    clearInterval(timeChange)
  }, [])

  //timer
  const [openTimer, setOpenTimer] = useState(0) // timer
  useEffect(() => {
    if (openTimer === 1) {
      runTimerJump()
    } else {
      clearInterval(timeChange)
    }
  }, [openTimer])
  const runTimerJump = () => {
    timeChange = setInterval(() => pollPayResult(), 3000)
  }

  useEffect(() => {
    if (renderCodeCharacter?.codeUrl) {
      generateQrCode()
    }
  }, [renderCodeCharacter])

  const getAccountInfo = async () => {
    setPageId(id)
    let res = await getPayAssetAccountGetAssetAccount({ id })
    const { code, data } = res
    setDetails(data)
    getPayAssetAccountGetAccountStatusRecord({ memberAssetAccountId: id + '' }).then((res) => {
      const { data } = res
      setMoveData(data)
    })
    refTrade.current.reloadCurrent()
  }

  // 获取交易记录
  const fetchTradeData = (params) => {
    return new Promise((resolve, reject) => {
      getPayAssetAccountGetAccountTradeRecord({ memberAssetAccountId: id + '', ...params }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const generateQrCode = () => {
    // 生成二维码
    QRCode.toDataURL(renderCodeCharacter.codeUrl)
      .then((url: any) => {
        setQrCode(url)
        // 轮询支付结果
        setOpenTimer(1)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  const pollPayResult = () => {
    if (renderCodeCharacter?.tradeRecordId) {
      getPayAssetAccountGetRechargeResult({ tradeRecordId: renderCodeCharacter.tradeRecordId }).then((res) => {
        console.log(res)
        if (res.code === 1000) {
          if (res.data) {
            clearInterval(timeChange)
            setScanVisible(false)
            Modal.success({
              content: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.success' }),
            })
            getAccountInfo()
          }
        } else {
          message.error(intl.formatMessage({ id: `${res.code}` }))
        }
      })
    }
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.columns.tradeCode' }),
      dataIndex: 'tradeCode',
      key: 'tradeCode',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.columns.tradeTime' }),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.columns.tradeMoney' }),
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) => `${operationMap[r.operation]['operator']} ${t.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.columns.operation' }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t, r) => operationMap[t]['title'],
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => <StatusTag title={statusMap[text]['title']} type={statusMap[text]['type']} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.columns.remark' }),
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  const moveColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.id' }),
      dataIndex: 'id',
      key: 'id',
      render: (t, c, i) => i + 1,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.parentMemberRoleName',
      }),
      dataIndex: ['memberAssetAccount', 'parentMemberRoleName'],
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <StatusTag title={moveStatusMap[text]['title']} type={moveStatusMap[text]['type']} />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.operation',
      }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t, r) => {
        return t === 1
          ? intl.formatMessage({
              id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.operation.1',
            })
          : intl.formatMessage({
              id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.operation.2',
            })
      },
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.createTime',
      }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.moveColumns.remark' }),
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  const handleConfirm = () => {
    schemaActions.submit()
  }

  const handleCannel = () => {}

  const handleSubmit = (value) => {
    // 提交重置
    setIsBtnLoading(true)
    setRechargeType(value['type'][0])
    let parasm = {
      memberAssetAccountId: pageId,
      money: Number(value.money),
      type: value['type'][0],
    }
    postPayAssetAccountRecharge(parasm, { ctlType: 'none', penetrateError: true }).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        modalRef.current.setVisible(false)
        setScanVisible(true)
        setRenderCodeCharacter(data)
      } else {
        message.error(res.message)
      }
      setIsBtnLoading(false)
    })
  }

  const handleRecharge = () => {
    modalRef.current.setVisible(true)
  }

  const handleScan = () => {
    setScanVisible(false)
    getAccountInfo()
    refTrade.current.reloadCurrent()
    setOpenTimer(0)
  }

  return (
    <PageHeaderWrapper
      title={
        details?.parentMemberName ||
        intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.title' })
      }
      titleIcon={details?.memberLogo || defaultAvatar}
      bodyStyle={{ marginTop: -12 }}
      isAnchor
      items={[
        {
          key: 'card1',
          label: intl.formatMessage({
            id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.1',
            defaultMessage: '账户信息',
          }),
        },
        {
          key: 'card2',
          label: intl.formatMessage({
            id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.2',
            defaultMessage: '交易记录',
          }),
        },
        {
          key: 'card3',
          label: intl.formatMessage({
            id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.3',
            defaultMessage: '流转记录',
          }),
        },
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          id="card1"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.1' })}
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
                    <span className={styles['repayment-time']}>{details?.parentMemberName}</span>
                  </div>
                </div>
                <div className={styles.rightActions}>
                  {/* <AuthButton type="custom" code="Recharge"> */}
                  <Button className={styles.rightAction} type="primary" onClick={handleRecharge}>
                    {intl.formatMessage({
                      id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.1.button.1',
                    })}
                  </Button>
                  {/* </AuthButton> */}
                  {/* <AuthButton type="custom" code="Withdrawal"> */}
                  <Button
                    className={styles.rightAction}
                    onClick={() =>
                      history.push(`/payandSettle/capitalAccounts/accountLists/applyWithdraw?id=${details?.id}`)
                    }
                  >
                    {intl.formatMessage({
                      id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.1.button.2',
                    })}
                  </Button>
                  {/* </AuthButton> */}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.infoRight}>
                <Row>
                  <div className={styles.rightTitle}>
                    {intl.formatMessage({
                      id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.1.rightTitle.1',
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
                      id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.1.rightTitle.3',
                    })}
                  </div>
                  <div className={styles.rightInfo}>{details?.lockBalance?.toFixed(2)}</div>
                </Row>
                <Row>
                  <div className={styles.rightTitle}>
                    {intl.formatMessage({
                      id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.1.rightTitle.4',
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
          id="card2"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.2' })}
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
          id="card3"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.card.3' })}
        >
          <Table columns={moveColumns} dataSource={moveData} pagination={false} />
        </Card>
      </Space>
      <ModalForm
        modalTitle={intl.formatMessage({
          id: 'payandSettle.capitalAccounts.accountLists.accountDetail.modal.1.modalTitle',
        })}
        currentRef={modalRef}
        schema={rechargeSchema}
        actions={schemaActions}
        confirm={handleConfirm}
        onSubmit={handleSubmit}
        cancel={handleCannel}
        modalProps={{
          okText: intl.formatMessage({
            id: 'payandSettle.capitalAccounts.accountLists.accountDetail.modal.1.modalTitle',
          }),
          confirmLoading: isBtnLoading,
          destroyOnClose: true,
        }}
        // effects={($, {setFieldState}) => {
        //   $('onFieldInit', 'type').subscribe(parentState => {
        // getPayMemberPayList({memberId: details.memberId, memberType: details.memberLevelType}).then(res => {
        //   console.log(res, 'res')
        // })
        // setFieldState('type', state => {
        //   state.props["x-component-props"].dataSource = []
        // });
        //   })
        // }}
      />
      {/* 扫码充值 */}
      <Modal
        title={intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.modal.2.title' })}
        visible={scanVisible}
        onOk={handleScan}
        onCancel={handleScan}
      >
        <div className={styles.qrCodeImage}>
          <img src={qrCode} alt="" />
          <div className={styles.scanTips}>
            <ScanOutlined className={styles.scanIcon} />
            <span>
              {rechargeType === 2
                ? intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.modal.2.button.1' })
                : intl.formatMessage({
                    id: 'payandSettle.capitalAccounts.accountLists.accountDetail.modal.2.button.2',
                  })}
              <br />
              {intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.accountDetail.modal.2.br' })}
            </span>
          </div>
        </div>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default AccountDetail

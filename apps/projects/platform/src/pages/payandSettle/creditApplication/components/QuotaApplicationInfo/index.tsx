import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Descriptions, Upload, Card, Button, Modal, message } from 'antd'
import { FormOutlined, RightCircleFilled } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { FileData } from '@/utils'
import MellowCard from '@/components/MellowCard'
import NiceForm from '@/components/NiceForm'
import { editModalSchema } from './schema'
import { createEffects } from './effects'
import styles from './index.less'

const formActions = createFormActions()
const { onFormInit$ } = FormEffectHooks

interface QuotaApplicationInfo {
  editable?: boolean
  onSubmit?: (values: { [key: string]: any }) => void
  // 授信申请信息
  quotaInfo: {
    // 现有额度
    originalQuota: number
    // 申请调整额度
    applyQuota: number
    // 申请调整账单日期
    billDay: number
    // 申请还款周期
    repayPeriod: number
    // 申请时间
    applyTime: string
    // 申请附件
    fileList: FileData[]
  }
  // 授信审批信息
  verify: {
    // 审批额度
    quota: number
    // 审批账单日期
    billDay: number
    // 审批账单生成后还款周期
    repayPeriod: number
    // 审批时间
    verifyTime: string
    // 最大申请额度
    maxApplyQuota: number
  } | null
}

const QuotaApplicationInfo: React.FC<QuotaApplicationInfo> = ({
  editable = false,
  onSubmit,
  quotaInfo = {},
  verify,
}) => {
  const intl = useIntl()
  const [modalVisible, setModalVisible] = useState(false)

  // 最大申请额度，没有审批信息说明是第一次申请
  // 第一次申请 最大值取 支付配置的默认额度，否则取审批信息的最大值数据
  const maxQuota = !verify ? quotaInfo.applyQuota : verify.maxApplyQuota

  const handleSubmit = (values) => {
    if (onSubmit) {
      const { applyQuota, billDay, repayPeriod, quotaSlide, fileList, ...rest } = values

      onSubmit({
        applyQuota: +applyQuota,
        billDay: +billDay,
        repayPeriod: +repayPeriod,
        fileList: fileList.filter((item) => item.status === 'done'),
        ...rest,
      })
      setModalVisible(false)
    }
  }

  const MinMarks = (
    <div
      style={{
        textAlign: 'left',
        position: 'relative',
        left: '4px',
      }}
    >
      <div>{quotaInfo.originalQuota}</div>
      <div>{intl.formatMessage({ id: 'payandSettle.creditApplication.components.quotaApplicationInfo.minMarks' })}</div>
    </div>
  )

  const MaxMarks = (
    <div
      style={{
        textAlign: 'right',
        position: 'relative',
        left: '-20px',
      }}
    >
      <div>{maxQuota}</div>
      <div>{intl.formatMessage({ id: 'payandSettle.creditApplication.components.quotaApplicationInfo.maxMarks' })}</div>
    </div>
  )

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(
        intl.formatMessage({ id: 'payandSettle.creditApplication.components.quotaApplicationInfo.warning' }),
      )
      return Upload.LIST_IGNORE
    }
    return Promise.resolve()
  }

  return (
    <>
      <Row
        gutter={24}
        style={{
          marginBottom: 24,
        }}
      >
        <Col span={verify ? 14 : 24}>
          <MellowCard
            title={intl.formatMessage({ id: 'payandSettle.creditApplication.components.quotaApplicationInfo.title' })}
            extra={
              <>
                {editable && (
                  <Button
                    type="link"
                    icon={<FormOutlined />}
                    disabled={!quotaInfo || !quotaInfo.applyQuota}
                    onClick={() => setModalVisible(true)}
                  >
                    {intl.formatMessage({ id: 'payandSettle.creditApplication.components.quotaApplicationInfo.extra' })}
                  </Button>
                )}
              </>
            }
            fullHeight
          >
            <Card
              type="inner"
              style={{
                background: '#EBECF0',
              }}
            >
              <Row gutter={40}>
                <Col span={8}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>
                      {intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.1',
                      })}
                    </div>
                    <div className={styles['statistic-amount']}>
                      <Row align="middle" justify="space-between">
                        <Col span={14}>{quotaInfo.originalQuota}</Col>
                        <Col span={8}>
                          <div className={styles.adjustment}>
                            {intl.formatMessage({
                              id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.1.text',
                            })}
                            <RightCircleFilled style={{ marginLeft: 10 }} />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>
                      {intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.2',
                      })}
                    </div>
                    <div className={styles['statistic-amount']}>{quotaInfo.applyQuota}</div>
                  </div>

                  <Descriptions
                    column={1}
                    style={{
                      marginTop: 25,
                    }}
                  >
                    <Descriptions.Item
                      label={intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.2.descriptions.1',
                      })}
                    >
                      {quotaInfo.billDay}
                      {intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.2.descriptions.1.text',
                      })}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.2.descriptions.2',
                      })}
                    >
                      {quotaInfo.repayPeriod}
                      {intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.2.descriptions.2.text',
                      })}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.2.descriptions.3',
                      })}
                    >
                      {quotaInfo.applyTime}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={8}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>
                      {intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.3',
                      })}
                    </div>
                  </div>

                  <Upload fileList={quotaInfo.fileList} disabled />
                </Col>
              </Row>
            </Card>
          </MellowCard>
        </Col>

        {verify ? (
          <Col span={10}>
            <MellowCard
              title={
                <div style={{ color: '#fff' }}>
                  {intl.formatMessage({ id: 'payandSettle.creditApplication.components.quotaApplicationInfo.title.2' })}
                </div>
              }
              style={{
                background: '#4279DF',
              }}
              fullHeight
            >
              <div className={styles.approval}>
                <div className={styles['approval-amountWrap']}>
                  <Descriptions column={1}>
                    <Descriptions.Item
                      label={intl.formatMessage({
                        id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.4.descriptions.1',
                      })}
                    >
                      <div className={styles['approval-amount']}>{verify.quota}</div>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <Descriptions column={1}>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.4.descriptions.2',
                    })}
                  >
                    {verify.billDay}
                    {intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.4.descriptions.2.text',
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.4.descriptions.3',
                    })}
                  >
                    {verify.repayPeriod}
                    {intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.4.descriptions.3.text',
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.quotaApplicationInfo.col.4.descriptions.4',
                    })}
                  >
                    {verify.verifyTime}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </MellowCard>
          </Col>
        ) : null}
      </Row>

      <Modal
        title={intl.formatMessage({ id: 'payandSettle.creditApplication.components.quotaApplicationInfo.modal' })}
        width={576}
        visible={modalVisible}
        onOk={() => formActions.submit()}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <NiceForm
          previewPlaceholder=""
          layout="vertical"
          initialValues={quotaInfo}
          effects={($, actions) => {
            const { setFieldState, setFieldValue } = actions

            onFormInit$().subscribe(() => {
              // 初始化数据
              setFieldState('applyQuota', (fileState) => {
                fileState.rules = fileState.rules.concat({
                  validator(value) {
                    return +value > maxQuota
                      ? intl.formatMessage({
                          id: 'payandSettle.creditApplication.components.quotaApplicationInfo.modal.validator',
                        })
                      : ''
                  },
                })
              })
              setFieldState('quotaSlide', (fileState) => {
                fileState.value = maxQuota
                fileState.props['x-component-props'].min = quotaInfo.originalQuota
                fileState.props['x-component-props'].max = maxQuota
                fileState.props['x-component-props'].marks = {
                  [quotaInfo.originalQuota || 0]: {
                    label: MinMarks,
                  },
                  [maxQuota]: {
                    label: MaxMarks,
                  },
                }
              })
            })

            createEffects($, actions)
          }}
          expressionScope={{
            MinMarks,
            MaxMarks,
            beforeUpload,
          }}
          actions={formActions}
          schema={editModalSchema}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  )
}

export default QuotaApplicationInfo

import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import { Card, Space, Descriptions, Row, Col, Upload, Button, Modal } from '@linkseeks/ui'
import { FormOutlined, RightCircleFilled } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { FileData } from '@/utils'
import MellowCard from '@/components/MellowCard'
import NiceForm from '@/components/NiceForm'
import { editModalSchema } from './schema'
import { createEffects } from './effects'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const formActions = createFormActions()
const { onFormInit$ } = FormEffectHooks
const translate = getWebIntl()
export interface QuotaInfoData {
  /**
   * 现有额度
   */
  originalQuota: number
  /**
   * 申请调整额度
   */
  applyQuota: number
  /**
   * 申请调整账单日期
   */
  billDay: number
  /**
   * 申请还款周期
   */
  repayPeriod: number
  /**
   * 申请时间
   */
  applyTime: string
  /**
   * 申请附件
   */
  fileList: FileData[]
  /**
   * 申请类型 1-外部 2-内部
   */
  applyType: number
}

export interface VerifyData {
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
}
interface QuotaApplicationInfo {
  editable?: boolean
  onSubmit?: (values: { [key: string]: any }) => Promise<unknown>
  /**
   * 授信申请信息
   */
  quotaInfo: QuotaInfoData
  /**
   * 授信审批信息
   */
  verify: VerifyData | null
}

const QuotaApplicationInfo: React.FC<QuotaApplicationInfo> = ({
  editable = false,
  onSubmit,
  quotaInfo = {},
  verify,
}) => {
  const intl = useIntl()
  const [modalVisible, setModalVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = (values) => {
    if (onSubmit) {
      setSubmitLoading(true)
      const { quota, billDay, repayPeriod, quotaSlide, ...rest } = values

      onSubmit({
        quota: +quota,
        billDay: +billDay,
        repayPeriod: +repayPeriod,
        ...rest,
      })
        .then(() => {
          setModalVisible(false)
        })
        .finally(() => {
          setSubmitLoading(false)
        })
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
      <div>{intl.formatMessage({ id: 'payandSettle.creditManage.components.quotaApplicationInfo.minMarks' })}</div>
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
      <div>{verify?.maxApplyQuota}</div>
      <div>{intl.formatMessage({ id: 'payandSettle.creditManage.components.quotaApplicationInfo.maxMarks' })}</div>
    </div>
  )

  return (
    <>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card
          title={intl.formatMessage({
            id: 'payandSettle.creditManage.components.quotaApplicationInfo.title',
            defaultMessage: '授信申请信息',
          })}
        >
          <Row gutter={16}>
            <Col xl={12} xs={24}>
              <div className={styles['quota-list']}>
                <div className={cx(styles['quota-list-item'], styles.blue)}>
                  <div className={styles['quota-list-item-title']}>
                    <div className={styles['quota-list-item-title-tag']}>
                      {`${translate('web.resource.payment.shenqingtiaozhengedu')}(${translate(
                        'web.common.currencySymbol',
                      )})`}
                    </div>
                  </div>
                  <div className={styles['quota-list-item-content']}>
                    <span>{quotaInfo.applyQuota}</span>
                  </div>
                </div>
                <div className={styles['quota-list-item']}>
                  <div className={styles['quota-list-item-title']}>
                    <div className={styles['quota-list-item-title-tag']}>
                      {`${translate('web.resource.payment.xianyouedu')}(${translate('web.common.currencySymbol')})`}
                    </div>
                  </div>
                  <div className={styles['quota-list-item-content']}>
                    <span>{quotaInfo.originalQuota}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={12} xs={24}>
              <Descriptions column={1}>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.2.descriptions.1',
                  })}
                >
                  {quotaInfo.billDay}
                  {intl.formatMessage({
                    id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.2.descriptions.1.text',
                  })}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.2.descriptions.2',
                  })}
                >
                  {quotaInfo.repayPeriod}
                  {intl.formatMessage({
                    id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.2.descriptions.2.text',
                  })}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.2.descriptions.3',
                  })}
                >
                  {quotaInfo.applyTime}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.3' })}
                >
                  <Upload fileList={quotaInfo.fileList} disabled />
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
        {verify && (
          <Card
            title={intl.formatMessage({
              id: 'payandSettle.creditManage.components.quotaApplicationInfo.title.2',
              defaultMessage: '授信审批信息',
            })}
            extra={
              <>
                {editable && (
                  <Button type="link" icon={<FormOutlined />} onClick={() => setModalVisible(true)}>
                    {intl.formatMessage({ id: 'payandSettle.creditManage.components.quotaApplicationInfo.extra' })}
                  </Button>
                )}
              </>
            }
          >
            <Row gutter={16}>
              <Col xl={12} xs={24}>
                <div className={styles['quota-list']}>
                  <div className={cx(styles['quota-list-item'], styles.green)}>
                    <div className={styles['quota-list-item-title']}>
                      <div className={styles['quota-list-item-title-tag']}>
                        {intl.formatMessage({
                          id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.4.descriptions.1',
                        })}
                      </div>
                    </div>
                    <div className={styles['quota-list-item-content']}>
                      <span>{verify?.quota}</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={12} xs={24}>
                <Descriptions column={1}>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.4.descriptions.2',
                    })}
                  >
                    {verify?.billDay}
                    {intl.formatMessage({
                      id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.4.descriptions.2.text',
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.4.descriptions.3',
                    })}
                  >
                    {verify?.repayPeriod}
                    {intl.formatMessage({
                      id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.4.descriptions.2.text',
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'payandSettle.creditManage.components.quotaApplicationInfo.col.4.descriptions.4',
                    })}
                  >
                    {verify?.verifyTime}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        )}
      </Space>
      <Modal
        title={intl.formatMessage({ id: 'payandSettle.creditManage.components.quotaApplicationInfo.modal.title' })}
        width={576}
        open={modalVisible}
        confirmLoading={submitLoading}
        onOk={() => formActions.submit()}
        onCancel={() => setModalVisible(false)}
        className={styles.modal}
        destroyOnClose
      >
        <NiceForm
          previewPlaceholder=""
          layout="vertical"
          initialValues={verify}
          effects={($, actions) => {
            const { setFieldState, setFieldValue } = actions

            onFormInit$().subscribe(() => {
              // 初始化数据
              setFieldState('quota', (fileState) => {
                fileState.rules = fileState.rules.concat({
                  validator(value) {
                    return +value > verify?.maxApplyQuota
                      ? intl.formatMessage({
                          id: 'payandSettle.creditManage.components.quotaApplicationInfo.modal.validator',
                        })
                      : ''
                  },
                })
              })
              setFieldState('quotaSlide', (fileState) => {
                fileState.value = verify?.maxApplyQuota
                fileState.props['x-component-props'].min = quotaInfo.originalQuota
                fileState.props['x-component-props'].max = verify?.maxApplyQuota
                fileState.props['x-component-props'].marks = {
                  [quotaInfo.originalQuota || 0]: {
                    label: MinMarks,
                  },
                  [verify?.maxApplyQuota]: {
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
          }}
          actions={formActions}
          schema={editModalSchema}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  )
}

export default React.memo(QuotaApplicationInfo)

import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Row, Col } from 'antd'
import ReturnEle from '@/components/ReturnEle'
import { SaveOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import MellowCard from '@/components/MellowCard'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import { formatTimeString } from '@/utils'
import styles from './index.less'
import {
  getPurchaseExpertExtractRecordGetExpertExtractRecord,
  postPurchaseExpertExtractRecordUpdateExpertExtractRecordStatus,
} from '@apps/apis'
const intl = getIntl()
const approvedActions = createFormActions()

const ExtractNoticeManageDetail: React.FC = () => {
  const {
    id,
    preview,
    pageStatus,
    status, // 1确认 2拒绝 null查看
    action, // 1操作 null查看
  } = usePageStatus()
  const currentRef = useRef<any>({})
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [inviterInfo, setInviterInfo] = useState<any>({})
  const [initValue, setInitValue] = useState<any>(() => {
    if (Number(status)) {
      return {
        id,
        status: true,
      }
    } else {
      return {
        id,
        status: false,
      }
    }
  })

  useEffect(() => {
    if (id) {
      getPurchaseExpertExtractRecordGetExpertExtractRecord({ id }).then((res) => {
        const { code, data } = res
        if (code === 1000) setInviterInfo(data.inviteTender)
      })
    }
  }, [id])

  const onSubmit = () => {
    currentRef.current.setVisible(true)
  }

  const onConfirm = () => {
    approvedActions.submit()
  }

  const handleSubmit = (value) => {
    postPurchaseExpertExtractRecordUpdateExpertExtractRecordStatus({
      ...value,
      id,
      status: status === '1' ? true : status === '2' ? false : null,
    }).then((res) => {
      const { code } = res
      if (code === 1000) {
        setTimeout(() => {
          history.goBack()
        }, 600)
      }
    })
  }

  const clickPreviewDetail = () => {
    history.push(`/procurementAbility/callForBids/callForBidsSearch/detail?id=${inviterInfo['id']}`)
  }

  return (
    <PageHeaderWrapper
      style={{ margin: 0 }}
      title={intl.formatMessage({ id: 'table.purchase.zhuanjiachouqutong' })}
      extra={
        action && [
          <Button key="1" onClick={onSubmit} loading={btnLoading} type="primary" icon={<SaveOutlined />}>
            {intl.formatMessage({ id: 'table.purchase.tijiao' })}
          </Button>,
        ]
      }
    >
      <MellowCard
        title={intl.formatMessage({ id: 'table.purchase.zhaobiaojibenxin' })}
        style={{ marginTop: 24 }}
        bordered={false}
        fullHeight
      >
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.zhaobiaobianhao' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>
              <a onClick={clickPreviewDetail}>{inviterInfo?.code}</a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{inviterInfo?.inviteTenderInStatusValue}</p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{inviterInfo?.memberName}</p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.fabushijian' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{formatTimeString(inviterInfo?.createTime)}</p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.zhaobiaoxiangmu' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{inviterInfo?.projectName}</p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.zhaobiaozhaiyao' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{inviterInfo?.remark}</p>
          </Col>
        </Row>
      </MellowCard>
      <MellowCard
        title={intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' })}
        style={{ marginTop: 24 }}
        bordered={false}
        fullHeight
      >
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiushi' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{`${formatTimeString(
              inviterInfo?.evaluationStartTime,
            )} ~ ${formatTimeString(inviterInfo?.evaluationEndTime)}`}</p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{inviterInfo?.evaluationRequirement}</p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiufu' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>
              {inviterInfo?.evaluationFile?.length
                ? inviterInfo.evaluationFile.map((item) => (
                    <div>
                      <a href={item.url} target="_blank">
                        {item.name}
                      </a>
                    </div>
                  ))
                : null}
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.shifouzaixianping' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>
              {inviterInfo?.isOnlineEvaluation
                ? intl.formatMessage({ id: 'table.purchase.shi' })
                : intl.formatMessage({ id: 'table.purchase.fou' })}
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p className={styles.cardListTitle}>{intl.formatMessage({ id: 'table.purchase.pingbiaoxiangmuban' })}:</p>
          </Col>
          <Col span={18}>
            <p className={styles.cardListText}>{inviterInfo?.templateName}</p>
          </Col>
        </Row>
      </MellowCard>
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'table.purchase.tijiaoyuanyin' })}
        currentRef={currentRef}
        confirm={onConfirm}
        onSubmit={handleSubmit}
        initialValues={initValue}
        actions={approvedActions}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
              },
              properties: {
                remark: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({ id: 'table.purchase.zaicishuruni30' }),
                  },
                  title: intl.formatMessage({ id: 'table.purchase.yuanyin' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'table.purchase.qingshuruyuanyin' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 30,
                    },
                  ],
                },
                status: {
                  type: 'boolean',
                  title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
                  visible: false,
                },
                id: {
                  type: 'number',
                  title: 'ID',
                  visible: false,
                },
              },
            },
          },
        }}
        effects={($, ctx) => {
          $('onFieldValueChange', 'status').subscribe(async (parentState) => {
            ctx.setFieldState(
              'remark',
              (state) =>
                (state.props.title = parentState.initialValue
                  ? intl.formatMessage({ id: 'table.purchase.querenyuanyin' })
                  : intl.formatMessage({ id: 'table.purchase.jujueyuanyin' })),
            )
          })
        }}
        modalProps={{ confirmLoading: loading }}
      />
    </PageHeaderWrapper>
  )
}

export default ExtractNoticeManageDetail

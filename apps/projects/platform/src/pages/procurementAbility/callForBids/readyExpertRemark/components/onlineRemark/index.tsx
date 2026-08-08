import React, { useState } from 'react'
import { Input, Checkbox, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import style from './index.less'
import { useRemarkTable } from '../../effects/useRemarkTable'
import NiceForm from '@/components/NiceForm'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useRemarkDetail } from '../../effects/useRemarkDetail'
import { getIntl } from '@linkseeks/i18n'

/**
 * 评标报告
 */
const intl = getIntl()

export interface RemarkBidReportProps {
  cardTitle?: string
  addSchemaAction?: ISchemaFormActions | ISchemaFormAsyncActions
  onConfirm?: any
}

const OnlineRemark: React.FC<RemarkBidReportProps> = ({ cardTitle, addSchemaAction, onConfirm }) => {
  const { formContext, id } = useRemarkDetail({ type: 'callForBid' })
  const { data } = formContext

  const { remarkColumns, remarkComponents } = useRemarkTable(addSchemaAction, data)

  const [initFormValue, setInitFormValue] = useState<any>({})
  const [evaluationTenderList, setEvaluationTenderList] = useState<any>()

  const onChangeInput = (v, index) => {
    // console.log(v.target.value, index)
  }

  const handleSubmit = (values) => {
    onConfirm && onConfirm(values)
  }

  const onBlurInput = (v, index) => {
    const hasValues = addSchemaAction.getFieldValue('evaluationTenderList')
    if (hasValues.length) {
      addSchemaAction.setFieldValue(
        'evaluationTenderList',
        hasValues.map((item, _i) => {
          if (index === _i) {
            return {
              ...item,
              isRecommend: true,
              reason: v.target.value,
            }
          } else {
            return { ...item }
          }
        }),
      )
    }
  }

  const chanegChecked = (e) => {
    const ev: any = window.event || e
    const path = ev.path || (ev.composedPath && ev.composedPath())
    if (e.target.checked) {
      path[6].style.border = '1px solid #00A98F'
      path[6].nextSibling.style.display = 'inline-block'
    } else {
      path[6].style.border = '1px solid #F4F5F7'
      path[6].nextSibling.style.display = 'none'
    }
  }

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
      <div className={style.remarkBidReportWrapper}>
        <div className={style.remarkRecordContainer}>
          <div className={style.remarkRecordHead}>
            <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.pingbiaojilu' })}</div>
          </div>
          <NiceForm
            // loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={{
              type: 'object',
              properties: {
                evaluationTenderList: {
                  type: 'array',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{remarkColumns}}',
                    components: '{{remarkComponents}}',
                    pagination: false,
                    scroll: { x: true },
                  },
                },
                memberList: {
                  type: 'array',
                  title: intl.formatMessage({ id: 'table.purchase.toubiaohuiyuanbei' }),
                  visible: false,
                },
                templateContentList: {
                  type: 'array',
                  title: intl.formatMessage({ id: 'table.purchase.pingfenxizebei' }),
                  visible: false,
                },
              },
            }}
            onSubmit={handleSubmit}
            effects={($, ctx) => {
              $('onFormMount').subscribe(async () => {
                $('onFieldValueChange', 'evaluationTenderList').subscribe((state) => {
                  console.log(state.value, 'vvv')
                  setEvaluationTenderList(state.value)
                })
              })
            }}
            expressionScope={{
              remarkColumns,
              remarkComponents,
            }}
          />
        </div>
        <div className={style.bidMemberContainer}>
          <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.tuijianzhongbiaohui' })}</div>
          <Row gutter={[16, 0]}>
            {evaluationTenderList?.length
              ? evaluationTenderList.map((item, index) => (
                  <Col span={4} key={item.memberId}>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={20}>
                          <p style={{ fontWeight: 'bold' }}>{item.memberName}</p>
                        </Col>
                        <Col>
                          <p style={{ fontWeight: 'bold' }}>{item.totalScore}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={20}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'table.purchase.tuijianzhongbiao' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>
                            <Checkbox defaultChecked={false} style={{ marginRight: 16 }} onChange={chanegChecked} />
                          </p>
                        </Col>
                      </Row>
                    </div>
                    <div style={{ marginTop: 12, display: 'none', width: '100%' }}>
                      <p className={style['card-list_title']}>
                        &nbsp;&nbsp;{intl.formatMessage({ id: 'table.purchase.tuijianliyou' })}:
                      </p>
                      <Input
                        placeholder={intl.formatMessage({ id: 'table.purchase.qingshurutuijian' })}
                        onChange={(e) => onChangeInput(e, index)}
                        onBlur={(e) => onBlurInput(e, index)}
                      />
                    </div>
                  </Col>
                ))
              : null}
          </Row>
        </div>
      </div>
    </MellowCard>
  )
}

OnlineRemark.defaultProps = {}

export default OnlineRemark

import React, { useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Row, Col, Radio, Table, message } from 'antd'
import style from './index.less'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { ReportDetailContext } from '@/pages/procurement/_public/bid/context'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import { useReportDetail } from '../effects/useReportDetail'
import TransferProcess, { TransferEnum } from '@/pages/procurement/components/transferProcess'
import { anchorTitleList, basicColumnList, evaluationColumnList, insideRecordCols, outReocrdCols } from '../constant'
import MellowCard from '@/components/MellowCard'
import { findLastIndexFlowState } from '@/utils'
import RemarkBidReport from '../components/remarkBidReport'
import { createFormActions } from '@apps/formily'
import { SendOutlined } from '@ant-design/icons'
import { postPurchaseExpertExtractReportSubmitEvaluationTenderReport } from '@apps/apis'

const addSchemaAction = createFormActions()
const intl = getIntl()

const readySubmitReportDetail: React.FC = () => {
  const { formContext, id, action } = useReportDetail({ type: 'callForBid' })
  const { data, externalProcurementOrderLogResponses, interiorProcurementOrderLogResponses, submitData } = formContext

  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)
  const [loading, setLoading] = useState<boolean>(false)

  const RenderBasicInfoColumns = ({ infoList = [], dataSource }) => (
    <Row>
      {infoList.map(({ span, fieldList = [] }, index) => (
        <Col key={index} span={span}>
          {fieldList.length
            ? fieldList.map((_v, _i) => (
                <Row key={_v.name} className={style['card-list']} style={_v.rowStyle}>
                  {_v?.noTitle ? null : (
                    <Col span={6} className={style['card-list_title']}>
                      {_v.title}
                    </Col>
                  )}
                  <Col>{_v.render ? _v.render(dataSource[_v.name], dataSource) : dataSource[_v.name]}</Col>
                </Row>
              ))
            : null}
        </Col>
      ))}
    </Row>
  )

  const handleChangeType = (e) => {
    setTransferRadio(e.target.value)
  }

  const handleSubmit = () => {
    setLoading(true)
    const { fileList, recommandList, childTableData, offlineData } = submitData
    let params: any = { id }
    if (recommandList && recommandList.length) {
      params.evaluationTenderRecommendList = recommandList.filter((item) => !item?.id)
    }
    params.evaluationTenderFile = fileList

    // 在线
    if (data.isOnlineEvaluation) {
      params.evaluationTenderReportMemberList = childTableData?.length
        ? childTableData[0].map((item) => ({ memberId: item.memberId, correctScore: item.modifyTotal }))
        : []
      if (!params.evaluationTenderReportMemberList.length) {
        setLoading(false)
        return message.error(
          intl.formatMessage({ id: 'table.purchase.submit.text', defaultMessage: '请先进行评标相关操作' }),
        )
      }
    } else {
      // 非在线
      params.evaluationTenderReportMemberList = offlineData?.length
        ? offlineData.map((item) => ({
            memberId: item.memberId,
            correctScore: item.modifyTotal,
            evaluationTenderOfflineList: Object.keys(item)
              .filter((ele) => /^\d+$/.test(ele))
              .map((_ele) => ({ templateContent: { id: _ele }, score: item[_ele] || 0 })),
          }))
        : []
    }
    console.log(params)
    postPurchaseExpertExtractReportSubmitEvaluationTenderReport(params)
      .then((res) => {
        setLoading(true)
        if (res.code === 1000) {
          history.goBack()
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <ReportDetailContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            action && (
              <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SendOutlined rotate={-45} />}>
                {intl.formatMessage({ id: 'table.purchase.tijiaobaogao' })}
              </Button>
            )
          }
        />
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <div id="transferProcess" style={{ marginTop: 100 }}>
              <TransferProcess
                cardTitle={intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' })}
                customTitleKey="name"
                customKey="id"
                outerVerifyCurrent={findLastIndexFlowState(formContext.externalWorkflowFlowRecordLogResponses)}
                innerVerifyCurrent={findLastIndexFlowState(formContext.interiorWorkflowFlowRecordLogResponses)}
                outerVerifySteps={
                  formContext.externalWorkflowFlowRecordLogResponses
                    ? formContext.externalWorkflowFlowRecordLogResponses.map((item) => ({
                        ...item,
                        status: item.isActive ? 'finish' : 'wait',
                      }))
                    : []
                }
                innerVerifySteps={
                  formContext.interiorWorkflowFlowRecordLogResponses
                    ? formContext.interiorWorkflowFlowRecordLogResponses.map((item) => ({
                        ...item,
                        status: item.isActive ? 'finish' : 'wait',
                      }))
                    : []
                }
              ></TransferProcess>
            </div>
            <div id="baseicInfo">
              <MellowCard
                title={intl.formatMessage({ id: 'table.purchase.jibenxinxi' })}
                style={{ marginTop: 24 }}
                bordered={false}
                fullHeight
              >
                {data && <RenderBasicInfoColumns infoList={basicColumnList} dataSource={data} />}
              </MellowCard>
            </div>
            <div id="remarkNeed">
              <MellowCard
                title={intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' })}
                style={{ marginTop: 24 }}
                bordered={false}
                fullHeight
              >
                {data && <RenderBasicInfoColumns infoList={evaluationColumnList} dataSource={data} />}
              </MellowCard>
            </div>
            {/* 评标报告 */}
            <RemarkBidReport
              cardTitle={intl.formatMessage({ id: 'table.purchase.zaixianpingbiao' })}
              addSchemaAction={addSchemaAction}
              editable={!!action}
            />
            {/* 评标报告 */}
            <div id="transferRecord">
              <MellowCard
                title={intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' })}
                style={{ marginTop: 24 }}
                bordered={false}
                extra={
                  <Radio.Group value={transferRadio} buttonStyle="solid" size="small" onChange={handleChangeType}>
                    {externalProcurementOrderLogResponses?.length ? (
                      <Radio.Button value={TransferEnum.Outer}>
                        {intl.formatMessage({ id: 'detail.purchase.externalLogStates' })}
                      </Radio.Button>
                    ) : null}
                    {interiorProcurementOrderLogResponses?.length ? (
                      <Radio.Button value={TransferEnum.Interior}>
                        {intl.formatMessage({ id: 'detail.purchase.interiorLogStates' })}
                      </Radio.Button>
                    ) : null}
                  </Radio.Group>
                }
                className={style.cardWrap}
              >
                {externalProcurementOrderLogResponses?.length && transferRadio === TransferEnum.Outer ? (
                  <Table
                    columns={outReocrdCols}
                    dataSource={externalProcurementOrderLogResponses}
                    pagination={{ size: 'small' }}
                    rowKey="id"
                  />
                ) : null}
                {interiorProcurementOrderLogResponses?.length && transferRadio === TransferEnum.Interior ? (
                  <Table
                    columns={insideRecordCols}
                    dataSource={interiorProcurementOrderLogResponses}
                    pagination={{ size: 'small' }}
                    rowKey="id"
                  />
                ) : null}
              </MellowCard>
            </div>
          </PreLoading>
        </OrderDetailWrapper>
      </ReportDetailContext.Provider>
    </div>
  )
}

export default readySubmitReportDetail

import React, { useState } from 'react'
import { Button, Row, Col, Radio, Table, message } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { RemarkDetailContext } from '@/pages/procurement/_public/bid/context'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import TransferProcess, { TransferEnum } from '@/pages/procurement/components/transferProcess'
import { findLastIndexFlowState } from '@/utils'
import { useRemarkDetail } from '../effects/useRemarkDetail'
import style from './index.less'
import MellowCard from '@/components/MellowCard'
import { anchorTitleList, basicColumnList, evaluationColumnList, insideRecordCols, outReocrdCols } from '../constant'
import OnlineRemark from '../components/onlineRemark'
import { createFormActions } from '@apps/formily'
import { SendOutlined } from '@ant-design/icons'
import { postPurchaseExpertExtractRecordEvaluationTender } from '@apps/apis'

const addSchemaAction = createFormActions()
const intl = getIntl()

const ReadyExpertRemarkDetail: React.FC = () => {
  const { formContext, id } = useRemarkDetail({ type: 'callForBid' })
  const { data, externalProcurementOrderLogResponses, interiorProcurementOrderLogResponses } = formContext

  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)

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

  const onConfirm = async (value) => {
    const { evaluationTenderList: _value, templateContentList } = value
    console.log(_value, templateContentList)
    const evaluationTenderRecommendList = _value
      .map((item) => {
        if (item?.isRecommend) {
          return {
            isRecommend: item.isRecommend,
            memberName: item.memberName,
            reason: item.reason,
          }
        }
      })
      .filter((_) => Boolean(_))

    try {
      let evaluationList = []
      for (let i = 0; i < _value.length; i++) {
        let item = _value[i]
        let keys = Object.keys(item)
        for (let j = 0; j < keys.length; j++) {
          let _item = keys[j]
          if (_item.indexOf('score') !== -1) {
            let contentId = _item.split('_')[1]
            let content = templateContentList.filter((_) => _.id === Number(contentId))[0]
            // 判断分值是否有null或者""
            if (item[_item] === null || item[_item] === '') {
              throw intl.formatMessage({ id: 'table.purchase.qingzhengquetianxie' })
            }
            evaluationList.push({
              inviteTenderMemberId: item.memberId,
              inviteTenderMemberName: item.memberName,
              score: Number(item[_item]),
              ...content,
            })
          }
        }
      }
      evaluationList = evaluationList.map((item) => {
        delete item.id
        return item
      })

      const res = await postPurchaseExpertExtractRecordEvaluationTender({
        id: Number(id),
        evaluationTenderList: evaluationList.filter(Boolean),
        evaluationTenderRecommendList,
      })

      if (res.code === 1000) {
        history.goBack()
      }

      console.log(evaluationTenderRecommendList, evaluationList)
    } catch (error) {
      console.log(error)
      return message.error(error)
    }
  }

  return (
    <div>
      <RemarkDetailContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            <Button type="primary" onClick={() => addSchemaAction.submit()} icon={<SendOutlined rotate={-45} />}>
              {intl.formatMessage({ id: 'table.purchase.tijiaopingbiao' })}
            </Button>
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
                {data?.inviteTender && (
                  <RenderBasicInfoColumns infoList={basicColumnList} dataSource={data.inviteTender} />
                )}
              </MellowCard>
            </div>
            <div id="remarkNeed">
              <MellowCard
                title={intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' })}
                style={{ marginTop: 24 }}
                bordered={false}
                fullHeight
              >
                {data?.inviteTender && (
                  <RenderBasicInfoColumns infoList={evaluationColumnList} dataSource={data.inviteTender} />
                )}
              </MellowCard>
            </div>
            {/* 在线评标 */}
            <div id="remarkBidReport">
              <OnlineRemark
                cardTitle={intl.formatMessage({ id: 'table.purchase.zaixianpingbiao' })}
                addSchemaAction={addSchemaAction}
                onConfirm={onConfirm}
              />
            </div>
            {/* 在线评标 */}
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
      </RemarkDetailContext.Provider>
    </div>
  )
}

export default ReadyExpertRemarkDetail

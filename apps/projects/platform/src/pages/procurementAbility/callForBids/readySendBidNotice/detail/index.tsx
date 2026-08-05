import React, { useState } from 'react'
import { Button, Row, Col, Radio, Table, Divider, message } from 'antd'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { ReadySendBidNoticeContext } from '@/pages/procurement/_public/bid/context'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import AnchorDrawer from '@/components/AnchorDrawer'
import { createFormActions } from '@apps/formily'
import { useNoticeDetail } from '../effects/useNoticeDetail'
import MellowCard from '@/components/MellowCard'
import TransferProcess, { TransferEnum } from '@/pages/procurement/components/transferProcess'
import style from './index.less'
import {
  anchorTitleList,
  basicColumnList,
  dataIdList,
  insideRecordCols,
  noticeSchema,
  outReocrdCols,
} from '../constant'
import { findLastIndexFlowState } from '@/utils'
import winBid from '@/assets/imgs/winBid.png'
import { SendOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import { postPurchaseInviteTenderWinTenderNotice } from '@apps/apis'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
const formActions = createFormActions()

const ReadySendBidNoticeDetail: React.FC = () => {
  const { formContext, id } = useNoticeDetail({ type: 'callForBid' })
  const { data, externalProcurementOrderLogResponses, interiorProcurementOrderLogResponses } = formContext
  const {
    action, // 1操作 null查看
  } = usePageStatus()
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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

  const confirmSubmit = () => {
    // setVisible(false)
    setLoading(true)
    formActions.validate().then((res) => {
      if (res['errors']['length'] === 0) {
        formActions.submit(async (v) => {
          const { code } = await postPurchaseInviteTenderWinTenderNotice({ id, ...v })
          if (code === 1000) {
            history.goBack()
          }
          setLoading(false)
        })
      }
    })
  }

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
      return Promise.reject()
    }
  }

  const footer = (
    <div
      style={{
        textAlign: 'right',
      }}
    >
      <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
        {intl.formatMessage({ id: 'table.purchase.quxiao' })}
      </Button>
      <Button onClick={confirmSubmit} type="primary" loading={loading}>
        {intl.formatMessage({ id: 'detail.purchase.confirm' })}
      </Button>
    </div>
  )

  return (
    <div>
      <ReadySendBidNoticeContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            action && [
              <Button type="primary" onClick={() => setVisible(true)} icon={<SendOutlined rotate={-45} />}>
                {intl.formatMessage({ id: 'table.purchase.fasongzhongbiaogong' })}
              </Button>,
            ]
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
            <div id="memberWinInfo">
              <MellowCard
                title={intl.formatMessage({ id: 'table.purchase.zhongbiaohuiyuanxin' })}
                style={{ marginTop: 24 }}
                bordered={false}
                fullHeight
              >
                <div className={style.winBidWrapper}>
                  <div className={style.winBidContainer}>
                    <div className="common-panel-title">
                      {intl.formatMessage({ id: 'table.purchase.zhongbiaohuiyuan' })}
                    </div>
                    <Row gutter={[16, 0]}>
                      {data?.memberList?.length
                        ? data.memberList.map((item, index) => (
                            <Col span={6} key={item.memberId}>
                              <div className={style['card-list']}>
                                <h4>{item.memberName}</h4>
                                <Row>
                                  <Col span={8}>
                                    <p className={style['card-list_title']}>
                                      {intl.formatMessage({ id: 'detail.purchase.message25' })}:
                                    </p>
                                  </Col>
                                  <Col>
                                    <p className={style.amount}>
                                      {intl.formatMessage({ id: 'common.money' })}
                                      {item.amount.toFixed(2)}
                                    </p>
                                  </Col>
                                </Row>
                                {/* <img src={winBid} alt={intl.formatMessage({ id: 'table.purchase.yizhongbiao' })} /> */}
                              </div>
                            </Col>
                          ))
                        : null}
                    </Row>
                  </div>
                  <Divider dashed />
                  <div className={style.remarkCommitteeContainer}>
                    <div className="common-panel-title">{intl.formatMessage({ id: 'detail.purchase.label1' })}</div>
                    <Row gutter={[16, 0]}>
                      <Col span={4}>
                        <div className={style['card-list']}>
                          <Row>
                            <Col span={8}>
                              <p className={style['card-list_title']}>
                                {intl.formatMessage({ id: 'detail.purchase.label1' })}
                              </p>
                            </Col>
                            <Col>
                              <p>{data?.winTenderReason}</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={8}>
                              <p className={style['card-list_title']}>
                                {intl.formatMessage({ id: 'table.purchase.zhongbiaofujian' })}
                              </p>
                            </Col>
                            <Col>
                              {data?.winTenderFile?.length
                                ? data.winTenderFile.map((_item, _i) => (
                                    <p key={`file${_item.id}`}>
                                      <a target="_blank" href={_item.url}>
                                        {_item.name}
                                      </a>
                                    </p>
                                  ))
                                : null}
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </MellowCard>
            </div>
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

        <AnchorDrawer
          title={intl.formatMessage({ id: 'table.purchase.fasongzhongbiaogong' })}
          visible={visible}
          dataIdList={dataIdList}
          footer={footer}
          onClose={() => setVisible(false)}
          isForm={true}
          actions={formActions}
          schema={noticeSchema}
          expressionScope={{
            beforeUpload,
          }}
          effects={($, ctx) => {
            const applyBuines = data.memberList.map(
              (item) =>
                `${item.memberName}(${intl.formatMessage({
                  id: 'table.purchase.zhongbiaozongjine1',
                })}${translate('web.common.currencySymbol')}${item.amount})`,
            )
            const text = `${data.memberName}《${data.projectName}》${intl.formatMessage({
              id: 'table.purchase.pingbiaogongzuoyi',
            })}：
${intl.formatMessage({ id: 'table.purchase.zhongbiaogongyingshang' })}：${applyBuines.toString()}。
${intl.formatMessage({ id: 'detail.purchase.label1' })}：${data.winTenderReason}。`

            $('onFieldInit', 'winTenderAnnounceContent').subscribe(() => {
              ctx.setFieldValue('winTenderAnnounceContent', text)
            })
            ctx.setFieldValue('winTenderAnnounceContent', text)

            $('onFieldInit', 'winTenderNoticeContent').subscribe(() => {
              ctx.setFieldValue('winTenderNoticeContent', text)
            })
            ctx.setFieldValue('winTenderNoticeContent', text)

            const thinkText = `${intl.formatMessage({ id: 'table.purchase.guigongsicanyu' })}《${
              data.projectName
            }》${intl.formatMessage({ id: 'table.purchase.jingbiaoaiwo' })}`
            $('onFieldInit', 'winTenderThanksContent').subscribe(() => {
              ctx.setFieldValue('winTenderThanksContent', thinkText)
            })
            ctx.setFieldValue('winTenderThanksContent', thinkText)
          }}
        />
      </ReadySendBidNoticeContext.Provider>
    </div>
  )
}

export default ReadySendBidNoticeDetail

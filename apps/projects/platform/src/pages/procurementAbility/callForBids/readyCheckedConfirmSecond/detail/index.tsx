import React, { useState, useRef } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Radio, Table } from 'antd'
import style from './index.less'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { ReadyConfirmBidContext } from '@/pages/procurement/_public/bid/context'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import { anchorTitleList, insideRecordCols, outReocrdCols, submitSchema } from '../constant'
import { useConfirmDetail } from '@/pages/procurement/_public/bid/effects/useConfirmDetail'
import TransferProcess, { TransferEnum } from '@/pages/procurement/components/transferProcess'
import { findLastIndexFlowState } from '@/utils'
import MellowCard from '@/components/MellowCard'
import BasicInfo from '../components/basicInfo'
import RemarkBidReport from '../components/remarkBidReport'
import ParticipateInfo from '../components/participateInfo'
import BidConfirm from '../components/bidConfirm'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import { postPurchaseInviteTenderCheckFinishTender } from '@apps/apis'

const modalActions = createFormActions()

const ReadyCheckedConfirmSecondDetail: React.FC = () => {
  const { formContext, id } = useConfirmDetail({ type: 'callForBid' })
  const { externalProcurementOrderLogResponses, interiorProcurementOrderLogResponses, submitData } = formContext
  const { paramsTableData } = submitData
  const currentRef = useRef<any>({})
  const intl = getIntl()

  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)
  const [loading, setLoading] = useState<boolean>(false)

  const handleChangeType = (e) => {
    setTransferRadio(e.target.value)
  }

  const onSubmit = () => {
    currentRef.current.setVisible(true)
  }

  const onConfirm = () => {
    modalActions.submit().then(async ({ values }) => {
      setLoading(true)
      const params = {
        id: Number(id),
        ...values,
      }
      // @todo 待审核定标二级
      const result = await postPurchaseInviteTenderCheckFinishTender(params)

      if (result.code === 1000) {
        currentRef.current.setVisible(false)
        history.goBack()
      }
      setLoading(false)
    })
  }

  return (
    <div>
      <ReadyConfirmBidContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            <Button type="primary" onClick={onSubmit}>
              {intl.formatMessage({ id: 'table.purchase.shenhedingbiao' })}
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
              <BasicInfo title={intl.formatMessage({ id: 'table.purchase.jibenxinxi' })} />
            </div>
            {/* 评标报告 */}
            <RemarkBidReport cardTitle={intl.formatMessage({ id: 'table.purchase.pingbiaobaogao' })} />

            {/* 会员参标信息 */}
            <ParticipateInfo cardTitle={intl.formatMessage({ id: 'table.purchase.huiyuancanbiaoxin' })} />

            {/* 招标定标 */}
            <BidConfirm cardTitle={intl.formatMessage({ id: 'table.purchase.zhaobiaodingbiao' })} />

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

        <ModalForm
          modalTitle={intl.formatMessage({ id: 'table.purchase.shenhedingbiao' })}
          currentRef={currentRef}
          confirm={onConfirm}
          actions={modalActions}
          schema={submitSchema}
          effects={($, ctx) => {
            $('onFormInit').subscribe(() => {})
          }}
          modalProps={{ confirmLoading: loading }}
        />
      </ReadyConfirmBidContext.Provider>
    </div>
  )
}

export default ReadyCheckedConfirmSecondDetail

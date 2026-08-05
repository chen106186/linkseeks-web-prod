import React, { useState, useRef } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Radio, Table, message } from 'antd'
import style from './index.less'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { ReadyConfirmBidContext } from '@/pages/procurement/_public/bid/context'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import { SendOutlined } from '@ant-design/icons'
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
import { postPurchaseInviteTenderSubmitCheckFinishTender } from '@apps/apis'

const modalActions = createFormActions()
const intl = getIntl()

const ReadyQualifityCheckedDetail: React.FC = () => {
  const { formContext, id } = useConfirmDetail({ type: 'callForBid' })
  const { externalProcurementOrderLogResponses, interiorProcurementOrderLogResponses, submitData } = formContext
  const { paramsTableData } = submitData
  const currentRef = useRef<any>({})

  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)
  const [loading, setLoading] = useState<boolean>(false)

  const handleChangeType = (e) => {
    setTransferRadio(e.target.value)
  }

  const onSubmit = () => {
    console.log(paramsTableData)
    let errorValidate = false
    let rigthRate: boolean[] = []
    paramsTableData.forEach((element) => {
      // 校验是否授标
      Object.values(element).forEach((_ele: any) => {
        if (_ele?.isAward) errorValidate = true
      })
      // 校验授标100%
      const rate = Object.values(element).reduce((a: any, b: any) => a + (b.isAward ? b.awardRate : 0), 0)
      rigthRate.push(rate === 100)
    })
    if (!errorValidate) {
      return message.error(intl.formatMessage({ id: 'table.purchase.qingshoubiao' }))
    }
    if (rigthRate.some((item) => !item)) {
      return message.error(intl.formatMessage({ id: 'table.purchase.qingzhengqueshoubiao' }))
    }
    currentRef.current.setVisible(true)
  }

  const onConfirm = () => {
    setLoading(true)
    modalActions
      .submit()
      .then(async ({ values }) => {
        console.log(values, paramsTableData)
        const params = {
          id: Number(id),
          ...values,
        }

        const bidParams = [...paramsTableData]
        bidParams.map((item) => {
          delete item.count
          delete item.unitName
          delete item.inviteTenderMateriel
          return item
        })

        const memberIdKey = Object.keys(bidParams[0])

        // 物料和授标信息取多次 投标会员记录id和投标id只需取一次
        params['memberList'] = memberIdKey.map((mKey) => {
          let tempTenderObject = {
            id: bidParams[0][mKey]['submitTender']['id'], // 投标id
            submitTenderMateriel: bidParams.map((_item) => ({
              id: _item[mKey]['id'],
              isAwardTender: _item[mKey]['isAward'],
              awardTenderRatio: _item[mKey]['awardRate'],
            })),
          }

          return {
            id: mKey, // 投标会员记录id
            submitTender: tempTenderObject,
          }
        })
        console.log(params)

        const { code } = await postPurchaseInviteTenderSubmitCheckFinishTender(params)
        if (code === 1000) {
          currentRef.current.setVisible(false)
          history.goBack()
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
      return Promise.reject()
    }
  }

  return (
    <div>
      <ReadyConfirmBidContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            <Button type="primary" onClick={onSubmit} icon={<SendOutlined />}>
              {intl.formatMessage({ id: 'table.purchase.tijiaodingbiao' })}
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
                style={{ marginTop: 16 }}
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
          modalTitle={intl.formatMessage({ id: 'table.purchase.tijiaodingbiao' })}
          currentRef={currentRef}
          confirm={onConfirm}
          actions={modalActions}
          schema={submitSchema}
          effects={($, ctx) => {
            $('onFormInit').subscribe(() => {})
          }}
          expressionScope={{
            beforeUpload,
          }}
          modalProps={{ confirmLoading: loading }}
        />
      </ReadyConfirmBidContext.Provider>
    </div>
  )
}

export default ReadyQualifityCheckedDetail

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Row, Col, Anchor, Skeleton } from 'antd'
import headStyle from '../../../components/bidDetailHeader/index.less'
import style from './index.less'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/procurement/_public/bid/effects/useBidDetail'
import { ArrowLeftOutlined } from '@ant-design/icons'
import TransferProcess from '@/pages/procurement/components/transferProcess'
import { findLastIndexFlowState } from '@/utils'
import DescriptionsInfo from '@/pages/procurement/components/descriptionsInfo'
import BidTransformRecord from '@/pages/procurement/components/transferRecord'
import MellowCard from '@/components/MellowCard'
import ApprovedModal from '@/pages/procurement/components/approvedModal'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { postPurchaseInviteTenderCheckQualifications } from '@apps/apis'
const intl = getIntl()

const { Link } = Anchor

const ReadyQualifityCheckedDetail: React.FC = () => {
  const { formContext, id } = useBidDetail({ type: 'callForBidInTender' })
  const { data } = formContext

  const [isFixed, setIsFixed] = useState<boolean>(false)
  const flagRef = useRef({
    flag: false,
    distanceTop: 0,
  })

  const approvedRef = useRef<any>({})

  const { run, loading } = useHttpRequest(postPurchaseInviteTenderCheckQualifications)

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onScroll = () => {
    let navDom: any = document.getElementById('anchorTitle')
    if (navDom) {
      let distance = navDom.offsetTop - document.documentElement.scrollTop
      if (!flagRef.current.flag) {
        flagRef.current.distanceTop = navDom.offsetTop
        flagRef.current.flag = true
      }

      if (distance <= 0) {
        setIsFixed(true)
      }

      if (document.documentElement.scrollTop <= flagRef.current.distanceTop) {
        setIsFixed(false)
      }
    }
  }

  const isLoading = !!formContext.data

  const anchorTitleList = [
    { title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }), id: 'transferProcess' },
    { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo' },
    { title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }), id: 'checkNeed' },
    { title: intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' }), id: 'qualifityNeed' },
    { title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }), id: 'transferRecord' },
  ]

  const handleClick = useCallback(() => {
    approvedRef.current.setVisible(true)
  }, [])

  // 提交资格预审
  const handleSubmit = useCallback(() => {
    approvedRef.current.actions.submit().then(async ({ values }) => {
      const params = {
        id: Number(id),
        ...values,
      }
      const result = await run(params)

      if (result.code === 1000) {
        approvedRef.current.setVisible(false)
        history.goBack()
      }
    })
  }, [])

  return (
    <div>
      <BidDetailContext.Provider value={formContext}>
        <div
          className={isFixed ? [headStyle.detailHeader, headStyle.anchorTitleFixed].join(' ') : headStyle.detailHeader}
          id="detailHeader"
        >
          {isLoading ? (
            <Row>
              {
                <>
                  <Col span={22}>
                    <Row align="middle">
                      <Col>
                        <ArrowLeftOutlined onClick={() => history.goBack()} />
                      </Col>
                      <Col>
                        <div className={headStyle.titleAvatorText}>
                          {data.inviteTender.projectName}&nbsp;|&nbsp;{data.inviteTender.code}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className={headStyle.anchorTitle} id="anchorTitle">
                          <Anchor onClick={(e) => e.preventDefault()} showInkInFixed={false} targetOffset={200}>
                            {anchorTitleList.map((item, index) => (
                              <Link key={index} href={`#${item['id']}`} title={item['title']} />
                            ))}
                          </Anchor>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={2}>
                    <Button type="primary" onClick={handleClick} loading={loading}>
                      {intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
                    </Button>
                  </Col>
                </>
              }
            </Row>
          ) : (
            <Skeleton avatar={{ shape: 'square' }} active paragraph={{ rows: 3 }} />
          )}
        </div>

        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <div id="transferProcess" style={{ marginTop: 100 }}>
              <TransferProcess
                cardTitle={intl.formatMessage({ id: 'detail.purchase.progressLayout' })}
                customTitleKey="name"
                customKey="id"
                outerVerifyCurrent={findLastIndexFlowState(formContext?.externalWorkflowFlowRecordLogResponses || [])}
                innerVerifyCurrent={findLastIndexFlowState(formContext?.interiorWorkflowFlowRecordLogResponses || [])}
                outerVerifySteps={
                  formContext?.externalWorkflowFlowRecordLogResponses
                    ? formContext.externalWorkflowFlowRecordLogResponses.map((item) => ({
                        ...item,
                        status: item.isActive ? 'finish' : 'wait',
                      }))
                    : []
                }
                innerVerifySteps={
                  formContext.data?.interiorWorkflowFlowRecordLogResponses
                    ? formContext.data.interiorWorkflowFlowRecordLogResponses.map((item) => ({
                        ...item,
                        status: item.isActive ? 'finish' : 'wait',
                      }))
                    : []
                }
              />
            </div>
            <div id="baseicInfo">
              <DescriptionsInfo cardTitle={intl.formatMessage({ id: 'table.purchase.jibenxinxi' })} type="basicInfo" />
            </div>
            <div id="checkNeed">
              <DescriptionsInfo
                cardTitle={intl.formatMessage({ id: 'table.purchase.zigeyushenyao' })}
                type="checkNeed"
              />
            </div>
            <div id="qualifityNeed">
              <MellowCard
                title={intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' })}
                style={{ marginTop: 24 }}
                bordered={false}
                fullHeight
              >
                <div className={style['card-list']}>
                  <Row>
                    <Col span={2}>
                      <p className={style['card-list_title']}>
                        {intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' })}:
                      </p>
                    </Col>
                    <Col>
                      {data &&
                        data.qualificationsFile.map((item) => (
                          <div key={item.id}>
                            <a href={item.url} target="blank">
                              {item.name}
                            </a>
                          </div>
                        ))}
                    </Col>
                  </Row>
                </div>
              </MellowCard>
            </div>
            <div id="transferRecord">
              <BidTransformRecord cardTitle={intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' })} />
            </div>
          </PreLoading>
        </OrderDetailWrapper>
      </BidDetailContext.Provider>

      {/* 点击审核触发的弹窗集合 */}
      <ApprovedModal
        currentRef={approvedRef}
        onConfirm={handleSubmit}
        loading={loading}
        title={intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
      />
    </div>
  )
}

export default ReadyQualifityCheckedDetail

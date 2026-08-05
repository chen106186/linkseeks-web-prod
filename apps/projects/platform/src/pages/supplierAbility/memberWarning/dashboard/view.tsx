import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Row, Col, Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { OverView } from './components/OverVIew'
import { RecordList } from './components/Record'
import WarningArea from './components/WarningArea'
// import AnnotationArc from './components/AnnotationArc';
import CustomizeCard from './components/CustomizeCard'
import AnnotationArc from './components/AnnotationArc'
import MemberEvaluateScoreContainer from './components/MemberEvaluateScore/container'
import Suggestion from './components/Suggestion'
import ContractPrice from './components/Contract/purchaseContractPrice'
import TimelyDeliveryRate from './components/TimelyDeliveryRate'
import AfterServiceRate from './components/AfterServiceRate'
import AfterSoldEvaluation from './components/AfterSoldEvaluation'
import WarningProject from './components/WarningProject'
import PurchaseContractExpire from './components/Contract/purchaseContractExpire'
import DocExpire from './components/DocExpire'

const Dashboard = () => {
  const intl = useIntl()
  return (
    <PageHeaderWrapper title={`${intl.formatMessage({ id: 'member.memberWarning.dashboard.index.warnWorkbench' })}`}>
      <Row gutter={[16, 16]}>
        <OverView />
        <Col xxl={6} lg={6} md={24} sm={24}>
          <CustomizeCard
            title={intl.formatMessage({ id: 'member.memberWarning.dashboard.index.todayWarnRecord' })}
            bodyStyle={{ padding: '0', height: '408px' }}
          >
            <RecordList dataSource={[]} height={384} />
          </CustomizeCard>
        </Col>
        <Col xxl={12} lg={18} md={24} sm={24}>
          <WarningArea />
        </Col>
        <Col xxl={6} lg={6} md={10} sm={24}>
          <WarningProject dataSource={[]} />
        </Col>
        <Col xxl={8} lg={9} md={14}>
          <AnnotationArc />
        </Col>
        <Col xxl={8} lg={9} md={24}>
          <MemberEvaluateScoreContainer />
        </Col>
        <Col xxl={8} lg={12} md={24}>
          <Suggestion />
        </Col>
        <Col xxl={8} lg={12} md={24}>
          <ContractPrice />
        </Col>
        <Col xxl={8} lg={12} md={24}>
          <PurchaseContractExpire />
        </Col>
        <Col xxl={8} lg={12} md={24}>
          <DocExpire />
        </Col>
        <Col xxl={12} lg={12} md={24}>
          <TimelyDeliveryRate />
        </Col>
        <Col xxl={12} lg={12} md={24}>
          <AfterServiceRate />
        </Col>
        <Col xxl={16} lg={16} md={24}>
          <AfterSoldEvaluation />
        </Col>
        <Col xxl={8} lg={8} md={24}>
          <MemberEvaluateScoreContainer />
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
}

export default Dashboard

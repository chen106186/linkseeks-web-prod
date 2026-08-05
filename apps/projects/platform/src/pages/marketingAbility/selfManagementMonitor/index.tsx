import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ActivityLayout from './components/activityLayout'
import ProductListLayout from './components/productListLayout'
import ActivityTypeLayout from './components/activityTypeLayout'
import ActivityProductList from './components/activityProductList'
import DataLayout from './components/dataLayout'
import ChartLineAdvance from './components/chartLineAdvance'
import SourceLayout from './components/sourceLayout'
import AnalysisLayout from './components/analysisLayout'

const SelfManagementMonitor = () => {
  const intl = useIntl()
  return (
    <PageHeaderWrapper>
      <ActivityLayout />
      <Row gutter={[16, 16]}>
        <Col xl={{ span: 18 }} span={14}>
          <ActivityTypeLayout />
          <ActivityProductList />
          <DataLayout />
          <ChartLineAdvance title={intl.formatMessage({ id: 'marketingAbility.dangqianshangpinkehuqushifenxi' })} />
          <ChartLineAdvance
            title={intl.formatMessage({ id: 'marketingAbility.dangqianshangpinhuodongxiaoguoqushifenxi' })}
            type="lineInterval"
          />
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <SourceLayout />
            </Col>
            <Col span={8}>
              <AnalysisLayout
                title={intl.formatMessage({ id: 'marketingAbility.dangqianshangpinyonghuleixingfenxi' })}
              />
            </Col>
            <Col span={8}>
              <AnalysisLayout
                title={intl.formatMessage({ id: 'marketingAbility.dangqianshangpinhuiyuandengjifenxi' })}
              />
            </Col>
          </Row>
        </Col>
        <Col xl={{ span: 6 }} span={10}>
          <ProductListLayout />
          <ProductListLayout />
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
}
export default SelfManagementMonitor

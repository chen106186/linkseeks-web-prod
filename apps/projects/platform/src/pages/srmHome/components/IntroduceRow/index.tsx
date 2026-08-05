/**
 * @Description 统计行
 */
import React from 'react'
import { Row, Col } from 'antd'
// import { getReportMemberHomeGetNewlyAddedDayReport, GetReportMemberHomeGetNewlyAddedDayReportResponse } from '@apps/apis';
import { useHttpRequest } from '@/hooks/useHttpRequest'
import themeConfig from '@apps/config/lingxi.theme.config'
import HOME_ICON_1 from '@/assets/imgs/home-icon-23.png'
import HOME_ICON_2 from '@/assets/imgs/home-icon-12.png'
import HOME_ICON_3 from '@/assets/imgs/home-icon-37.png'
import HOME_ICON_4 from '@/assets/imgs/home-icon-22.png'
import AnalysisCard from './components/AnalysisCard'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const paddingMd = parseInt(themeConfig['@padding-md'])
// TODO 待替换接口
const TodoCard: React.FC = () => {
  const { data } = useHttpRequest<any>(() => {}, { manual: false })
  const translate = useWebIntl()
  return (
    <Row gutter={[paddingMd, paddingMd]}>
      <Col span={6}>
        <AnalysisCard
          title={translate('web.resource.srmHome.jinrixinzengdingdan')}
          count={data?.orderAmount || 0}
          icon={HOME_ICON_1}
          growthValue={data?.orderGrowthRate || 0}
        />
      </Col>
      <Col span={6}>
        <AnalysisCard
          title={translate('web.resource.srmHome.jinrixinzenggongyingshang')}
          count={data?.memberCount || 0}
          icon={HOME_ICON_2}
          growthValue={data?.memberGrowthRate || 0}
        />
      </Col>
      <Col span={6}>
        <AnalysisCard
          title={translate('web.resource.srmHome.jinrixinqianhetong')}
          count={data?.contractCount || 0}
          icon={HOME_ICON_3}
          growthValue={data?.contractGrowthRate || 0}
        />
      </Col>
      <Col span={6}>
        <AnalysisCard
          title={translate('web.resource.srmHome.jinrixinzengcaigoudingdan')}
          count={data?.orderCount || 0}
          icon={HOME_ICON_4}
          growthValue={data?.orderCountGrowthRate || 0}
        />
      </Col>
    </Row>
  )
}

export default TodoCard

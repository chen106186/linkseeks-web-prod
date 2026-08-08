import React, { useCallback, useMemo } from 'react'
import { Space } from 'antd'
import styles from './center.less'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import Layout from './layout'
import useGetAuth from '../../hooks/useGetAuth'
// import { getReportMemberHomeGetQualityReport, GetReportMemberHomeGetQualityReportResponse } from '@apps/apis'

interface Iprops {}

// TODO
const QualityCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, isError, ref } = useViewRequest<any, any>(() => {}, {})
  const intl = useIntl()
  const { userAuth, hasAbilityFunc } = useGetAuth()
  const hasAbility = hasAbilityFunc('quality')
  const { StaticsDataList } = Layout
  const KEY_TITLE = {
    qualityInspectionList: intl.formatMessage({ id: 'home.zhijiandan', defaultMessage: '质检单' }),
    eightDRectificationList: intl.formatMessage({ id: 'home.8Dzhenggai', defaultMessage: '8D整改' }),
    eightDCollaborationList: intl.formatMessage({ id: 'home.8Dxietong', defaultMessage: '8D协同' }),
  }

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.zhiliangzhongxin', defaultMessage: '质量中心' })}
      tips={intl.formatMessage({
        id: 'home.tigongzhijiandanguanli8D',
        defaultMessage: '提供质检单管理、8D 整改、8D 协同等功能。',
      })}
      loading={loading}
      isError={isError}
      extra={
        <Space>
          <Authorize url={'/quality'}>
            <div>
              <Link to={'/quality'}>
                {intl.formatMessage({ id: 'home.jinruzhiliangzhongxin', defaultMessage: '进入质量中心' })}
              </Link>
            </div>
          </Authorize>
        </Space>
      }
    >
      <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList} />
    </Layout>
  )
}

export default QualityCenter

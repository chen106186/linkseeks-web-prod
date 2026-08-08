import React, { useCallback, useMemo } from 'react'
import { Space } from 'antd'
import styles from './center.less'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import Layout, { IDataListProps } from './layout'
import useGetAuth from '../../hooks/useGetAuth'
import { getMemberReportGetMember, GetMemberReportGetMemberResponse } from '@apps/apis'

interface Iprops {}

const CustomeCenter: React.FC<Iprops> = () => {
  const { loading, responseData, isError, ref } = useViewRequest<GetMemberReportGetMemberResponse, any>(
    getMemberReportGetMember as any,
    {},
  )
  const intl = useIntl()
  const { userAuth, hasAbilityFunc } = useGetAuth()
  const hasAbility = hasAbilityFunc('customerAbility')
  const { StaticsDataList } = Layout
  const KEY_TITLE = {
    customerImportList: intl.formatMessage({ id: 'home.kehuruku', defaultMessage: '客户入库' }),
    customerChangeList: intl.formatMessage({ id: 'home.kehubiangeng', defaultMessage: '客户变更' }),
    customerKpiList: intl.formatMessage({ id: 'home.kehukaoping', defaultMessage: '客户考评' }),
  }

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.kehuzhongxin', defaultMessage: '客户中心' })}
      tips={intl.formatMessage({ id: 'home.tigongkehurukubian', defaultMessage: '提供客户入库、变更、考评等功能。' })}
      loading={loading}
      isError={isError}
      extra={
        <Space>
          <Authorize url={'/customerAbility'}>
            <div>
              <Link to={'/customerAbility'}>
                {intl.formatMessage({ id: 'home.jinrukehuzhongxin', defaultMessage: '进入客户中心' })}
              </Link>
            </div>
          </Authorize>
        </Space>
      }
    >
      <StaticsDataList title={KEY_TITLE} dataSource={responseData as unknown as IDataListProps['dataSource']} />
    </Layout>
  )
}

export default CustomeCenter

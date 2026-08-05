import React from 'react'
import { Space } from 'antd'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import Layout, { IDataListProps } from './layout'
import useGetAuth from '../../hooks/useGetAuth'
import { getMemberReportGetMember, GetMemberReportGetMemberResponse } from '@apps/apis'

interface Iprops {}

const VendorCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, isError, ref } = useViewRequest<
    GetMemberReportGetMemberResponse,
    any
  >(getMemberReportGetMember as any, {})
  const intl = useIntl()
  const { userAuth, hasAbilityFunc } = useGetAuth()
  const hasAbility = hasAbilityFunc('supplierAbility')
  const { StaticsDataList } = Layout

  const KEY_TITLE = {
    importList: intl.formatMessage({ id: 'home.memberCenter.importList' }),
    changeList: intl.formatMessage({ id: 'home.memberCenter.changeList' }),
    kpiList: intl.formatMessage({ id: 'home.memberCenter.kpiList' }),
    rectifyList: intl.formatMessage({ id: 'home.memberCenter.rectifyList' }),
    rectifyNoticeList: intl.formatMessage({ id: 'home.memberCenter.rectifyNoticeList' }),
    memberImportChangeList: intl.formatMessage({
      id: 'home.huiyuanrukuziliaobiangeng',
      defaultMessage: '会员入库资料变更',
    }),
  }

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.memberCenter.layoutTitle', defaultMessage: '会员中心' })}
      tips=""
      loading={loading}
      isError={isError}
      extra={
        <Space>
          <Authorize url={'/supplierAbility'}>
            <div>
              <Link to={'/supplierAbility'}>
                {intl.formatMessage({ id: 'home.userCenter.userAuth.link', defaultMessage: '进入会员中心' })}
              </Link>
            </div>
          </Authorize>
        </Space>
      }
    >
      <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList as unknown as IDataListProps['dataSource']} />
    </Layout>
  )
}

export default VendorCenter

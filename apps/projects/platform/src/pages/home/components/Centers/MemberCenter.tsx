import React, { Fragment, useMemo } from 'react'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import Layout, { IDataListProps } from './layout'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import { getMemberReportGetMember, GetMemberReportGetMemberResponse } from '@apps/apis'
import useGetAuth from '../../hooks/useGetAuth'
interface Iprops {}
const { StaticsDataList } = Layout
const url = '/memberAbility'

const KEY_TITLE = {
  importList: getIntl().formatMessage({ id: 'home.memberCenter.importList' }),
  changeList: getIntl().formatMessage({ id: 'home.memberCenter.changeList' }),
  kpiList: getIntl().formatMessage({ id: 'home.memberCenter.kpiList' }),
  rectifyList: getIntl().formatMessage({ id: 'home.memberCenter.rectifyList' }),
  rectifyNoticeList: getIntl().formatMessage({ id: 'home.memberCenter.rectifyNoticeList' }),
  memberImportChangeList: getIntl().formatMessage({
    id: 'home.huiyuanrukuziliaobiangeng',
    defaultMessage: '会员入库资料变更',
  }),
}
// 修改会员信息：判断当前用户是否有会员导入权限，有则显示修改会员信息按钮，点击跳转会员能力--会员管理--新增会员页
// 进入会员中心：判断当前用户是否有会员管理权限，有则显示进入会员中心按钮，点击跳转会员能力--会员管理

const MemberCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, isError, ref, isEmpty } = useViewRequest<
    GetMemberReportGetMemberResponse,
    any
  >(getMemberReportGetMember as any, {})
  const intl = useIntl()
  const { hasAbilityFunc } = useGetAuth()
  const hasAbility = hasAbilityFunc('memberAbility')

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.memberCenter.layoutTitle' })}
      tips=""
      extra={
        <Authorize url={url}>
          <div>
            <Link to={url}>{intl.formatMessage({ id: 'home.memberCenter.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
      loading={loading}
      isError={isError}
    >
      <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList as unknown as IDataListProps['dataSource']} />
    </Layout>
  )
}

export default MemberCenter

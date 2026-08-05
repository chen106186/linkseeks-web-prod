import React, { useEffect, useState } from 'react'
import styles from './center.less'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import Layout from './layout'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import useGetAuth from '../../hooks/useGetAuth'
// import { getReportMemberHomeGetEnhanceTally, GetReportMemberHomeGetEnhanceTallyResponse } from '@apps/apis'
import { getCommodityWebMemberProcessWebFindCurrMemberProcess } from '@apps/apis'
interface Iprops {}

const url = '/handling/assign/query'
const CREATE_INFO_MANAGE = '/handling/infoManage'

const KEY_TITLE = {
  supplierList: getIntl().formatMessage({ id: 'home.processCenter.supplierList' }),
  processList: getIntl().formatMessage({ id: 'home.processCenter.processList' }),
}

// 加工中心：根据当前用户+当前角色是否有此加工能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 如果当前用户有创建加工企业门户权限，但还未创建加工企业门户，则显示：您还没有创建加工企业门户，请先创建加工企业门户，点击创建加工企业门户按钮，跳转加工能力-加工企业门户管理-创建加工企业门户页
// TODO
const ProcessCenter: React.FC<Iprops> = () => {
  const { loading, responseData, isError, filterEmptyList, ref, inViewPort } = useViewRequest<any, any>(() => {}, {})
  const intl = useIntl()
  const { hasAbilityFunc, userAuth, authUrlList } = useGetAuth()
  const hasAbility = hasAbilityFunc('handling')
  const [isShow, setIsShow] = useState(false)
  const [hasFetchData, setHasFetchData] = useState(false)

  useEffect(() => {
    const hasCreateInfoManageAuth = authUrlList?.includes(CREATE_INFO_MANAGE)
    if (!inViewPort || !hasCreateInfoManageAuth || hasFetchData) {
      return
    }
    async function getManagerData() {
      const { data, code } = await getCommodityWebMemberProcessWebFindCurrMemberProcess()
      setHasFetchData(true)
      if (code === 1000) {
        setIsShow(data === null)
      }
    }
    getManagerData()
  }, [inViewPort, userAuth, hasFetchData])

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.processCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.processCenter.layoutTips' })}
      extra={
        <Authorize url={url}>
          <div>
            <Link to={url}>{intl.formatMessage({ id: 'home.processCenter.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
      loading={loading}
      isError={isError}
    >
      {isShow && (
        <Layout.AlertTip content={intl.formatMessage({ id: 'home.processCenter.alertTip' })} url={CREATE_INFO_MANAGE} />
      )}
      <Layout.StaticsDataList dataSource={filterEmptyList} title={KEY_TITLE}></Layout.StaticsDataList>
    </Layout>
  )
}

export default ProcessCenter

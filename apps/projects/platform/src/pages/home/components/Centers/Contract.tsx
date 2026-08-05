import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Layout, { IDataListProps } from './layout'
import useViewRequest from '../../hooks/useViewRequest'
import { getContractReportGetContract, GetContractReportGetContractResponse } from '@apps/apis'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import useGetAuth from '../../hooks/useGetAuth'
import Authorize from '../Authorize'
import { getContractSignatureAuthAuthStatus } from '@apps/apis'

const { StaticsDataList, AlertTip } = Layout
interface Iprops {}

const KEY_TITLE = {
  contractManageList: getIntl().formatMessage({ id: 'home.constract.contractManageList' }),
  contractCoordinationList: getIntl().formatMessage({ id: 'home.constract.contractCoordinationList' }),
}

// 合同中心：根据当前用户+当前角色是否有合同能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 进入合同中心：当前会员角色类型为服务消费则点击进入合同能力--合同管理--合同查询页，如果当前会员角色类型为服务提供则点击进入合同能力-合同协同--合同查询页
// 如果当前用户有电子签章申请菜单权限，但还未申请电子签章，则显示：您还没有申请电子签章，请先申请电子签章，点击申请电子签章按钮，跳转合同能力--电子签章-电子签章申请页

const Constract: React.FC<Iprops> = (props: Iprops) => {
  const { loading, responseData, filterEmptyList, ref, inViewPort } = useViewRequest<
    GetContractReportGetContractResponse,
    any
  >(getContractReportGetContract as any, {})
  const intl = useIntl()
  const [hasConstract, setHasConstract] = useState<boolean>(false)
  const { userAuth, hasAbilityFunc, isConsumer } = useGetAuth()
  const [hasFetchData, setHasFetchData] = useState(false)

  const hasAbility = hasAbilityFunc('contract')
  const url = isConsumer ? '/contract/manage/QueryList' : '/contract/coordination/coordinationList'

  useEffect(() => {
    if (!inViewPort || hasFetchData) {
      return
    }
    async function findCurrMemberPurchase() {
      const { data, code } = await getContractSignatureAuthAuthStatus()
      setHasFetchData(true)
      if (code === 1000) {
        return setHasConstract(data)
      }
    }
    findCurrMemberPurchase()
  }, [inViewPort, hasFetchData])

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.constract.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.constract.layoutTips' })}
      loading={loading}
      extra={
        <Authorize url={url}>
          <div>
            <Link to={url}>{intl.formatMessage({ id: 'home.constract.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
    >
      <Fragment>
        {isConsumer && !hasConstract && (
          <AlertTip
            url="/contract/ElectronicSignature/apply"
            content={intl.formatMessage({ id: 'home.constract.alertTip' })}
          />
        )}
        <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList as unknown as IDataListProps['dataSource']} />
      </Fragment>
    </Layout>
  )
}

export default Constract

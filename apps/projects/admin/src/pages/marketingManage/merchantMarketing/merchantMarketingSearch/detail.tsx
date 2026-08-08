import { Fragment, useCallback, useMemo, useState } from 'react'
import { useLocation } from '@linkseeks/router-core'
import { Context } from '@/components/DetailLayout/components/context'
import { PageHeaderWrapper } from '@apps/components'
import ProgressLayout from '@/components/DetailLayout/components/progressLayout'
import GeneralLayout from '@/components/DetailLayout/components/generalLayout'
import RecordLyout from '@/components/DetailLayout/components/recordLyout'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import { formatTimeString } from '@/utils'
import { useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { ACTIVITYTYPENAME, GeneralEffect } from './constants'
import ActivityUserLayout from '../components/activityUserLayout'
import DemandLayout from '../components/demandLayout'
import ListLayout from '@/components/DetailLayout/components/listLayout'
import { Columns } from '@/pages/marketingManage/common/columns'
import { isEmpty } from 'lodash'
import { remindLayout, RemindLayoutProps } from '@/pages/marketingManage/common/remind'
import ListModalLayout from '../../components/listModalLayout'
import CouponsListLayout from '../../components/couponsListLayout'
import {
  getMarketingPlatformMerchantActivityDetail,
  getMarketingPlatformMerchantActivityDetailGoodsPage,
} from '@apps/apis'
import { ACTIVITY_TYPE_13, ACTIVITY_TYPE_15, ACTIVITY_TYPE_6 } from '@/constants/const/marketing'

const TABLINK = [
  { key: 'progressLayout', label: '流转进度' },
  { key: 'basicLayout', label: '基本信息' },
  { key: 'activityRuleLayout', label: '活动规则' },
  { key: 'activityProductLayout', label: '活动商品' },
  { key: 'activityUserLayout', label: '活动用户' },
  { key: 'applyMallLayout', label: '适用商城' },
  { key: 'recordLyout', label: '流转记录' },
]

const DetialLayout = () => {
  const { id, signUpId } = usePageStatus()
  const { pathname } = useLocation()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [allUsers, setAllusers] = useState<any[]>([])
  const [value, setValue] = useState<number>(1)
  const [collocation, setCollocation] = useState<any[]>([])
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [remind, setRemind] = useState<RemindLayoutProps>()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [generalEffect, setGeneralEffect] = useState<any>([])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '活动ID', extra: data.id },
          // { label: '外部状态', extra: data.outerStatusName },
          { label: '内部状态', extra: data.innerStatusName },
        ],
      },
      {
        col: [
          { label: '活动类型', extra: data.activityTypeName },
          { label: '活动名称', extra: data.activityName },
          { label: '会员名称', extra: data.memberName },
        ],
      },
      {
        col: [
          { label: '活动开始时间', extra: formatTimeString(data.startTime) },
          { label: '活动结束时间', extra: formatTimeString(data.endTime) },
          { label: '创建时间', extra: formatTimeString(data.createTime) },
        ],
      },
    ])
  }

  const handleGeneralEffect = (data: any, int?: number) => {
    if (!isEmpty(data)) {
      setGeneralEffect(GeneralEffect(int, data))
    }
  }

  const fetchDataSource = useCallback(async () => {
    await getMarketingPlatformMerchantActivityDetail({ id })
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        let { data } = res
        let interiorLogStates: any = []
        let interiorLogs: any = []
        if (data.innerTaskList) {
          data.innerTaskList.forEach((item: any) => {
            interiorLogStates.push({
              state: item.step,
              stateName: null,
              isExecute: item.isExecute,
              operationalProcess: item.taskName,
              roleName: item.roleName,
            })
          })
          data.interiorLogStates = interiorLogStates
        }
        if (data.innerRecordDOList) {
          data.innerRecordDOList.forEach((item: any, index: number) => {
            interiorLogs.push({
              operation: item.operate,
              createTime: item.operateTime,
              roleName: item.roleName,
              auditOpinion: item.opinion,
              stateName: item.statusName,
              id: index + 1,
              state: item.status,
              step: index,
            })
          })
          data.interiorLogs = interiorLogs
        }
        if (data.activityType === ACTIVITY_TYPE_6) {
          setRemind(remindLayout(data.activityType, data.activityDefined.giveType, data.activityDefined.giftType))
        }
        if (data.activityType === ACTIVITY_TYPE_13) {
          setRemind(remindLayout(data.activityType, data.activityDefined.swapType))
        }
        if (data.activityType === ACTIVITY_TYPE_15) {
          setRemind(remindLayout(data.activityType))
        }
        setAllusers([
          {
            title: '适用用户',
            value: [
              {
                key: data.newUser,
                name: '新用户(不包含会员)',
              },
              {
                key: data.oldUser,
                name: '老用户(不包含会员)',
              },
              {
                key: data.newMember,
                name: '新会员(仅会员用户)',
              },
              {
                key: data.oldMember,
                name: '老会员(仅会员用户)',
              },
            ],
          },
        ])
        setValue(data.activityType)
        setDataSource(data)
        handleBasicEffect(data)
        handleGeneralEffect(data.activityDefined, data.activityType)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [])

  const handlCollocation = (val) => {
    setCollocation(val.goodsSubsidiaryGroupList)
    setListModalVisible(true)
  }

  const columns = useMemo(() => {
    return Columns[value]?.({ value, handlCollocation })
  }, [value])

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper subTitle={dataSource.id} title={dataSource.activityName} isAnchor items={TABLINK}>
        <Fragment>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <GeneralLayout
            visible
            title={`活动规则-${ACTIVITYTYPENAME[dataSource.activityType]}`}
            anchor="activityRuleLayout"
            effect={generalEffect}
          />
          <ListLayout
            anchor="activityProductLayout"
            fetch={getMarketingPlatformMerchantActivityDetailGoodsPage}
            ids={{ activityId: id }}
            title="活动商品"
            columns={columns}
          />
          <ActivityUserLayout dataScoure={dataSource} allUsers={allUsers} />
          <DemandLayout storeList={dataSource.shopList} />
          <RecordLyout />
        </Fragment>
      </PageHeaderWrapper>
      {/* 查看搭配商品 */}
      {!isEmpty(remind) && remind?.value === 1 && (
        <ListModalLayout
          title={remind?.modalTitle}
          remind={remind}
          visible={listModalVisible}
          value={collocation}
          isPreview
          onClose={() => setListModalVisible(false)}
        />
      )}
      {/* 查看优惠券 */}
      {!isEmpty(remind) && remind?.value !== 1 && (
        <CouponsListLayout
          title={remind?.modalTitle}
          remind={remind}
          visible={listModalVisible}
          value={collocation}
          isPreview
          onClose={() => setListModalVisible(false)}
        />
      )}
    </Context.Provider>
  )
}
export default DetialLayout

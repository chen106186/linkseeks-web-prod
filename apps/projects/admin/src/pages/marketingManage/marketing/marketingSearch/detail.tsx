import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { Button, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Context } from '@/components/DetailLayout/components/context'
import { PageHeaderWrapper } from '@apps/components'
import ProgressLayout from '@/components/DetailLayout/components/progressLayout'
import GeneralLayout from '@/components/DetailLayout/components/generalLayout'
import RecordLyout from '@/components/DetailLayout/components/recordLyout'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import { formatTimeString } from '@/utils'
import { useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useLocation } from '@linkseeks/router-core'
import { ACTIVITYTYPENAME, GeneralEffect } from './constants'
import ActivityUserLayout from '../components/activityUserLayout'
import DemandLayout from '../components/demandLayout'
import ListLayout from '@/components/DetailLayout/components/listLayout'
import { Columns } from '@/pages/marketingManage/common/columns'
import { isEmpty } from 'lodash'
import { CheckCircleOutlined } from '@ant-design/icons'
import { remindLayout, RemindLayoutProps } from '@/pages/marketingManage/common/remind'
import CouponsListLayout from '../../components/couponsListLayout'
import ListModalLayout from '../../components/listModalLayout'
import ModalOperate from '../../components/modalOperate'
import {
  getMarketingPlatformActivityDetail,
  getMarketingPlatformActivityDetailGoodsPage,
  getMarketingPlatformActivityDetailGoodsPageTobeSignUp,
  getMarketingPlatformActivityDetailTobeSignUp,
  postMarketingPlatformActivityExamineSignUp,
  postMarketingPlatformActivityExamineStep1,
  postMarketingPlatformActivityExamineStep2,
} from '@apps/apis'

const TABLINK = [
  { key: 'progressLayout', label: '流转进度' },
  { key: 'basicLayout', label: '基本信息' },
  { key: 'activityRuleLayout', label: '活动规则' },
  { key: 'activityProductLayout', label: '活动商品' },
  { key: 'activityUserLayout', label: '活动用户' },
  { key: 'applyMallLayout', label: '适用商城' },
  { key: 'recordLyout', label: '流转记录' },
]

interface IProps {
  isPreview?: boolean
}

const DetialLayout: React.FC<IProps> = ({ isPreview = true }) => {
  const { pathname } = useLocation()
  const { id, signUpId } = usePageStatus()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [value, setValue] = useState<number>(1)
  const [visible, setVisible] = useState<boolean>(false)
  const [, setPrizeList] = useState<any[]>([])
  const [collocation, setCollocation] = useState<any[]>([])
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [remind, setRemind] = useState<RemindLayoutProps>()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [generalEffect, setGeneralEffect] = useState<any>([])
  console.log(pathPci, 'pathPci')
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '活动ID', extra: data.id },
          { label: '活动名称', extra: data.activityName },
          { label: '外部状态', extra: data.outerStatusName },
          { label: '内部状态', extra: data.innerStatusName },
          pathPci === 'waitAuditApply' && !isPreview && { label: '报名会员', extra: data.memberName },
        ],
      },
      {
        col: [
          { label: '活动类型', extra: data.activityTypeName },
          { label: '活动参与类型', extra: data.activitySignUpTypeName },
          { label: '活动开始时间', extra: formatTimeString(data.startTime) },
          { label: '活动结束时间', extra: formatTimeString(data.endTime) },
          pathPci === 'waitAuditApply' && !isPreview && { label: '报名时间', extra: data.signUpTime },
        ],
      },
      {
        col: [
          {
            label: '要求报名时间',
            extra: (
              <>
                {formatTimeString(data.signUpStartTime)}~{formatTimeString(data.signUpEndTime)}
              </>
            ),
          },
        ],
      },
    ])
  }

  const handleGeneralEffect = (data: any, int?: number) => {
    if (!isEmpty(data)) {
      setGeneralEffect(GeneralEffect(int, data))
    }
  }

  const useUpApi = pathPci === 'waitAuditApply'

  const fetchDataSource = useCallback(async () => {
    let getFn
    const params: any = {}
    if (useUpApi) {
      params.signUpId = signUpId
      getFn = await getMarketingPlatformActivityDetailTobeSignUp
    } else {
      params.id = id
      getFn = await getMarketingPlatformActivityDetail
    }

    getFn(params)
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res
        const externalLogStates: any = []
        const interiorLogStates: any = []
        const externalLogs: any = []
        const interiorLogs: any = []
        if (data.outerTaskList) {
          data.outerTaskList.forEach((item: any) => {
            externalLogStates.push({
              state: item.step,
              stateName: null,
              isExecute: item.isExecute,
              operationalProcess: item.taskName,
              roleName: item.roleName,
            })
          })
          data.externalLogStates = externalLogStates
        }
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
        if (data.outerRecordDOList) {
          data.outerRecordDOList.forEach((item: any, index: number) => {
            externalLogs.push({
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
          data.externalLogs = externalLogs
        }
        if (data.innerRecordDOList) {
          data.innerRecordDOList.forEach((item: any, index: number) => {
            interiorLogs.push({
              department: item.department,
              position: item.jobTitle,
              operation: item.operate,
              createTime: item.operateTime,
              roleName: item.operator,
              auditOpinion: item.opinion,
              stateName: item.statusName,
              id: index + 1,
              state: item.status,
              step: index,
            })
          })
          data.interiorLogs = interiorLogs
        }
        if (data.activityType === 6) {
          setRemind(remindLayout(data.activityType, data.activityDefined.giveType, data.activityDefined.giftType))
        }
        if (data.activityType === 13) {
          setRemind(remindLayout(data.activityType, data.activityDefined.swapType))
        }
        if (data.activityType === 15) {
          setRemind(remindLayout(data.activityType))
        }
        setDataSource(data)
        handleBasicEffect(data)
        setValue(data.activityType)
        if (data.activityDefined?.prizeList) {
          setPrizeList(data.activityDefined.prizeList)
        }
        handleGeneralEffect(data.activityDefined, data.activityType)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [])

  const handlCollocation = (record) => {
    const tableRecord: any = { ...record }
    if (remind?.value !== 1 && tableRecord.couponGroupList !== undefined) {
      setCollocation(tableRecord.couponGroupList)
    } else if (remind?.value === 1 && tableRecord.goodsSubsidiaryGroupList !== undefined) {
      setCollocation(tableRecord.goodsSubsidiaryGroupList)
    } else {
      setCollocation([])
    }
    setListModalVisible(true)
  }

  const columns = useMemo(() => {
    const _col = Columns[value]?.({ value, handlCollocation })
    _col.splice((_col.findIndex((item) => item.key === 'unit') as number) + 1, 0, {
      title: '报名会员',
      key: 'memberName',
      dataIndex: 'memberName',
    })
    return _col
  }, [value])

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (pathPci) {
      case 'waitAuditApply':
        fetchSoure = postMarketingPlatformActivityExamineSignUp
        break
      case 'waitAuditMarketingOne':
        fetchSoure = postMarketingPlatformActivityExamineStep1
        break
      case 'waitAuditMarketingTwo':
        fetchSoure = postMarketingPlatformActivityExamineStep2
        break
    }
    return fetchSoure
  }

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        subTitle={dataSource.id}
        title={dataSource.activityName}
        isAnchor
        items={TABLINK}
        extra={
          <>
            {!isPreview && (
              <Button type="primary" onClick={() => setVisible(true)}>
                <CheckCircleOutlined />
                单据审核
              </Button>
            )}
          </>
        }
      >
        <Space direction="vertical" size={16}>
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
            fetch={
              useUpApi
                ? getMarketingPlatformActivityDetailGoodsPageTobeSignUp
                : getMarketingPlatformActivityDetailGoodsPage
            }
            ids={useUpApi ? { signUpId } : { activityId: id }}
            title="活动商品"
            columns={columns}
          />
          <ActivityUserLayout dataScoure={dataSource} />
          <DemandLayout storeList={dataSource.shopList} />
          <RecordLyout />
        </Space>
      </PageHeaderWrapper>
      {/* 审核 */}
      <ModalOperate
        id={signUpId ? signUpId : id}
        title="单据审核"
        modalType={signUpId ? 'merkeingAudit' : 'merkeingAuditId'}
        visible={visible}
        fetch={fetchLink()}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
      />
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
          title="赠品-买商品赠优惠券"
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

import { useIntl } from '@linkseeks/i18n'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { Button, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { PageHeaderWrapper } from '@apps/components'
import ProgressLayout from '@/pages/transaction/components/detailLayout/components/progressLayout'
import GeneralLayout from '@/pages/transaction/components/detailLayout/components/generalLayout'
import RecordLyout from '@/pages/transaction/components/detailLayout/components/recordLyout'
import BasicLayout from '@/pages/transaction/components/detailLayout/components/basicLayout'
import { formatTimeString } from '@/utils'
import { useEffect } from 'react'
import { ACTIVITYTYPENAME, GeneralEffect } from '../../common/constants'
import ActivityUserLayout from '../../components/activityUserLayout'
import DemandLayout from '../../components/demandLayout'
import ListLayout from '@/pages/transaction/components/detailLayout/components/listLayout'
import { Columns } from '../../common/columns'
import { isEmpty } from 'lodash'
import { CheckCircleOutlined } from '@ant-design/icons'
import ModalOperate from '@/pages/transaction/components/modalOperate'
import { remindLayout, RemindLayoutProps } from '../readySubmitExamine/components/productListLayout/remind'
import ListModalLayout from '../../components/listModalLayout'
import CouponsListLayout from '../../components/couponsListLayout'
import {
  getMarketingPlatformActivitySignupDetail,
  getMarketingPlatformActivitySignupDetailGoodsPage,
  postMarketingPlatformActivitySignupExamineStep1,
  postMarketingPlatformActivitySignupExamineStep2,
} from '@apps/apis'
import { useQuery, useLocation } from '@linkseeks/router-core'

const DetialLayout = () => {
  const intl = useIntl()

  const { activityId, signUpId, preview } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [generalEffect, setGeneralEffect] = useState<any>([])
  const [value, setValue] = useState<number>(1)
  const [collocation, setCollocation] = useState<any[]>([])
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [remind, setRemind] = useState<RemindLayoutProps>({})

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'paltformSign.activityID' }), extra: data.id },
          { label: `${intl.formatMessage({ id: 'paltformSign.theNameOfTheEvent' })}`, extra: data.activityName },
          { label: `${intl.formatMessage({ id: 'paltformSign.externalState' })}`, extra: data.outerStatusName },
          { label: `${intl.formatMessage({ id: 'paltformSign.internalState' })}`, extra: data.innerStatusName },
        ],
      },
      {
        col: [
          { label: `${intl.formatMessage({ id: 'paltformSign.theActivityType' })}`, extra: data.activityTypeName },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activitiesInvolvedInType' })}`,
            extra: data.activitySignUpTypeName,
          },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activitiesStartTime' })}`,
            extra: formatTimeString(data.startTime),
          },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activityOverTime' })}`,
            extra: formatTimeString(data.endTime),
          },
        ],
      },
      {
        col: [
          {
            label: `${intl.formatMessage({ id: 'paltformSign.requestTimeSigningUp' })}`,
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
    console.log(data, 10086)
    if (!isEmpty(data)) {
      setGeneralEffect(GeneralEffect(int, data))
    }
  }

  const fetchDataSource = useCallback(async () => {
    await getMarketingPlatformActivitySignupDetail({ activityId })
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        let { data } = res
        let externalLogStates: any = []
        let interiorLogStates: any = []
        let externalLogs: any = []
        let interiorLogs: any = []
        if (data.outerTaskStepList) {
          data.outerTaskStepList.forEach((item: any) => {
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
        if (data.innerTaskStepList) {
          data.innerTaskStepList.forEach((item: any) => {
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
        handleGeneralEffect(data.activityDefined, data.activityType)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [])

  const handlCollocation = (record) => {
    const tableRecord: any = { ...record }
    if (remind.value !== 1 && tableRecord.couponGroupList !== undefined) {
      setCollocation(tableRecord.couponGroupList)
    } else if (remind.value === 1 && tableRecord.goodsSubsidiaryGroupList !== undefined) {
      setCollocation(tableRecord.goodsSubsidiaryGroupList)
    } else {
      setCollocation([])
    }
    setListModalVisible(true)
  }

  const columns = useMemo(() => {
    return Columns[value]?.({ value, handlCollocation })
  }, [value])

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (pathPci) {
      case 'readyExamineOne':
        fetchSoure = postMarketingPlatformActivitySignupExamineStep1
        break
      case 'readyExamineTwo':
        fetchSoure = postMarketingPlatformActivitySignupExamineStep2
        break
    }
    return fetchSoure
  }

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        subTitle={dataSource.activityId}
        title={dataSource.activityName}
        items={[
          { key: 'progressLayout', label: `${intl.formatMessage({ id: 'paltformSign.theCirculationProgress' })}` },
          { key: 'basicLayout', label: `${intl.formatMessage({ id: 'paltformSign.theBasicInformation' })}` },
          { key: 'activityRuleLayout', label: `${intl.formatMessage({ id: 'paltformSign.activityRules' })}` },
          { key: 'activityProductLayout', label: `${intl.formatMessage({ id: 'paltformSign.activitiesOfGoods' })}` },
          { key: 'activityUserLayout', label: `${intl.formatMessage({ id: 'paltformSign.activeUsers' })}` },
          { key: 'applyMallLayout', label: `${intl.formatMessage({ id: 'paltformSign.applyToMall' })}` },
          { key: 'recordLyout', label: `${intl.formatMessage({ id: 'paltformSign.transferRecord' })}` },
        ]}
        extra={
          <>
            {!preview && (
              <Button type="primary" onClick={() => setVisible(true)}>
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'paltformSign.documentsReview' })}
              </Button>
            )}
          </>
        }
      >
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <GeneralLayout
            visible
            title={`${intl.formatMessage({ id: 'paltformSign.activityRules' })}-${
              ACTIVITYTYPENAME[dataSource.activityType]
            }`}
            anchor="activityRuleLayout"
            effect={generalEffect}
          />
          <ListLayout
            anchor="activityProductLayout"
            ids={signUpId !== 'null' && { signUpId }}
            title={intl.formatMessage({ id: 'paltformSign.activitiesOfGoods' })}
            fetch={getMarketingPlatformActivitySignupDetailGoodsPage}
            columns={columns}
          />
          <ActivityUserLayout dataScoure={dataSource} />
          <DemandLayout storeList={dataSource.shopList} />
          <RecordLyout />
        </Space>
      </PageHeaderWrapper>
      {/* 审核 */}
      <ModalOperate
        id={signUpId}
        title={intl.formatMessage({ id: 'paltformSign.documentsReview' })}
        modalType="merkeingAudit"
        visible={visible}
        fetch={fetchLink()}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
      />
      {/* 查看搭配商品 */}
      {!isEmpty(remind) && remind.value === 1 && (
        <ListModalLayout
          title={remind.modalTitle}
          remind={remind}
          visible={listModalVisible}
          value={collocation}
          isPreview
          onClose={() => setListModalVisible(false)}
        />
      )}
      {/* 查看优惠券 */}
      {!isEmpty(remind) && remind.value !== 1 && (
        <CouponsListLayout
          title={remind.modalTitle}
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

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
import ListModalLayout from '../../components/listModalLayout'
import CouponsListLayout from '../../components/couponsListLayout'
import {
  remindLayout,
  RemindLayoutProps,
} from '@/pages/marketingAbility/paltformSign/readySubmitExamine/components/productListLayout/remind'
import PrizeList from './prizeList'
import {
  getMarketingMerchantActivityDetail,
  getMarketingMerchantActivityDetailGoodsPage,
  postMarketingMerchantActivityExamineStep1,
  postMarketingMerchantActivityExamineStep2,
} from '@apps/apis'
import { useQuery, useLocation } from '@linkseeks/router-core'

const DetialLayout = () => {
  const intl = useIntl()
  const { id, preview } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [generalEffect, setGeneralEffect] = useState<any>([])
  const [allUsers, setAllusers] = useState<any[]>([])
  const [value, setValue] = useState<number>(1)
  const [remind, setRemind] = useState<RemindLayoutProps>({})
  const [collocation, setCollocation] = useState<any[]>([])
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [prizeList, setPrizeList] = useState<any[]>([])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: `${intl.formatMessage({ id: 'selfManagement.activityID' })}`, extra: data.id },
          // { label: `${intl.formatMessage({ id: 'selfManagement.externalState'})}`, extra: data.outerStatusName },
          { label: `${intl.formatMessage({ id: 'selfManagement.internalState' })}`, extra: data.innerStatusName },
        ],
      },
      {
        col: [
          { label: `${intl.formatMessage({ id: 'selfManagement.theActivityType' })}`, extra: data.activityTypeName },
          { label: `${intl.formatMessage({ id: 'selfManagement.theNameOfTheEvent' })}`, extra: data.activityName },
          { label: `${intl.formatMessage({ id: 'selfManagement.memberName' })}`, extra: data.memberName },
        ],
      },
      {
        col: [
          {
            label: `${intl.formatMessage({ id: 'selfManagement.activitiesStartTime' })}`,
            extra: formatTimeString(data.startTime),
          },
          {
            label: `${intl.formatMessage({ id: 'selfManagement.activityOverTime' })}`,
            extra: formatTimeString(data.endTime),
          },
          {
            label: `${intl.formatMessage({ id: 'selfManagement.creationTime' })}`,
            extra: formatTimeString(data.createTime),
          },
        ],
      },
    ])
  }

  const handleGeneralEffect = (data: any, int?: number) => {
    console.log(GeneralEffect(int, data), 962039)
    if (!isEmpty(data)) {
      setGeneralEffect(GeneralEffect(int, data))
    }
  }

  const fetchDataSource = useCallback(async () => {
    await getMarketingMerchantActivityDetail({ id })
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        let { data } = res
        let externalLogStates: any = []
        let interiorLogStates: any = []
        let externalLogs: any = []
        let interiorLogs: any = []
        ;(data.outerTaskList || []).forEach((item: any) => {
          externalLogStates.push({
            state: item.step,
            stateName: null,
            isExecute: item.isExecute,
            operationalProcess: item.taskName,
            roleName: item.roleName,
          })
        })
        !isEmpty(externalLogStates) && (data.externalLogStates = externalLogStates)
        ;(data.innerTaskList || []).forEach((item: any) => {
          interiorLogStates.push({
            state: item.step,
            stateName: null,
            isExecute: item.isExecute,
            operationalProcess: item.taskName,
            roleName: item.roleName,
          })
        })
        !isEmpty(interiorLogStates) && (data.interiorLogStates = interiorLogStates)
        ;(data.outerRecordDOList || []).forEach((item: any, index: number) => {
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
        !isEmpty(externalLogs) && (data.externalLogs = externalLogs)
        ;(data.innerRecordDOList || []).forEach((item: any, index: number) => {
          interiorLogs.push({
            auditOpinion: item.opinion,
            createMemberId: item.memberId,
            createRoleId: item.needPlanId,
            createTime: item.operateTime,
            department: item.department,
            stateName: item.statusName,
            id: index + 1,
            memberId: null,
            memberRoleId: null,
            operation: item.operate,
            position: item.jobTitle,
            purchaseInquiryId: null,
            roleName: item.operator,
            state: item.step,
            step: item.step,
          })
        })
        !isEmpty(interiorLogs) && (data.interiorLogs = interiorLogs)
        setAllusers([
          {
            title: `${intl.formatMessage({ id: 'selfManagement.applyToTheUser' })}`,
            value: [
              {
                key: data.newUser,
                name: `${intl.formatMessage({ id: 'selfManagement.includeMember)' })}`,
              },
              {
                key: data.oldUser,
                name: `${intl.formatMessage({ id: 'selfManagement.customersIncludeMember)' })}`,
              },
              {
                key: data.newMember,
                name: `${intl.formatMessage({ id: 'selfManagement.newMembers(membersOnly)' })}`,
              },
              {
                key: data.oldMember,
                name: `${intl.formatMessage({ id: 'selfManagement.oldMembers(membersOnly)' })}`,
              },
            ],
          },
        ])
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
        fetchSoure = postMarketingMerchantActivityExamineStep1
        break
      case 'readyExamineTwo':
        fetchSoure = postMarketingMerchantActivityExamineStep2
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
          { key: 'progressLayout', label: `${intl.formatMessage({ id: 'selfManagement.theCirculationProgress' })}` },
          { key: 'basicLayout', label: `${intl.formatMessage({ id: 'selfManagement.theBasicInformation' })}` },
          { key: 'activityRuleLayout', label: `${intl.formatMessage({ id: 'selfManagement.activityRules' })}` },
          {
            key: 'activityProductLayout',
            label:
              value === 10
                ? `${intl.formatMessage({ id: 'selfManagement.thePrize' })}`
                : `${intl.formatMessage({ id: 'selfManagement.activitiesOfGoods' })}`,
          },
          { key: 'activityUserLayout', label: `${intl.formatMessage({ id: 'selfManagement.activeUsers' })}` },
          { key: 'applyMallLayout', label: `${intl.formatMessage({ id: 'selfManagement.applyToMall' })}` },
          { key: 'recordLyout', label: `${intl.formatMessage({ id: 'selfManagement.transferRecord' })}` },
        ]}
        extra={
          <>
            {!preview && (
              <Button type="primary" onClick={() => setVisible(true)}>
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'selfManagement.documentsReview' })}
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
            title={`${intl.formatMessage({ id: 'selfManagement.ActivityRules' })}-${
              ACTIVITYTYPENAME[dataSource.activityType]
            }`}
            anchor="activityRuleLayout"
            effect={generalEffect}
          />
          {value !== 10 && (
            <ListLayout
              anchor="activityProductLayout"
              ids={id !== 'null' && { activityId: id }}
              title={intl.formatMessage({ id: 'selfManagement.activitiesOfGoods' })}
              fetch={getMarketingMerchantActivityDetailGoodsPage}
              columns={columns}
            />
          )}
          {value === 10 && <PrizeList columns={columns} dataSource={prizeList} />}
          <ActivityUserLayout dataScoure={dataSource} allUsers={allUsers} />
          <DemandLayout storeList={dataSource.shopList} />
          <RecordLyout />
        </Space>
      </PageHeaderWrapper>
      {/* 审核 */}
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'selfManagement.documentsReview' })}
        modalType="marketing"
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

import React, { Fragment, useEffect, useState } from 'react'
import { Badge, Button } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Context } from '../../components/detail/components/context'
import PeripheralLayout from '../../components/detail'
import ProgressLayout from '../../components/detail/components/progressLayout'
import BasicLayout from '../../components/detail/components/basicLayout'
import RecordLyout from '../../components/detail/components/recordLyout'
import { formatTimeString } from '@/utils'

import { OFFTER_INTERNALSTATE_COLOR } from '../../constants'
import { CheckCircleOutlined } from '@ant-design/icons'
import ModalOperate from '../../components/modalOperate'
import DemandPlanMaterialLayout from '../../components/detail/components/demandPlanMaterialLayout'
import {
  getPurchaseNeedPlanDetails,
  getPurchaseNeedPlanNeedPlanDetail,
  postPurchaseNeedPlanFirstExam,
  postPurchaseNeedPlanSecondExam,
  postPurchaseNeedPlanSubmit,
} from '@apps/apis'
import { useLocation, useQuery } from '@linkseeks/router-core'
const intl = getIntl()

const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { id: 'materialLayout', title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }) },
  { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const DemandDetailed = () => {
  const { id, preview } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.needPlanNo' }), extra: data.needPlanNo },
          { label: intl.formatMessage({ id: 'detail.purchase.demendSummary' }), extra: data.summary },
          {
            label: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
            extra: <Badge status={OFFTER_INTERNALSTATE_COLOR[data.innerStatus]} text={data.innerStatusName} />,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.demendStartTime' }),
            extra: formatTimeString(data.startTime, 'YYYY-MM-DD'),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.demendEndTime' }),
            extra: formatTimeString(data.endTime, 'YYYY-MM-DD'),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.operate' }), extra: data.department },
          { label: intl.formatMessage({ id: 'detail.purchase.department' }), extra: data.userName },
          { label: intl.formatMessage({ id: 'detail.purchase.createTime' }), extra: formatTimeString(data.createTime) },
        ],
      },
    ])
  }

  const fetchDataSource = async () => {
    const params = {
      id,
    }
    await getPurchaseNeedPlanDetails({ ...params })
      .then((res: any) => {
        if (res.code !== 1000) {
          history.goBack()
          return
        }
        let { data } = res
        let interiorLogs: any = []
        let interiorLogStates: any = []
        data.innerTaskList.forEach((item: any) => {
          interiorLogStates.push({
            state: item.step,
            stateName: null,
            isExecute: item.isExecute,
            operationalProcess: item.taskName,
            roleName: item.roleName,
          })
        })
        data.innerRecords.forEach((item: any) => {
          interiorLogs.push({
            auditOpinion: item.opinion,
            createMemberId: item.memberId,
            createRoleId: item.needPlanId,
            createTime: item.operateTime,
            department: item.department,
            stateName: item.status,
            id: item.id,
            memberId: null,
            memberRoleId: null,
            operation: item.operate,
            position: item.jobTitle,
            purchaseInquiryId: null,
            roleName: item.operator,
            state: item.step + 1,
            step: item.step,
          })
        })
        data.interiorLogs = interiorLogs
        data.interiorLogStates = interiorLogStates
        setDataSource(data)
        handleBasicEffect(data)
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (pathPci) {
      case 'demandPlanOne':
        fetchSoure = postPurchaseNeedPlanFirstExam
        break
      case 'demandPlanTwo':
        fetchSoure = postPurchaseNeedPlanSecondExam
        break
      case 'demandPlanSubmit':
        fetchSoure = postPurchaseNeedPlanSubmit
        break
    }
    return fetchSoure
  }

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.needPlanNo}
        detail={dataSource.summary}
        tabLink={TABLINK}
        effect={
          <>
            {path === 'detail' && !preview && (
              <Button onClick={() => setVisible(true)} type="primary">
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
              </Button>
            )}
          </>
        }
        components={
          <Fragment>
            <ProgressLayout logstate={2} />
            <BasicLayout effect={basicEffect} />
            <DemandPlanMaterialLayout id={id} fetch={getPurchaseNeedPlanNeedPlanDetail} />
            <RecordLyout logstate={2} />
          </Fragment>
        }
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
        modalType="planAudit"
        visible={visible}
        fetch={fetchLink()}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
      />
    </Context.Provider>
  )
}
export default DemandDetailed

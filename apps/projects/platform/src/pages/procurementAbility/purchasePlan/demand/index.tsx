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
import { useQuery, useLocation } from '@linkseeks/router-core'
import { OFFTER_INTERNALSTATE_COLOR } from '../../constants'
import { MinusCircleOutlined } from '@ant-design/icons'
import ModalOperate from '../../components/modalOperate'
import DemandPlanMaterialLayout from '../../components/detail/components/demandPlanMaterialLayout'
import { getPurchaseNeedPlanDetails, getPurchaseNeedPlanNeedPlanDetail, postPurchaseNeedPlanSendBack } from '@apps/apis'

const intl = getIntl()

const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { id: 'materialLayout', title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }) },
  { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const DemandDetailed = () => {
  const { id, number } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
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
            label: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
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
          { label: intl.formatMessage({ id: 'table.purchase.department' }), extra: data.department },
          { label: intl.formatMessage({ id: 'table.purchase.userName' }), extra: data.userName },
          { label: intl.formatMessage({ id: 'table.purchase.createTime' }), extra: formatTimeString(data.createTime) },
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

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.needPlanNo}
        detail={dataSource.summary}
        tabLink={TABLINK}
        effect={
          <>
            {path === 'detail' && (
              <Button onClick={() => setVisible(true)} type="primary">
                <MinusCircleOutlined />
                {intl.formatMessage({ id: 'detail.purchase.billBack' })}
              </Button>
            )}
          </>
        }
        components={
          <Fragment>
            <ProgressLayout logstate={2} />
            <BasicLayout effect={basicEffect} />
            <DemandPlanMaterialLayout id={id} fetch={getPurchaseNeedPlanNeedPlanDetail} />
            <RecordLyout />
          </Fragment>
        }
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'detail.purchase.billBack' })}
        modalType="billBack"
        visible={visible}
        fetch={postPurchaseNeedPlanSendBack}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
      />
    </Context.Provider>
  )
}
export default DemandDetailed

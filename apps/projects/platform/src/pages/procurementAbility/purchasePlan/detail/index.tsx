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
import { CheckCircleOutlined } from '@ant-design/icons'
import ModalOperate from '../../components/modalOperate'
import PurchasePlanMaterialLayout from '../../components/detail/components/purchasePlanMaterialLayout'
import ModalLayout from './modal'
import {
  getPurchasePurchasePlanDetails,
  getPurchasePurchasePlanPurchasePlanDetail,
  postPurchasePurchasePlanFirstExam,
  postPurchasePurchasePlanSecondExam,
  postPurchasePurchasePlanSubmitExam,
} from '@apps/apis'

const intl = getIntl()

const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { id: 'materialLayout', title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }) },
  { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

interface PropsType {
  /** 类型 */
  type?: string
  /** 显示隐藏 */
  visible?: boolean
  /** 标题 */
  title?: string
  /** 传进来的数据 */
  dataScoure: string | number
}

const PurchasePlanDetailed = () => {
  const { id, preview, number } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [props, setProps] = useState<PropsType>()

  const handleEidt = (value: string | number, title: string, type: string) => {
    setProps({
      title,
      visible: true,
      dataScoure: value,
      type,
    })
  }

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.purchasePlanNo' }), extra: data.purchasePlanNo },
          {
            label: intl.formatMessage({ id: 'detail.purchase.summary' }),
            extra: (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{data.summary}</span>
                {pathPci === 'purchasePlanSubmit' && path === 'detail' && (
                  <span
                    onClick={() =>
                      handleEidt(data.summary, intl.formatMessage({ id: 'detail.purchase.summary' }), 'summary')
                    }
                    style={{ padding: 0, color: '#00A98F', cursor: 'pointer' }}
                  >
                    {intl.formatMessage({ id: 'purchase.xiugaizhaiyao' })}
                  </span>
                )}
              </div>
            ),
          },
          {
            label: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
            extra: <Badge status={OFFTER_INTERNALSTATE_COLOR[data.innerStatus]} text={data.innerStatusName} />,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.startTime' }),
            extra: (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{formatTimeString(data.startTime, 'YYYY-MM-DD')}</span>
                {pathPci === 'purchasePlanSubmit' && path === 'detail' && (
                  <span
                    onClick={() =>
                      handleEidt(
                        data.startTime,
                        intl.formatMessage({ id: 'detail.purchase.purchaseStartTime' }),
                        'startTime',
                      )
                    }
                    style={{ padding: 0, color: '#00A98F', cursor: 'pointer' }}
                  >
                    {intl.formatMessage({ id: 'purchase.xiugaishijian' })}
                  </span>
                )}
              </div>
            ),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.endTime' }),
            extra: (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{formatTimeString(data.endTime, 'YYYY-MM-DD')}</span>
                {pathPci === 'purchasePlanSubmit' && path === 'detail' && (
                  <span
                    onClick={() =>
                      handleEidt(data.endTime, intl.formatMessage({ id: 'detail.purchase.purchaseEndTime' }), 'endTime')
                    }
                    style={{ padding: 0, color: '#00A98F', cursor: 'pointer' }}
                  >
                    {intl.formatMessage({ id: 'purchase.xiugaishijian' })}
                  </span>
                )}
              </div>
            ),
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
    await getPurchasePurchasePlanDetails({ ...params })
      .then((res) => {
        if (res.code !== 1000) {
          history.goBack()
          return
        }
        let { data }: any = res
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

  const handleSubmit = () => {
    if (pathPci !== 'purchasePlanSubmit') {
      setVisible(true)
      return
    }
    postPurchasePurchasePlanSubmitExam({ id })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        history.goBack()
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (pathPci) {
      case 'purchasePlanOne':
        fetchSoure = postPurchasePurchasePlanFirstExam
        break
      case 'purchasePlanTwo':
        fetchSoure = postPurchasePurchasePlanSecondExam
        break
    }
    return fetchSoure
  }

  const reload = () => {
    fetchDataSource()
  }

  const handleClose = () => {
    setProps({
      title: '',
      visible: false,
      dataScoure: null,
      type: '',
    })
  }

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.purchasePlanNo}
        detail={dataSource.summary}
        tabLink={TABLINK}
        effect={
          <>
            {path === 'detail' && !preview && (
              <Button onClick={handleSubmit} type="primary">
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'detail.purchase.submit' })}
              </Button>
            )}
          </>
        }
        components={
          <Fragment>
            <ProgressLayout logstate={2} />
            <BasicLayout effect={basicEffect} />
            <PurchasePlanMaterialLayout id={id} fetch={getPurchasePurchasePlanPurchasePlanDetail} />
            <RecordLyout />
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
      <ModalLayout {...props} id={id} reload={reload} onClose={handleClose} />
    </Context.Provider>
  )
}
export default PurchasePlanDetailed

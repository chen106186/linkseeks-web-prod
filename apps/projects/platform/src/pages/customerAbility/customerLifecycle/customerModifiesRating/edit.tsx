/*
 * @Description: 评分人评分
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Col, Row, Space, Spin } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  GetMemberCustomerLifecycleWaitGradeDetailResponse,
  getMemberCustomerLifecycleWaitGradeDetail,
  postMemberCustomerLifecycleWaitGradeGrade,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import ModifiesBasicInfo from '../components/ModifiesBasicInfo'
import CustomerAssessmentHistoryCard from '../components/CustomerAssessmentHistoryCard'
// import ModifiesSupplyListCard from '../../components/ModifiesSupplyListCard';
import CustomerAssessmentProjectForm, {
  CustomerAssessmentProjectFormRef,
  APSubmitValueType,
} from '../components/CustomerAssessmentProjectForm'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'

const CustomerModifiesRatingVerify: React.FC<any> = (props) => {
  const [details, setDetails] = useState<GetMemberCustomerLifecycleWaitGradeDetailResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { id } = usePageStatus()
  const translate = useWebIntl()

  const supplierAssessmentProject = useRef<CustomerAssessmentProjectFormRef | null>(null)

  const getModifiesDetails = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getMemberCustomerLifecycleWaitGradeDetail({
      id,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setDetails(res.data)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getModifiesDetails()
  }, [])

  const anchors = useMemo(
    () => [
      {
        key: 'verifySteps',
        label: translate('web.common.liuzhuangjindu'),
      },
      {
        key: 'basicInfo',
        label: translate('web.common.jibenxinxi'),
      },
      {
        key: 'assessmentProject',
        label: translate('web.resource.member.kaopinxiangmu'),
      },
      {
        key: 'assessmentHistory',
        label: translate('web.resource.order.kaopinglishi'),
      },
      // {
      //   key: 'supplyList',
      //   label: translate("web.resource.commodity.huoyuanqingdan"),
      // },
    ],
    [],
  )

  const handleVerify = () => {
    supplierAssessmentProject?.current.submit()
  }

  const handleCustomerAssessmentProjectSubmit = (values: APSubmitValueType) => {
    setSubmitLoading(true)
    postMemberCustomerLifecycleWaitGradeGrade(
      {
        id: +id,
        items: values.items?.map((item) => ({
          ...item,
          id: item.id,
        })),
      },
      {
        timeout: 0,
      },
    )
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={`${details?.subMemberName || ''} | ${details?.changeRequestFormNo || ''}`}
        items={anchors}
        extra={
          <Space>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleVerify} loading={submitLoading}>
              {translate('web.common.submit')}
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {/* 流转进度 */}
          <Col span={24}>
            <div id="verifySteps">
              <AuditProcess
                innerVerifySteps={details?.verifySteps}
                innerVerifyCurrent={details?.verifySteps?.findIndex((item) => item.step === details?.currentStep)}
              />
            </div>
          </Col>
          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <ModifiesBasicInfo
                data={{
                  changeRequestFormNo: details?.changeRequestFormNo,
                  changeRequestSummary: details?.changeRequestSummary,
                  subMemberName: details?.subMemberName,
                  remark: details?.remark,
                  currentLifecycleStage: details?.currentLifecycleStage,
                  createTime: details?.createTime,
                  targetLifecycleStage: details?.targetLifecycleStage,
                  statusName: details?.statusName,
                  status: details?.status,
                }}
              />
            </div>
          </Col>
          {/* 考评项目 */}
          <Col span={24}>
            <div id="assessmentProject">
              <CustomerAssessmentProjectForm
                ref={supplierAssessmentProject}
                value={details?.items}
                onSubmit={handleCustomerAssessmentProjectSubmit}
                rater
              />
            </div>
          </Col>
          {/* 考评历史 */}
          <Col span={24}>
            <div id="assessmentHistory">
              <CustomerAssessmentHistoryCard subMemberId={details?.subMemberId} subRoleId={details?.subRoleId} />
            </div>
          </Col>
          {/* 货源清单 */}
          {/* <Col span={24}>
            <div id="supplyList">
              <ModifiesSupplyListCard data={{}} />
            </div>
          </Col> */}
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default CustomerModifiesRatingVerify

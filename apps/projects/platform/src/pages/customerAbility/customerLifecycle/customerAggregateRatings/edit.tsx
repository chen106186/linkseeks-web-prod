/*
 * @Description: 汇总评分结果
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Col, Row, Space, Spin } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  GetMemberCustomerLifecycleSummaryDetailResponse,
  getMemberCustomerLifecycleSummaryDetail,
  postMemberCustomerLifecycleWaitSubmitSubmit,
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
import CustomerAssessmentResultForm, {
  CustomerAssessmentResultFormRef,
  ARSubmitValueType,
} from '../components/CustomerAssessmentResultForm'
import { CheckCircleOutlined } from '@ant-design/icons'

const CustomerAggregateRatingsVerify: React.FC<any> = (props) => {
  const [details, setDetails] = useState<GetMemberCustomerLifecycleSummaryDetailResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState({
    totalScore: '',
  })
  const [submitLoading, setSubmitLoading] = useState(false)

  const APSubmitValue = useRef<APSubmitValueType | undefined>(undefined)

  const { id } = usePageStatus()

  const intl = useIntl()

  const supplierAssessmentProject = useRef<CustomerAssessmentProjectFormRef | null>(null)
  const supplierAssessmentResultProject = useRef<CustomerAssessmentResultFormRef | null>(null)

  const getModifiesDetails = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getMemberCustomerLifecycleSummaryDetail({
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
        label: '流转进度',
      },
      {
        key: 'basicInfo',
        label: '基本信息',
      },
      {
        key: 'assessmentProject',
        label: '考评项目',
      },
      {
        key: 'assessmentResult',
        label: '考评结果',
      },
      {
        key: 'assessmentHistory',
        label: '考评历史',
      },
      // {
      //   key: 'supplyList',
      //   label: '货源清单',
      // },
    ],
    [],
  )

  const handleVerify = async () => {
    // 加 await 是为了确保执行顺序
    await supplierAssessmentProject?.current.submit()
    await supplierAssessmentResultProject?.current.submit()
  }

  const handleComputeTotal = (total: string) => {
    setAssessmentResult({
      ...assessmentResult,
      totalScore: total,
    })
  }

  const handleCustomerAssessmentProjectSubmit = (values: APSubmitValueType) => {
    APSubmitValue.current = values
  }

  const handleCustomerAssessmentResultSubmit = (values: ARSubmitValueType) => {
    if (!APSubmitValue.current) {
      return
    }
    setSubmitLoading(true)
    postMemberCustomerLifecycleWaitSubmitSubmit(
      {
        id: +id,
        items: APSubmitValue.current.items?.map((item) => ({
          ...item,
          id: item.id,
        })),
        submitVO: values.submitVO,
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
              提交
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
                onComputeTotal={handleComputeTotal}
                rater={false}
                summay
              />
            </div>
          </Col>
          {/* 考评结果 */}
          <Col span={24}>
            <div id="assessmentResult">
              <CustomerAssessmentResultForm
                ref={supplierAssessmentResultProject}
                value={assessmentResult}
                onSubmit={handleCustomerAssessmentResultSubmit}
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

export default CustomerAggregateRatingsVerify

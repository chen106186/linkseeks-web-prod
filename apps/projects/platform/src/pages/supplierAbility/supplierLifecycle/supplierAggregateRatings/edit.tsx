/*
 * @Description: 汇总评分结果
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Col, Row, Space, Spin } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  GetMemberSupplierLifecycleSummaryDetailResponse,
  getMemberSupplierLifecycleSummaryDetail,
  postMemberSupplierLifecycleWaitSubmitSubmit,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import ModifiesBasicInfo from '../components/ModifiesBasicInfo'
import SupplierAssessmentHistoryCard from '../components/SupplierAssessmentHistoryCard'
// import ModifiesSupplyListCard from '../../components/ModifiesSupplyListCard';
import SupplierAssessmentProjectForm, {
  SupplierAssessmentProjectFormRef,
  APSubmitValueType,
} from '../components/SupplierAssessmentProjectForm'
import SupplierAssessmentResultForm, {
  SupplierAssessmentResultFormRef,
  ARSubmitValueType,
} from '../components/SupplierAssessmentResultForm'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'

const SupplierAggregateRatingsVerify: React.FC<any> = (props) => {
  const [details, setDetails] = useState<GetMemberSupplierLifecycleSummaryDetailResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState({
    totalScore: '',
  })
  const [submitLoading, setSubmitLoading] = useState(false)

  const APSubmitValue = useRef<APSubmitValueType | undefined>(undefined)

  const { id } = usePageStatus()

  const translate = useWebIntl()

  const supplierAssessmentProject = useRef<SupplierAssessmentProjectFormRef | null>(null)
  const supplierAssessmentResultProject = useRef<SupplierAssessmentResultFormRef | null>(null)

  const getModifiesDetails = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getMemberSupplierLifecycleSummaryDetail({
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
        key: 'assessmentResult',
        label: translate('web.resource.member.kaopinjieguo'),
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

  const handleSupplierAssessmentProjectSubmit = (values: APSubmitValueType) => {
    APSubmitValue.current = values
  }

  const handleSupplierAssessmentResultSubmit = (values: ARSubmitValueType) => {
    if (!APSubmitValue.current) {
      return
    }
    setSubmitLoading(true)
    postMemberSupplierLifecycleWaitSubmitSubmit(
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
              <SupplierAssessmentProjectForm
                ref={supplierAssessmentProject}
                value={details?.items}
                onSubmit={handleSupplierAssessmentProjectSubmit}
                onComputeTotal={handleComputeTotal}
                rater={false}
                summay
              />
            </div>
          </Col>
          {/* 考评结果 */}
          <Col span={24}>
            <div id="assessmentResult">
              <SupplierAssessmentResultForm
                ref={supplierAssessmentResultProject}
                value={assessmentResult}
                onSubmit={handleSupplierAssessmentResultSubmit}
              />
            </div>
          </Col>
          {/* 考评历史 */}
          <Col span={24}>
            <div id="assessmentHistory">
              <SupplierAssessmentHistoryCard subMemberId={details?.subMemberId} subRoleId={details?.subRoleId} />
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

export default SupplierAggregateRatingsVerify

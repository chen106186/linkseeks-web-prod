/*
 * @Description: 供应商变更信息组件
 */
import React, { useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Col, Row, Spin } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import ModifiesBasicInfo from '../ModifiesBasicInfo'
import SupplierAssessmentHistoryCard from '../SupplierAssessmentHistoryCard'
// import ModifiesSupplyListCard from '../../components/ModifiesSupplyListCard';
import SupplierAssessmentProject from '../SupplierAssessmentProject'
import SupplierAssessmentResult from '../SupplierAssessmentResult'
import { GetMemberSupplierLifecycleSummaryDetailResponse } from '@apps/apis'
import { useWebIntl } from '@apps/locales'

export type SupplierModifiesType = GetMemberSupplierLifecycleSummaryDetailResponse & {}

interface SupplierModifiesProfileProps {
  /**
   * 数据
   */
  data: SupplierModifiesType
  /**
   * 数据loading
   */
  loading: boolean
  /**
   * 头部右侧额外内容
   */
  extra?: React.ReactNode
}

const SupplierModifiesProfile: React.FC<SupplierModifiesProfileProps> = (props) => {
  const { data, loading, extra } = props

  const translate = useWebIntl()

  const anchors = useMemo(
    () =>
      [
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
        data?.totalScore
          ? {
              key: 'assessmentResult',
              label: translate('web.resource.member.kaopinjieguo'),
            }
          : null,
        {
          key: 'assessmentHistory',
          label: translate('web.resource.order.kaopinglishi'),
        },
        // {
        //   key: 'supplyList',
        //   name: '货源清单',
        // },
      ].filter(Boolean),
    [],
  )

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${data?.subMemberName || ''} | ${data?.changeRequestFormNo || ''}`}
        items={
          anchors as {
            key: string
            label: string
          }[]
        }
        extra={extra}
      >
        <Row gutter={[16, 16]}>
          {/* 流转进度 */}
          <Col span={24}>
            <div id="verifySteps">
              <AuditProcess
                innerVerifySteps={data?.verifySteps.map((item) => ({ ...item, roleName: '' }))}
                innerVerifyCurrent={data?.verifySteps?.findIndex((item) => item.step === data?.currentStep)}
              />
            </div>
          </Col>
          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <ModifiesBasicInfo
                data={{
                  changeRequestFormNo: data?.changeRequestFormNo,
                  changeRequestSummary: data?.changeRequestSummary,
                  subMemberName: data?.subMemberName,
                  remark: data?.remark,
                  currentLifecycleStage: data?.currentLifecycleStage,
                  createTime: data?.createTime,
                  targetLifecycleStage: data?.targetLifecycleStage,
                  statusName: data?.statusName,
                  status: data?.status,
                }}
              />
            </div>
          </Col>
          {/* 考评项目 */}
          <Col span={24}>
            <div id="assessmentProject">
              <SupplierAssessmentProject data={data?.items} />
            </div>
          </Col>
          {/* 考评结果 */}
          {data?.totalScore ? (
            <Col span={24}>
              <div id="assessmentResult">
                <SupplierAssessmentResult
                  data={{
                    totalScore: data?.totalScore,
                    notifyMember: data?.notifyMember,
                    scoringResultContent: data?.scoringResultContent,
                    resultAttachments: data?.resultAttachments,
                  }}
                />
              </div>
            </Col>
          ) : null}
          {/* 考评历史 */}
          <Col span={24}>
            <div id="assessmentHistory">
              <SupplierAssessmentHistoryCard subMemberId={data?.subMemberId} subRoleId={data?.subRoleId} />
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

export default SupplierModifiesProfile

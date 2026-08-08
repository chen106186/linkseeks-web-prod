/*
 * @Description: 客户变更信息组件
 */
import React, { useMemo } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Col, Row, Spin, Tag } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import ModifiesBasicInfo from '../ModifiesBasicInfo'
import CustomerAssessmentHistoryCard from '../CustomerAssessmentHistoryCard'
// import ModifiesSupplyListCard from '../../components/ModifiesSupplyListCard';
import CustomerAssessmentProject from '../CustomerAssessmentProject'
import CustomerAssessmentResult from '../CustomerAssessmentResult'
import type { GetMemberCustomerLifecycleSummaryDetailResponse } from '@apps/apis'
import type { ColumnType } from 'antd/lib/table/interface'
import { INTERNALSTATE_COLOR } from '@/constants/stateColor'
import { format } from 'util'
import { useWebIntl } from '@apps/locales'

export type CustomerModifiesType = GetMemberCustomerLifecycleSummaryDetailResponse & {}

interface CustomerModifiesProfileProps {
  /**
   * 数据
   */
  data: CustomerModifiesType
  /**
   * 数据loading
   */
  loading: boolean
  /**
   * 头部右侧额外内容
   */
  extra?: React.ReactNode
}

const CustomerModifiesProfile: React.FC<CustomerModifiesProfileProps> = (props) => {
  const { data, loading, extra } = props
  const intl = getIntl()
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
          label: translate('web.resource.member.kaopinjilu'),
        },
        // {
        //   key: 'supplyList',
        //   label: translate("web.resource.commodity.huoyuanqingdan"),
        // },
      ].filter(Boolean),
    [],
  )

  /** 内部流转记录 */
  const INTERNALLOGS: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'transaction_components.liuzhuanshunxuhao' }),
      key: 'id',
      dataIndex: 'id',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuoren' }),
      key: 'operatorName',
      dataIndex: 'operatorName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.bumen' }),
      key: 'operatorOrgName',
      dataIndex: 'operatorOrgName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhiwei' }),
      key: 'operatorJobTitle',
      dataIndex: 'operatorJobTitle',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhuangtai' }),
      key: 'status',
      dataIndex: 'status',
      width: 160,
      render: (_text: any, _record: any) => (
        <Tag color={INTERNALSTATE_COLOR[_text] || 'default'}>{_record.statusName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
      key: 'operation',
      dataIndex: 'operation',
      width: 230,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuoshijian' }),
      key: 'createTime',
      dataIndex: 'createTime',
      width: 160,
      render: (_text: any, _record: any) => format(_record.createTime || _record.operationTime),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shenheyijian' }),
      key: 'remark',
      dataIndex: 'remark',
      width: 160,
    },
  ]

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
                circulationIcon
                innerColumns={INTERNALLOGS}
                innerDataSource={data?.changeRequestFormHistory || []}
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
              <CustomerAssessmentProject data={data?.items} />
            </div>
          </Col>
          {/* 考评结果 */}
          {data?.totalScore ? (
            <Col span={24}>
              <div id="assessmentResult">
                <CustomerAssessmentResult
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
              <CustomerAssessmentHistoryCard subMemberId={data?.subMemberId} subRoleId={data?.subRoleId} />
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

export default CustomerModifiesProfile

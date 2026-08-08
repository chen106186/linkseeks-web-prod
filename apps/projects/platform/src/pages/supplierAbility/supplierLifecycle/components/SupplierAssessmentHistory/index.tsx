/*
 * @Description: 变更申请考评历史
 */
import React, { useMemo, useEffect, useRef } from 'react'
import PolymericTable, { FetchParamsType, NormalTableRefHandleType } from '@/components/PolymericTable'
import { ColumnType } from 'antd/lib/table'
import { getMemberSupplierAppraisalSummaryAppointPage } from '@apps/apis'
import { useWebIntl } from '@apps/locales'

export interface SupplierAssessmentHistoryProps {
  /**
   * 下级会员Id
   */
  subMemberId: number
  /**
   * 下级会员角色Id
   */
  subRoleId: number
}

type RequestParams = FetchParamsType & {
  /**
   * 下级会员Id
   */
  subMemberId: number
  /**
   * 下级会员角色Id
   */
  subRoleId: number
}

const SupplierAssessmentHistory: React.FC<SupplierAssessmentHistoryProps> = (props) => {
  const { subMemberId, subRoleId } = props
  const translate = useWebIntl()

  const polymericRef = useRef<NormalTableRefHandleType | null>(null)

  const columns: ColumnType<any>[] = useMemo(
    () => [
      {
        title: translate('web.resource.member.kaopingdanhao'),
        dataIndex: 'appraisalNo',
      },
      {
        title: translate('web.resource.member.kaopingzhuti'),
        dataIndex: 'subject',
      },
      {
        title: translate('web.resource.member.kaopingfanwei'),
        dataIndex: 'appraisalDayStart',
        render: (text, record) => `${text} ~ ${record.appraisalDayEnd}`,
      },
      {
        title: translate('web.resource.member.kaopingwanchengshijian'),
        dataIndex: 'completeDay',
      },
      {
        title: translate('web.resource.member.kaopingzuizhongfen'),
        dataIndex: 'totalScore',
      },
    ],
    [],
  )

  const fetchList = async (params: RequestParams) => {
    if (!params.subMemberId || !params.subRoleId) {
      return { data: [], totalCount: 0 }
    }
    const res = await getMemberSupplierAppraisalSummaryAppointPage({
      ...params,
      subMemberId: `${params.subMemberId}`,
      subRoleId: `${params.subRoleId}`,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    if (res.code === 1000) {
      return res.data
    }
  }

  useEffect(() => {
    if (subMemberId && subRoleId) {
      polymericRef.current.reload({
        subMemberId,
        subRoleId,
      })
    }
  }, [subMemberId, subRoleId])

  return (
    <PolymericTable
      rowKey="id"
      columns={columns}
      fetchDataSource={(params) => fetchList(params as unknown as RequestParams)}
      defaultPageSize={5}
      ref={polymericRef}
    />
  )
}

export default SupplierAssessmentHistory

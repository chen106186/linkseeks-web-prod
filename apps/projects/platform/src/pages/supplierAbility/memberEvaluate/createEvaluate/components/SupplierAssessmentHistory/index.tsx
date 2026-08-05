/*
 * @Description: 变更申请考评历史
 */
import React, { useMemo } from 'react'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import { ColumnType } from 'antd/lib/table'

interface SupplierAssessmentHistoryProps {
  /**
   * 数据，待定
   */
  data: any
}

const SupplierAssessmentHistory: React.FC<SupplierAssessmentHistoryProps> = (props) => {
  const { data } = props

  const columns: ColumnType<any>[] = useMemo(
    () => [
      {
        title: '考评单号',
        dataIndex: 'appraisalNo',
      },
      {
        title: '考评主题',
        dataIndex: 'subject',
      },
      {
        title: '考评范围',
        dataIndex: 'appraisalDayStart',
        render: (text, record) => `${text} ~ ${record.appraisalDayEnd}`,
      },
      {
        title: '考评完成时间',
        dataIndex: 'completeDay',
      },
      {
        title: '考评最终分',
        dataIndex: 'totalScore',
      },
    ],
    [],
  )

  const fetchList = async (params: FetchParamsType) => {
    // const res = await getMemberSupplierVisitList({
    //   ...params,
    //   visitType: params.visitType ? `${params.visitType}` : undefined,
    //   visitLevel: params.visitLevel ? `${params.visitLevel}` : undefined,
    //   current: `${params.current}`,
    //   pageSize: `${params.pageSize}`,
    // });
    // if (res.code === 1000) {
    //   return res.data;
    // }
    return {
      data: [
        {
          id: 1,
          appraisalNo: 'PA002X',
          subject: '11111',
          appraisalDayStart: '2022-01-14',
          appraisalDayEnd: '2022-01-28',
          completeDay: '2022-01-29',
          totalScore: '50',
        },
        {
          id: 2,
          appraisalNo: 'PA002X',
          subject: '11111',
          appraisalDayStart: '2022-01-14',
          appraisalDayEnd: '2022-01-28',
          completeDay: '2022-01-29',
          totalScore: '50',
        },
      ],
      totalCount: 0,
    }
  }

  return (
    <PolymericTable rowKey="id" columns={columns} fetchDataSource={(params) => fetchList(params)} defaultPageSize={5} />
  )
}

export default SupplierAssessmentHistory

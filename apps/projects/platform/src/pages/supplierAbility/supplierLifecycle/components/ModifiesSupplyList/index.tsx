/*
 * @Description: 变更申请货源清单
 */
import React, { useMemo } from 'react'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import { ColumnType } from 'antd/lib/table'

interface ModifiesSupplyListProps {
  /**
   * 数据，待定
   */
  data: any
}

const ModifiesSupplyList: React.FC<ModifiesSupplyListProps> = (props) => {
  const { data } = props

  const columns: ColumnType<any>[] = useMemo(
    () => [
      {
        title: '物料编号',
        dataIndex: 'appraisalNo',
      },
      {
        title: '物料名称',
        dataIndex: 'subject',
      },
      {
        title: '规格型号',
        dataIndex: 'completeDay',
      },
      {
        title: '物料组',
        dataIndex: 'completeDay',
      },
      {
        title: '品类',
        dataIndex: 'totalScore',
      },
      {
        title: '品牌',
        dataIndex: 'totalScore',
      },
      {
        title: '单位',
        dataIndex: 'totalScore',
      },
      {
        title: '供应物料编码',
        dataIndex: 'totalScore',
      },
      {
        title: '联系人',
        dataIndex: 'totalScore',
      },
      {
        title: '联系电话',
        dataIndex: 'totalScore',
      },
      {
        title: '生产厂家',
        dataIndex: 'totalScore',
      },
      {
        title: '产地',
        dataIndex: 'totalScore',
      },
      {
        title: '起运地',
        dataIndex: 'totalScore',
      },
      {
        title: '到货周期',
        dataIndex: 'totalScore',
      },
      {
        title: '交货方式',
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

export default ModifiesSupplyList

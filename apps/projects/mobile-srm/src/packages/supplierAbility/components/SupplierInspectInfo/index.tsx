/*
 * @Description: 供应商入库考察信息
 */
import React, { useMemo } from 'react'
import CellListCard, { CellListCardProps } from '../CellListCard'
import CustomUpload from '../CustomUpload'
import './index.scss'

export interface SupplierInspectInfoProps extends Omit<CellListCardProps, 'dataSource'> {
  /**
   * 考察信息
   */
  data: {
    /**
     * 考察日期
     */
    inspectDay: string
    /**
     * 考察评分
     */
    score: string
    /**
     * 考察结果
     */
    result: string
    /**
     * 考察附件
     */
    reports: {
      /**
       * 文件名
       */
      name: string
      /**
       * 文件Url
       */
      url: string
    }[]
  }
}

const SupplierInspectInfo: React.FC<SupplierInspectInfoProps> = (props: SupplierInspectInfoProps) => {
  const { data, ...restProps } = props

  const dataSource = useMemo(
    () => [
      {
        title: '考察日期',
        value: data?.inspectDay,
      },
      {
        title: '考察评分',
        value: data?.score,
      },
      {
        title: '入库考察合格',
        value: data?.result,
      },
      {
        title: '考察报告',
        label: <CustomUpload value={data?.reports.map((item) => item.url)} multiple disabled />,
      },
    ],
    [data],
  )

  return <CellListCard title="考察信息" dataSource={dataSource} {...restProps} />
}

export default SupplierInspectInfo

import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import CustomizeColumn from '@/components/CustomizeColumn'
import StatusTag from '@/components/StatusTag'

export type BasicInfoProps = {
  /**
   * 数据
   */
  dataSource: {
    /**
     * 业务员Id
     */
    userId: number
    /**
     * 业务员姓名
     */
    name: string
    /**
     * 所属机构
     */
    title: string
    /**
     * 职位
     */
    position: string
    /**
     * 所属角色
     */
    roleName: string
    /**
     * 城市Code
     */
    countryCode: string
    /**
     * 绑定手机号
     */
    phone: string
  }
}

const BasicInfo: React.FC<BasicInfoProps> = (props: BasicInfoProps) => {
  const { dataSource, ...rest } = props

  const intl = useIntl()

  const basicInfo = [
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.basicInfo.name' }),
      value: dataSource?.name || '',
    },
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.basicInfo.organization' }),
      value: dataSource?.title || '',
    },
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.basicInfo.position' }),
      value: dataSource?.position || '',
    },
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.basicInfo.role' }),
      value: dataSource?.roleName || '',
    },
    {
      title: intl.formatMessage({ id: 'salesPerformanceStatistics.basicInfo.phone' }),
      value: (dataSource?.countryCode || '') + ' ' + (dataSource?.phone || '') || '',
    },
  ]

  return (
    <CustomizeColumn
      title={intl.formatMessage({ id: 'member.components.MemberBasicInfo.title' })}
      {...rest}
      data={basicInfo}
    />
  )
}

export default React.memo(BasicInfo)

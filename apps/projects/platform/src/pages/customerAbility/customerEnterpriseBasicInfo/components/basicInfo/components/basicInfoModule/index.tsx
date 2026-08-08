import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { MEMBER_OUTER_STATUS_TYPE } from '../../../../../constant'
import CustomizeColumn from '@/components/CustomizeColumn'
import StatusTag from '@/components/StatusTag'

export type BasicInfoProps = {
  /**
   * 数据
   */
  dataSource: {
    /**
     * 会员id
     */
    memberId: number
    /**
     * 会员类型
     */
    memberTypeName: string
    /**
     * 登录账号
     */
    account: string
    /**
     * 会员名称
     */
    name: string
    /**
     * 会员角色
     */
    roleName: string
    /**
     * 注册手机号
     */
    phone: string
    /**
     * 外部状态
     */
    outerStatus: number
    /**
     * 外部状态名称
     */
    outerStatusName: string
    /**
     * 等级
     */
    level?: number
    /**
     * 会员等级
     */
    levelTag: string
    /**
     * 注册邮箱
     */
    email: string
    /**
     * 申请时间
     */
    createTime: string
    /**
     * 会员类型枚举，前端不展示，当值为3或4时，展示渠道信息
     */
    memberTypeEnum?: number
  }
}

const MemberBasicInfo: React.FC<BasicInfoProps> = (props: BasicInfoProps) => {
  const { dataSource, ...rest } = props

  const intl = useIntl()

  const basicInfo = [
    {
      title: intl.formatMessage({ id: 'customerAbility.enterpriseBasicInfo.ID' }),
      value: dataSource.memberId !== undefined ? dataSource.memberId : '',
    },
    // {
    //   title: intl.formatMessage({ id: 'supplier.components.supplierBasicInfo.supplierTypeName' }),
    //   value: dataSource.memberTypeName || '',
    // },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.account' }),
      value: dataSource.account || '',
    },
    // {
    //   title: intl.formatMessage({ id: 'supplier.components.SupplierBasicInfo.name' }),
    //   value: dataSource.name || '',
    // },
    {
      title: intl.formatMessage({ id: 'customerAbility.management.import.query.roleName' }),
      value: dataSource.roleName || '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.email' }),
      value: dataSource.email || '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.levelTag' }),
      value: dataSource.levelTag || '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.createTime' }),
      value: dataSource.createTime || '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.phone' }),
      value: dataSource.phone || '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.outerStatus' }),
      value: <StatusTag type={MEMBER_OUTER_STATUS_TYPE[dataSource.outerStatus]} title={dataSource.outerStatusName} />,
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

export default React.memo(MemberBasicInfo)

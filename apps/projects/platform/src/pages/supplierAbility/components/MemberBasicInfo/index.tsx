/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-18 16:27:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:16:15
 * @Description: 会员基础信息
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import CustomizeColumn from '@/components/CustomizeColumn'
import StatusTag from '@/components/StatusTag'
import { Badge } from 'antd'

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
     * 外部状态
     */
    innerStatus: number
    /**
     * 外部状态名称
     */
    innerStatusName: string
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

  const defaultValue = intl.formatMessage({
    id: 'common.text.not.have',
    defaultMessage: '无',
  })

  const basicInfo = [
    {
      title: intl.formatMessage({ id: 'supplier.components.supplierBasicInfo.supplierId' }),
      value: dataSource.memberId !== undefined ? dataSource.memberId : '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.phone' }),
      value: dataSource.phone || defaultValue,
    },
    {
      title: intl.formatMessage({ id: 'supplier.components.MemberBasicInfo.roleName' }),
      value: dataSource.roleName || defaultValue,
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.email' }),
      value: dataSource.email || defaultValue,
    },
    {
      title: intl.formatMessage({ id: 'supplier.components.MemberBasicInfo.levelTag' }),
      value: dataSource.levelTag || defaultValue,
      hide: !dataSource.levelTag,
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.createTime' }),
      value: dataSource.createTime || defaultValue,
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.account' }),
      value: dataSource.account || defaultValue,
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.innerStatus' }),
      value: (
        <Badge
          color={MEMBER_INNER_STATUS_BADGE_COLOR[dataSource.innerStatus] || '#606266'}
          text={dataSource.innerStatusName}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberBasicInfo.outerStatus' }),
      value: <StatusTag type={MEMBER_OUTER_STATUS_TYPE[dataSource.outerStatus]} title={dataSource.outerStatusName} />,
    },
  ]

  return (
    <CustomizeColumn
      column={2}
      title={intl.formatMessage({ id: 'member.components.MemberBasicInfo.title' })}
      {...rest}
      data={basicInfo.filter((item) => !item.hide)}
    />
  )
}

export default React.memo(MemberBasicInfo)

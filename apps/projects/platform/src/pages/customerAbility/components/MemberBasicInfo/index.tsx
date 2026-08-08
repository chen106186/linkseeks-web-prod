/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-18 16:27:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:16:15
 * @Description: 会员基础信息
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { MEMBER_OUTER_STATUS_TYPE } from '../../constant'
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

  const defaultValue = intl.formatMessage({
    id: 'common.text.not.have',
    defaultMessage: '无',
  })

  const basicInfo = [
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.memberId',
        defaultMessage: '会员ID',
      }),
      value: dataSource.memberId !== undefined ? dataSource.memberId : '',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.memberTypeName',
        defaultMessage: '会员类型',
      }),
      value: dataSource.memberTypeName || defaultValue,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.account',
        defaultMessage: '登录账户',
      }),
      value: dataSource.account || defaultValue,
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.components.MemberBasicInfo.name', defaultMessage: '登录账户' }),
      value: dataSource.name || defaultValue,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.roleName',
        defaultMessage: '会员角色',
      }),
      value: dataSource.roleName || defaultValue,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.phone',
        defaultMessage: '注册手机号',
      }),
      value: dataSource.phone || defaultValue,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.outerStatus',
        defaultMessage: '外部状态',
      }),
      value: <StatusTag type={MEMBER_OUTER_STATUS_TYPE[dataSource.outerStatus]} title={dataSource.outerStatusName} />,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.levelTag',
        defaultMessage: '会员等级',
      }),
      value: dataSource.levelTag || defaultValue,
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.components.MemberBasicInfo.email', defaultMessage: '注册邮箱' }),
      value: dataSource.email || defaultValue,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberBasicInfo.createTime',
        defaultMessage: '申请时间',
      }),
      value: dataSource.createTime || defaultValue,
    },
  ]

  return (
    <CustomizeColumn
      title={intl.formatMessage({ id: 'customerAbility.components.MemberBasicInfo.title', defaultMessage: '基本信息' })}
      {...rest}
      data={basicInfo}
    />
  )
}

export default React.memo(MemberBasicInfo)

/*
 * @Description: 信息折叠卡片
 */
import React, { useMemo } from 'react'
import CellListCard, { CellListCardProps } from '../CellListCard'
import './index.scss'

export interface BasicInfoCellListCardProps extends Omit<CellListCardProps, 'dataSource'> {
  /**
   * 数据
   */
  data: {
    /**
     * 会员id
     */
    memberId?: number
    /**
     * 会员类型
     */
    memberTypeName?: string
    /**
     * 登录账号
     */
    account?: string
    /**
     * 会员名称
     */
    name?: string
    /**
     * 会员角色
     */
    roleName?: string
    /**
     * 注册手机号
     */
    phone?: string
    /**
     * 外部状态
     */
    outerStatus?: number
    /**
     * 外部状态名称
     */
    outerStatusName?: string
    /**
     * 等级
     */
    level?: number
    /**
     * 会员等级
     */
    levelTag?: string
    /**
     * 注册邮箱
     */
    email?: string
    /**
     * 申请时间
     */
    createTime?: string
    /**
     * 会员类型枚举，前端不展示，当值为3或4时，展示渠道信息
     */
    memberTypeEnum?: number
  }
}

const BasicInfoCellListCard: React.FC<BasicInfoCellListCardProps> = (props: BasicInfoCellListCardProps) => {
  const { data, ...restProps } = props

  const dataSource = useMemo(
    () => [
      {
        title: '供应商ID',
        value: data.memberId,
      },
      {
        title: '供应商类型',
        value: data.memberTypeName,
      },
      {
        title: '供应商角色',
        value: data.roleName,
      },
      {
        title: '登陆账号',
        value: data.account,
      },
      {
        title: '注册手机号',
        value: data.account,
      },
      {
        title: '注册邮箱',
        value: data.email,
      },
      {
        title: '申请时间',
        value: data.createTime,
      },
    ],
    [data],
  )

  return <CellListCard title="基本信息" dataSource={dataSource} {...restProps} />
}

export default BasicInfoCellListCard

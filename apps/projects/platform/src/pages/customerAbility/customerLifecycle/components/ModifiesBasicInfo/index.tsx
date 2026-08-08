/*
 * @Description: 变更申请基本信息
 */
import React, { useMemo } from 'react'
import { Badge } from 'antd'
import CustomizeColumn from '@/components/CustomizeColumn'
import StatusTag from '@/components/StatusTag'
import { MODIFIES_INNER_STATUS_BADGE_COLOR } from '../../common/const'
import { useWebIntl } from '@apps/locales'

interface ModifiesBasicInfoProps {
  /**
   * 数据
   */
  data: {
    /**
     * 变更申请单编号
     */
    changeRequestFormNo: string
    /**
     * 变更申请单摘要
     */
    changeRequestSummary: string
    /**
     * 客户
     */
    subMemberName: string
    /**
     * 备注
     */
    remark: string
    /**
     * 当前阶段
     */
    currentLifecycleStage: string
    /**
     * 单据时间
     */
    createTime: string
    /**
     * 待变更目标阶段
     */
    targetLifecycleStage: string
    /**
     * 内部状态名称
     */
    statusName: string
    /**
     * 内部状态
     */
    status: number
  }
}

const ModifiesBasicInfo: React.FC<ModifiesBasicInfoProps> = (props) => {
  const { data } = props
  const translate = useWebIntl()

  const basicInfo = useMemo(
    () => [
      {
        title: translate('web.resource.order.biangengshenqingdanbianhao'),
        value: data.changeRequestFormNo,
      },
      {
        title: translate('web.resource.member.biangengshenqingdanzhaiyao'),
        value: data.changeRequestSummary,
      },
      {
        title: translate('web.resource.member.kehu'),
        value: data.subMemberName,
      },
      {
        title: translate('web.common.remark'),
        value: data.remark,
      },
      {
        title: translate('web.resource.member.dangqianjieduan'),
        value: <StatusTag type="default" title={data.currentLifecycleStage} />,
      },
      {
        title: translate('web.resource.member.danjushijian'),
        value: data.createTime,
      },
      {
        title: translate('web.resource.member.daibiangengmubiaojieduan'),
        value: <StatusTag type="default" title={data.targetLifecycleStage} />,
      },
      {
        title: translate('web.common.neibuzhuangtai'),
        value: <Badge color={MODIFIES_INNER_STATUS_BADGE_COLOR[data.status] || '#606266'} text={data.statusName} />,
      },
    ],
    [data],
  )

  return <CustomizeColumn title={translate('web.resource.order.jichuxinxi')} column={2} data={basicInfo} />
}

export default ModifiesBasicInfo

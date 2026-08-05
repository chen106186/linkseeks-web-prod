/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-09 15:30:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-09 15:30:54
 * @Description: 
 */
import { InvestigateInfoProps } from '../MemberInvestigateInfo';
import { MemberDocCategoryProProps } from '../MemberDocCategoryPro';
import { ElementType } from '../../utils';

export type VerifyStepsItemType = {
  /**
   * 角色名称
   */
  roleName: string,
  /**
   * 当前步骤
   */
  step: number,
  /**
   * 步骤名称
   */
  stepName: string,
}

export type ElementsItemType = {
  /**
   * 分组内的字段顺序
   */
  fieldOrder?: number
  /**
   * 字段类型
   */
  fieldType?: string
  /**
   * 字段中文名称
   */
  fieldLocalName?: string
  /**
   * 字段值
   */
  fieldValue?: string
  /**
   * 修改之前的值，如果没有为空字符串
   */
  lastValue?: string
  /**
   * fieldType为list的数据
   */
  registers?: ElementsItemType[]
}

export type QualitiesItemType = {
  /**
   * 文件Url
   */
  url: string
  /**
   * 文件名称
   */
  name: string
  /**
   * 有效日期，格式为yyyy-MM-dd，当permanent=1时为空字符串
   */
  expireDay: string
  /**
   * 是否长期有效，0-否，1-是
   */
  permanent: number
}

export type CategoriesItemType = {
  /**
   * 品类信息id
   */
  id: number,
  /**
   * 品类名称
   */
  name: string,
  /**
   * 付款周期（天）
   */
  paymentDay: number,
  /**
   * 发票类型名称
   */
  invoiceTypeName: string,
  /**
   * 税点，百分比的分子部分
   */
  taxPoint: string,
}

export type AreaCodeType = {
  provinceCode: string,
  cityCode: string,
}

export type DetailType = {
  /**
   * 内部流转
   */
  innerVerifySteps?: VerifyStepsItemType[],
  /**
   * 内部审核流程当前的步骤
   */
  currentInnerStep?: number,
  /**
   * 外部流转
   */
  outerVerifySteps: VerifyStepsItemType[],
  /**
   * 外部审核流程当前的步骤
   */
  currentOuterStep: number,
  /**
   * 会员id
   */
  memberId: number,
  /**
   * 会员类型
   */
  memberTypeName: string,
  /**
   * 登录账号
   */
  account: string,
  /**
   * 会员名称
   */
  name: string,
  /**
   * 会员角色
   */
  roleName: string,
  /**
   * 注册手机号
   */
  phone: string,
  /**
   * 上级会员列表
   */
  upperMembers?: {
    /**
     * 上级会员关系Id
     */
    upperRelationId: number
    /**
     * 上级会员公司名称+角色名称
     */
    name: string
  }[],
  /**
   * 渠道类型列表
   */
  channelTypes?: {
    /**
     * 渠道类型Id
     */
    channelTypeId: number
    /**
     * 渠道类型名称
     */
    channelTypeName: string
  }[],
  /**
   * 上级渠道id
   */
  upperRelationId?: number,
  /**
   * 渠道类型Id
   */
  channelTypeId?: number
  /**
   * 外部状态
   */
  outerStatus: number,
  /**
   * 外部状态名称
   */
  outerStatusName: string,
  /**
   * 等级
   */
  level?: number,
  /**
   * 会员等级
   */
  levelTag: string,
  /**
   * 注册邮箱
   */
  email: string,
  /**
   * 申请时间
   */
  registerTime: string,
  /**
   * 会员类型枚举，前端不展示，当值为3或4时，展示渠道信息
   */
  memberTypeEnum?: number,
  /**
   * 注册信息
   */
  registerDetails?: {
    /**
     * 分组名称
     */
    groupName: string,
    /**
     * 分组内的元素
     */
    elements: ElementsItemType[],
  }[],
  /**
   * 渠道信息-渠道级别
   */
  channelLevelTag: string,
  /**
   * 渠道信息-渠道级别
   */
  channelTypeName?: string,
  /**
   * 渠道信息-代理地市
   */
  areaCodes?: (string | AreaCodeType)[],
  /**
   * 渠道信息-渠道描述
   */
  remark: string,
  /**
   * 入库信息，表单用
   */
  depositDetails?: {
    /**
     * 分组名称
     */
    groupName: string,
    /**
     * 分组内的元素
     */
    elements: ElementType[],
  }[],
  /**
   * 入库信息，展示用
   */
  depositDetailTexts?: {
    /**
     * 分组名称
     */
    groupName: string,
    /**
     * 分组内的元素
     */
    elements: ElementsItemType[],
  }[],
  /**
   * 资质证明
   */
  qualities?: QualitiesItemType[],
  /**
   * 考察信息
   */
  inspection?: InvestigateInfoProps['dataSource'],
  /**
   * 分类信息
   */
  classification?: MemberDocCategoryProProps['value'],
  /**
   * 内部流转记录
   */
  innerHistory?: {
    /**
     * 记录Id
     */
    id: number
    /**
     * 操作时间
     */
    createTime: string
    /**
     * 操作人员姓名
     */
    operatorName: string
    /**
     * 操作人员组织机构名称
     */
    operatorOrgName: string
    /**
     * 操作人员职位
     */
    operatorJobTitle: string
    /**
     * 操作方法
     */
    operation: string
    /**
     * 内部状态枚举
     */
    innerStatus: number
    /**
     * 会员内部状态名称
     */
    innerStatusName: string
    /**
     * 操作说明（审核意见）
     */
    remark: string
  }[],
  /**
   * 外部流转记录
   */
  outerHistory: {
    /**
     * 记录Id
     */
    id: number
    /**
     * 操作时间
     */
    createTime: string
    /**
     * 操作角色
     */
    operatorRoleName: string
    /**
     * 外部状态枚举
     */
    outerStatus: number
    /**
     * 外部状态名称
     */
    outerStatusName: string
    /**
     * 操作
     */
    operation: string
    /**
     * 备注（审核意见）
     */
    remark: string
  }[],
  /**
   * 入库分类信息-合作关系下拉框内容 ,DropdownItem
   */
  partnerTypes?: {
    /**
     * 下拉选择框的id
     */
    id: number
    /**
     * 下拉选择框的文本内容
     */
    text: string
  }[]
};
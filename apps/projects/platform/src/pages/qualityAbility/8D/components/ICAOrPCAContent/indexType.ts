/**
 * 响应数据 ,EightDetailsVO
 */
export interface PostOrderEightDRectificationDetailResponse {
  /**
   * 主键Id
   */
  id: number
  /**
   * 整改单编号
   */
  eightDRectificationNo: string
  /**
   * 整改单类型:1:SRM;2:B2B
   */
  orderType: number
  /**
   * 来源类型:在EightDRectificationSourceTypeEnum中定义
   */
  sourceType: number
  /**
   * 来源类型名称
   */
  sourceTypeName: string
  /**
   * 摘要
   */
  summary: string
  /**
   * 供应会员id
   */
  supplyMemberId: number
  /**
   * 供应会员角色id
   */
  supplyMemberRoleId: number
  /**
   * 供应会员名称
   */
  supplyMemberName: string
  /**
   * 物料信息来源于【能力中心--商品能力--物料管理-物料查询】 ,GoodsResponse
   */
  productDetail: {
    /**
     * 编码
     */
    code: string
    /**
     * 名称
     */
    name: string
    /**
     * 规格型号
     */
    type: string
    /**
     * 会员品类
     */
    customerCategoryName: string
    /**
     * 品牌
     */
    brandName: string
    /**
     * 单位名称
     */
    unitName: string
    /**
     * 物料组
     */
    materialGroupName: string
    /**
     * 商品物料总称,用于详情中石
     */
    generalTerm: string
  }
  /**
   * 来源单据类型定义在EightDRectificationSourceOrderEnum,1-收货单,2-质检单,3-订单
   */
  qualityType: number
  /**
   * 来源单据类型名称
   */
  qualityTypeName: string
  /**
   * 来源单据的单号
   */
  orderNo: string
  /**
   * ICA要求日期yyyy-MM-dd
   */
  icaReplyTime: string
  /**
   * PCA要求日期yyyy-MM-dd
   */
  pcaReplyTime: string
  /**
   * 备注
   */
  remark: string
  /**
   * 外部状态定义在EightDRectificationExternalStatusEnum中
   */
  outerStatus: number
  /**
   * 外部状态名称
   */
  outerStatusName: string
  /**
   * 内部状态定义在EightDRectificationInternalStatusEnum中
   */
  internalStatus: number
  /**
   * 内部状态名称
   */
  internalStatusName: string
  /**
   * 检验方式定义在InspectionTypeEnum中,2:全检;3:抽检
   */
  inspectionType: number
  /**
   * 检验方式名称
   */
  inspectionTypName: string
  /**
   * 质检数量
   */
  qualityQuantity: number
  /**
   * 不良品数量
   */
  defectiveQuantity: number
  /**
   * 不良率
   */
  defectiveRate: number
  /**
   * 检验结果定义在BatchJudgmentTypeEnum中
   */
  batchJudgmentType: number
  /**
   * 检验结果名称
   */
  batchJudgmentTypeName: string
  /**
   * 问题紧急程度定义在ProblemDegreeTypeEnum中
   */
  problemDegreeType: number
  /**
   * 问题紧急程度名称
   */
  problemDegreeTypeName: string
  /**
   * 问题描述
   */
  problemDescription: string
  /**
   * 附件信息 ,EightDRectificationUrlsRequest
   */
  urls: {
    /**
     * 附件名字
     */
    name: string
    /**
     * 附件链接
     */
    url: string
  }[]
  /**
   * 小组成员信息 ,EightDRectificationMemberVO
   */
  qualityOrderProductVOS: {
    /**
     * 主键Id(新增时不用传,修改时必传)
     */
    id: number
    /**
     * 用户id
     */
    userId: number
    /**
     * 姓名
     */
    name: string
    /**
     * 所属组织机构名称
     */
    orgName: string
    /**
     * 职位
     */
    jobTitle: string
    /**
     * 邮箱
     */
    email: string
    /**
     * 手机号码前缀（国家代码）
     */
    countryCode: string
    /**
     * 手机号码
     */
    phone: string
    /**
     * 说明
     */
    legend: string
    /**
     * 是否是组长1:是;2:否
     */
    isGroupLeader: number
    /**
     * 是否供应商可见1:是;2:否
     */
    isVisible: number
  }[]
  /**
   * 整改信息 ,EightMeasuresVO
   */
  correctionInformation: {
    /**
     * 临时遏制措施列表 ,ContainmentMeasuresVO
     */
    measuresVOS: {
      /**
       * 检查环节
       */
      link: string
      /**
       * 质检数量
       */
      qualityQuantity: number
      /**
       * 不良品数量
       */
      defectiveQuantity: number
      /**
       * 处理措施
       */
      treatmentMeasures: string
      /**
       * 实施负责人UserId
       */
      userId: number
      /**
       * 实施负责人名称
       */
      name: string
      /**
       * 要求完成日期
       */
      completionDate: string
    }[]
    /**
     * 临时遏制措施描述
     */
    containmentDescription: string
    /**
     * 临时遏制措施附件 ,EightDRectificationUrlsRequest
     */
    descriptionUrls: {
      /**
       * 附件名字
       */
      name: string
      /**
       * 附件链接
       */
      url: string
    }[]
    /**
     * 根本原因
     */
    rootCause: string
    /**
     * 根本原因附件 ,EightDRectificationUrlsRequest
     */
    rootCauseUrls: {
      /**
       * 附件名字
       */
      name: string
      /**
       * 附件链接
       */
      url: string
    }[]
    /**
     * 永久纠正措施 ,CorrectiveActionVO
     */
    correctiveAction: {
      /**
       * 永久纠正措施
       */
      measure: string
      /**
       * 实施负责人UserId
       */
      carryOutUserId: number
      /**
       * 实施负责人名称
       */
      carryOutName: string
      /**
       * 实施日期
       */
      carryOutDate: string
      /**
       * 措施实施监督效果
       */
      effect: string
      /**
       * 监督负责人UserId
       */
      controlUserId: number
      /**
       * 监督负责人名称
       */
      controlName: string
      /**
       * 完成日期
       */
      completionDate: string
    }[]
    /**
     * 永久纠正措施附件 ,EightDRectificationUrlsRequest
     */
    correctiveActionUrls: {
      /**
       * 附件名字
       */
      name: string
      /**
       * 附件链接
       */
      url: string
    }[]
    /**
     * 永久纠正措施验证 ,CorrectiveActionValidateVO
     */
    correctiveActionVerify: {
      /**
       * 永久纠正措施
       */
      measure: string
      /**
       * 实施负责人UserId
       */
      carryOutUserId: number
      /**
       * 实施负责人名称
       */
      carryOutName: string
      /**
       * 实施日期
       */
      carryOutDate: string
      /**
       * 措施实施验证效果
       */
      effect: string
      /**
       * 验证人UserId
       */
      verifyUserId: number
      /**
       * 验证人名称
       */
      verifyName: string
      /**
       * 验证日期
       */
      verifyDate: string
    }[]
    /**
     * 永久纠正措施验证附件 ,EightDRectificationUrlsRequest
     */
    correctiveActionVerifyUrls: {
      /**
       * 附件名字
       */
      name: string
      /**
       * 附件链接
       */
      url: string
    }[]
    /**
     * 预防列表信息 ,CorrectivePreventVO
     */
    prevention: {
      /**
       * 检查相关文件更新
       */
      content: string
      /**
       * 文件更新结果1:是;2:否
       */
      result: number
      /**
       * 实施负责人名称
       */
      carryOutName: string
      /**
       * 完成日期
       */
      completionDate: string
    }[]
    /**
     * 预防措施详述
     */
    preventionDetail: string
    /**
     * 预防措施附件 ,EightDRectificationUrlsRequest
     */
    preventionUrls: {
      /**
       * 附件名字
       */
      name: string
      /**
       * 附件链接
       */
      url: string
    }[]
    /**
     * 效果确认
     */
    effectConfirmed: string
  }
  /**
   * 8D外部流转图 ,LogStateResponse
   */
  interiorLogStates: {
    /**
     * 需求单状态
     */
    state: number
    /**
     * 状态
     */
    stateName: string
    /**
     * 角色名字
     */
    roleName: string
    /**
     * 此流程是否已经执行：1.是0.否
     */
    isExecute: number
    /**
     * 需求单操作流程
     */
    operationalProcess: string
  }[]
  /**
   * 外部单据流转记录 ,ExternalEightLogVO
   */
  externalEightLogVOS: {
    /**
     * 操作角色名字
     */
    roleName: string
    /**
     * 外部流转状态
     */
    state: number
    /**
     * 外部流转状态名称
     */
    stateName: string
    /**
     * 操作
     */
    operation: number
    /**
     * 操作名称
     */
    operationName: string
    /**
     * 审核意见
     */
    auditOpinion: string
    /**
     * 创建时间&操作时间时间戳
     */
    createTime: number
  }[]
  /**
   * 内部单据流转记录 ,InternalEightLogVO
   */
  internalEightLogVOS: {
    /**
     * 操作角色名字
     */
    roleName: string
    /**
     * 部门
     */
    department: string
    /**
     * 职位
     */
    position: string
    /**
     * 外部流转状态
     */
    state: number
    /**
     * 外部流转状态名称
     */
    stateName: string
    /**
     * 操作
     */
    operation: number
    /**
     * 操作名称
     */
    operationName: string
    /**
     * 审核意见
     */
    auditOpinion: string
    /**
     * 创建时间&操作时间时间戳
     */
    createTime: number
  }[]
}

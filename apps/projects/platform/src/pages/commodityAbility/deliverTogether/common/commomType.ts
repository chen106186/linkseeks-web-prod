import { GetProductSampleDeliverVendorDetailResponse } from '@apps/apis'

type PartInfoType = {
  /**
   * 主键id
   */
  id?: number
  /**
   * 寄、退样人姓名
   */
  name?: string
  /**
   * 类型1.寄样2.退样
   */
  type?: number
  /**
   * 联系电话
   */
  phone?: string
  /**
   * 预计送达时间
   */
  estimatedDeliveryTime?: string
  /**
   * 退样收货人名称
   */
  receiverName?: string
  /**
   * 退样收货地址
   */
  fullAddress?: string
  /**
   * 退样收货人电话
   */
  receiverPhone?: string
  /**
   * 物流单号
   */
  logisticsNo?: string
  /**
   * 备注
   */
  remark?: string
  /**
   * 附件 ,SampleDeliveryLogisticsAttachmentBO
   */
  attachments?: {
    /**
     * 附件名称
     */
    name?: string
    /**
     * 附件地址
     */
    url?: string
  }[]
}

type SimpleProcessDefVO = {
  /**
   * 流程名称
   */
  processName: string
  /**
   * 当前步骤
   */
  currentStep: number
  /**
   * 任务列表 ,SimpleTaskResponse
   */
  tasks: {
    /**
     * 任务步骤
     */
    taskStep: number
    /**
     * 任务名称
     */
    taskName: string
    /**
     * 可执行此步骤任务的角色名称,<p>当查询的是外部流程，此字段表示会员角色名称<p>,<p>当查询的是内部流程，此字段表示用户角色名称<p>
     */
    roleName: string
    /**
     * 任务自定义属性(该参数为map)
     */
    properties: {
      /**
       * String
       */
      mapKey?: {}
      /**
       * String
       */
      mapValue?: {
        hash?: number
      }
      oper?: string
    }
  }[]
}

export interface DetailInfoType extends GetProductSampleDeliverVendorDetailResponse {
  sendInfo?: PartInfoType
  returnInfo?: PartInfoType
  simpleProcessDefVO: SimpleProcessDefVO
}

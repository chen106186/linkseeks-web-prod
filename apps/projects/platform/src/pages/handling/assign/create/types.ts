export type EnterpriceType = {
  name: string,
  memberId: number | string,
  roleId: number | string
}

export type FileType = {
  name: string,
  url?: string,
  value?: string,
}


export type SubmitDataType = {
  /** 物流地址id, 显示用，不提交 */
  receivefullAddress: number,
  receiveAddress: string
  receiveUserName: string
  receiveUserTel: string
  receiverAddressId: number

  deliveryDate: string,
  /**配送方式 */
  deliveryType: 1 | 2 | number & {},
  /* 加工企业id */
  processMemberId: number,
  processName: string
  processRoleId: number,
  /** 来源 1 加工订单， 2 加工商品 */
  source: 1 | 2 | number & {},
  /** 无用字段 */
  source1: 1 | 2 | number & {},
  /** 通知单摘要 */
  summary: string,
  orderList?: {
    /** 品牌 */
    brand: string,
    category: string
    /** skuid */
    commodityId: number,
    /** 附件 */
    enclosure: FileType[],
    /** 订单商品，即下单的商品 唯一id */
    id: number,
    /** 是否是 */
    isHasTax: 0 | 1 | number | {},
    /** 是否含税、税率，显示用 */
    isHasTaxAndTaxRate: string,
    /** 商品图片 */
    mainPic?: string,
    /** 商品名 */
    name: string,
    /** 订单id, 跟上面id 不一样 */
    orderId: number,
    orderNo: string,
    /** 加工数量 */
    processNum: string | number,
    /** 加工总价 = 加工数量 * 加工单价  */
    processTotalPrice: string | number,
    /** 加工单价 */
    processUnitPrice: string | number,
    /** 采购数量 或者叫订单数量 */
    purchaseCount: number,
    /** 采购数量 跟 单位，只做显示用 */
    purchaseCountAndUnit: string,
    /** skuid, 这里跟commodityId yizhi  */
    skuid: number,
    /** 剩余加工 */
    surplusProcessNum: number,
    /** 剩余加工数量和加工数量 */
    surplusAndProcessNum: string,
    /** 税率 */
    taxRate: string | number,
    /** 单位 */
    unitName: string,
    /** 商品属性 */
    productProps: {
      name: string,
      value: string,
    }[]
  }[],
  /** 加工商品 */
  productList: {
    brand: string,
    category: string,
    /** 商品id */
    commodityId: number,
    enclosure: FileType[],
    isHasTax: 0 | 1 | number & {}
    isHasTaxAndTaxRate: string,
    mainPic?: string,
    name: string,
    processNum: string | number,
    processTotalPrice: string | number,
    processUnitPrice: string | number,
    productProps: {
      name: string,
      value: string,
    }[],
    /** skuid */
    skuid: number,
    taxRate: string | number,
    unitName: string,
  }[],
  /** 其他说明 */
  otherDesc: string,
  /** 包装说明 */
  packingDesc: string,
  /** 付款说明 */
  payDesc: string,
  /** 税费说明 */
  taxDesc: string,
  /** 交付说明 */
  deliveryDesc: string,
  /** 物资说明 */
  materialDesc: string,
  enclosure: FileType[]
}

export type RestDataType = {
  // processMemberId: number;
  // processName: string;
  // processRoleId: number;
  // // source: 1 | 2 | number & {};
  // summary: string;
  receiveAddress?: string,
  receiveUserName?: string,
  receiveUserTel?: string,
  receiverAddressId?: number,
}

export type OtherAskType = {
  explain: {
    name: string,
    value: string
  }[],
  annex: {
    name: string,
    value: string
  }[]
}


export type SelectedProcessProductType = {
  skuid: number,
  commodityId: number,
  mainPic: string | null,
  name: string,
  category: string,
  brand: string,
  unitName: string,
  /**
   * 唯一id 从接口获取数据这个id 就是skuid， 可以直接用skuid
   * 这里新增的这个字段是为了记录， 而skuid 是为了阅读
   * 此id 就是skuid
   * */
  id: number,
}

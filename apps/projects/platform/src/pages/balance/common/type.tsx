/*
 * @Author: Bill
 * @Date: 2020-10-26 15:05:03
 * @Description: 结算能力公共类型集合
 */


/**
 * 上传凭证类型
 */
export interface VoucherFileProps {
  /**
   * 文件名
   */
  name: string,

  /**
   * 文件路径
   */
  proveUrl: string
}


export interface ProveListProps {
  /**
   * 发票号
   */
  number: string,
  /**
   * 开具时间
   */
  invoiceDate: string,
  /**
   * 备注
   */
  remark: string
}

/**
 * 开票管理中， 发票的信息， 用于开票管理查看发票，开票
 */

export interface InvoiceInfoProps {
  /**
   * 开具类型
   */
  typeName: string,

  /**
   * 发票种类
   */
  kindName: string,

  /**
   * 发票抬头
   */
  invoiceTitle: string,

  /**
   * 纳税号
   */
  taxNo: string,

  /**
    * 开户行
    */
  bankOfDeposit: string,

  /**
    * 账号
    */
  account: string,

  /**
   * 电话
   */
  tel: string,

  /**
   * 地址
   */
  address: string,

  /**
   * 发票数组
   */
  proveList: ProveListProps[]
}


enum Kind {
  /**
   * 增值税普通发票（默认）
   */
  common = 1,
  /**
   * 增值税专用发票
   */
  special = 2 //
}

enum ItemIpropType {
  /**
   * 企业
   */
  business = 1,
  /**
   * 个人
   */
  person = 2
}
/**
 * 发票内容,用于发票列表
 */
export interface IReceiptProps {
  id: number,
  kind: Kind,
  type: ItemIpropType,
  invoiceTitle: string,
  taxNo: string,
  bankOfDeposit: string,
  account: string,
  address: string,
  tel: string
  isDefault: number
}

/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-19 16:07:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-03-19 16:18:45
 * @Description: 单据模块相关常量
 */
/* --------------------------------- 内部单据类型 -------------------------------- */
/**
 * 采购入库单
 */
export const BILL_TYPE_PURCHASE_RECEIPT = 1;
/**
 * 销售发货单
 */
export const BILL_TYPE_SALES_INVOICE = 2;
/**
 * 加工入库单
 */
export const BILL_TYPE_PROCESS_RECEIPT = 3;
/**
 * 加工发货单
 */
export const BILL_TYPE_PROCESS_INVOICE = 4;
/**
 * 退货发货单
 */
export const BILL_TYPE_RETURN_INVOICE = 5;
/**
 * 退货入库单
 */
export const BILL_TYPE_RETURN_RECEIPT = 6;
/**
 * 换货退货发货单
 */
export const BILL_TYPE_EXCHANGE_RETURN_INVOICE = 11;
/**
 * 换货退货入货单
 */
export const BILL_TYPE_EXCHANGE_RETURN_RECEIPT = 12;
/**
 * 换货发货单
 */
export const BILL_TYPE_EXCHANGE_INVOICE = 7;
/**
 * 换货入库单
 */
export const BILL_TYPE_EXCHANGE_RECEIPT = 8;
/**
 * 单据类型对应的中文
 */
export const BILL_TYPE: { [key: string]: string } = {
  [BILL_TYPE_PURCHASE_RECEIPT]: '采购入库单',
  [BILL_TYPE_SALES_INVOICE]: '销售发货单',
  [BILL_TYPE_PROCESS_RECEIPT]: '加工入库单',
  [BILL_TYPE_PROCESS_INVOICE]: '加工发货单',
  [BILL_TYPE_RETURN_INVOICE]: '退货发货单',
  [BILL_TYPE_RETURN_RECEIPT]: '退货入库单',
  [BILL_TYPE_EXCHANGE_RETURN_INVOICE]: '换货退货发货单',
  [BILL_TYPE_EXCHANGE_RETURN_RECEIPT]: '换货退货入货单',
  [BILL_TYPE_EXCHANGE_INVOICE]: '换货发货单',
  [BILL_TYPE_EXCHANGE_RECEIPT]: '换货入库单',
};
/**
 * 单据类型对应的批次中文
 */
export const BILL_TYPE_BATCH: { [key: string]: string } = {
  [BILL_TYPE_PURCHASE_RECEIPT]: '发货',
  [BILL_TYPE_SALES_INVOICE]: '发货',
  [BILL_TYPE_PROCESS_RECEIPT]: '加工',
  [BILL_TYPE_PROCESS_INVOICE]: '加工',
  [BILL_TYPE_RETURN_INVOICE]: '退货',
  [BILL_TYPE_RETURN_RECEIPT]: '退货',
  [BILL_TYPE_EXCHANGE_RETURN_INVOICE]: '退货',
  [BILL_TYPE_EXCHANGE_RETURN_RECEIPT]: '退货',
  [BILL_TYPE_EXCHANGE_INVOICE]: '换货',
  [BILL_TYPE_EXCHANGE_RECEIPT]: '换货',
};

/* --------------------------------- 内部单据方向 -------------------------------- */
/**
 * 内部单据方向
 */
export const BILL_DIRECTION: { [key: string]: ('-' | '+') } = {
  [BILL_TYPE_PURCHASE_RECEIPT]: '+',
  [BILL_TYPE_SALES_INVOICE]: '-',
  [BILL_TYPE_PROCESS_RECEIPT]: '+',
  [BILL_TYPE_PROCESS_INVOICE]: '-',
  [BILL_TYPE_RETURN_INVOICE]: '-',
  [BILL_TYPE_RETURN_RECEIPT]: '+',
  [BILL_TYPE_EXCHANGE_RETURN_INVOICE]: '-',
  [BILL_TYPE_EXCHANGE_RETURN_RECEIPT]: '+',
  [BILL_TYPE_EXCHANGE_INVOICE]: '-',
  [BILL_TYPE_EXCHANGE_RECEIPT]: '+',
};

/* --------------------------------- 内部单据类型编号 -------------------------------- */
/**
 * 内部单据编号
 */
export const BILL_NUMBER: { [key: string]: string } = {
  [BILL_TYPE_PURCHASE_RECEIPT]: 'S001',
  [BILL_TYPE_SALES_INVOICE]: 'S002',
  [BILL_TYPE_PROCESS_RECEIPT]: 'S003',
  [BILL_TYPE_PROCESS_INVOICE]: 'S004',
  [BILL_TYPE_RETURN_INVOICE]: 'S005',
  [BILL_TYPE_RETURN_RECEIPT]: 'S006',
  [BILL_TYPE_EXCHANGE_RETURN_INVOICE]: 'H003',
  [BILL_TYPE_EXCHANGE_RETURN_RECEIPT]: 'H004',
  [BILL_TYPE_EXCHANGE_INVOICE]: 'S007',
  [BILL_TYPE_EXCHANGE_RECEIPT]: 'S008',
};

/* --------------------------------- 对应单据 -------------------------------- */
/**
 * 订单
 */
export const DEPENDENT_BILL_ORDER = 1;
/**
 * 换货
 */
export const DEPENDENT_BILL_EXCHANGE = 2;
/**
 * 退货
 */
export const DEPENDENT_BILL_RETURN = 3;
/**
 * 生产
 */
export const DEPENDENT_BILL_PRODUCTION = 4;
/**
 * 内部
 */
export const DEPENDENT_BILL_INTERNAL = 5;
/**
 * 对应单据对应的中文
 */
export const DEPENDENT_BILL: { [key: string]: string } = {
  [DEPENDENT_BILL_ORDER]: '订单',
  [DEPENDENT_BILL_EXCHANGE]: '换货',
  [DEPENDENT_BILL_RETURN]: '退货',
  [DEPENDENT_BILL_PRODUCTION]: '生产',
  [DEPENDENT_BILL_INTERNAL]: '内部',
};

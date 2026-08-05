/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-06 14:46:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-06 15:39:33
 * @Description: 公共常量
 */
/**
 * 快捷路由跳转
 */
 export const routes = [
  {
    name: '待提交退货申请单',
    path: 'RefundPrSubmit',
  },
  {
    name: '待新增退货发货单',
    path: 'RefundPrAddReturnInvoice',
  },
  {
    name: '待新增物流单',
    path: 'RefundPrAddLogistics',
  },
  {
    name: '待退货发货',
    path: 'RefundPrSendOut',
  },
  {
    name: '待确认退货回单',
    path: 'RefundPrConfirmBack',
  },
  {
    name: '待确认退款结果',
    path: 'RefundPrConfirmResult',
  },
  {
    name: '待确认售后完成',
    path: 'RefundPrFinished',
  },
];

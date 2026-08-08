/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-22 18:01:50
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-02 16:43:08
 * @Description: 单据列表 弹窗表格列
 */
import { formatTimeString } from '@/utils'
import { ORDER_TYPE2, PurchaseOrderInsideWorkStateTexts } from '@/constants/order'
import { getIntl } from '@linkseeks/i18n'
/**
 * 采购订单-弹窗表格列
 */
export const purchaseOrderColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanhao' }),
    // align: 'center',
    dataIndex: 'orderNo',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanzhaiyao' }),
    // align: 'center',
    dataIndex: 'orderThe',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.huiyuanmingcheng' }),
    // align: 'center',
    dataIndex: 'supplyMembersName',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.xiadanshijian' }),
    // align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanleixing' }),
    // align: 'center',
    dataIndex: 'type',
    render: (text) => ORDER_TYPE2[text],
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanzhuangtai' }),
    // align: 'center',
    dataIndex: 'interiorState',
    render: (text) => PurchaseOrderInsideWorkStateTexts[text],
  },
]

/**
 * 销售订单-弹窗表格列
 */
export const salesOrderColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanhao' }),
    // align: 'center',
    dataIndex: 'orderNo',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanzhaiyao' }),
    // align: 'center',
    dataIndex: 'orderThe',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.huiyuanmingcheng' }),
    // align: 'center',
    dataIndex: 'createMemberName',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.xiadanshijian' }),
    // align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanleixing' }),
    // align: 'center',
    dataIndex: 'type',
    render: (text) => ORDER_TYPE2[text],
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.dingdanzhuangtai' }),
    // align: 'center',
    dataIndex: 'interiorState',
    render: (text) => PurchaseOrderInsideWorkStateTexts[text],
  },
]

/**
 * 加工入库单列表
 */
export const machiningWarehousingColumns = [
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.tongzhidanhao' }),
    // align: 'center',
    dataIndex: 'noticeNo',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.tongzhidanzhaiyao' }),
    // align: 'center',
    dataIndex: 'summary',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.jiagongqiyemingcheng' }),
    // align: 'center',
    dataIndex: 'processName',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.danjushijian' }),
    // align: 'center',
    dataIndex: 'createTime',
    render: (text) => formatTimeString(text),
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.shenqingdanzhuangtai' }),
    // align: 'center',
    dataIndex: 'outerStatusName',
  },
]

/**
 * 加工发货单列表
 */
export const machiningDeliveryColumns = [
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.tongzhidanhao' }),
    // align: 'center',
    dataIndex: 'noticeNo',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.tongzhidanzhaiyao' }),
    // align: 'center',
    dataIndex: 'summary',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.gongyinghuiyuan' }),
    // align: 'center',
    dataIndex: 'supplierName',
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.danjushijian' }),
    // align: 'center',
    dataIndex: 'createTime',
    render: (text) => formatTimeString(text),
  },
  {
    title: getIntl().formatMessage({ id: 'stockSellStorage.shenqingdanzhuangtai' }),
    // align: 'center',
    dataIndex: 'outerStatusName',
  },
]

/**
 * 售后发货、入库订单列表
 */
export const getAfterSaleColumns = (isPurchaser?: boolean) => {
  return [
    {
      title: getIntl().formatMessage({ id: 'stockSellStorage.shenqingdanhao' }),
      // align: 'center',
      dataIndex: 'applyNo',
    },
    {
      title: getIntl().formatMessage({ id: 'stockSellStorage.shenqingdanzhaiyao' }),
      // align: 'center',
      dataIndex: 'applyAbstract',
    },
    isPurchaser
      ? {
          title: getIntl().formatMessage({ id: 'stockSellStorage.gongyinghuiyuan' }),
          // align: 'center',
          dataIndex: 'supplierName',
        }
      : {
          title: getIntl().formatMessage({ id: 'stockSellStorage.caigouhuiyuan' }),
          // align: 'center',
          dataIndex: 'consumerName',
        },
    {
      title: getIntl().formatMessage({ id: 'stockSellStorage.danjushijian' }),
      // align: 'center',
      dataIndex: 'applyTime',
    },
    {
      title: getIntl().formatMessage({ id: 'stockSellStorage.shenqingdanzhuangtai' }),
      // align: 'center',
      dataIndex: 'outerStatusName',
    },
  ]
}

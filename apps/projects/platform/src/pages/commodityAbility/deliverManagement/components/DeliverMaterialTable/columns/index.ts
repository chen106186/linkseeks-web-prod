import { getIntl } from '@linkseeks/i18n'

// 弹窗商品列表
export const drawerShopColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shangpinID', defaultMessage: '商品ID' }),
    dataIndex: 'id',
    align: 'center',
    width: 120,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shangpinmingcheng', defaultMessage: '商品名称' }),
    dataIndex: 'name',
    align: 'center',
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinlei', defaultMessage: '品类' }),
    dataIndex: 'customerCategoryName',
    align: 'center',
    width: 150,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brandName',
    align: 'center',
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.danwei', defaultMessage: '单位' }),
    dataIndex: 'unitName',
    align: 'center',
    width: 200,
  },
]
// 弹窗物料列表
export const drawerMaterialColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.wuliaobianhao', defaultMessage: '物料编号' }),
    dataIndex: 'code',
    align: 'center',
    width: 120,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.wuliaomingcheng', defaultMessage: '物料名称' }),
    dataIndex: 'name',
    align: 'center',
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.wuliaozu', defaultMessage: '物料组' }),
    dataIndex: 'materialGroupName',
    align: 'center',
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.guigexinghao', defaultMessage: '规格型号' }),
    dataIndex: 'type',
    align: 'center',
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinlei', defaultMessage: '品类' }),
    dataIndex: 'customerCategoryName',
    align: 'center',
    width: 150,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brandName',
    align: 'center',
    width: 200,
  },
]

// 送样商品列表
export const deliverShopColumns = [
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shangpinID', defaultMessage: '商品ID' }),
    dataIndex: 'skuId',
    key: 'skuId',
    width: 150,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.shangpinmingcheng', defaultMessage: '商品名称' }),
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinlei', defaultMessage: '品类' }),
    dataIndex: 'category',
    key: 'category',
    width: 150,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brand',
    key: 'brand',
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.danwei', defaultMessage: '单位' }),
    dataIndex: 'unit',
    key: 'unit',
    width: 120,
    component: 'Select',
    editable: true,
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzedanwei',
        defaultMessage: '请选择单位',
      }),
    },
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiushuliang', defaultMessage: '需求数量' }),
    dataIndex: 'demandQuantity',
    key: 'demandQuantity',
    width: 250,
    editable: true,
    component: 'Input',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiushijian', defaultMessage: '需求时间' }),
    dataIndex: 'demandTime',
    key: 'demandTime',
    width: 320,
    editable: true,
    component: 'DatePicker',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzexuqiushijian',
        defaultMessage: '请选择需求时间',
      }),
    },
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiuren', defaultMessage: '需求人' }),
    dataIndex: 'demandPerson',
    key: 'demandPerson',
    width: 300,
    editable: true,
    component: 'CustomInput',
    editProps: {
      placeholder: getIntl().formatMessage({
        id: 'commodity.deliverManagement.qingxuanzexuqiuren',
        defaultMessage: '请选择需求人',
      }),
    },
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiubumen', defaultMessage: '需求部门' }),
    dataIndex: 'demandDepartment',
    key: 'demandDepartment',
    width: 250,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.fujian', defaultMessage: '附件' }),
    dataIndex: 'attachmentUrl',
    key: 'attachmentUrl',
    width: 150,
    component: 'File',
    editable: true,
    editProps: {
      disabled: false,
    },
  },
]

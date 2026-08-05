// 会员弹框的列
import { getIntl } from '@linkseeks/i18n'
export const columnsSetMember: any[] = [
  {
    title: 'ID',
    dataIndex: 'memberId',
    align: 'center',
    key: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.name' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.memberTypeName' }),
    dataIndex: 'memberTypeName',
    align: 'center',
    key: 'memberTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.roleName' }),
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.levelTag' }),
    dataIndex: 'levelTag',
    align: 'center',
    key: 'levelTag',
  },
]

// 会员等级弹框的列
export const columnsSetMemberLevel: any[] = [
  {
    title: 'ID',
    dataIndex: 'levelId',
    align: 'center',
    key: 'levelId',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.memberTypeName' }),
    dataIndex: 'memberTypeName',
    align: 'center',
    key: 'memberTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.roleName' }),
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.levelTypeName' }),
    dataIndex: 'levelTypeName',
    align: 'center',
    key: 'levelTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.level' }),
    dataIndex: 'level',
    align: 'center',
    key: 'level',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.levelTag' }),
    dataIndex: 'levelTag',
    align: 'center',
    key: 'levelTag',
  },
]

// 选择商品列
export const columnsSetProduct: any[] = [
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.code' }),
    dataIndex: 'code',
    align: 'center',
    key: 'code',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.name' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
    width: 210,
    ellipsis: true,
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.customerCategory' }),
    dataIndex: 'customerCategoryName',
    align: 'center',
    key: 'customerCategoryName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.brand' }),
    dataIndex: 'brandName',
    align: 'center',
    key: 'brandName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.unitName' }),
    dataIndex: 'unitName',
    align: 'center',
    key: 'unitName',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.priceType' }),
    dataIndex: 'priceType',
    align: 'center',
    key: 'priceType',
    render: (t, r) =>
      t === 1
        ? getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.priceType.1' })
        : getIntl().formatMessage({ id: 'priceManage.constant.columnsSetProduct.priceType.2' }),
  },
]

// 和商品规格
export const columnsUnitProduct: any[] = [
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.index' }),
    dataIndex: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.index' }),
    key: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.index' }),
    align: 'center',
    className: 'commonHide',
  },
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    align: 'center',
    className: 'commonHide',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.goodsId' }),
    dataIndex: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.goodsId' }),
    key: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.goodsId' }),
    align: 'center',
    className: 'commonHide',
  },
  {
    dataIndex: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.name' }),
    key: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.name' }),
    align: 'center',
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsUnitProduct.name' }),
  },
]

// 适用会员的列
export const memberColumns: any[] = [
  {
    dataIndex: 'memberId',
    title: 'ID',
    align: 'center',
  },
  {
    dataIndex: 'name',
    align: 'center',
    title: getIntl().formatMessage({ id: 'priceManage.constant.memberColumns.name' }),
  },
  {
    dataIndex: 'memberTypeName',
    title: getIntl().formatMessage({ id: 'priceManage.constant.memberColumns.memberTypeName' }),
    align: 'center',
  },
  {
    dataIndex: 'roleName',
    title: getIntl().formatMessage({ id: 'priceManage.constant.memberColumns.roleName' }),
    align: 'center',
  },
  {
    dataIndex: 'ctl',
    title: getIntl().formatMessage({ id: 'priceManage.constant.memberColumns.ctl' }),
    align: 'center',
  },
]

// 适用会员等级的列
export const memberLevelColumns: any[] = [
  {
    dataIndex: 'levelId',
    title: 'ID',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.memberTypeName' }),
    dataIndex: 'memberTypeName',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.roleName' }),
    dataIndex: 'roleName',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.levelTypeName' }),
    dataIndex: 'levelTypeName',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.level' }),
    dataIndex: 'level',
    align: 'center',
  },
  {
    title: getIntl().formatMessage({ id: 'priceManage.constant.columnsSetMember.levelTag' }),
    dataIndex: 'levelTag',
    align: 'center',
  },
  {
    dataIndex: 'ctl',
    title: getIntl().formatMessage({ id: 'priceManage.constant.memberColumns.ctl' }),
    align: 'center',
  },
]

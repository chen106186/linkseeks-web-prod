import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
/**
 * 请购单对应的采购物料
 */
export const purchasecolumns: any = [
  {
    title: intl.formatMessage({ id: 'contract.purchase.number' }),
    dataIndex: 'requisitionNo',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.digest' }),
    dataIndex: 'digest',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.member' }),
    dataIndex: 'vendorMemberName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.department' }),
    dataIndex: 'department',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.people' }),
    dataIndex: 'requisitioner',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.time' }),
    dataIndex: 'advanceDeliveryDate',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.type' }),
    dataIndex: 'deliveryMethodName',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.address' }),
    dataIndex: 'deliveryAddress',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.materialNumber' }),
    dataIndex: 'productNo',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.materialName' }),
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.quantity' }),
    dataIndex: 'quantity',
    align: 'left',
  },
  {
    title: intl.formatMessage({ id: 'contract.purchase.internalState' }),
    dataIndex: 'buyerInnerStatusName',
    align: 'left',
  },
]

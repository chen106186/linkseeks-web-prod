import { priceFormat } from '@/utils/numberFomat'
import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const formKeys = [
  'reconciliationId',
  'reconciliationNo',
  'reconciliationAbstract',
  'createTime',
  'reconciliationTypeName',
  'reconciliationType',
  'returnResource',
  'type',
  'bankOfDeposit',
  'kind',
  'account',
  'invoiceTitle',
  'address',
  'taxNo',
  'payer',
  'tel',
]

const translate = getWebIntl()
export const reconciliationColumn = [
  {
    title: intl.formatMessage({
      id: 'balance.common.columns.productNoticecolumns.orderNo',
    }),
    dataIndex: 'reconciliationNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.orderAbstract',
    }),
    dataIndex: 'reconciliationAbstract',
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.settlementOrderTypeName',
    }),
    dataIndex: 'reconciliationTypeName',
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.orderTime',
    }),
    dataIndex: 'createTime',
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.tax',
    }),
    dataIndex: 'tax',
    render: (_, record) => {
      return record.isTaxRate === 1
        ? `${intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.tax.yes',
          })}/${priceFormat(record.taxRate * 100)}%`
        : intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.tax.none',
          })
    },
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.orderAmount',
    }),
    dataIndex: 'reconciliationMoneyAmount',
    render: (text) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.invoiceStatus',
    }),
    dataIndex: 'invoiceStatusName',
  },
]

export const statementsColumn = [
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.orderNo',
      defaultMessage: '订单号',
    }),
    dataIndex: 'orderNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.deliveryNo',
      defaultMessage: '发货单号',
    }),
    dataIndex: 'deliveryNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.receiveNo',
      defaultMessage: '收货单号',
    }),
    dataIndex: 'receiveNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.productNo',
      defaultMessage: '物料编码',
    }),
    dataIndex: 'productNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.productName',
      defaultMessage: '物料名称',
    }),
    dataIndex: 'productName',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.spec',
      defaultMessage: '规格型号',
    }),
    dataIndex: 'spec',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.category',
      defaultMessage: '品类',
    }),
    dataIndex: 'category',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.brand',
      defaultMessage: '品牌',
    }),
    dataIndex: 'brand',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.unit',
      defaultMessage: '单位',
    }),
    dataIndex: 'unit',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.taxRate',
      defaultMessage: '税率',
    }),
    dataIndex: 'taxRate',
    render: (taxRate) => `${taxRate}%`,
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.price',
      defaultMessage: '单价(含税)',
    }),
    dataIndex: 'price',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.currentReconciliationQuantity',
      defaultMessage: '对账数量',
    }),
    dataIndex: 'currentReconciliationQuantity',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.currentMoney',
      defaultMessage: '对账金额(含税)',
    }),
    dataIndex: 'currentMoney',
  },
]

export const addInvoiceDetailColumn = [
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.orderNo',
      defaultMessage: '订单号',
    }),
    width: 110,
    dataIndex: 'orderNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.deliveryNo',
      defaultMessage: '发货单号',
    }),
    width: 110,
    dataIndex: 'deliveryNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.receiveNo',
      defaultMessage: '收货单号',
    }),
    width: 110,
    dataIndex: 'receiveNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.productNo',
      defaultMessage: '物料编码',
    }),
    dataIndex: 'productNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.productName',
      defaultMessage: '物料名称',
    }),
    dataIndex: 'name',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.spec',
      defaultMessage: '规格型号',
    }),
    dataIndex: 'spec',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.category',
      defaultMessage: '品类',
    }),
    dataIndex: 'category',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.brand',
      defaultMessage: '品牌',
    }),
    dataIndex: 'brand',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.unit',
      defaultMessage: '单位',
    }),
    dataIndex: 'unit',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.taxRate',
      defaultMessage: '税率',
    }),
    dataIndex: 'taxRate',
    render: (taxRate) => `${taxRate}%`,
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.price',
      defaultMessage: '单价(含税)',
    }),
    dataIndex: 'price',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.price.not',
      defaultMessage: '单价(不含税)',
    }),
    dataIndex: 'priceNoTax',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.quantity.treat',
      defaultMessage: '待开票数量',
    }),
    dataIndex: 'treatReconciliationQuantity',
    render: (count) => Number(count)?.toFixed(3),
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.quantity',
      defaultMessage: '开票数量',
    }),
    width: 80,
    editable: true,
    formItem: 'number',
    dataIndex: 'currentNumber',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.treatMoney',
      defaultMessage: '待开票金额(含税)',
    }),
    width: 160,
    className: 'column_title',
    dataIndex: 'treatMoney',
    showTotal: true,
    render: (money) => (
      <div>
        <span>{translate('web.common.currencySymbol')}</span> {money?.toFixed(2) || 0}
      </div>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.moneyAmount',
      defaultMessage: '开票金额(含税)',
    }),
    className: 'column_title',
    dataIndex: 'currentMoneyAmount',
    showTotal: true,
    render: (money) => (
      <div>
        <span>{translate('web.common.currencySymbol')}</span> {money || 0}
      </div>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.moneyAmount.not',
      defaultMessage: '开票金额(不含税)',
    }),
    className: 'column_title',
    dataIndex: 'currentMoneyNoTax',
    showTotal: true,
    render: (money) => (
      <div>
        <span>{translate('web.common.currencySymbol')}</span> {money || 0}
      </div>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.taxAmount',
      defaultMessage: '税额',
    }),
    className: 'column_title',
    dataIndex: 'taxMoneyAmount',
    showTotal: true,
    render: (money) => (
      <div>
        <span>{translate('web.common.currencySymbol')}</span> {money || 0}
      </div>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.operation',
      defaultMessage: '操作',
    }),
    width: 80,
    action: 'delete',
    fixed: 'right',
  },
]

export const invoiceDetailColumn = [
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.orderNo',
      defaultMessage: '订单号',
    }),
    width: 110,
    dataIndex: 'orderNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.deliveryNo',
      defaultMessage: '发货单号',
    }),
    width: 110,
    dataIndex: 'deliveryNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.receiveNo',
      defaultMessage: '收货单号',
    }),
    width: 110,
    dataIndex: 'receiveNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.productNo',
      defaultMessage: '物料编码',
    }),
    dataIndex: 'productNo',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.productName',
      defaultMessage: '物料名称',
    }),
    dataIndex: 'name',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.spec',
      defaultMessage: '规格型号',
    }),
    dataIndex: 'spec',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.category',
      defaultMessage: '品类',
    }),
    dataIndex: 'category',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.brand',
      defaultMessage: '品牌',
    }),
    dataIndex: 'brand',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.unit',
      defaultMessage: '单位',
    }),
    dataIndex: 'unit',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.taxRate',
      defaultMessage: '税率',
    }),
    dataIndex: 'taxRate',
    render: (taxRate) => `${taxRate}%`,
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.price',
      defaultMessage: '单价(含税)',
    }),
    dataIndex: 'price',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.price.not',
      defaultMessage: '单价(不含税)',
    }),
    dataIndex: 'priceNoTax',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.quantity',
      defaultMessage: '开票数量',
    }),
    editable: true,
    formItem: 'number',
    dataIndex: 'currentNumber',
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.moneyAmount',
      defaultMessage: '开票金额(含税)',
    }),
    className: 'column_title',
    dataIndex: 'currentMoneyAmount',
    showTotal: true,
    render: (money) => (
      <div>
        <span>{translate('web.common.currencySymbol')}</span> {money || 0}
      </div>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.moneyAmount.not',
      defaultMessage: '开票金额(不含税)',
    }),
    className: 'column_title',
    dataIndex: 'currentMoneyNoTax',
    showTotal: true,
    render: (money) => (
      <div>
        <span>{translate('web.common.currencySymbol')}</span> {money || 0}
      </div>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'balance.invoice.columns.taxAmount',
      defaultMessage: '税额',
    }),
    className: 'column_title',
    dataIndex: 'taxMoneyAmount',
    showTotal: true,
    render: (money) => (
      <div>
        <span>{translate('web.common.currencySymbol')}</span> {money || 0}
      </div>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'balance.accountsReceivable.invoice.columns.operation',
      defaultMessage: '操作',
    }),
    width: 80,
    action: 'delete',
    fixed: 'right',
  },
]

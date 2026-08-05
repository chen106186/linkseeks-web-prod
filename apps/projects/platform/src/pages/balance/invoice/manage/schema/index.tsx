import { getIntl } from '@linkseeks/i18n'

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema, createFormActions } from '@apps/formily'
import moment from 'moment'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()

/**
 * 开票管理列表页schema
 */
export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{controllerBtns}}',
          },
        },
        reconciliationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            allowClear: true,
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderNo' }),
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        colStyle: {
          marginLeft: 16,
        },
      },
      properties: {
        reconciliationAbstract: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderAbstract' }),
            allowClear: true,
          },
        },
        number: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceNumber' }),
            allowClear: true,
          },
        },
        '[invoiceStartDate, invoiceEndDate]': {
          type: 'object',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceStartDate' }),
              intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceEndDate' }),
            ],
            allowClear: true,
            style: {
              width: 320,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.submit' }),
          },
        },
      },
    },
  },
}

/**
 * 选择单据搜索schema
 */
export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        reconciliationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            allowClear: true,
            align: 'flex-start',
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderNo' }),
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
        },
        colStyle: {
          marginRight: 16,
        },
      },
      properties: {
        reconciliationAbstract: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.orderAbstract' }),
            allowClear: true,
          },
        },
        '[createTimeStart, createTimeEnd]': {
          type: 'object',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceStartTime' }),
              intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.invoiceEndTime' }),
            ],
            allowClear: true,
            style: {
              width: 320,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.submit' }),
          },
        },
      },
    },
  },
}

// 单据信息
const receiptInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'balance.invoice.manage.addSchema.receiptInfo', defaultMessage: '单据信息' }),
    id: 'receiptInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        id: {
          type: 'string',
          readOnly: true,
          visible: false,
        },
        reconciliationId: {
          type: 'string',
          readOnly: true,
          visible: false,
        },
        reconciliationNo: {
          type: 'string',
          title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.orderNo' }),
          'x-component-props': {
            addonAfter: '{{SelectNoBtn}}',
            disabled: true,
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'balance.invoice.reconciliationNo.required',
                defaultMessage: '请选择单据号',
              }),
            },
          ],
        },
        payer: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.payer',
            defaultMessage: '付款方',
          }),
        },
        reconciliationAbstract: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.reconciliationAbstract',
            defaultMessage: '单据摘要',
          }),
        },
        createTime: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.createTime',
            defaultMessage: '单据时间',
          }),
        },
        reconciliationTypeName: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.reconciliationType',
            defaultMessage: '单据类型',
          }),
        },
        reconciliationType: {
          type: 'string',
          readOnly: true,
          visible: false,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.reconciliationType',
            defaultMessage: '单据类型',
          }),
        },
      },
    },
  },
}

// 发票信息
const invoiceInfo: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'balance.invoice.manage.addSchema.invoiceInfo', defaultMessage: '发票信息' }),
    id: 'invoiceInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        type: {
          type: 'string',
          readOnly: true,
          title: intl.formatMessage({
            id: 'balance.common.columns.productNoticecolumns.type',
            defaultMessage: '开具类型',
          }),
          enum: [
            {
              value: 1,
              label: intl.formatMessage({
                id: 'balance.settleRules.receipt.receiptItem.row.1.text.1',
                defaultMessage: '企业',
              }),
            },
            {
              value: 2,
              label: intl.formatMessage({
                id: 'balance.settleRules.receipt.receiptItem.row.1.text.2',
                defaultMessage: '个人',
              }),
            },
          ],
        },
        bankOfDeposit: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.bankOfDeposit',
            defaultMessage: '开户行',
          }),
        },
        kind: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.kind',
            defaultMessage: '发票种类',
          }),
          enum: [
            {
              value: 1,
              label: intl.formatMessage({
                id: 'balance.settleRules.receipt.receiptItem.row.2.text.1',
                defaultMessage: '增值税普通发票',
              }),
            },
            {
              value: 2,
              label: intl.formatMessage({
                id: 'balance.settleRules.receipt.receiptItem.row.2.text.2',
                defaultMessage: '增值税专用发票',
              }),
            },
          ],
        },
        account: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.account',
            defaultMessage: '账号',
          }),
        },
        invoiceTitle: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.invoiceTitle',
            defaultMessage: '发票抬头',
          }),
        },
        address: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.address',
            defaultMessage: '地址',
          }),
        },
        taxNo: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.taxNo',
            defaultMessage: '纳税号',
          }),
        },
        tel: {
          type: 'string',
          readOnly: true,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.tel',
            defaultMessage: '电话号码',
          }),
        },
      },
    },
  },
}

// 开票信息
const billInfo: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'balance.invoice.manage.addSchema.billInfo', defaultMessage: '开票信息' }),
    id: 'billInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        operateType: {
          type: 'string',
          visible: false,
          'x-linkages': [
            {
              type: 'value:state',
              target: '*(code,invoiceDate,number,remark,urlImgs)',
              condition: '{{ $value === "detail"}}',
              state: {
                editable: false,
              },
              otherwise: {
                editable: true,
              },
            },
          ],
        },
        code: {
          type: 'string',
          readOnly: true,
          title: intl.formatMessage({
            id: 'balance.common.columns.productNoticecolumns.code',
            defaultMessage: '发票代码',
          }),
          'x-component-props': {
            placeholder: translate('web.resource.balance.zuichangershizifu'),
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'balance.invoice.code.required',
                defaultMessage: '请输入发票代码',
              }),
            },
            {
              limitByte: true,
              maxByte: 20,
              placeholder: translate('web.resource.balance.zuichangershizifu'),
            },
          ],
        },
        invoiceDate: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.invoiceDate',
            defaultMessage: '开票日期',
          }),
          'x-component': 'date',
          'x-component-props': {
            style: { width: '100%' },
            placeholder: '选择日期',
            disabledDate: (current) => {
              return current && current < moment().startOf('day')
            },
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'balance.invoice.invoiceDate.required',
                defaultMessage: '请选择开票日期',
              }),
            },
            {
              limitByte: true,
              maxByte: 20,
              placeholder: translate('web.resource.balance.zuichangershizifu'),
            },
          ],
        },
        number: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.number',
            defaultMessage: '发票号码',
          }),
          'x-component-props': {
            placeholder: translate('web.resource.balance.zuichangershizifu'),
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'balance.invoice.number.required',
                defaultMessage: '请输入发票号码',
              }),
            },
            {
              limitByte: true,
              maxByte: 20,
              placeholder: translate('web.resource.balance.zuichangershizifu'),
            },
          ],
        },
        remark: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.remark',
            defaultMessage: '备注',
          }),
          maxLength: 100,
          'x-component-props': {
            placeholder: translate('web.resource.balance.zuichangyibaigewenzi'),
            maxLength: 100,
          },
        },
        urlImgs: {
          type: 'string',
          'x-component': 'UploadInvoice',
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.urlImgs',
            defaultMessage: '发票文件',
          }),
        },
        returnResource: {
          type: 'string',
          readOnly: true,
          visible: false,
          title: getIntl().formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.returnResource',
            defaultMessage: '退回原因',
          }),
        },
      },
    },
  },
}

// 发票明细
const invoiceDetails: ISchema = {
  'x-index': 3,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({
      id: 'balance.invoice.manage.addSchema.invoiceDetails',
      defaultMessage: '发票明细',
    }),
    id: 'invoiceDetails',
    showTotal: true,
  },
  properties: {
    rows: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        rowKey: 'id',
        columns: '{{invoiceDetailColumns}}',
        components: '{{invoiceDetailComponents}}',
        prefix: '{{SelectStatementsButton}}',
        scroll: {
          x: 2000,
        },
      },
      'x-rules': [
        {
          required: true,
          message: getIntl().formatMessage({
            id: 'balance.invoice.details.rows.required',
            defaultMessage: '请选择对账单',
          }),
        },
      ],
    },
  },
}

export const increaseSchema: ISchema = {
  type: 'object',
  properties: {
    receiptInfo,
    invoiceInfo,
    billInfo,
    invoiceDetails,
  },
}

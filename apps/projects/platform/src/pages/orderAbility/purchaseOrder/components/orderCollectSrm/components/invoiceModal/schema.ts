import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'

const addressSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT_LAYOUT_ADDRESS: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 20,
        full: true,
      },
      properties: {
        type: {
          type: 'radio',
          required: true,
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.type' }),
          enum: [
            {
              label: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.type1' }),
              value: 1,
            },
            {
              label: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.type2' }),
              value: 2,
            },
          ],
          default: 1,
          // "x-linkages": [
          //   {
          //     type: 'value:visible',
          //     target: 'taxNo',
          //     condition: "{{$value === 1}}"
          //   }
          // ]
        },
        kind: {
          type: 'radio',
          required: true,
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.kind' }),
          enum: [
            {
              label: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.kind1' }),
              value: 1,
            },
            {
              label: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.kind2' }),
              value: 2,
            },
          ],
          default: 1,
        },
        invoiceTitle: {
          type: 'string',
          required: true,
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.invoiceTitle' }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.invoiceTitleMessage' }),
            },
            {
              limitByte: true,
              maxByte: 40,
            },
          ],
        },
        taxNo: {
          type: 'string',
          required: true,
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.taxNo' }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.taxNoMessage' }),
            },
            {
              limitByte: true,
              maxByte: 20,
            },
          ],
        },
        bankOfDeposit: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.bankOfDeposit' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 40,
            },
          ],
        },
        account: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.account' }),
          maxLength: 20,
        },
        address: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.address' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 80,
            },
          ],
        },
        tel: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.tel' }),
          'x-rules': [
            {
              pattern: /^0\d{2,3}-?\d{7,8}$/,
              message: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.telMessage' }),
            },
          ],
        },
        isDefault: {
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.invoiceSchema.isDefault' }),
          type: 'boolean',
          'x-component-props': {
            style: { maxWidth: 36 },
          },
        },
      },
    },
  },
}

export default addressSchema

import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'

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
          title: '开具类型',
          enum: [
            {
              label: '企业（默认）',
              value: 1,
            },
            {
              label: '个人',
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
          title: '发票种类',
          enum: [
            {
              label: '增值税普通发票（默认）',
              value: 1,
            },
            {
              label: '增值税专用发票',
              value: 2,
            },
          ],
          default: 1,
        },
        invoiceTitle: {
          type: 'string',
          required: true,
          title: '发票抬头',
          'x-rules': [
            {
              required: true,
              message: '请输入发票抬头',
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
          title: '纳税号',
          'x-rules': [
            {
              required: true,
              message: '请输入纳税号',
            },
            {
              limitByte: true,
              maxByte: 20,
            },
          ],
        },
        bankOfDeposit: {
          type: 'string',
          title: '开户行',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 40,
            },
          ],
        },
        account: {
          type: 'string',
          title: '账号',
          maxLength: 20,
        },
        address: {
          type: 'string',
          title: '地址',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 80,
            },
          ],
        },
        tel: {
          type: 'string',
          title: '电话号码',
          'x-rules': [
            {
              pattern: PATTERN_MAPS.tel,
              message: '请输入正确的电话号码',
            },
          ],
        },
        isDefault: {
          title: '是否默认',
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

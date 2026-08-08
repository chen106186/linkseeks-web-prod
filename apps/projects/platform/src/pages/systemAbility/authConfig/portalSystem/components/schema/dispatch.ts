import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
const intl = getIntl()

export const DISPATCH_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT_LAYOUT_ADDRESS: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 24,
        wrapperCol: 24,
        labelAlign: 'left',
      },
      properties: {
        deliverName: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.fahuoren' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshurufahuo' }),
            },
            {
              limitByte: true,
              maxByte: 40,
            },
          ],
        },
        areaSelect: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.shouhuodiqu' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'portalSystem.qingxuanzeshengshiqu',
                defaultMessage: '请选择省/市/区',
              }),
            },
          ],
          'x-component': 'AddressSelect',
        },
        address: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            rows: 3,
            placeholder: '',
          },
          title: intl.formatMessage({ id: 'logistics.xiangxidizhi' }),
          'x-rules': [
            {
              required: true,
              message: `${intl.formatMessage({ id: 'detail.purchase.message22' })} ${intl.formatMessage({
                id: 'logistics.xiangxidizhi',
              })} `,
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        postalCode: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.youbian' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 12,
            },
          ],
        },
        NO_SUBMIT_LAYOUT_PHONE: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            wrapperCol: 24,
            label: intl.formatMessage({ id: 'logistics.shoujihaoma' }),
            className: 'noMarbottom',
            required: true,
          },
          properties: {
            MEGA_LAYOUT2_1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                grid: true,
                full: true,
                columns: 2,
              },
              properties: {
                areaCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.qingxuanze' }),
                  },
                },
                phone: {
                  type: 'string',
                  'x-mega-props': {
                    span: 3,
                  },
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.qingshurunide' }),
                    maxLength: 11,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'logistics.qingshurunide' }),
                    },
                    // {
                    //   pattern: PATTERN_MAPS.phone,
                    //   message: intl.formatMessage({ id: 'logistics.qingshuruzhengque' }),
                    // },
                  ],
                },
              },
            },
          },
        },
        tel: {
          title: intl.formatMessage({ id: 'logistics.dianhuahaoma' }),
          type: 'string',
          'x-rules': [
            {
              pattern: PATTERN_MAPS.tel,
              message: intl.formatMessage({
                id: 'portalSystem.dianhuahaomageshibuzheng',
                defaultMessage: '电话号码格式不正确',
              }),
            },
          ],
        },
        isDefault: {
          title: intl.formatMessage({ id: 'logistics.shifoumoren' }),
          type: 'boolean',
          'x-component-props': {
            style: { maxWidth: 36 },
          },
        },
      },
    },
  },
}

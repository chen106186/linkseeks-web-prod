import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { GlobalConfig } from '@/global/config'
import { getIntl } from '@linkseeks/i18n'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'
const intl = getIntl()
/**
 * 公开招标方式 弹框所用的 schema
 */

const shopInfo = GlobalConfig.web.shopInfo

export const publicBidModalSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 6,
      },
      properties: {
        publishShop: {
          type: 'checkbox',
          title: `{{help("${intl.formatMessage({ id: 'detail.purchase.priceContrast3' })}", "${intl.formatMessage({
            id: 'detail.purchase.tips2',
          })}")}}`,
          // enum: shopInfo.filter(item => item.type === 6).map(item => ({ label: item.name, value: item.id }))
        },
      },
    },
  },
}

// 货品表单schema
export const goodFormSchema: ISchema = {
  type: 'object',
  properties: {
    Text_1: {
      type: 'object',
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }),
      },
      properties: {
        NO_SUBMIT_LAYOUT_1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'top',
            full: true,
          },
          properties: {
            code: {
              type: 'string',
              title: intl.formatMessage({ id: 'table.purchase.huohao' }),
              'x-mega-props': {
                full: true,
              },
              'x-component-props': {
                disabled: true,
                addonAfter: '{{connectGood}}',
                placeholder: intl.formatMessage({ id: 'table.purchase.zuichang20gezi' }),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'table.purchase.qingxuanzehuohao' }),
                },
                {
                  pattern: /^(?=.*\d)(?=.*[a-z_A-Z])(?=.*[~!@#$%^&*-_])[\da-zA-Z~!@#$%^&*-_]{1,20}$/,
                  message: intl.formatMessage({ id: 'table.purchase.zuichang20gezi1' }),
                },
                // {
                //   limitByte: true,
                //   maxByte: 20,
                // },
              ],
            },
            name: {
              type: 'string',
              title: intl.formatMessage({ id: 'table.purchase.huopinmingcheng' }),
              'x-component-props': {
                disabled: true,
                placeholder: intl.formatMessage({ id: 'table.purchase.zuichang60gezi' }),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'table.purchase.qingtianxiehuopin' }),
                },
                {
                  limitByte: true,
                  maxByte: 60,
                },
              ],
            },
            type: {
              type: 'string',
              title: intl.formatMessage({ id: 'table.purchase.guigexinghao' }),
              'x-component-props': {
                disabled: true,
                placeholder: intl.formatMessage({ id: 'table.purchase.zuichang60gezi' }),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'table.purchase.qingtianxieguige' }),
                },
                {
                  limitByte: true,
                  maxByte: 60,
                },
              ],
            },
            categoryId: {
              type: 'array',
              title: intl.formatMessage({ id: 'table.purchase.pinlei' }),
              'x-component': 'Cascader',
              'x-component-props': {
                disabled: true,
                placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzepinlei' }),
                showSearch: false,
                notFoundContent: null,
                style: { width: '100%' },
                options: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                displayRender: '{{displayRender}}',
              },
              required: true,
            },
            categoryName: {
              type: 'string',
              title: intl.formatMessage({ id: 'table.purchase.pinleimingcheng' }),
              visible: false,
            },
            brandName: {
              type: 'string',
              title: intl.formatMessage({ id: 'table.purchase.pinpai' }),
              'x-component-props': {
                disabled: true,
                placeholder: intl.formatMessage({ id: 'table.purchase.zuichang24gezi' }),
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 24,
                },
              ],
            },
            has: {
              type: 'boolean',
              title: intl.formatMessage({ id: 'table.purchase.shifouhuopinlie' }),
              visible: false,
            },
            goodsId: {
              type: 'string',
              title: '货品id',
              visible: false,
            },
          },
        },
      },
    },
    Text_2: {
      type: 'object',
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'table.purchase.caigoushuliang' }),
      },
      properties: {
        NO_SUBMIT_LAYOUT_1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'top',
            full: true,
          },
          properties: {
            unitId: {
              title: intl.formatMessage({ id: 'table.purchase.danwei' }),
              type: 'string',
              enum: [],
              'x-component-props': {
                disabled: true,
                placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzedanwei' }),
              },
              required: true,
            },
            unitName: {
              type: 'string',
              title: intl.formatMessage({ id: 'table.purchase.danweimingcheng' }),
              visible: false,
            },
            count: {
              title: intl.formatMessage({ id: 'table.purchase.caigoushuliang' }),
              type: 'number',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.qingtianxiecaigou' }),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'table.purchase.qingshurucaigou' }),
                },
                {
                  validator: (value) => {
                    return value > Number.MAX_SAFE_INTEGER
                  },
                  message: intl.formatMessage({ id: 'table.purchase.caigoushuliangshu' }),
                },
                {
                  pattern: /^\d+(\.\d{1,3})?$/,
                  message: intl.formatMessage({ id: 'table.purchase.caigoushuliangshu1' }),
                },
              ],
            },
          },
        },
      },
    },
    Text_3: {
      type: 'object',
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'table.purchase.fujian' }),
      },
      properties: {
        file: {
          title: intl.formatMessage({ id: 'table.purchase.fujian' }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: 1,
              prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
          'x-rules': [
            {
              required: false,
              message: intl.formatMessage({ id: 'table.purchase.qingshangchuanfujian' }),
            },
          ],
          description: intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }),
        },
      },
    },
  },
}

// 选择货品抽屉高级筛选
export const goodSearch: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'table.purchase.huopinmingcheng' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'wrap',
          width: '100%',
          justifyContent: 'flex-start',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        code: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.huohao' }),
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.shangpinpinpai' }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            style: { width: '174px' },
            searchValue: null,
            dataoption: [],
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'CustomCategorySearch',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.shangpinpinlei' }),
            showSearch: true,
            notFoundContent: null,
            style: { width: '174px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}

// 选择会员筛选
export const formSearch: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruhuiyuan' }),
        align: 'flex-left',
        advanced: false,
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}

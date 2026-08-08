import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/** 一级标签 */
export const tabTitleSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        primary: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.drawer.activity.columns.templateName' }),
          enum: [],
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.category.select.onelevel.type' }),
            },
          ],
        },
        title: {
          type: 'string',
          display: false,
        },
      },
    },
  },
}

/** 二级标签 */
export const secondaryTabSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        secondary: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.drawer.activity.columns.templateName' }),
          enum: [],
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.category.select.secondary.type' }),
            },
          ],
        },
        title: {
          type: 'string',
          display: false,
        },
        icon: {
          type: 'string',
          title: intl.formatMessage({ id: 'common.form.label.icon' }),
          'x-component': 'FormilyUpload',
          'x-component-props': {
            renderUploadChild: '{{renderUploadChild}}',
            showFiles: false,
            customizeItemRender: null,
            children: null,
            maxCount: 1,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.form.btn.upload.img' }),
            },
          ],
        },
      },
    },
  },
}

/** 区块标题 */

export const blockSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        blockTitle: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.setting.form.title' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.setting.form.title.required' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 32,
            },
          ],
        },
      },
    },
  },
}

/** 限量采购schema */
export const flashSaleSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        product: {
          type: 'object',
          'x-component': 'FormilyProduct',
          'x-component-props': {
            activityType: 12, // 秒杀类型
          },
        },
      },
    },
  },
}

/** 销量采购 */

/** 销量排行schema */
export const saleRankSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        rankProduct: {
          type: 'object',
          'x-component': 'FormilyCommodity',
          'x-component-props': {
            commodityKey: 'saleRanking',
          },
        },
        sale: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.category.sales.volume' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.category.sales.volume.required' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 16,
            },
            {
              pattern: /^\d+$/,
              message: intl.formatMessage({ id: 'common.form.rule.only.number' }),
            },
          ],
        },
      },
    },
  },
}

/** 品牌 */
export const branchSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        brand: {
          type: 'object',
          // title: '',
          'x-component': 'FormilyBrand',
        },
      },
    },
  },
}

export const productListSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        // title: {
        //   type: 'string',
        //   title: '标题',
        // },
        type: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.form.label.product.show' }),
          'x-component': 'FormilyRadio',
          enum: [
            {
              label: intl.formatMessage({ id: 'editor.form.label.product.type_1' }),
              value: 1,
            },
            {
              label: intl.formatMessage({ id: 'editor.form.label.product.type_2' }),
              value: 2,
            },
            {
              label: intl.formatMessage({ id: 'editor.form.label.product.type_3' }),
              value: 3,
            },
          ],
          'x-linkages': [
            {
              type: 'value:state',
              target: 'num',
              state: {
                visible: '{{$value !== 3}}',
              },
            },
          ],
        },
        num: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.form.label.product.show.count' }),
        },
      },
    },
  },
}

/** 精选商品schema */
export const commoditySchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        commodity: {
          type: 'object',
          'x-component': 'FormilyCommodity',
          'x-component-props': {
            isWithLabels: true,
            commodityKey: 'suggestProduct',
          },
        },
      },
    },
  },
}

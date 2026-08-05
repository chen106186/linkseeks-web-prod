import { ISchema } from '@apps/formily'

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
          title: "{{ text('类型', help('注意：当一级导航确认选择后，不能修改。')) }}",
          enum: [],
          'x-rules': [
            {
              required: true,
              message: '请选择一级品类',
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
          title: '类型',
          enum: [],
          'x-rules': [
            {
              required: true,
              message: '请选择二级类型',
            },
          ],
        },
        title: {
          type: 'string',
          display: false,
        },
        icon: {
          type: 'string',
          title: '图标',
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
              message: '请上传图片',
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
          title: '标题',
          'x-rules': [
            {
              required: true,
              message: '请填写标题',
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
          title: '销量',
          'x-rules': [
            {
              required: true,
              message: '请填写销量',
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
          title: '商品展示',
          'x-component': 'FormilyRadio',
          enum: [
            {
              label: '自动按销量排行展示 (从高到低)',
              value: 1,
            },
            {
              label: '自动按上架时间排序 (从新到旧)',
              value: 2,
            },
            {
              label: '自定义选择',
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
          title: '展示数量',
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

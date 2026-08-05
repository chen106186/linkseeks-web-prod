import { ISchema } from '@apps/formily'

/** 活动图片广告图 */
export const activityImageSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        imageUrl: {
          type: 'string',
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
              message: `请上传图片`,
            },
          ],
        },
      },
    },
  },
}

/** 优惠券 */
export const couponSchema: ISchema = {
  type: 'object',
  properties: {
    coupon: {
      type: 'object',
      'x-component': 'FormilyCoupon',
    },
  },
}

/** 卡片容器 */
export const cardSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        title: {
          type: 'string',
          title: `活动名称`,
          'x-rules': [
            {
              required: true,
              message: `请填写活动名称`,
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

/**
 * 活动商品
 */
export const activityProducts: ISchema = {
  type: 'object',
  properties: {
    product: {
      type: 'object',
      'x-component': 'FormilyProduct',
    },
  },
}

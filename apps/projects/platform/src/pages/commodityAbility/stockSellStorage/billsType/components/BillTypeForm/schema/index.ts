/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-02 16:08:24
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { DOC_DIRECTION_WAREHOUSING, DOC_DIRECTION_OUTGOING, DOC_DIRECTION } from '@/constants/commodity'
import { getIntl } from '@linkseeks/i18n'
export const billsTypeDetailSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 12,
        labelAlign: 'left',
      },
      properties: {
        number: {
          type: 'text',
          visible: false,
          title: getIntl().formatMessage({ id: 'stockSellStorage.danjuleixingbianhao' }),
          // 'x-component-props': {
          //   placeholder: getIntl().formatMessage({ id: 'stockSellStorage.zuichang10gezifu' }),
          //   maxLength: 10,
          // },
          // 'x-rules': [
          //   {
          //     required: true,
          //     message: getIntl().formatMessage({ id: 'stockSellStorage.qingshurudanjuleixingbian' }),
          //   },
          //   {
          //     validator: value => {
          //       const CNReg = /[\u4E00-\u9FA5]/g;
          //       return CNReg.test(value) ? getIntl().formatMessage({ id: 'stockSellStorage.qingshurufeizhongwenzifu' }) : '';
          //     },
          //   },
          // ],
        },
        name: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'stockSellStorage.danjuleixingmingcheng' }),
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.zuichang20gezifu10ge' }),
          },
          'x-rules': [
            { required: true },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        direction: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'stockSellStorage.danjuleixingfangxiang' }),
          enum: [
            {
              label: DOC_DIRECTION[DOC_DIRECTION_WAREHOUSING],
              value: DOC_DIRECTION_WAREHOUSING,
            },
            {
              label: DOC_DIRECTION[DOC_DIRECTION_OUTGOING],
              value: DOC_DIRECTION_OUTGOING,
            },
          ],
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanze' }),
          },
          required: true,
        },
      },
    },
  },
}

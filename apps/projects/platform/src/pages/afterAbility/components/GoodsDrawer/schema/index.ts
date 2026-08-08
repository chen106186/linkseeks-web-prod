/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 10:03:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-13 10:17:48
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const listSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.GoodsDrawer.orderNo.placeholder',
              defaultMessage: '搜索',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'afterService.components.GoodsDrawer.orderNo.tip',
              defaultMessage: '输入 订单号 进行搜索',
            }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            digest: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.components.GoodsDrawer.digest.placeholder',
                  defaultMessage: '订单摘要',
                }),
                allowClear: true,
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.components.GoodsDrawer.date.placeholder',
                  defaultMessage: '下单时间(全部)',
                }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'afterService.components.GoodsDrawer.query',
                  defaultMessage: '查询',
                }),
              },
            },
          },
        },
      },
    },
  },
}

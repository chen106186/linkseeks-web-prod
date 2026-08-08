/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 10:03:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-08 14:53:34
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { UPLOAD_TYPE } from '@/constants'

const intl = getIntl()

export const listSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        applyNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.common.query.applyNo.placeholder',
              defaultMessage: '搜索',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'afterService.common.query.applyNo.tip',
              defaultMessage: '输入 申请单号 进行搜索',
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
            applyAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.common.query.applyAbstract.placeholder',
                  defaultMessage: '申请单摘要',
                }),
                allowClear: true,
              },
            },
            supplierName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.common.query.supplierName.placeholder',
                  defaultMessage: '供应会员',
                }),
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.common.query.date.placeholder',
                  defaultMessage: '单据时间(全部)',
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
                children: intl.formatMessage({ id: 'afterService.common.query.submit', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}

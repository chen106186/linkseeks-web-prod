import type { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': { className: 'useMegaStart' },
          properties: {
            deliveryNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({
                  id: 'customerAbility.songyang.deliveryNo.placeholder',
                  defaultMessage: '请输入送样需求单号',
                }),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-end',
            },
            colStyle: { marginLeft: 20 },
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({
                  id: 'customerAbility.songyang.title_2',
                  defaultMessage: '送样需求单摘要',
                }),
              },
            },
            '[demandDateStart, demandDateEnd]': {
              type: 'daterange',
              'x-component-props': {
                allowClear: true,
                placeholder: [
                  getIntl().formatMessage({
                    id: 'customerAbility.songyang.demandDateStart.placeholder',
                    defaultMessage: '需求开始日期',
                  }),
                  getIntl().formatMessage({
                    id: 'customerAbility.songyang.demandDateEnd.placeholder',
                    defaultMessage: '需求结束日期',
                  }),
                ],
              },
            },
            buyerMemberName: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({
                  id: 'customerAbility.songyang.title_buyers',
                  defaultMessage: '采购商',
                }),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': { span: 1 },
              'x-component-props': {
                children: getIntl().formatMessage({
                  id: 'customerAbility.management.common.schames.query',
                }),
              },
            },
          },
        },
      },
    },
  },
}

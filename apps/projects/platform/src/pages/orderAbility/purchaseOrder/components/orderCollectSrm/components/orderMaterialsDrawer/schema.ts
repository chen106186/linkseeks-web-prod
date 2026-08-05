import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 1,
      },
      properties: {
        code: {
          type: 'string',
          'x-mega-props': {
            wrapperCol: 12,
          },
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '物料编号',
            align: 'flex-left',
            tip: '输入 物料编号 进行搜索',
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
            materielName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'components.wuliaomingcheng', defaultMessage: '物料名称' }),
                allowClear: true,
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'components.guigexinghao', defaultMessage: '规格型号' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'common.button.search', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}

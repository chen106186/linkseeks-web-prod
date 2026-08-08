import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

export const schema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          properties: {
            contractNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({
                  id: 'contract.qingshuruhetongbianhao',
                  defaultMessage: '请输入合同编号',
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
            },
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            contractAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'contract.qingshuruhetongzhaiyao',
                  defaultMessage: '请输入合同摘要',
                }),
              },
            },
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                showTime: false,
                placeholder: [
                  getIntl().formatMessage({ id: 'contract.kaishishijian', defaultMessage: '开始时间' }),
                  getIntl().formatMessage({ id: 'contract.jieshushijian', defaultMessage: '结束时间' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'common.button.query', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}

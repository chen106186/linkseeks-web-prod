import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
// import { QUERY_SEARCH_NAME, TO_BE_ADD_QUERY_SEARCH_NAME, PENDING_FIRST_AND_SECOND_NOTICE } from '../contants';
import { docTime } from '../../common'
import { getIntl } from '@linkseeks/i18n'

/**
 * 待新增加工入库单 - 列表页 schema
 */

const intl = getIntl()
export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        noticeNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'handling.notice.search' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'handling.notice.search.tips' }),
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
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: '',
                allowClear: true,
              },
            },
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.assign.add.noticeDesc' }),
              },
            },
            docTime: {
              type: 'string',
              default: 0,
              enum: docTime,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.docTime' }),
                allowClear: true,
              },
            },

            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'common.button.search' }),
              },
            },
          },
        },
      },
    },
  },
}

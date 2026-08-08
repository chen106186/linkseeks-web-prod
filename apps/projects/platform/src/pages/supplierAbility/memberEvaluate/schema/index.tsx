import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

/**
 * 会员考评页scheam
 */
export const evaluationListSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-Layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-Layout',
          'x-component-props': {
            grid: true,
            // columns: 3,
          },
          properties: {
            ctl: {
              type: 'object',
              // 'x-component': 'Children',
              // 'x-component-props': {
              //   children: '{{controllerBtns}}',
              // },
              'x-component': 'controllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'supplier.supplierInspection.common.schema.add.searchsupplierName',
                })}`,
                tip: `${intl.formatMessage({ id: 'supplier.management.import.query.name.placeholder-tip' })}`,
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            subject: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTopic' })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[appraisalDayStart,appraisalDayEnd]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateBeginTime' })}`,
                  `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateEndTime' })}`,
                ],
                allowClear: true,
                style: {
                  width: 260,
                },
              },
            },
            // status: {
            //   type: 'string',
            //   default: undefined,
            //   enum: [],
            //   'x-component-props': {
            //     placeholder: '内部状态(全部)',
            //     allowClear: true,
            //     style: {
            //       width: 160,
            //     },
            //   },
            // },

            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.query' })}`,
              },
            },
          },
        },
      },
    },
  },
}

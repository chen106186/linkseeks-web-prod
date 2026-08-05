import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

/**
 * 会员考评页scheam
 */
const searchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        upperName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${intl.formatMessage({
              id: 'supplier.supplierInspection.common.schema.add.searchsupplierName',
            })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({
              id: 'supplier.supplierEvaluationResults.list.tip',
              defaultMessage: '输入 归属供应商名称 进行搜索',
            })}`,
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
            subject: {
              type: 'string',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTopic' })}`,
                allowClear: true,
                style: {
                  width: 145,
                },
              },
            },
            '[appraisalDayStart,appraisalDayEnd]': {
              type: 'daterange',
              'x-mega-props': {
                span: 2,
              },
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

export default searchSchema

import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

/**
 * 会员考评页scheam
 */
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${intl.formatMessage({
              id: 'supplier.supplierInspection.common.schema.add.searchsupplierName',
            })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({ id: 'supplier.supplierEvaluate.allQuery.schema.searchForsupplierName' })}`,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            subject: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTopic' })}`,
                allowClear: true,
                style: {
                  width: 200,
                },
              },
            },
            '[appraisalDayStart,appraisalDayEnd]': {
              type: 'daterange',
              'x-mega-props': {
                wrapperWidth: 240,
              },
              'x-component-props': {
                placeholder: [
                  `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateBeginTime' })}`,
                  `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateEndTime' })}`,
                ],
                allowClear: true,
              },
            },
            status: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.management.maintain.query.innerStatus.placeholder',
                })}`,
                allowClear: true,
                style: {
                  width: 200,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
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

export const scoringSchema: ISchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      'x-component': 'arraytable',
      'x-component-props': {
        // operations: false,
        renderAddition: () => null,
        renderRemove: () => null,
        renderMoveDown: () => null,
        renderMoveUp: () => null,
        operations: false,
      },
      items: {
        type: 'object',
        properties: {
          id: {
            title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
            editable: false,
            type: 'string',
            'x-props': {
              width: 65,
            },
          },
          name: {
            title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateProject' })}`,
            type: 'string',
            'x-component-props': {},
            editable: false,
            'x-props': {
              width: 160,
            },
          },
          content: {
            title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateContent' })}`,
            type: 'textarea',
            editable: false,
            'x-props': {
              width: 424,
            },
            'x-component-props': {
              row: 1,
              style: {
                height: 32,
              },
            },
          },
          userName: {
            title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluater' })}`,
            type: 'string',
            editable: false,
            'x-props': {
              width: 128,
            },
            // "x-component": "FormilySelectMember",
            // "x-component-props": {
            //   children: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.chooseEvaluater'})}`
            // }
          },
          templates: {
            title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTemplate' })}`,
            type: 'object',
            'x-component': 'FormilyUploadFiles',
            'x-component-props': {
              mode: 'link',
              buttonText: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.upload' })}`,
              fileContainerClassName: 'customizeFileContainer',
            },
            editable: false,
            'x-props': {
              width: 180,
            },
          },
          reports: {
            title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateReport' })}`,
            type: 'object',
            'x-component': 'FormilyUploadFiles',
            'x-component-props': {
              mode: 'link',
              buttonText: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.upload' })}`,
              fileContainerClassName: 'customizeFileContainer',
            },
            'x-props': {
              width: 180,
            },
          },
          scoring: {
            title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateScore' })}`,
            type: 'string',
            'x-props': {
              width: 95,
            },
            'x-rules': [
              {
                required: true,
                message: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.plzFillEvaluateScore' })}`,
              },
              {
                pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
                message: `${intl.formatMessage({
                  id: 'member.memberEvaluate.allQuery.schema.plzFillNumberCanTwoDecimal',
                })}`,
              },
            ],
            'x-component-props': {},
          },
        },
      },
    },
  },
}

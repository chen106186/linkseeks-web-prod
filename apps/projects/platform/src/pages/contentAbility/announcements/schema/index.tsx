import { ISchema } from '@apps/formily'
import { TimeList } from '../../statusList'
import { getIntl } from '@linkseeks/i18n'
import { ANNOUNCE_COLUMN_TYPE, transfer2Options } from '../../utils/utils'
import { FORM_FILTER_PATH } from '@/formSchema/const'

// const ALL = [{ label: getIntl().formatMessage({ id: 'common.text.all' }), value: 0 }]
// const COLUMNS_OPTIONS = ALL.concat(transfer2Options(ANNOUNCE_COLUMN_TYPE))

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
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            title: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'content.info.title' }),
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
            columnType: {
              type: 'string',
              enum: transfer2Options(ANNOUNCE_COLUMN_TYPE),
              'x-component-props': {
                placeholder: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}${getIntl().formatMessage({
                  id: 'content.info.column',
                })}`,
                style: { width: '174px' },
              },
            },
            status: {
              type: 'string',
              enum: [
                { label: getIntl().formatMessage({ id: 'common.text.all' }), value: '0' },
                { label: getIntl().formatMessage({ id: 'content.common.waitUp' }), value: '1' },
                { label: getIntl().formatMessage({ id: 'content.common.hadUp' }), value: '2' },
                { label: getIntl().formatMessage({ id: 'content.common.hadDown' }), value: '3' },
              ],
              'x-component-props': {
                placeholder: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}${getIntl().formatMessage({
                  id: 'common.table.status',
                })}`,
                style: { width: '174px' },
              },
            },
            // time: {
            //   type: 'string',
            //   enum: TimeList,
            //   'x-component-props': {
            //     placeholder: getIntl().formatMessage({id: 'content.info.time'}),
            //     style: { width: '174px' },
            //   },
            // },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'common.button.submit' }),
              },
            },
          },
        },
      },
    },
  },
}

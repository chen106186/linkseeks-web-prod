import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
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
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'renderAddBtn',
        },
        eightDRectificationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索',
            tip: '请输入8D编号进行搜索',
          },
        },
      },
    },

    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'Flex-Layout',
      'x-component-props': {
        grid: true,
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        summary: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'eightD.zhaiyao',
              defaultMessage: '摘要',
            }),
            allowClear: true,
            style: {
              width: 160,
            },
          },
        },
        '[startTime,endTime]': {
          type: 'daterange',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({
                id: 'eightD.danjushijiankaishi',
                defaultMessage: '单据时间开始',
              }),
              intl.formatMessage({
                id: 'eightD.danjushijianjieshu',
                defaultMessage: '单据时间结束',
              }),
            ],
            allowClear: true,
            style: {
              width: 240,
            },
          },
        },
        supplyMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'eightD.gongyinghuiyuan',
              defaultMessage: '供应会员',
            }),
            allowClear: true,
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
        },
      },
    },
  },
}

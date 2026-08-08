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
        // 8D编码
        eightDRectificationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            align: 'flex-left',
            placeholder: intl.formatMessage({
              id: 'eightD.sousuo',
              defaultMessage: '搜索',
            }),
            tip: intl.formatMessage({
              id: 'eightD.qingshuru8Dbianhaojinhang',
              defaultMessage: '请输入8D编号进行搜索',
            }),
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 5,
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
          },
        },
        outerStatus: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'eightD.waibuzhuangtaiquanbu',
              defaultMessage: '外部状态(全部)',
            }),
            allowClear: true,
          },
        },
        internalStatus: {
          enum: [],
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'eightD.neibuzhuangtaiquanbu',
              defaultMessage: '内部状态(全部)',
            }),
            allowClear: true,
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

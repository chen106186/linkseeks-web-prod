// import { FORM_FILTER_PATH } from '@/formSchema/const';
// import { ISchema } from '@apps/formily';
// import { getIntl } from '@linkseeks/i18n';
// const intl = getIntl();
// export const wangBuyScema: ISchema = {
//   type: 'object',
//   properties: {
//     MEGA_LAYOUT: {
//       type: 'object',
//       'x-component': 'mega-layout',
//       'x-component-props': {
//         grid: true,
//       },
//       properties: {
//         // 8D编码
//         eightDRectificationNo: {
//           type: 'string',
//           'x-component': 'Search',
//           'x-component-props': {
//             align: 'flex-left',
//             placeholder: '需求单号',
//             tip: intl.formatMessage({
//               id: 'eightD.qingshuru8Dbianhaojinhang',
//               defaultMessage: '请输入8D编号进行搜索',
//             }),
//           },
//         },
//       },
//     },
//     [FORM_FILTER_PATH]: {
//       type: 'object',
//       'x-component': 'mega-layout',
//       'x-component-props': {
//         grid: true,
//         full: true,
//         autoRow: true,
//         columns: 5,
//       },
//       properties: {
//         summary: {
//           type: 'string',
//           'x-component-props': {
//             placeholder: intl.formatMessage({
//               id: 'eightD.zhaiyao',
//               defaultMessage: '摘要',
//             }),
//             allowClear: true,
//           },
//         },
//         '[startTime,endTime]': {
//           type: 'daterange',
//           'x-component-props': {
//             placeholder: [
//               intl.formatMessage({
//                 id: 'eightD.danjushijiankaishi',
//                 defaultMessage: '单据时间开始',
//               }),
//               intl.formatMessage({
//                 id: 'eightD.danjushijianjieshu',
//                 defaultMessage: '单据时间结束',
//               }),
//             ],
//             allowClear: true,
//           },
//         },
//         // supplyMemberName: {
//         //   type: 'string',
//         //   'x-component-props': {
//         //     placeholder: intl.formatMessage({
//         //       id: 'eightD.gongyinghuiyuan',
//         //       defaultMessage: '供应会员',
//         //     }),
//         //     allowClear: true,
//         //   },
//         // },
//         outerStatus: {
//           type: 'string',
//           enum: [],
//           'x-component-props': {
//             placeholder: intl.formatMessage({
//               id: 'eightD.waibuzhuangtaiquanbu',
//               defaultMessage: '外部状态(全部)',
//             }),
//             allowClear: true,
//           },
//         },
//         // internalStatus: {
//         //   enum: [],
//         //   type: 'string',
//         //   'x-component-props': {
//         //     placeholder: intl.formatMessage({
//         //       id: 'eightD.neibuzhuangtaiquanbu',
//         //       defaultMessage: '内部状态(全部)',
//         //     }),
//         //     allowClear: true,
//         //   },
//         // },
//         submit: {
//           'x-component': 'Submit',
//           'x-mega-props': {
//             span: 1,
//           },
//         },
//       },
//     },
//   },
// };
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
import { STATUS } from '../../constats'
const intl = getIntl()
export const wangBuyScema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'controllerBtns',
        },
        askPurchaseNo: {
          //报价单号
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: '需求摘要',
          },
        },
        // billTime: {
        //   type: 'string',
        //   'x-component-props': {
        //     placeholder: '单据时间',
        //   },
        // },
        '[billStartTime,billEndTime]': {
          type: 'string',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'dealAbility.kaishishijian' }),
              intl.formatMessage({ id: 'dealAbility.jieshushijian' }),
            ],
          },
        },
        status: {
          enum: [
            {
              label: intl.formatMessage({ id: 'transaction_components.suoyouzhuangtai' }),
              value: STATUS.allStatus,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.daifabu' }),
              value: STATUS.toBeReleased,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.daibaojia' }),
              value: STATUS.ToBeQuoted,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.yijieshu' }),
              value: STATUS.toBeClosed,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.yizhongzhi' }),
              value: STATUS.toBeTerminated,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.yizuofei' }),
              value: STATUS.toBeVoided,
            },
          ],
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'transaction_components.zhuangtai' }),
            allowClear: true,
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'dealAbility.chaxun' }),
          },
        },
      },
    },
  },
}

/** 内部状态颜色 */
export const EXTERNALSTATE_COLOR = {
  1: 'default',
  2: 'default',
  3: 'default',
  4: 'success',
  5: 'error',
}

/** 外部状态颜色 */
export const INTERNALSTATE_COLOR = {
  1: 'default',
  2: 'default',
  3: 'default',
  4: 'default',
  5: 'success',
  6: 'error',
  7: 'error',
}

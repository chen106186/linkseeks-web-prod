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
import { STATUS, INNER_STATUS } from '../../../wangBuy/constats'
const intl = getIntl()
export const wangBuyScema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        askPurchaseNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xuqiudanhao' }),
            align: 'flex-left',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
          marginRight: 20,
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xuqiudanzhaiyao' }),
          },
        },
        purchaseMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.caigoushangmingzi' }),
          },
        },
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
        outerStatus: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
            style: {
              width: 160,
            },
          },
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
        },
        innerStatus: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
            style: {
              width: 160,
            },
          },
          enum: [
            {
              label: intl.formatMessage({ id: 'transaction_components.suoyouzhuangtai' }),
              value: INNER_STATUS.allStatus,
            },
            {
              label: intl.formatMessage({
                id: 'transaction_components.zhuangtaidaitijiaoshenhe',
              }),
              value: INNER_STATUS.waitAduit,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.daishenheyiji' }),
              value: INNER_STATUS.waitAduitFirst,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.daishenheerji' }),
              value: INNER_STATUS.waitAduitSecond,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.daitijiaobaojiadan' }),
              value: INNER_STATUS.waitSubmit,
            },
            {
              label: intl.formatMessage({ id: 'transaction_components.yitijiao' }),
              value: INNER_STATUS.submited,
            },
            {
              label: intl.formatMessage({
                id: 'transaction_components.zhuangtaishenhebutongguoyiji',
              }),
              value: INNER_STATUS.unPassFirst,
            },
            {
              label: intl.formatMessage({
                id: 'transaction_components.zhuangtaishenhebutongguoerji',
              }),
              value: INNER_STATUS.unPassSecond,
            },
          ],
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

export const wangBuyScemaBuy: ISchema = {
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
        quoteNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }),
            align: 'flex-end',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-end',
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
          marginLeft: 20,
        },
      },
      properties: {
        askPurchaseNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xuqiudanhao' }),
          },
        },
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xuqiudanzhaiyao' }),
          },
        },
        purchaseMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xuqiudanhao' }),
          },
        },
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
        // outerStatus: {
        //   type: 'string',
        //   'x-component-props': {
        //     placeholder: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
        //     style: {
        //       width: 160,
        //     },
        //   },
        //   enum: [
        //     { label: '所有状态', value: '' },
        //     { label: '待发布', value: 1 },
        //     { label: '待报价', value: 2 },
        //     { label: '已结束', value: 3 },
        //     { label: '已终止', value: 4 },
        //     { label: '已作废', value: 5 },
        //   ],
        // },
        // innerStatus: {
        //   type: 'string',
        //   'x-component-props': {
        //     placeholder: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
        //     style: {
        //       width: 160,
        //     },
        //   },
        //   enum: [
        //     { label: '所有状态', value: '' },
        //     { label: '待提交审核', value: 1 },
        //     { label: '待审核(一级)', value: 2 },
        //     { label: '待审核(二级)', value: 3 },
        //     { label: '待提交报价单)', value: 4 },
        //     { label: '已提交', value: 5 },
        //     { label: '审核不通过(一级)', value: 6 },
        //     { label: '审核不通过(二级', value: 7 },
        //   ],
        // },
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

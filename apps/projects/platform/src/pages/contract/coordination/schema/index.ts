import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { OrderTypeMap, PurchaseOrderInsideWorkStateTexts, PurchaseOrderOutWorkStateTexts } from '@/constants'
import { getIntl } from '@linkseeks/i18n'

/**
 * 请款
 */
const intl = getIntl()
export const CoordinationSchema: ISchema = {
  type: 'object',
  properties: {
    contractNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
        align: 'start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
          },
        },
        '[startTime,endTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'contract.kaishishijian' }),
              intl.formatMessage({ id: 'contract.jieshushijian' }),
            ],
          },
        },
        outerStatus: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingxuanzewaibuzhuangtai' }),
          },
          // 0.所有状态,1.待提交乙方签订合同,2.待乙方签订合同,3.乙方不同意签订合同,4.待甲方签订合同,5.甲方不同意签订合同,6.已完成签约,7.已作废,8.已停用,9.合同已到期
          enum: [],
        },
        innerStatus: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingxuanzeneibuzhuangtai' }),
          },
          enum: [],
        },
        partyAName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongjiafang' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'contract.chaxun' }),
          },
        },
      },
    },
  },
}
/* 合同协同 */
export const Schema: ISchema = {
  type: 'object',
  properties: {
    contractNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
        align: 'start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
          },
        },

        '[startTime,endTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'contract.kaishishijian' }),
              intl.formatMessage({ id: 'contract.jieshushijian' }),
            ],
          },
        },
        partyAName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongjiafang' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'contract.chaxun' }),
          },
        },
      },
    },
  },
}
/* 合同执行 */
export const SchemaList: ISchema = {
  type: 'object',
  properties: {
    contractNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
        align: 'start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
          },
        },
        '[startTime,endTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'contract.kaishishijian' }),
              intl.formatMessage({ id: 'contract.jieshushijian' }),
            ],
          },
        },
        outerStatus: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingxuanzewaibuzhuangtai' }),
          },
          // 0.所有状态,1.待提交乙方签订合同,2.待乙方签订合同,3.乙方不同意签订合同,4.待甲方签订合同,5.甲方不同意签订合同,6.已完成签约,7.已作废,8.已停用,9.合同已到期
          enum: [],
        },
        partyAName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongjiafang' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'contract.chaxun' }),
          },
        },
      },
    },
  },
}

/** 选择报价商品 */
export const OfferProductSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.huopinmingcheng' }),
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'contract.huohao' }),
              },
            },
            customerCategory: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'contract.pinlei' }),
              },
            },
            brand: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'contract.pinpai' }),
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'contract.guigexinghao' }),
              },
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'contract.chaxun' }),
          },
        },
      },
    },
  },
}

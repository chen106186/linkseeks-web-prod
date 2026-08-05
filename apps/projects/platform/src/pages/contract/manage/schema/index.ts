import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
/**
 * 除了订单必填字段, 默认
 */

const intl = getIntl()

export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    orderNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshurusousuoneirong' }),
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
        contractNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
          },
        },
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
          },
        },
        type: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingxuanzedingdanleixing' }),
          },
          enum: [],
        },
        externalState: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingxuanzewaibuzhuangtai' }),
          },
          enum: [],
        },
        interiorState: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingxuanzeneibuzhuangtai' }),
          },
          enum: [],
        },
        '[startCreateTime,endCreateTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'contract.kaishishijian' }),
              intl.formatMessage({ id: 'contract.jieshushijian' }),
            ],
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

/**
 * 招标列表
 */
export const BidListSchema: any = {
  type: 'object',
  properties: {
    inviteBidNO: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshuruzhaobiaodanhao' }),
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
        inviteBidAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruxiangmu' }),
          },
        },
        bidNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshurutoubiaodanhao' }),
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
        bidWinnerName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruzhongbiaohuiyuan' }),
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

/**
 * 竞价列表
 */
export const ViePriceListSchema: any = {
  type: 'object',
  properties: {
    viePriceNO: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshurusousuojingjiadan' }),
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
        viePriceAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshurujingjiazhaiyao' }),
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
            // disabledDate: current => {
            //   return current && current < moment().startOf('day')
            // }
          },
        },
        awardName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshurushoubiaohuiyuanming' }),
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
/**
 * 采购
 */
export const purchaseSchema: any = {
  type: 'object',
  properties: {
    demandNO: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshurusousuoxuqiudan' }),
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
        demandAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruxuqiuzhaiyao' }),
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
            format: 'YYYY-MM-DD HH:mm:ss',
          },
        },
        awardName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshurushoubiaohuiyuanming' }),
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
/* 用户会员 */
export const userchema: any = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'supplier.query.name.tip' }),
        align: 'start',
      },
    },
  },
}
/**
 * 合同管理合同查询
 */
export const QueryListSchema: ISchema = {
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
        partyBName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongyifang' }),
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

/**
 * 新曾合同
 * */
export const addListSchema: ISchema = {
  type: 'object',
  properties: {
    contractNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        rowStyle: {
          flexWrap: 'nowrap',
        },
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
          },
        },
        partyBName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongyifang' }),
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

/**
 * 待审核合同查询
 * */

/**
 * 除了订单必填字段, 默认
 */
export const examineSchema: ISchema = {
  type: 'object',
  properties: {
    contractNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
          },
        },
        partyBName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'contract.qingshuruhetongyifang' }),
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

//待创建请购单合同
export const PurchaseContractListSchema: any = {
  type: 'object',
  properties: {
    requisitionNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder:
          intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.number' }),
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginLeft: 20,
        },
        rowStyle: {
          flexWrap: 'nowrap',
        },
      },
      properties: {
        digest: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.digest' }),
          },
        },
        vendorMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.member' }),
          },
        },
        '[startDate,endDate]': {
          type: 'daterange',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'contract.qingshuru' }),
              intl.formatMessage({ id: 'contract.jieshushijian' }),
            ],
          },
        },
        department: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) +
              intl.formatMessage({ id: 'contract.purchase.department' }),
          },
        },
        requisitioner: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.people' }),
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

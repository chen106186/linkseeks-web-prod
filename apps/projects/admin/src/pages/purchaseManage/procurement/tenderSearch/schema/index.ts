import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { BidOutStateTexts } from '@/constants'

/**
 * 招标查询列表高级筛选
 */
export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    inviteTenderCode: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: '请输入招标编号',
        align: 'flex-start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        rowStyle: {
          justifyContent: 'start',
        },
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        projectName: {
          type: 'string',
          'x-component-props': {
            placeholder: '请输入投标项目',
          },
        },
        submitTenderCode: {
          type: 'string',
          'x-component-props': {
            placeholder: '请输入投标编号',
          },
        },
        openTenderTime: {
          type: 'string',
          'x-component': 'data',
          'x-component-props': {
            placeholder: '开标开始时间',
            showTime: true,
          },
        },
        inviteTenderMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '请输入投标会员',
          },
        },
        tenderOutStatusList: {
          type: 'string',
          'x-component-props': {
            placeholder: '请选择外部状态',
          },
          enum: Object.keys(BidOutStateTexts).map((item) => ({
            label: BidOutStateTexts[item],
            value: item,
          })),
        },
        // "interiorState": {
        //   type: 'string',
        //   "x-component-props": {
        //     placeholder: '请选择内部状态'
        //   },
        //   enum: Object.keys(PurchaseOrderInsideWorkStateTexts).map(item => ({
        //     label: PurchaseOrderInsideWorkStateTexts[item],
        //     value: item,
        //   }))
        // },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: '查询',
          },
        },
      },
    },
  },
}

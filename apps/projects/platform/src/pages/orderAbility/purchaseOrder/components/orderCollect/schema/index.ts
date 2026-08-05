import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { GlobalConfig } from '@/global/config'
import moment from 'moment'

// 将获取的商城转化为可用类型
const getShopTypeMap = (() => {
  return GlobalConfig.web.shopInfo.map((item) => ({
    label: item.name,
    value: item.id,
    type: item.type,
    environment: item.environment,
  }))
})()

/**
 * 除了订单必填字段, 默认
 */
export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    orderNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: '请输入订单编号',
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
        orderThe: {
          type: 'string',
          'x-component-props': {
            placeholder: '请输入订单摘要',
          },
        },
        supplyMembersName: {
          type: 'string',
          'x-component-props': {
            placeholder: '请输入供应会员名称',
          },
        },
        '[startCreateTime,endCreateTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: ['开始时间', '结束时间'],
          },
        },
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

// 基本信息
const basicInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '基本信息',
    className: 'useConnectBtnWrapper',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'left',
        wrapperCol: 10,
      },
      properties: {
        orderModel: {
          type: 'string',
          required: true,
          enum: [],
          // enum: GlobalConfig.web.orderMode.map((v) => {
          //   delete v.platformType
          //   return v
          // }),
          title: '下单模式',
          'x-linkages': [
            // 联动显示单据字段
            {
              type: 'value:visible',
              target: 'quotationNo',
              condition: `{{orderCombination.showQuotationNoOrder.includes($value)}}`,
            },
            // 联动显示单据按钮
            {
              type: 'value:schema',
              target: 'quotationNo',
              condition: `{{!!$value && orderCombination.showQuotationNoOrderBtn.includes($value) || orderCombination.showPurchaseContract.includes($value)}}`,
              schema: {
                'x-component-props': {
                  disabled: true,
                  addonAfter:
                    '{{orderCombination.showQuotationNoOrderBtn.includes($value) ? orderNoPrice : orderContract}}',
                },
              },
              otherwise: {
                visible: true,
                'x-component-props': {
                  disabled: true,
                  addonAfter: '',
                },
              },
            },
            // 联动显示供应会员按钮
            {
              type: 'value:schema',
              target: 'supplyMembersName',
              condition: `{{$self.editable && $value && orderCombination.showSupplyMembersNameBtn.includes($value)}}`,
              schema: {
                'x-component-props': {
                  disabled: true,
                  addonAfter: '{{orderMember}}',
                },
              },
              otherwise: {
                visible: true,
                'x-component-props': {
                  disabled: true,
                  addonAfter: '',
                },
              },
            },
          ],
        },
        shopId: {
          type: 'string',
          enum: getShopTypeMap,
          title: '适应商城',
          required: true,
          visible: false,
        },
        orderThe: {
          type: 'string',
          title: '订单摘要',
          'x-rules': [
            {
              required: true,
              message: '请输入订单摘要',
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        quotationNo: {
          type: 'string',
          title: '对应报价单号',
          visible: false,
          'x-component-props': {
            disabled: true,
          },
          'x-linkages': [
            {
              type: 'value:schema',
              target: 'supplyMembersName',
              condition: `{{$self.editable && handleQuotation($value)}}`,
              schema: {
                'x-component-props': {
                  disabled: true,
                  addonAfter: '',
                },
              },
            },
          ],
        },
        supplyMembersName: {
          type: 'string',
          title: '供应会员',
          'x-component-props': {
            disabled: true,
          },
          required: true,
        },
        supplyMembersId: {
          type: 'string',
          display: false,
        },
        supplyMembersRoleId: {
          type: 'string',
          display: false,
        },
        idList: {
          type: 'array',
          display: false,
        },
        productType: {
          type: 'number',
          display: false,
        },

        orderNo: {
          type: 'string',
          title: '订单编号',
          'x-component': 'text',
          visible: false,
        },
        type: {
          type: 'string',
          title: '订单类型',
          'x-component': 'text',
        },
        createTime: {
          type: 'string',
          title: '下单时间',
          visible: false,
        },
        interiorState: {
          type: 'string',
          title: '内部状态',
          visible: false,
        },
        externalState: {
          type: 'string',
          title: '外部状态',
          visible: false,
        },
        contractId: {
          type: 'number',
          title: '采购合同ID',
          visible: false,
        },
        contractNo: {
          type: 'string',
          title: '合同下单的合同编号',
          visible: false,
        },
        sourceType: {
          type: 'number',
          title: '合同下单的寻源类型',
          visible: false,
        },
        purchaseType: {
          type: 'number',
          title: '合同下单的是否有限制下单金额',
          visible: false,
        },
      },
    },
  },
}
// 订单商品
export const orderProduct: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '订单商品',
  },
  properties: {
    orderProductRequests: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        rowKey: 'id',
        columns: '{{productColumns}}',
        components: '{{productComponents}}',
      },
    },
    // 仅合并下单时备用参数数据
    ordeProducts: {
      type: 'array',
      title: '合并下单记录',
      visible: false,
    },
    NO_SUBMIT_SPY: {
      type: 'object',
      'x-component': 'moneyTotalBox',
    },
  },
}

// 合同下单 订单物料
export const orderMaterial: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '订单物料',
  },
  properties: {
    orderProductRequests: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        rowKey: 'id',
        columns: '{{materialColumns}}',
        components: '{{materialComponents}}',
      },
    },
    // 仅合同下单时备用参数数据
    ordeProducts: {
      type: 'array',
      title: '合同下单记录',
      visible: false,
    },
    NO_SUBMIT_SPY: {
      type: 'object',
      'x-component': 'moneyTotalBox',
    },
  },
}

// 支付信息
export const payInfo: ISchema = {
  'x-index': 3,
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '支付信息',
  },
  properties: {
    paymentInformationResponses: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        rowKey: 'payCount',
        columns: '{{paymentColumns}}',
        components: '{{paymentComponents}}',
      },
      // default: [
      //   {
      //     payCount: 1,
      //     id: 1,
      //     payRatio: 123
      //   }
      // ]
    },
  },
}

// 送货信息
const submitInfo: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '送货信息',
  },
  properties: {
    NO_SUBMIT_LAYOUT_2: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        labelAlign: 'left',
        grid: true,
        columns: 2,
        full: true,
      },
      properties: {
        FLEX_LAYOUT_LEFT: {
          type: 'object',
          'x-component': 'mega-layout',
          properties: {
            deliveryTime: {
              type: 'string',
              'x-component': 'date',
              title: '送货日期',
              required: true,
              'x-component-props': {
                disabledDate: (current) => {
                  return current && current < moment().startOf('day')
                },
              },
            },
          },
        },
        deliveryAddresId: {
          type: 'string',
          'x-component': 'SelectAddress',
          'x-mega-props': {
            style: {
              full: true,
            },
          },
          'x-component-props': {
            dataSource: [],
            times: 0,
          },
          'x-rules': [
            {
              required: true,
              message: '请选择收货方式',
            },
          ],
          title: '送货地址',
        },
      },
    },
  },
}

// 其他信息
const ortherInfo: ISchema = {
  'x-index': 4,
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '其他信息',
  },
  properties: {
    NO_SUBMIT_LAYOUT_ORTHER: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 10,
      },
      properties: {
        needTheInvoice: {
          type: 'number',
          'x-component': 'CheckboxSingle',
          'x-component-props': {
            children: '需要发票',
            style: {
              marginTop: 4,
            },
          },
          title: '发票',
          default: 0,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'theInvoiceId',
              condition: '{{!!$value}}',
            },
          ],
        },
        theInvoiceId: {
          type: 'number',
          title: ' ',
          'x-component': 'theInvoiceList',
          'x-component-props': {
            times: 0,
          },
        },
        pageRequire: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            rows: 4,
          },
          title: '包装要求',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        restsRequire: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            rows: 4,
          },
          title: '其他要求',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        // // 仅购物车下单传入接口使用
        // shopId: {
        //   type: 'number',
        //   title: '店铺ID',
        //   visible: false
        // },
        // 仅简单流程使用合同情况下使用
        processEnum: {
          type: 'number',
          title: '工作流枚举',
          visible: false,
        },
        // 合同签署记录id
        signatureLogId: {
          type: 'number',
          title: '合同签署记录id',
          visible: false,
        },
        electronicContractUrl: {
          type: 'string',
          title: '合同URL',
          visible: false,
        },
        electronicContractName: {
          type: 'string',
          title: '合同Name',
          visible: false,
        },
        usingElectronicContracts: {
          type: 'number',
          title: '使用电子合同',
          'x-component-props': {
            contract: {},
          },
          visible: false,
        },
        electronicContractId: {
          type: 'number',
          title: '电子合同ID',
          visible: false,
        },
      },
    },
  },
}

// 审核单据
const auditRecord: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '审核单据',
  },
  properties: {
    NO_SUBMIT_LAYOUT_3: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 10,
      },
      properties: {
        state: {
          title: '是否审核通过',
          type: 'radio',
          required: true,
          enum: [
            {
              label: '审核通过',
              value: 1,
            },
            {
              label: '审核不通过',
              value: 0,
            },
          ],
          editable: true,
          default: 1,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'cause',
              condition: '{{$value === 0}}',
            },
          ],
        },
        cause: {
          type: 'textarea',
          title: '审核不通过原因',
          required: true,
          'x-component-props': {
            rows: 3,
          },
          editable: true,
        },
      },
    },
  },
}

// 电子合同
const electronicResult: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '电子合同',
  },
  properties: {
    NO_SUBMIT_LAYOUT_3: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 10,
      },
      properties: {
        electronic: {
          title: '电子合同',
          type: 'checkbox',
          required: true,
          enum: [
            {
              label: 'pdf',
              value: true,
            },
          ],
          editable: true,
          default: false,
        },
      },
    },
  },
}
// 流转记录
const transformRecord: ISchema = {
  type: 'object',
  'x-component': 'tabpane',
  'x-component-props': {
    tab: '流转记录',
  },
  properties: {
    RECORD: {
      type: 'object',
      'x-component': 'VirtualChildren',
      'x-component-props': {
        children: '{{CirculationRecord}}',
      },
    },
  },
}
// 新增订单详情
export const orderDetailSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      properties: {
        basicInfo,
        submitInfo,
        orderProduct,
        payInfo,
        ortherInfo,
        transformRecord,
      },
    },
  },
}

// 一级审核详情
export const auditOneSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      properties: {
        basicInfo,
        submitInfo,
        orderProduct,
        payInfo,
        ortherInfo,
        auditRecord,
        transformRecord,
      },
    },
  },
}

// 新增时使用的schema
export const orderAddSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      properties: {
        basicInfo,
        submitInfo,
        orderProduct,
        payInfo,
        ortherInfo,
      },
    },
  },
}

// 确认电子合同
export const orderElectronicSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      properties: {
        basicInfo,
        submitInfo,
        orderProduct,
        payInfo,
        ortherInfo,
        electronicResult,
        transformRecord,
      },
    },
  },
}

// 根据传入的query参数 判断当前使用哪个schema
export const mergeAllSchemas = {
  // 新增订单详情
  '-1': orderDetailSchema,
  0: orderAddSchema,
  // 一级审核详情
  1: auditOneSchema,
  // 二级审核详情
  2: auditOneSchema,
  // 待提交订单详情
  3: orderDetailSchema,
  // 电子合同详情
  4: orderElectronicSchema,
  // 订单支付
  5: orderDetailSchema,
}

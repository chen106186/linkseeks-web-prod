import { ISchema } from '@apps/formily'
import React from 'react'
import { Button } from 'antd'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
/**
 * 新建生产通知单schema
 */
const createSchema: ISchema = {
  type: 'object',
  properties: {
    basicInfo: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'handling.assign.add.basicInfo' }),
        id: 'basicInfo',
        style: {
          marginBottom: 16,
        },
      },
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            columns: 2,
            full: true,
            autoRow: true,
            labelCol: 4,
            labelAlign: 'left',
            wrapperCol: 18,
          },
          properties: {
            summary: {
              title: intl.formatMessage({ id: 'handling.assign.add.noticeDesc' }),
              type: 'string',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.notice.requiredMsg' }),
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 60,
                },
              ],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.zuichang60gezifu30ge' }),
              },
            },
            deliveryType: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.assign.add.delivery' }),
              enum: [
                { label: intl.formatMessage({ id: 'handling.assign.add.delivery.logistics' }), value: 1 },
                { label: intl.formatMessage({ id: 'handling.assign.add.delivery.self' }), value: 2 },
              ],
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.delivery.requiredMsg' }),
                },
              ],
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: '*(receivefullAddress, receiveAddressID, receiveAddress,receiveUserName,receiveUserTel)',
                  condition: '{{$value === 1}}',
                },
              ],
            },
            processName: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.processName' }),
              'x-component-props': {
                disabled: true,
                addonAfter: '{{connetEnterprise}}',
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.processName.requiredMsg' }),
                },
              ],
            },
            processMemberId: {
              //加工企业会员ID
              type: 'string',
              display: false,
            },
            processRoleId: {
              //加工企业会员角色ID
              type: 'string',
              display: false,
            },
            receivefullAddress: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.assign.add.receiveAddress' }),
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.receiveAddress.requiredMsg' }),
                },
              ],
              // 'x-component-props': {}
              enum: [],
            },
            receiverAddressId: {
              type: 'string',
              display: false,
            },
            receiveAddress: {
              type: 'string',
              // title: 'address'
              display: false,
            },
            receiveUserName: {
              type: 'string',
              display: false,
            },
            receiveUserTel: {
              type: 'string',
              display: false,
            },
            source: {
              title: intl.formatMessage({ id: 'handling.assign.add.notice.source' }),
              required: true,
              'x-component': 'RadioGroup',
              'x-mega-props': {
                wrapperCol: 24,
              },
              'x-component-props': {
                optionType: 'button',
                // "layoutProps": {
                // }
              },
              enum: [
                {
                  label: intl.formatMessage({ id: 'handling.assign.add.notice.source.order' }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({ id: 'handling.assign.add.notice.source.product' }),
                  value: 2,
                },
              ],
              'x-linkages': [
                {
                  type: 'value:state',
                  target: '*(orderList)',
                  condition: '{{ $self.value === 1 }}',
                  state: {
                    display: true,
                  },
                  otherwise: {
                    //条件不满足时控制bbb字段的编辑状态
                    display: false,
                  },
                },
                {
                  type: 'value:state',
                  target: '*(productList)',
                  condition: '{{ $self.value === 2 }}',
                  state: {
                    display: true,
                  },
                  otherwise: {
                    //条件不满足时控制bbb字段的编辑状态
                    display: false,
                  },
                },
                // {
                //   "type": "value:state",
                //   "target": "source1",
                //   "condition": "{{ $self.value }}",
                //   state: {
                //     value: "{{$self.value}}",
                //   },
                // }
              ],
            },
            deliveryDate: {
              type: 'date',
              title: intl.formatMessage({ id: 'handling.assign.add.notice.deliveryDate' }),
              'x-component-props': {
                disabledDate: (currentDate) => currentDate && currentDate < moment().endOf('day'),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.notice.deliveryDate.requiredMsg' }),
                },
              ],
            },
          },
        },
      },
    },
    detail: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'handling.assign.add.basicInfo' }),
        id: 'detail',
        style: {
          marginBottom: 16,
        },
      },
      properties: {
        layout1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            full: true,
            labelCol: 4,
            labelAlign: 'left',
            wrapperCol: 20,
          },
          properties: {
            source1: {
              title: intl.formatMessage({ id: 'handling.assign.add.notice.source' }),
              'x-component': 'RadioGroup',
              'x-component-props': {
                optionType: 'button',
                // disabled: true,
              },
              enum: [
                {
                  label: intl.formatMessage({ id: 'handling.assign.add.notice.source.order' }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({ id: 'handling.assign.add.notice.source.product' }),
                  value: 2,
                },
              ],
              // editable: false,
            },
            productModal: {
              type: 'object',
              'x-mega-props': {
                wrapperCol: 24,
              },
              'x-component': 'renderAddProduct',
            },
            productList: {
              type: 'array',
              'x-mega-props': {
                wrapperCol: 24,
              },
              'x-component': 'arraytable',
              'x-component-props': {
                renderAddition: () => null,
                renderRemove: () => null,
                renderExtraOperations: '{{renderProductListTableRemove}}',
                renderMoveDown: () => null,
                renderMoveUp: () => null,
                operations: {
                  title: intl.formatMessage({ id: 'common.table.action' }),
                },
                // columns: "{{tableColumns}}",
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.select.process.product' }),
                },
              ],
              items: {
                type: 'object',
                properties: {
                  commodityId: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.id' }),
                    type: 'string',
                    editable: false,
                    'x-props': {
                      width: 65,
                    },
                  },
                  // mainPic: {
                  //   title: intl.formatMessage({id: 'handling.assign.add.product.img'}),
                  //   type: "string",
                  //   "x-component": 'ReadOnly',
                  //   'x-component-props': {
                  //     isImage: true,
                  //   },
                  //   editable: false,
                  // },
                  name: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.img' }),
                    type: 'string',
                    editable: false,
                  },
                  category: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.category' }),
                    type: 'string',
                    editable: false,
                  },
                  brand: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
                    type: 'string',
                    editable: false,
                  },
                  unitName: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.unitName' }),
                    type: 'string',
                    editable: false,
                    'x-component': 'ReadOnly',
                  },
                  processNum: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.processNum' }),
                    type: 'string',
                    'x-component': 'ReadOnly',
                  },
                  isHasTaxAndTaxRate: {
                    title: `${intl.formatMessage({ id: 'handling.assign.add.hasTax' })}/${intl.formatMessage({
                      id: 'handling.assign.add.hasTax',
                    })}
                    ${intl.formatMessage({ id: 'handling.assign.add.taxRate' })}`,
                    type: 'string',
                    'x-component': 'ReadOnly',
                  },
                  processUnitPrice: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
                    type: 'string',
                    'x-component': 'ReadOnly',
                  },
                  processTotalPrice: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
                    type: 'string',
                    'x-component': 'ReadOnly',
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'handling.qingtianxiejiagongfei' }),
                      },
                    ],
                  },
                  // deliveryDate: {
                  //   title: "交期",
                  //   type: 'string',
                  //   "x-component": 'ReadOnly',
                  // }
                },
              },
            },
            orderList: {
              type: 'array',
              'x-mega-props': {
                wrapperCol: 24,
              },
              'x-component': 'arraytable',
              'x-component-props': {
                renderAddition: () => null,
                renderRemove: () => null,
                renderMoveDown: () => null,
                renderMoveUp: () => null,
                renderExtraOperations: '{{renderProductListTableRemove}}',
                operations: {
                  title: intl.formatMessage({ id: 'handling.caozuo' }),
                },
                // columns: "{{tableColumns}}",
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.qingxuanzeyaojiagongdeshang' }),
                },
              ],
              items: {
                type: 'object',
                properties: {
                  orderNo: {
                    title: intl.formatMessage({ id: 'handling.assign.add.orderNo' }),
                    type: 'string',
                    editable: false,
                    'x-props': {
                      width: 65,
                    },
                  },
                  commodityId: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.id' }),
                    type: 'string',
                    editable: false,
                    'x-props': {
                      width: 65,
                    },
                  },
                  // mainPic: {
                  //   title: intl.formatMessage({id: 'handling.assign.add.product.img'}),
                  //   type: "string",
                  //   editable: false,
                  //   "x-component": 'ReadOnly',
                  //   'x-component-props': {
                  //     isImage: true,
                  //   },
                  // },
                  name: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.name' }),
                    type: 'string',
                    editable: false,
                  },
                  category: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.category' }),
                    type: 'string',
                    editable: false,
                  },
                  brand: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
                    type: 'string',
                    editable: false,
                  },
                  purchaseCountAndUnit: {
                    title: `${intl.formatMessage({ id: 'handling.assign.add.orderNum' })}/${intl.formatMessage({
                      id: 'handling.assign.add.product.unitName',
                    })}`,
                    type: 'string',
                    editable: false,
                    'x-component': 'ReadOnly',
                  },
                  surplusAndProcessNum: {
                    title: `${intl.formatMessage({ id: 'handling.assign.add.product.surplus' })}/${intl.formatMessage({
                      id: 'handling.assign.add.product.processNum',
                    })}`,
                    type: 'string',
                    'x-component': 'ReadOnly',
                  },
                  isHasTaxAndTaxRate: {
                    title: `${intl.formatMessage({ id: 'handling.assign.add.hasTax' })}/${intl.formatMessage({
                      id: 'handling.assign.add.taxRate',
                    })}`,
                    type: 'string',
                    editable: false,
                    'x-component': 'ReadOnly',
                  },
                  processUnitPrice: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
                    type: 'string',
                    'x-component': 'ReadOnly',
                  },
                  processTotalPrice: {
                    title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
                    type: 'string',
                    editable: false,
                    'x-component': 'ReadOnly',
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'handling.qingtianxiejiagongfei' }),
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    other: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'handling.assign.add.otherInfo' }),
        id: 'basicInfo',
        style: {
          marginBottom: 16,
        },
      },
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            columns: 2,
            full: true,
            autoRow: true,
            labelCol: 4,
            labelAlign: 'left',
            wrapperCol: 18,
          },
          properties: {
            deliveryDesc: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.delivery.instructions' }),
              'x-component': 'textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.oneHundred.byte' }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
            payDesc: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.pay.instructions' }),
              'x-component': 'textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.oneHundred.byte' }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
            taxDesc: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.tax.instructions' }),
              'x-component': 'textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.oneHundred.byte' }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
            materialDesc: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.material.instructions' }),
              'x-component': 'textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.oneHundred.byte' }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
            packingDesc: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.packing.instructions' }),
              'x-component': 'textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.oneHundred.byte' }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
            otherDesc: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.other.instructions' }),
              'x-component': 'textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.oneHundred.byte' }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
          },
        },
      },
    },
    files: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'handling.assign.add.files' }),
        id: 'file',
        style: {
          marginBottom: 16,
        },
      },
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            columns: 2,
            full: true,
            autoRow: true,
            labelCol: 4,
            labelAlign: 'left',
            wrapperCol: 18,
          },
          properties: {
            enclosure: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.assign.add.files' }),
              'x-component': 'FormilyUploadFiles',
              'x-component-props': {
                children: '{{uploadChildren}}',
              },
            },
          },
        },
      },
    },
  },
}

export default createSchema

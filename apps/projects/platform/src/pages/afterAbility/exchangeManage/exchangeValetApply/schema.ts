/*
 * @Author: XieZhiXiong
 * @Date: 2021-12-02 14:15:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 17:37:22
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
import { GlobalConfig } from '@/global/config'
import { UPLOAD_TYPE } from '@/constants'
import { DELIVERY_TYPE_ENUM } from '@/constants/afterService'
import { ORDER_TYPE_TENDER_CONTRACT, ORDER_TYPE2_POINTS, ORDER_TYPE2_CHANNEL_POINTS } from '@/constants/order'
import { authService } from '@apps/services'
import { isMaterialOrder } from '../../utils'
import {
  getLogisticsSelectListShipperAddress,
  getLogisticsSelectListMemberReceiverAddress,
  getLogisticsSelectListMemberShipperAddress,
} from '@apps/apis'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const intl = getIntl()
const userInfo = authService.getAuth()
export const addSchema = (orderType: number): ISchema => {
  const isPoints = orderType === ORDER_TYPE2_POINTS || orderType === ORDER_TYPE2_CHANNEL_POINTS
  const isMateriel = isMaterialOrder(orderType)
  return {
    type: 'object',
    properties: {
      REPOSIT_TABS: {
        type: 'object',
        'x-component': 'tab',
        'x-component-props': {
          type: 'card',
        },
        properties: {
          'tab-1': {
            type: 'object',
            'x-component': 'tabpane',
            'x-component-props': {
              tab: intl.formatMessage({ id: 'afterService.apply.basicInfo', defaultMessage: '基本信息' }),
            },
            properties: {
              MEGA_LAYOUT1: {
                type: 'object',
                'x-component': 'Mega-Layout',
                'x-component-props': {
                  labelCol: 4,
                  wrapperCol: 12,
                  labelAlign: 'left',
                },
                properties: {
                  applyAbstract: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.applyAbstract', defaultMessage: '申请单摘要' }),
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'afterService.apply.applyAbstract.required',
                          defaultMessage: '请填写申请单摘要',
                        }),
                      },
                      {
                        limitByte: true, // 自定义校验规则
                        maxByte: 60,
                      },
                    ],
                  },
                  purchaser: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.purchaser', defaultMessage: '采购会员' }),
                    enum: [],
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'afterService.apply.purchaser.placeholder',
                        defaultMessage: '请输入采购会员名称',
                      }),
                      showSearch: true,
                      defaultActiveFirstOption: false,
                      showArrow: false,
                      filterOption: false,
                      onSearch: '{{handlePurchaserSearch}}',
                    },
                    required: true,
                  },
                  supplierMember: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.supplierMember', defaultMessage: '供应会员' }),
                    default: userInfo.memberName,
                    editable: false,
                  },
                  orderType: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.orderType', defaultMessage: '售后订单类型' }),
                    enum: [],
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'afterService.apply.orderType.placeholder',
                        defaultMessage: '请选择',
                      }),
                    },
                    required: true,
                    editable: false,
                  },
                  applyNo: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.applyNo', defaultMessage: '申请单号' }),
                    'x-component': 'Text',
                  },
                  applyTime: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.applyTime', defaultMessage: '单据时间' }),
                    'x-component': 'Text',
                  },
                  outerStatus: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.outerStatus', defaultMessage: '外部状态' }),
                    'x-component': 'Children',
                    'x-component-props': {
                      children: '{{OuterStatus}}',
                    },
                  },
                  innerStatus: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'afterService.apply.innerStatus', defaultMessage: '内部状态' }),
                    'x-component': 'Children',
                    'x-component-props': {
                      children: '{{InnerStatus}}',
                    },
                  },
                },
              },
            },
          },
          'tab-2': {
            type: 'object',
            'x-component': 'tabpane',
            'x-component-props': {
              tab: intl.formatMessage({ id: 'afterService.apply.product', defaultMessage: '单据明细' }),
            },
            properties: {
              MEGA_LAYOUT2: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  labelCol: 4,
                  labelAlign: 'left',
                },
                properties: {
                  addBtn: {
                    type: 'object',
                    'x-component': 'Children',
                    'x-component-props': {
                      children: '{{TableAddButton}}',
                    },
                  },
                  replaceGoodsList: {
                    type: 'array',
                    'x-component': 'ArrayTable',
                    'x-component-props': {
                      renderAddition: () => null,
                      renderRemove: '{{renderListTableRemove}}',
                      renderMoveDown: () => null,
                      renderMoveUp: () => null,
                      operationsWidth: 100,
                      operations: {
                        align: 'center',
                      },
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: !isMateriel
                          ? intl.formatMessage({
                              id: 'afterService.apply.product.replace.normal',
                              defaultMessage: '请选择换货商品',
                            })
                          : intl.formatMessage({
                              id: 'afterService.apply.product.replace.material',
                              defaultMessage: '请选择换货物料',
                            }),
                      },
                    ],
                    items: {
                      type: 'object',
                      properties: {
                        ...(!isMateriel
                          ? {
                              orderNo: {
                                type: 'string',
                                title: intl.formatMessage({
                                  id: 'afterService.apply.orderNo',
                                  defaultMessage: '订单号',
                                }),
                                'x-component': 'OrderNo',
                              },
                              productId: {
                                type: 'string',
                                title: intl.formatMessage({
                                  id: 'afterService.apply.productId',
                                  defaultMessage: '商品ID',
                                }),
                                'x-component': 'Text',
                              },
                              productName: {
                                type: 'string',
                                title: intl.formatMessage({
                                  id: 'afterService.apply.productName',
                                  defaultMessage: '商品名称',
                                }),
                                'x-component': 'Text',
                              },
                              category: {
                                type: 'string',
                                title: intl.formatMessage({
                                  id: 'afterService.apply.category',
                                  defaultMessage: '品类',
                                }),
                                'x-component': 'Text',
                              },
                              brand: {
                                type: 'string',
                                title: intl.formatMessage({ id: 'afterService.apply.brand', defaultMessage: '品牌' }),
                                'x-component': 'Text',
                              },
                              unit: {
                                type: 'string',
                                title: intl.formatMessage({ id: 'afterService.apply.unit', defaultMessage: '单位' }),
                                'x-component': 'Text',
                              },
                            }
                          : {
                              orderNo: {
                                type: 'string',
                                title: intl.formatMessage({
                                  id: 'afterService.apply.orderNo',
                                  defaultMessage: '订单号',
                                }),
                                'x-component': 'OrderNo',
                              },
                              productId: {
                                type: 'string',
                                title: intl.formatMessage({
                                  id: 'afterService.apply.materialNo',
                                  defaultMessage: '物料编号',
                                }),
                                'x-component': 'Text',
                              },
                              productName: {
                                type: 'string',
                                title: `${intl.formatMessage({
                                  id: 'afterService.apply.materialName',
                                  defaultMessage: '物料名称',
                                })}、${intl.formatMessage({
                                  id: 'afterService.apply.quotedSpec',
                                  defaultMessage: '规格',
                                })}`,
                                'x-component': 'Text',
                              },
                              category: {
                                type: 'string',
                                title: intl.formatMessage({
                                  id: 'afterService.apply.category',
                                  defaultMessage: '品类',
                                }),
                                'x-component': 'Text',
                              },
                              brand: {
                                type: 'string',
                                title: intl.formatMessage({ id: 'afterService.apply.brand', defaultMessage: '品牌' }),
                                'x-component': 'Text',
                              },
                              associatedUnit: {
                                type: 'string',
                                title: intl.formatMessage({ id: 'afterService.apply.unit', defaultMessage: '单位' }),
                                'x-component': 'Text',
                              },
                              associated: {
                                type: 'string',
                                title:
                                  orderType !== ORDER_TYPE_TENDER_CONTRACT
                                    ? intl.formatMessage({
                                        id: 'afterService.apply.materialMergeInfo1',
                                        defaultMessage: '关联报价商品ID、名称、规格、品类、品牌',
                                      })
                                    : intl.formatMessage({
                                        id: 'afterService.apply.materialMergeInfo2',
                                        defaultMessage: '关联投标商品ID、名称、规格、品类、品牌',
                                      }),
                                'x-component': 'Text',
                              },
                            }),
                        purchaseCount: {
                          type: 'string',
                          title: !isPoints
                            ? intl.formatMessage({ id: 'afterService.apply.purchaseCount', defaultMessage: '采购数量' })
                            : intl.formatMessage({
                                id: 'afterService.common.productColumns.purchaseCount-integral',
                                defaultMessage: '兑换数量',
                              }),
                          'x-component': 'Text',
                        },
                        purchasePrice: {
                          type: 'string',
                          title: !isPoints
                            ? intl.formatMessage({ id: 'afterService.apply.purchasePrice', defaultMessage: '采购单价' })
                            : intl.formatMessage({
                                id: 'afterService.common.productColumns.purchasePrice-integral',
                                defaultMessage: '所需积分',
                              }),
                          'x-component': 'Text',
                        },
                        purchaseAmount: {
                          type: 'string',
                          title: !isPoints
                            ? intl.formatMessage({
                                id: 'afterService.apply.purchaseAmount',
                                defaultMessage: '采购金额',
                              })
                            : intl.formatMessage({
                                id: 'afterService.common.productColumns.purchaseAmount-integral',
                                defaultMessage: '所需积分小计',
                              }),
                          'x-component': 'Text',
                        },
                        replaceCount: {
                          type: 'string',
                          title: intl.formatMessage({
                            id: 'afterService.apply.replaceCount',
                            defaultMessage: '换货数量',
                          }),
                          'x-component-props': {
                            allowClear: true,
                            style: {
                              maxWidth: 150,
                            },
                          },
                          'x-rules': [
                            {
                              required: true,
                              message: intl.formatMessage({
                                id: 'afterService.apply.replaceCount.required',
                                defaultMessage: '请填写换货数量',
                              }),
                            },
                            {
                              pattern: PATTERN_MAPS.weight,
                              message: intl.formatMessage({
                                id: 'afterService.apply.replaceCount.legal',
                                defaultMessage: '请填写正数，最多保留3位小数',
                              }),
                            },
                          ],
                        },
                        replaceReason: {
                          type: 'string',
                          title: intl.formatMessage({
                            id: 'afterService.apply.replaceReason',
                            defaultMessage: '换货原因',
                          }),
                          'x-component-props': {
                            allowClear: true,
                            style: {
                              maxWidth: 150,
                            },
                          },
                          'x-rules': [
                            {
                              required: true,
                              message: intl.formatMessage({
                                id: 'afterService.apply.replaceReason.required',
                                defaultMessage: '请填写换货原因',
                              }),
                            },
                            {
                              limitByte: true, // 自定义校验规则
                              maxByte: 60,
                            },
                          ],
                        },
                        // 其他数据，不用于展示，只用于收集值
                        extraData: {
                          type: 'string',
                          display: false,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          'tab-3': {
            type: 'object',
            'x-component': 'tabpane',
            'x-component-props': {
              tab: intl.formatMessage({ id: 'afterService.apply.extra', defaultMessage: '相关附件' }),
            },
            properties: {
              MEGA_LAYOUT3: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  labelCol: 4,
                  labelAlign: 'left',
                },
                properties: {
                  proofFileList: {
                    title: intl.formatMessage({ id: 'afterService.apply.proofFileList', defaultMessage: '附件' }),
                    'x-component': 'FixUpload',
                    'x-component-props': {
                      action: '/api/support/file/upload/prefix',
                      data: {
                        fileType: UPLOAD_TYPE,
                        prefix: FILE_PREFIX_ENUM.AFTERSALES_SERVICE,
                      },
                      beforeUpload: '{{beforeUpload}}',
                      accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
                    },
                    'x-rules': [
                      {
                        required: false,
                        message: intl.formatMessage({
                          id: 'afterService.apply.proofFileList.required',
                          defaultMessage: '请上传附件',
                        }),
                      },
                    ],
                    description: intl.formatMessage({
                      id: 'afterService.apply.proofFileList.description',
                      defaultMessage: '一次上传一个文件，每个附件大小不能超过20M',
                    }),
                  },
                },
              },
            },
          },
          'tab-4': {
            type: 'object',
            'x-component': 'tabpane',
            'x-component-props': {
              tab: intl.formatMessage({ id: 'afterService.apply.address', defaultMessage: '退货收货地址' }),
            },
            properties: {
              MEGA_LAYOUT4: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  labelCol: 4,
                  wrapperCol: 12,
                  labelAlign: 'left',
                },
                properties: {
                  deliveryType: {
                    title: intl.formatMessage({ id: 'afterService.apply.deliveryType', defaultMessage: '配送方式' }),
                    type: 'string',
                    enum: DELIVERY_TYPE_ENUM,
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'afterService.apply.deliveryType.placeholder',
                        defaultMessage: '请选择',
                      }),
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'afterService.apply.deliveryType.required',
                          defaultMessage: '请选择配送方式',
                        }),
                      },
                    ],
                  },
                  // 退货发货地址
                  shippingAddress: {
                    title: intl.formatMessage({
                      id: 'afterService.apply.deliveryAddress',
                      defaultMessage: '退货发货地址',
                    }),
                    type: 'string',
                    visible: false,
                    'x-component': 'CustomAddressSelect',
                    'x-component-props': {
                      isDefaultAddress: true,
                      needParams: false,
                      getAddressListApi: getLogisticsSelectListShipperAddress,
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'afterService.apply.deliveryAddress.required',
                          defaultMessage: '请选择退货发货地址',
                        }),
                      },
                    ],
                  },
                  // 退货自提地址
                  pickupAddress: {
                    title: intl.formatMessage({
                      id: 'afterService.apply.pickupAddress',
                      defaultMessage: '退货自提地址',
                    }),
                    type: 'string',
                    visible: false,
                    'x-component': 'CustomAddressSelect',
                    'x-component-props': {
                      isDefaultAddress: true,
                      needParams: true,
                      getAddressListApi: getLogisticsSelectListMemberReceiverAddress,
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'afterService.apply.pickupAddress.required',
                          defaultMessage: '请选择退货自提地址',
                        }),
                      },
                    ],
                  },
                  // 换货收货地址
                  deliveryAddress: {
                    title: intl.formatMessage({
                      id: 'afterService.apply.shippingAddress.replace',
                      defaultMessage: '换货收货地址',
                    }),
                    type: 'string',
                    'x-component': 'CustomAddressSelect',
                    'x-component-props': {
                      isDefaultAddress: true,
                      addressType: 1,
                      needParams: true,
                      canChange: false,
                      getAddressListApi: getLogisticsSelectListMemberShipperAddress,
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'afterService.apply.shippingAddress.replace.required',
                          defaultMessage: '请选择换货收货地址',
                        }),
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
  }
}

import type { ISchema } from '@apps/formily'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 基本信息
const basicInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({
      id: 'purchaseRequisition.jibenxinxi',
      defaultMessage: '基本信息',
    }),
    id: 'basicInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        requisitionNo: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseRequisition.qinggoudanhao',
            defaultMessage: '请购单号',
          }),
          'x-component': 'text',
          visible: false,
        },
        digest: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseRequisition.qinggoudanzhaiyao',
            defaultMessage: '请购单摘要',
          }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'purchaseRequisition.qingshuruqinggouzhaiyao',
                defaultMessage: '请输入请购单摘要',
              }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
          'x-mega-props': {
            span: 1,
          },
        },
        purpose: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseRequisition.qinggouyongtu',
            defaultMessage: '请购用途',
          }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'purchaseRequisition.qingshuruqinggou',
                defaultMessage: '请输入请购用途',
              }),
            },
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
          'x-mega-props': {
            span: 1,
          },
        },
        department: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseRequisition.qinggoubumen',
            defaultMessage: '请购部门',
          }),
          required: true,
          'x-component-props': {
            disabled: true,
            addonAfter: '{{departmentBtn}}',
          },
          'x-mega-props': {
            span: 1,
          },
        },
        departmentId: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseRequisition.qinggoubumenID',
            defaultMessage: '请购部门ID',
          }),
          visible: false,
        },
        vendorMemberName: {
          type: 'string',
          title: translate('web.resource.member.gongyinghuiyuan'),
          'x-component-props': {
            disabled: true,
            addonAfter: '{{memberBtn}}',
          },
          // required: true,
        },
        vendorMemberId: {
          type: 'string',
          visible: false,
        },
        vendorRoleId: {
          type: 'string',
          visible: false,
        },
        createTime: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseRequisition.danjushijian',
            defaultMessage: '单据时间',
          }),
          visible: false,
        },
        interiorStateName: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseRequisition.neibuzhuangtai',
            defaultMessage: '内部状态',
          }),
          visible: false,
        },
        // 请购人
        requisitioner: {
          type: 'string',
          title: translate('web.resource.order.qinggouren'),
          'x-component-props': {
            disabled: true,
            addonAfter: '{{RequisitionerBtn}}',
          },
          required: true,
        },
        requisitionerId: {
          type: 'string',
          visible: false,
        },
        warehouseId: {
          type: 'string',
          title: (
            <Tooltip title={getIntl().formatMessage({ id: 'order.warehouseHouse.tips' })}>
              {getIntl().formatMessage({ id: 'order.warehouseHouse' })}
              <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
            </Tooltip>
          ),
          enum: [],
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            allowClear: true,
          },
        },
        warehouseName: {
          type: 'string',
          title: translate('web.resource.order.xiadancangkumingcheng'),
          visible: false,
        },
      },
    },
  },
}
// 送货/交期信息
const delivery: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: translate('web.resource.order.songhuojiaoqixinxi'),
    id: 'delivery',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 18,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        FLEX_LAYOUT_LEFT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: 6,
            wrapperCol: 18,
          },
          properties: {
            advanceDeliveryDate: {
              type: 'string',
              'x-component': 'date',
              title: getIntl().formatMessage({
                id: 'purchaseRequisition.yujiaoriqi',
                defaultMessage: '预交日期',
              }),
              required: true,
              'x-component-props': {
                disabledDate: (current) => {
                  return current && current < moment().endOf('day')
                },
                style: { width: '100%' },
              },
              'x-mega-props': {
                span: 1,
              },
            },
            deliveryType: {
              type: 'string',
              visible: false,
              title: translate('web.resource.order.kehupeisongfangshi'),
              'x-component': 'RadioNode',
              'x-component-props': {
                list: [],
                deliveryType: '',
              },
              'x-mega-props': {
                span: 1,
              },
            },
          },
        },
        FLEX_LAYOUT_RIGHT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: 3,
            wrapperCol: 21,
          },
          properties: {
            deliveryMethod: {
              type: 'string',
              title: translate('web.resource.logistics.peisongfangshi'),
              enum: [],
              'x-mega-props': {
                span: 1,
              },
            },
            deliveryAddressId: {
              visible: false,
              type: 'string',
              title: translate('web.resource.order.songhuodizhi'),
              'x-component': 'CustomAddressSelect',
              'x-component-props': {
                isDefaultAddress: true,
                addressType: 1,
              },
              'x-mega-props': {
                span: 1,
              },
            },
            deliveryAddress: {
              visible: false,
              type: 'string',
              title: translate('web.resource.order.songhuodizhi'),
              'x-mega-props': {
                span: 1,
              },
            },
          },
        },
      },
    },
  },
}
// 请购单物料
const material: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({
      id: 'purchaseRequisition.qinggouwuliao',
      defaultMessage: '请购物料',
    }),
    id: 'orderMaterial',
  },
  properties: {
    products: {
      type: 'array',
      'x-component': 'MultTable',
      required: true,
      'x-component-props': {
        rowKey: 'id',
        columns: '{{materialColumns}}',
        components: '{{materialComponents}}',
        prefix: '{{materialAddButton}}',
        // expandable: "{{materialChildren}}",
        scroll: '{{scroll}}',
      },
    },
    NO_SUBMIT_SPY: {
      type: 'object',
      'x-component': 'moneyTotalBox',
    },
  },
}

// 附件
const enclosure: ISchema = {
  'x-index': 3,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: translate('web.resource.member.fujian'),
    id: 'enclosure',
  },
  properties: {
    attachments: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        rowKey: 'id',
        columns: '{{enclosureColumns}}',
        suffix: '{{enclosureColumnsButton}}',
      },
    },
  },
}

export const increaseSchema: ISchema = {
  type: 'object',
  properties: {
    basicInfo,
    delivery,
    material,
    enclosure,
  },
}

import React from 'react'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const formSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT_0: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 8,
        labelAlign: 'left',
      },
      properties: {
        name: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zhuanjiamingcheng' }),
          'x-mega-props': {
            full: true,
          },
          'x-component-props': {
            disabled: true,
            addonAfter: '{{selectButton}}',
          },
          required: true,
        },
        userOrgName: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.suoshujigou' }),
          readOnly: true,
        },
        userJobTitle: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zhiwei' }),
          readOnly: true,
        },
        phone: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.lianxidianhua' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurulianxi' }),
          },
          required: true,
        },
        speciality: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.zhuanyeleibie' }),
          // enum: Object.keys(SpecialityTypeMap).map(item => ({
          //   label: SpecialityTypeMap[item],
          //   value: item,
          // })),
          enum: [
            { label: intl.formatMessage({ id: 'table.purchase.gongchenglei' }), value: 1 },
            { label: intl.formatMessage({ id: 'table.purchase.huowulei' }), value: 2 },
            { label: intl.formatMessage({ id: 'table.purchase.fuwulei' }), value: 3 },
            { label: intl.formatMessage({ id: 'table.purchase.qitalei' }), value: 4 },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzezhuanye' }),
          },
          required: true,
        },
        qualification: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zigezhengshu' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzige' }),
          },
          required: true,
        },
        code: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zhengshubianhao' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzige1' }),
          },
          required: true,
        },
        title: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zhuanyezhicheng' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhuanye' }),
          },
          required: true,
        },
        years: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.congshinianxian' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurucongshi' }),
            style: { width: '100%' },
          },
          required: true,
        },
        trade: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.suoshuhangye' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurusuoshu' }),
          },
          required: true,
        },
        address: {
          type: 'array',
          title: intl.formatMessage({ id: 'table.purchase.suozaidiqu' }),
          'x-component': 'CustomAddress',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.xuanzequyu' }),
            warningText: intl.formatMessage({ id: 'table.purchase.qingwanshansuozai' }),
          },
          default: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
          required: true,
        },
        unit: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.gongzuodanwei' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurugongzuo' }),
          },
          required: true,
        },
        type: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.zhuanjialeixing' }),
          // enum: Object.keys(ExpertTypeMap).map(item => ({
          //   label: ExpertTypeMap[item],
          //   value: item,
          // })),
          enum: [
            { label: intl.formatMessage({ id: 'table.purchase.zhaobiaorendaibiao' }), value: 1 },
            { label: intl.formatMessage({ id: 'table.purchase.jishuleizhuanjia' }), value: 2 },
            { label: intl.formatMessage({ id: 'table.purchase.teyaoleizhuanjia' }), value: 3 },
            { label: intl.formatMessage({ id: 'table.purchase.qitaleizhuanjia' }), value: 4 },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhuanjia1' }),
          },
          required: true,
        },
        remark: {
          type: 'textarea',
          title: intl.formatMessage({ id: 'table.purchase.beizhushuoming' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zuichang100gezi' }),
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        createTime: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.jiaruriqi' }),
          readOnly: true,
        },
        updateTime: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.yichuriqi' }),
          readOnly: true,
        },
        expertUserId: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.yonghuid' }),
          visible: false,
          readOnly: true,
        },
      },
    },
  },
}

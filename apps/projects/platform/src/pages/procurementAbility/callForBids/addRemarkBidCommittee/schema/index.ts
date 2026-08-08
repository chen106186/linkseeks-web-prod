import React from 'react'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ExpertTypeMap, SpecialityTypeMap } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
// 新增专家抽取
export const formSchema: ISchema = {
  type: 'object',
  properties: {
    STRATEGY_TABS: {
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
            tab: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }),
          },
          properties: {
            MEGA_LAYOUT1: {
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
                  title: intl.formatMessage({ id: 'table.purchase.zhutimingcheng' }),
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'table.purchase.zuichang50gezi' }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'table.purchase.qingtianxiezhuti' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 60,
                    },
                  ],
                },
                projectName: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.zhaobiaoxiangmu' }),
                  'x-mega-props': {
                    full: true,
                  },
                  'x-component-props': {
                    disabled: true,
                    addonAfter: '{{selectButton}}',
                  },
                  required: true,
                },
                status: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
                  readOnly: true,
                },
                code: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.zhaobiaobianhao' }),
                  readOnly: true,
                  'x-component': 'JumpDetails',
                },
                openTenderTime: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.kaibiaoshijian' }),
                  readOnly: true,
                },
                remarkTime: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.pingbiaoshijian' }),
                  readOnly: true,
                },
                createTime: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.chuangjianshijian' }),
                  readOnly: true,
                },
                inviteTender: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'number',
                      title: intl.formatMessage({ id: 'table.purchase.zhaobiaoid' }),
                      visible: false,
                      readOnly: true,
                    },
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
            tab: intl.formatMessage({ id: 'table.purchase.zujiantiaojian' }),
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
                expertExtractQueryList: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{conditionColumns}}',
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
            tab: intl.formatMessage({ id: 'table.purchase.zhuanjiachouqulie' }),
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
                expertExtractRecordList: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{memberColumns}}',
                    prefix: '{{selectExpertButton}}',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

// 编辑组建条件schema
export const conditionSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT_0: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 18,
        labelAlign: 'left',
      },
      properties: {
        currentIndex: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.dangqianbianjide' }),
          visible: false,
          readOnly: true,
        },
        speciality: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.zhuanyeleibie' }),
          enum: [
            { label: intl.formatMessage({ id: 'table.purchase.gongchenglei' }), value: 1 },
            { label: intl.formatMessage({ id: 'table.purchase.huowulei' }), value: 2 },
            { label: intl.formatMessage({ id: 'table.purchase.fuwulei' }), value: 3 },
            { label: intl.formatMessage({ id: 'table.purchase.qitalei' }), value: 4 },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzezhuanye' }),
          },
          // required: true,
        },
        qualification: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zigezhengshu' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzige' }),
          },
          // required: true,
        },
        title: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.zhuanyezhicheng' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhuanye' }),
          },
          // required: true,
        },
        years: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.congshinianxian' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurucongshi' }),
            style: { width: '100%' },
          },
          // required: true,
        },
        trade: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.suoshuhangye' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurusuoshu' }),
          },
          // required: true,
        },
        needArea: {
          type: 'array',
          title: intl.formatMessage({ id: 'table.purchase.yaoqiudiqu' }),
          'x-component': 'CustomAddress',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.xuanzequyu' }),
            warningText: intl.formatMessage({ id: 'table.purchase.qingxuanzeyaoqiu' }),
          },
          default: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
          // required: true,
        },
        excludeArea: {
          type: 'array',
          title: intl.formatMessage({ id: 'table.purchase.paichudiqu' }),
          'x-component': 'CustomAddress',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.xuanzequyu' }),
            warningText: intl.formatMessage({ id: 'table.purchase.qingxuanzepaichu' }),
          },
          default: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
          // required: true,
        },
        unit: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.gongzuodanwei' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurugongzuo' }),
          },
          // required: true,
        },
        type: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.zhuanjialeixing' }),
          enum: [
            { label: intl.formatMessage({ id: 'table.purchase.zhaobiaorendaibiao' }), value: 1 },
            { label: intl.formatMessage({ id: 'table.purchase.jishuleizhuanjia' }), value: 2 },
            { label: intl.formatMessage({ id: 'table.purchase.teyaoleizhuanjia' }), value: 3 },
            { label: intl.formatMessage({ id: 'table.purchase.qitaleizhuanjia' }), value: 4 },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurusuoshu' }),
          },
          // required: true,
        },
        count: {
          type: 'number',
          title: intl.formatMessage({ id: 'table.purchase.chouqurenshu' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruchouqu' }),
            style: {
              width: '100%',
            },
          },
          required: true,
        },
      },
    },
  },
}

// 选择评标专家schema
export const selectExpertSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhuanjia' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'wrap',
          width: '100%',
          justifyContent: 'flex-start',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        userOrgName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.suoshujigou' }),
          },
        },
        userJobTitle: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zhiwei' }),
          },
        },
        speciality: {
          type: 'string',
          enum: Object.keys(SpecialityTypeMap).map((item) => ({
            label: SpecialityTypeMap[item],
            value: item,
          })),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyelei' }),
          },
        },
        qualification: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zhuanjiazigezheng' }),
          },
        },
        title: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zhuanjiazhuanyezhi' }),
          },
        },
        type: {
          type: 'number',
          enum: Object.keys(ExpertTypeMap).map((item) => ({
            label: ExpertTypeMap[item],
            value: item,
          })),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.zhuanjialeixing' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}

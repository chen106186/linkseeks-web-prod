/*
 * @Author: LeeJiancong
 * @Date: 2020-08-06 11:12:18
 * @LastEditors: LeeJiancong
 * @LastEditTime: 2020-09-29 15:36:47
 */
import React, { useState, useEffect } from 'react'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { GlobalConfig } from '@/global/config'
import { AreaChartOutlined } from '@ant-design/icons'
import { json } from 'express'
let payType = ['', '线上支付', '线下支付', '授信额度支付', '货到付款支付']
let currentTab

//会员支付策略
export const strategyDetailTab = (props: any, usePageStatus: any) => {
  //新增时候就初始化
  let baseList: any = GlobalConfig.payConfig.payInitializeConfig || []

  // console.log('初始化', JSON.stringify(baseList))
  // baseList[2].ruleConfigurations = [{value:1,label:"1",platformType:1}]
  let tabItem = {},
    Tab1 = {},
    arr = []
  baseList.map((item, index) => {
    Tab1[`MEGA_LAYOUT_LINE${index}`] = {
      type: 'Text',
      title: <div style={{ borderLeft: '2px solid #00A98F', padding: '1px 5px' }}>{payType[item.payType]}</div>,
    }
    Tab1[`MEGA_LAYOUT_TAB${index}`] = {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        label: '资金收集模式',
        wrapperCol: 24,
        required: true,
      },
      properties: {
        [`id-${index}`]: {
          type: 'string',
          display: false,
          'x-component-props': {},
        },
        [`ruleConfigurationId-${index}`]: {
          type: 'string',
          enum: item.ruleConfigurations || [],
          'x-component-props': {},
          required: true,
        },
        [`payWayIds-${index}`]: {
          type: 'array:number',
          enum: item.payWayResponses || [],
          'x-component': 'checkbox',
          'x-component-props': {},
          required: true,
        },
      },
    }
    // arr.push({[`payWayIds${index}`: values[`payWayIds[${index}]`],[`ruleConfigurationId`]})
  })

  // props.paymentPolicyPayWayRequests
  // baseList.forEach((v, i) => {
  //   Tab1[`payTitle-${payType[v.payType]}`] = {
  //     type: 'Text',
  //     title: <div style={{ borderLeft: '2px solid #00A98F', padding: '1px 5px' }}>{payType[v.payType]}</div>,
  //   }
  //   Tab1[`ruleConfigurationId-${v.payType}`] = {
  //     type: 'string',
  //     required: true,
  //     title: '资金归集模式',
  //     enum: v.ruleConfigurations
  //   }
  //   Tab1[`payWayId-${v.payType}`] = {
  //     type: 'array:number',
  //     "x-component": 'checkbox',
  //     enum: v.payWayResponses,
  //     properties:{
  //     }
  //   }
  //   console.log('tab1', Tab1)
  // })

  tabItem[`tab-0`] = {
    type: 'object',
    'x-component': 'tabpane',
    'x-component-props': {
      tab: '基本信息',
      forceRender: true,
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
          paymentPolicyName: {
            type: 'string',
            required: true,
            title: '策略名称',
            'x-component-props': {
              max: 24,
              placeholder: '平台代收模式-线上支付+线下支付方式',
            },
          },
          ...Tab1,
        },
      },
    },
  }

  tabItem[`tab-1`] = {
    type: 'object',
    'x-component': 'tabpane',
    'x-component-props': {
      tab: '适用会员',
      forceRender: true,
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
          isSelected: {
            type: 'radio',
            enum: [
              { label: '所有会员共享(默认)', value: 1 },
              { label: '指定会员', value: 0 },
            ],
            title: '适用会员',
            default: 1,
            required: true,
            'x-linkages': [
              {
                type: 'value:visible',
                target: 'applyMember',
                condition: '{{!$value}}',
              },
            ],
          },
          applyMember: {
            type: 'array:number',
            'x-component': 'PayTable',
            'x-component-props': {
              rowKey: 'memberId',
              columns: '{{tableColumns}}',
              prefix: '{{tableAddButton}}',

              onChange: (val) => {
                console.log(val)
              },
            },
          },
        },
      },
    },
  }

  console.log('tabItem', tabItem)

  let payTabSetting: ISchema = {
    type: 'object',
    properties: {
      PAY_TABS: {
        type: 'object',
        'x-component': 'tab',
        'x-component-props': {
          type: 'card',
        },
        properties: { ...tabItem },
      },
    },
  }
  return payTabSetting
}

//列表搜索 多条件的schema
export const strategySearch: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        search: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '搜素',
          },
        },
      },
    },
  },
}
export const paySetting: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {},
    },
  },
}
let TabID: any = 1
function getID(val?) {
  TabID = val
  console.log('id', TabID)
}
//会员支付参数配置
export const TabSetting = (props?: any[]) => {
  let list = GlobalConfig.payConfig.payPlatformPayConfig
  // [{
  //   id: 1,
  //   isPitchOn: 1,
  //   payType: 1,
  //   way: "支付宝支付",
  // },
  // {
  //   id: 2,
  //   isPitchOn: 1,
  //   payType: 1,
  //   way: "微信",
  // },
  // {
  //   id: 3,
  //   isPitchOn: 1,
  //   payType: 2,
  //   way: "线上线下",
  // }

  // ]
  console.log('初始哈', list)
  let tabItem = {}
  list.forEach((v, i) => {
    if (i == 0) {
      currentTab = v.id
    }
    tabItem[`tab-${v.id}`] = {
      type: 'object',
      'x-component': 'tabpane',
      'x-component-props': {
        tab: v.way,
      },

      properties: {
        [`MeGALOYOUT`]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {},
          properties: {
            [`isPitchOn${v.id}`]: {
              type: 'RadioGroud',
              title: `是否开启${v.way}`,
              required: false,
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: `megaLayout${v.id}`,
                  condition: '{{!!$value}}',
                },
              ],
            },
            [`megaLayout${v.id}`]: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {},
              properties: {
                alipayTitle: {
                  visible: v.payType != 2,
                  type: 'Text',
                  title: <div style={{ borderLeft: '2px solid #00A98F', padding: '1px 5px' }}>{v.way}参数配置</div>,
                },
                [`payParametersListResponses${v.id}`]: {
                  visible: v.payType != 2,
                  type: 'array:number',
                  'x-component': 'PayTable',
                  'x-component-props': {
                    rowKey: 'code',
                    columns: '{{tableColumns}}',
                    suffix: v.id === 1 ? '{{tableAddButton}}' : '{{tableAddButton3}}',
                  },
                },
                cardTitle: {
                  visible: v.payType != 2 && v.id != 2,
                  type: 'Text',
                  title: (
                    <div style={{ borderLeft: '2px solid #00A98F', padding: '1px 5px' }}>
                      {v.way}转账到银行卡参数配置
                    </div>
                  ),
                },
                [`payParametersList${v.id}`]: {
                  visible: v.payType != 2 && v.id != 2,
                  type: 'array:number',
                  'x-component': 'PayTable',
                  'x-component-props': {
                    rowKey: 'code',
                    columns: '{{cardTableColumns}}',
                    suffix: '{{tableAddButton2}}',
                  },
                },
              },
            },
          },
        },
      },
    }
  })
  // tabItem[`tab-${props.length + 1}`] = {
  //   "type": 'object',
  //   "x-component": 'tabpane',
  //   "x-component-props": {
  //     tab: '线下支付'
  //   },
  //   properties: {
  //     "isPitchOn": {
  //       type: 'RadioGroud',
  //       title: `是否开线下支付`,
  //       // required: true
  //     }
  //   }
  // }
  let payTabSetting: ISchema = {
    type: 'object',
    properties: {
      PAY_TABS: {
        type: 'object',
        'x-component': 'tab',
        'x-component-props': {
          type: 'card',
          onTabClick: (tab) => {
            currentTab = tab.split('-')[1]
          },
        },
        properties: { ...tabItem },
      },
    },
  }
  console.log('结构', tabItem)
  return payTabSetting
}

export const exportId = () => {
  return currentTab
}

export default {
  getTabId: () => getID(),
}

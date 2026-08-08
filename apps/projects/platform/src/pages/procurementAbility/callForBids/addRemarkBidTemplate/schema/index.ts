import React from 'react'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

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
                  title: intl.formatMessage({ id: 'table.purchase.mubanmingcheng' }),
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'table.purchase.zuichang60gezi1' }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'table.purchase.qingtianxiemuban' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 60,
                    },
                  ],
                },
                version: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.banbenhao' }),
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'table.purchase.zuichang12gezi' }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'table.purchase.qingtianxiebanben' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 12,
                    },
                  ],
                },
                remark: {
                  type: 'textarea',
                  title: intl.formatMessage({ id: 'table.purchase.mubanshuoming' }),
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'table.purchase.zuichang60gezi' }),
                  },
                  'x-rules': [
                    {
                      limitByte: true,
                      maxByte: 60,
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'table.purchase.neirongxinxi' }),
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
                templateContentList: {
                  title: '',
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-component-props': {
                    draggable: false,
                    renderAddition: () =>
                      React.createElement(
                        'p',
                        { style: { color: '#00A98F', width: '100%', textAlign: 'center' } },
                        `+${intl.formatMessage({ id: 'table.purchase.tianjiapingbiaonei' })}`,
                      ),
                    renderMoveUp: () => null,
                    renderMoveDown: () => null,
                    renderRemove: intl.formatMessage({ id: 'table.purchase.shanchu' }),
                  },
                  items: {
                    type: 'object',
                    properties: {
                      // id: {
                      //   title: "内容项ID",
                      //   type: 'number',
                      //   'x-component-props': {

                      //   },
                      //   visible: false,
                      // },
                      sort: {
                        title: intl.formatMessage({ id: 'table.purchase.pingbiaofenlei' }),
                        type: 'string',
                        'x-component-props': {},
                      },
                      term: {
                        title: intl.formatMessage({ id: 'table.purchase.pingfenxiang' }),
                        type: 'string',
                        'x-component-props': {},
                      },
                      standard: {
                        title: intl.formatMessage({ id: 'table.purchase.pingfenbiaozhun' }),
                        type: 'string',
                        'x-component-props': {},
                      },
                      standardScore: {
                        title: intl.formatMessage({ id: 'table.purchase.biaozhunfen' }),
                        type: 'string',
                        'x-component-props': {},
                      },
                    },
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

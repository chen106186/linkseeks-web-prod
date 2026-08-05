import React from 'react'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'
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
                inviteTenderId: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.zhaobiaoID' }),
                  readOnly: true,
                  visible: false,
                },
                inviteTenderCode: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.numbering' }),
                  readOnly: true,
                },
                remark: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.zhaobiaozhaiyao' }),
                  readOnly: true,
                },
                memberName: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }),
                  readOnly: true,
                },
                inviteTenderArea: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.shiyongchengshi' }),
                  readOnly: true,
                },
                createTime: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.fabushijian' }),
                  readOnly: true,
                },
                submitTenderOutStatus: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
                  readOnly: true,
                },
                submitTenderInStatus: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
                  readOnly: true,
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'table.purchase.baomingyaoqiu' }),
          },
          properties: {
            MEGA_LAYOUT2: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                '[registerStartTime, registerEndTime]': {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.baomingshijianyao' }),
                  'x-component': 'daterange',
                  'x-component-props': {
                    showTime: true,
                    style: { width: '100%' },
                  },
                  readOnly: true,
                },
                registerRequirement: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.baomingyaoqiushuo' }),
                  readOnly: true,
                },
                registerNeedFile: {
                  title: intl.formatMessage({ id: 'table.purchase.baomingyaoqiufu' }),
                  'x-component': 'FixUpload',
                  readOnly: true,
                },
              },
            },
          },
        },
        'tab-3': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'table.purchase.baomingxinxi' }),
          },
          properties: {
            MEGA_LAYOUT3: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                inviteTenderMember: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.inviteMemberName' }),
                  readOnly: true,
                },
                name: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.lianxirenxingming' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'table.purchase.qingtianxielianxi2' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 12,
                    },
                  ],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'table.purchase.qingtianxielianxi' }),
                  },
                },
                MEGA_LAYOUT3_1: {
                  type: 'object',
                  'x-component': 'Mega-Layout',
                  'x-component-props': {
                    label: intl.formatMessage({ id: 'table.purchase.lianxirendianhua' }),
                    required: true,
                    wrapperCol: 24,
                    className: 'clearParentMargin',
                  },
                  properties: {
                    MEGA_LAYOUT1_1_1: {
                      type: 'object',
                      'x-component': 'Mega-layout',
                      'x-component-props': {
                        grid: true,
                        full: true,
                      },
                      properties: {
                        phoneCode: {
                          type: 'string',
                          enum: [],
                          'x-component-props': {
                            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanze' }),
                          },
                          required: true,
                        },
                        phone: {
                          type: 'string',
                          required: true,
                          'x-mega-props': {
                            span: 2,
                          },
                          'x-component-props': {
                            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurushouji' }),
                            maxLength: 11,
                          },
                          // 'x-rules': [
                          //   {
                          //     pattern: PATTERN_MAPS.phone,
                          //     message: intl.formatMessage({ id: 'table.purchase.qingshuruzhengque1' }),
                          //   },
                          // ],
                        },
                      },
                    },
                  },
                },
                email: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.dianziyouxiang' }),
                  required: true,
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'table.purchase.qingshurudianzi' }),
                  },
                  'x-rules': [
                    {
                      pattern: PATTERN_MAPS.email,
                      message: intl.formatMessage({ id: 'table.purchase.qingshuruzhengque' }),
                    },
                  ],
                },
                MEGA_LAYOUT3_2: {
                  type: 'object',
                  'x-component': 'Mega-Layout',
                  'x-component-props': {
                    label: intl.formatMessage({ id: 'table.purchase.dizhi' }),
                    required: true,
                    wrapperCol: 24,
                  },
                  properties: {
                    MEGA_LAYOUT1_1_2: {
                      type: 'object',
                      'x-component': 'mega-layout',
                      'x-component-props': {
                        columns: 1,
                      },
                      properties: {
                        tenderAddress: {
                          type: 'array',
                          'x-mega-props': {
                            span: 1,
                          },
                          'x-component': 'CustomAddress',
                          'x-component-props': {
                            placeholder: intl.formatMessage({ id: 'table.purchase.xuanzedanweidi' }),
                            warningText: intl.formatMessage({ id: 'table.purchase.qingwanshansuozai' }),
                          },
                          // default: [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }],
                          required: true,
                        },
                        address: {
                          type: 'textarea',
                          'x-mega-props': {
                            span: 1,
                          },
                          'x-component-props': {
                            placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder15' }),
                          },
                          required: true,
                          'x-rules': [
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'table.purchase.qingtianxiexiangxi' }),
                            },
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
              },
            },
          },
        },
        'tab-4': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'table.purchase.baomingwenjian' }),
          },
          properties: {
            MEGA_LAYOUT4: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                registerFile: {
                  title: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }),
                  'x-component': 'FixUpload',
                  'x-component-props': {
                    action: '/api/support/file/upload/prefix',
                    data: {
                      fileType: 1,
                      prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
                    },
                    beforeUpload: '{{beforeUpload}}',
                    accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
                  },
                  'x-rules': [
                    {
                      required: false,
                      message: intl.formatMessage({ id: 'detail.purchase.message57' }),
                    },
                  ],
                  description: intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }),
                },
              },
            },
          },
        },
      },
    },
  },
}

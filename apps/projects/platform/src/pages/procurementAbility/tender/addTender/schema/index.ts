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
                submitTenderCode: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.toubiaobianhao' }),
                  readOnly: true,
                },
                projectName: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.toubiaoxiangmu' }),
                  readOnly: true,
                },
                inviterTenderCode: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.numbering' }),
                  readOnly: true,
                  'x-component': 'InviterCodeJump',
                },
                memberName: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }),
                  readOnly: true,
                },
                // inviteTenderAreaList: {
                //   type: 'array',
                //   title: '适用城市',
                //   'x-component': 'MultAddress',
                //   'x-component-props': {
                //     placeholder: '选择区域',
                //     warningText: '请完善适用地市',
                //   },
                //   default: [{ provinceCode: null, province: null, cityCode: null, city: null }],
                //   readOnly: true,
                // },
                inviteTenderAreaList: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.shiyongchengshi' }),
                  readOnly: true,
                },
                inviteTenderOutStatus: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
                  readOnly: true,
                },
                inviteTenderInStatus: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
                  readOnly: true,
                },
              },
            },
          },
        },
        'tab-4': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'table.purchase.toubiaoshangpin' }),
          },
          properties: {
            MEGA_LAYOUT4: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                // labelCol: 4,
                // wrapperCol: 8,
                // labelAlign: 'left'
              },
              properties: {
                submitTenderMateriel: {
                  type: 'array',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{productColumns}}',
                    components: '{{productComponents}}',
                    expandable: '{{productChildren}}',
                    // pagination: { size: 'small' }
                  },
                },
              },
            },
          },
        },
        'tab-5': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'table.purchase.toubiaoqitaxin' }),
          },
          properties: {
            MEGA_LAYOUT5: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                remark: {
                  title: intl.formatMessage({ id: 'table.purchase.toubiaozhaiyao' }),
                  type: 'textarea',
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder8' }),
                  },
                  'x-rules': [
                    {
                      limitByte: true,
                      maxByte: 200,
                    },
                  ],
                },
                file: {
                  title: intl.formatMessage({ id: 'table.purchase.toubiaowenjian' }),
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

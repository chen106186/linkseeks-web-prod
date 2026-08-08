import { ISchema } from '@apps/formily'
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
            tab: intl.formatMessage({ id: 'detail.purchase.basicLayout' }),
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
                details: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.biddingDetails' }),
                  readOnly: true,
                  visible: true,
                },
                biddingNo: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.biddingNo' }),
                  readOnly: true,
                },
                createMemberName: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
                  readOnly: true,
                },
                areas: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.areas' }),
                  'x-component': 'MultAddress',
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder13' }),
                    warningText: intl.formatMessage({ id: 'detail.purchase.placeholder14' }),
                    onlyShowText: true,
                  },
                  default: [{ provinceCode: null, province: null, cityCode: null, city: null }],
                  readOnly: true,
                },
                createTime: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
                  readOnly: true,
                },
                externalStateName: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
                  readOnly: true,
                },
                interiorStateName: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
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
            tab: intl.formatMessage({ id: 'detail.purchase.signUpLayout' }),
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
                '[startSignUp, endSignUp]': {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.startSignUp' }),
                  'x-component': 'daterange',
                  'x-component-props': {
                    showTime: true,
                    style: { width: '100%' },
                    separator: intl.formatMessage({ id: 'detail.purchase.label3' }),
                  },
                  readOnly: true,
                },
                demand: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.label16' }),
                  readOnly: true,
                },
                demandUrls: {
                  title: intl.formatMessage({ id: 'detail.purchase.demandUrls' }),
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
            tab: intl.formatMessage({ id: 'detail.purchase.signUpMsgLayout' }),
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
                member: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'table.purchase.inviteMemberName' }),
                  readOnly: true,
                },
                contacts: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.contacts' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'detail.purchase.contactsMessage' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 12,
                    },
                  ],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder3' }),
                  },
                },
                MEGA_LAYOUT3_1: {
                  type: 'object',
                  'x-component': 'Mega-Layout',
                  'x-component-props': {
                    label: intl.formatMessage({ id: 'detail.purchase.telPhone' }),
                    required: true,
                    wrapperCol: 24,
                  },
                  properties: {
                    MEGA_LAYOUT1_1_1: {
                      type: 'object',
                      'x-component': 'mega-layout',
                      'x-component-props': {
                        grid: true,
                        full: true,
                      },
                      properties: {
                        telPrefix: {
                          type: 'string',
                          enum: [],
                          'x-component-props': {
                            placeholder: intl.formatMessage({ id: 'detail.purchase.message23' }),
                          },
                          required: true,
                        },
                        tel: {
                          type: 'string',
                          required: true,
                          'x-mega-props': {
                            span: 2,
                          },
                          'x-component-props': {
                            placeholder: intl.formatMessage({ id: 'detail.purchase.tel' }),
                            maxLength: 11,
                          },
                          // 'x-rules': [
                          //   {
                          //     pattern: PATTERN_MAPS.phone,
                          //     message: intl.formatMessage({ id: 'detail.purchase.message58' }),
                          //   },
                          // ],
                        },
                      },
                    },
                  },
                },
                mail: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.email' }),
                  required: true,
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'detail.purchase.message59' }),
                  },
                  'x-rules': [
                    {
                      pattern: PATTERN_MAPS.email,
                      message: intl.formatMessage({ id: 'detail.purchase.message60' }),
                    },
                  ],
                },
                signUpAreas: {
                  'x-component': 'AreaSelect',
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.label17' }),
                  required: true,
                  'x-mega-props': {
                    span: 2,
                  },
                  'x-rules': [],
                  'x-component-props': {
                    needName: true,
                  },
                },
                MEGA_LAYOUT3_2: {
                  type: 'object',
                  'x-component': 'Mega-Layout',
                  'x-component-props': {
                    label: ' ',
                    // required: true,
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
                              message: intl.formatMessage({ id: 'detail.purchase.message61' }),
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
            tab: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }),
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
                enclosureUrls: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }),
                  'x-component': 'FixUpload',
                  'x-component-props': {
                    action: '/api/support/file/upload/prefix',
                    data: {
                      fileType: 1,
                      prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
                    },
                    beforeUpload: '{{beforeUpload}}',
                    onChange: '{{onUploadChange}}',
                    headers: '{{ accessToken }}',
                    accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
                  },
                  'x-rules': [
                    {
                      required: false,
                      message: intl.formatMessage({ id: 'detail.purchase.message57' }),
                    },
                  ],
                  description: intl.formatMessage({ id: 'detail.purchase.placeholder2' }),
                },
              },
            },
          },
        },
      },
    },
  },
}

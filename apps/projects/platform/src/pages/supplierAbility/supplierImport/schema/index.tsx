import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PATTERN_MAPS } from '@/constants/regExp'
import { createMemberSchema, GroupItem } from '../../utils'
import { OperateType } from '../supplierForm'

const intl = getIntl()

export const importSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        controllerWrap: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'MemberControllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.management.import.query.name.placeholder' }),
                tip: intl.formatMessage({ id: 'supplier.management.import.query.name.placeholder-tip' }),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Flex-Layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.management.import.query.outerStatus.placeholder' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.management.import.query.date.placeholder' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'member.management.import.query.query' }),
              },
            },
          },
        },
      },
    },
  },
}

const auditProcess: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'supplier.profile.auditProcess', defaultMessage: '流转进度' }),
    id: 'auditProcess',
    headStyle: {
      display: 'none',
    },
    bodyStyle: {
      padding: 0,
    },
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        className: 'noMarBottom',
      },
      properties: {
        auditData: {
          type: 'object',
          'x-component': 'AuditProcess',
          default: 'outer',
          'x-component-props': {
            initRadioValue: 'outer',
            value: 'outer',
          },
        },
      },
    },
  },
}

const flowRecords: ISchema = {
  'x-index': 99,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'supplier.import.addSchema.flowRecords', defaultMessage: '流转记录' }),
    id: 'flowRecords',
    headStyle: {
      display: 'none',
    },
    bodyStyle: {
      padding: 0,
    },
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        className: 'noMarBottom',
      },
      properties: {
        flowData: {
          type: 'object',
          'x-component': 'FlowRecords',
        },
      },
    },
  },
}

// 基本信息
const basicInfo = (type: OperateType): ISchema => {
  return {
    'x-index': 1,
    type: 'object',
    'x-component': 'MellowCard',
    'x-component-props': {
      title: getIntl().formatMessage({ id: 'supplier.import.addSchema.basicInfo', defaultMessage: '基本信息' }),
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
          grid: true,
          full: true,
          autoRow: true,
          columns: 2,
        },
        properties: {
          memberId: {
            type: 'string',
            title: intl.formatMessage({
              id: 'supplier.profile.supplierId',
              defaultMessage: '供应商ID',
            }),
            readOnly: true,
            visible: type === OperateType.detail,
          },
          memberType: {
            type: 'string',
            readOnly: true,
            visible: false,
          },
          roleId: {
            type: 'string',
            title: intl.formatMessage({
              id: 'supplier.profile.roleName',
              defaultMessage: '供应商角色',
            }),
            enum: [],
            'x-rules': [
              {
                required: true,
                message: getIntl().formatMessage({
                  id: 'supplier.import.invite.supplierRole.required',
                  defaultMessage: '请选择供应商角色',
                }),
              },
            ],
          },
          account: {
            type: 'string',
            title: intl.formatMessage({
              id: 'supplier.profile.loginAccount',
              defaultMessage: '登录账户',
            }),
            readOnly: true,
            visible: type === OperateType.detail,
          },
          level: {
            type: 'string',
            title: intl.formatMessage({
              id: 'supplier.profile.levelTag',
              defaultMessage: '供应商等级',
            }),
            enum: [],
          },
          MEGA_LAYOUT1_1: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              className: 'noMarBottom',
              label: intl.formatMessage({
                id: 'supplier.profile.registerphone',
                defaultMessage: '注册手机号',
              }),
              required: type !== OperateType.detail,
              grid: false,
              // full: true,
            },
            properties: {
              MEGA_LAYOUT1_1_1: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  grid: true,
                  full: true,
                  columns: 3,
                  wrapperCol: 24,
                },
                properties: {
                  telCode: {
                    type: 'string',
                    enum: [],
                    visible: type !== OperateType.detail,
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'member.management.import.query.form.placeholder-select' }),
                      style: {
                        width: '100%',
                      },
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'member.management.import.query.form.placeholder-select' }),
                      },
                    ],
                  },
                  phone: {
                    type: 'string',
                    'x-mega-props': {
                      span: 2,
                    },
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'member.management.import.query.form.basic.phone.placeholder',
                      }),
                      style: {
                        width: '100%',
                      },
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'member.management.import.query.form.basic.phone.placeholder',
                        }),
                      },
                      // {
                      //   pattern: PATTERN_MAPS.phone,
                      //   message: intl.formatMessage({
                      //     id: 'member.management.import.query.form.basic.phone.rules-fact',
                      //   }),
                      // },
                    ],
                  },
                },
              },
            },
          },
          email: {
            type: 'string',
            title: intl.formatMessage({
              id: 'supplier.profile.email',
              defaultMessage: '注册邮箱',
            }),
            'x-component-props': {},
            'x-rules': [
              {
                pattern: PATTERN_MAPS.email,
                message: intl.formatMessage({ id: 'authConfig.correntEmail', defaultMessage: '请输入正确的邮箱' }),
              },
            ],
          },
          outerStatusName: {
            type: 'string',
            title: intl.formatMessage({
              id: 'supplier.profile.outerStatusName',
              defaultMessage: '外部状态',
            }),
            'x-component': 'StatusTag',
            'x-component-props': {
              className: 'statusTag',
            },
            readOnly: true,
            visible: type === OperateType.detail,
          },
          createTime: {
            type: 'string',
            title: intl.formatMessage({
              id: 'supplier.profile.createTime',
              defaultMessage: '申请时间',
            }),
            readOnly: true,
            visible: type === OperateType.detail,
          },
          password: {
            type: 'password',
            title: intl.formatMessage({
              id: 'supplier.profile.passwrod',
              defaultMessage: '登录密码',
            }),
            visible: type !== OperateType.detail,
            'x-component-props': {
              className: 'fullWidth',
              autoComplete: 'new-password',
            },
            'x-rules': [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'supplier.profile.passwrod.required',
                  defaultMessage: '请输入登录密码',
                }),
              },
              {
                pattern: PATTERN_MAPS.password,
                message: intl.formatMessage({
                  id: 'supplier.profile.passwrod.rule',
                  defaultMessage: '8-16个字符，由英文字母（区分大小写）、数字、符号组成',
                }),
              },
            ],
          },
        },
      },
    },
  }
}

// 渠道信息
const channelInfo: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'supplier.profile.channelInfo', defaultMessage: '渠道信息' }),
    id: 'channelInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        upperRelationId: {
          type: 'string',
          enum: [],
          title: intl.formatMessage({ id: 'member.management.import.query.form.channel.upperRelationId' }),
          required: true,
          'x-component-props': {},
        },
        remark: {
          type: 'string',
          title: intl.formatMessage({ id: 'member.management.import.query.form.channel.remark' }),
          required: true,
          // 'x-component': 'TextArea',
          'x-component-props': {
            rows: 4,
            placeholder: intl.formatMessage({ id: 'member.management.import.query.form.channel.remark.placeholder' }),
          },
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 200,
            },
          ],
        },
        channelTypeId: {
          type: 'string',
          enum: [],
          title: intl.formatMessage({ id: 'member.management.import.query.form.channel.channelTypeId' }),
          required: true,
          'x-component-props': {},
        },
        channelLevel: {
          type: 'text',
          title: intl.formatMessage({ id: 'member.management.import.query.form.channel.channelLevel' }),
        },
        areas: {
          type: 'array',
          title: intl.formatMessage({ id: 'member.management.import.query.form.channel.areas' }),
          required: true,
          'x-component': 'CustomAddArray',
          'x-component-props': {
            className: 'customAddArray',
            style: {
              display: 'flex',
              paddingRight: 36,
            },
          },
          default: [],
          items: {
            type: 'object',
            properties: {
              provinceCode: {
                type: 'string',
                enum: [],
                'x-mega-props': {
                  wrapperCol: 22,
                },
                'x-component-props': {
                  allowClear: true,
                },
              },
              cityCode: {
                type: 'string',
                enum: [],
                'x-mega-props': {
                  wrapperCol: 22,
                },
                'x-component-props': {
                  allowClear: true,
                },
              },
            },
          },
        },
      },
    },
  },
}

/**
 *
 * @param props 自定义表单数据
 * @param isChannelMember 是否渠道会员
 * @returns
 */
export const addSchema = (props: GroupItem[] = [], type: OperateType) => {
  const customSchema = {}
  const customList = [...props]

  if (Array.isArray(customList) && customList.length > 0) {
    for (let [index, item] of customList.entries()) {
      const customizeIndex = index + 3
      const customizeId = `customize_${customizeIndex}`
      const hasList =
        item.elements &&
        Array.isArray(item.elements) &&
        item.elements.length > 0 &&
        item.elements.some((item) => item.fieldType === 'list')
      customSchema[customizeId] = {
        'x-index': customizeIndex,
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          title: item.groupName,
          id: customizeId,
        },
        properties: {
          NO_SUBMIT_LAYOUT: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelCol: hasList ? 3 : 6,
              wrapperCol: hasList ? 21 : 16,
              labelAlign: 'left',
              grid: true,
              full: true,
              autoRow: true,
              columns: hasList ? 1 : 2,
            },
            properties: createMemberSchema(item.elements),
          },
        },
      }
    }
  }

  const properties = {}
  if (type === OperateType.detail) properties['auditProcess'] = auditProcess
  properties['basicInfo'] = basicInfo(type)

  if (Object.keys(customSchema).length > 0) {
    Object.keys(customSchema).forEach((key) => {
      properties[key] = customSchema[key]
    })
  }
  if (type === OperateType.detail) properties['flowRecords'] = flowRecords

  return {
    type: 'object',
    properties,
  }
}

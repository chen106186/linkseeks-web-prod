import { ISchema } from '@apps/formily'
import themeConfig from '@apps/config/lingxi.theme.config'
import { MEMBER_VISIT_BASIC_INFO, MEMBER_VISIT_FILES } from './config'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
const schema: ISchema = {
  type: 'object',
  properties: {
    BASIC_INFO: {
      type: 'object',
      'x-component': 'AnchorCardVirtualFieldWrap',
      'x-component-props': {
        title: intl.formatMessage({ id: 'member.memberVisitManage.basic', defaultMessage: '基本信息' }),
        anchorKey: MEMBER_VISIT_BASIC_INFO,
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            columns: 2,
            autoRow: true,
            labelCol: 6,
            labelAlign: 'left',
          },
          properties: {
            visitTheme: {
              title: intl.formatMessage({ id: 'member.memberVisitManage.visitTheme', defaultMessage: '拜访主题' }),
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitTheme.placeholder',
                  defaultMessage: '最长40个字符，20个文字',
                }),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'member.memberVisitManage.visitTheme.required',
                    defaultMessage: '请输入拜访主题',
                  }),
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 40,
                },
              ],
            },
            subMember: {
              title: translate('web.resource.member.memberName'),
              type: 'array',
              required: true,
              'x-component': 'MemberVisitedFieldItem',
            },
            visitType: {
              title: intl.formatMessage({ id: 'member.memberVisitManage.visitTypeName', defaultMessage: '拜访类型' }),
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitTypeName.placeholder',
                  defaultMessage: '请选择',
                }),
              },
            },
            visitorMember: {
              title: intl.formatMessage({ id: 'member.memberVisitManage.visitor', defaultMessage: '拜访人' }),
              type: 'array',
              required: true,
              'x-component': 'VisitorMemberFieldItem',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitor.placeholder',
                  defaultMessage: '请选择',
                }),
              },
            },
            visitLevel: {
              title: intl.formatMessage({ id: 'member.memberVisitManage.visitLevelName', defaultMessage: '拜访级别' }),
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitLevelName.placeholder',
                  defaultMessage: '请选择',
                }),
              },
            },
            peer: {
              title: intl.formatMessage({ id: 'member.memberVisitManage.peer', defaultMessage: '同行人' }),
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.peer.placeholder',
                  defaultMessage: '最长40个字符，20个汉字',
                }),
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 40,
                },
              ],
            },
            visitDate: {
              title: intl.formatMessage({ id: 'member.memberVisitManage.visitDate', defaultMessage: '拜访日期' }),
              type: 'string',
              'x-component': 'DatePicker',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitDate.placeholder',
                  defaultMessage: '请选择',
                }),
              },
            },
            visitRemark: {
              title: intl.formatMessage({ id: 'member.memberVisitManage.visitRemark', defaultMessage: '备注' }),
              type: 'string',
              'x-component': 'TextArea',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitRemark.placeholder',
                  defaultMessage: '最长200个字符，100个汉字',
                }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 200,
                },
              ],
            },
          },
        },
      },
    },
    VISIT_FILES: {
      type: 'object',
      'x-component': 'AnchorCardVirtualFieldWrap',
      'x-component-props': {
        title: intl.formatMessage({ id: 'member.memberVisitManage.files', defaultMessage: '附件' }),
        anchorKey: MEMBER_VISIT_FILES,
        style: {
          marginTop: themeConfig['@margin-md'],
        },
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            columns: 2,
            autoRow: true,
            labelCol: 6,
            labelAlign: 'left',
          },
          properties: {
            files: {
              type: 'string',
              'x-component': 'FormilyUploadFiles',
              description: intl.formatMessage({
                id: 'member.memberVisitManage.files.description',
                defaultMessage: '一次上传一个文件，每个附件大小不能超过 20M',
              }),
            },
          },
        },
      },
    },
  },
}

export default schema

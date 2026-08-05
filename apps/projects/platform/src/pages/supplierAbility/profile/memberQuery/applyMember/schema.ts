/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-26 17:00:39
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 18:13:20
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { createMemberSchema, ElementType } from '../../../utils'

const intl = getIntl()

export type GroupItem = {
  /**
   * 组名
   */
  groupName: string
  /**
   * 元素
   */
  elements: ElementType[]
}

const depositSchema: ISchema = {
  type: 'object',
  properties: {
    NO_DEPOSIT: {
      type: 'object',
      visible: false,
      'x-component': 'NoData',
      'x-component-props': {
        content: intl.formatMessage({ id: 'member.memberQuery.applyMember.deposit.nothing' }),
      },
    },
  },
}

const schema = (groups: GroupItem[], validateId?: number): ISchema => {
  ;(groups || []).forEach((item, index) => {
    depositSchema.properties[`CARD_BOX_${index}`] = {
      type: 'object',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: item.groupName,
        wrapProps: {
          style: {
            padding: '24px 16px',
          },
        },
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            // grid: true,
            // full: true,
            // autoRow: true,
            // columns: 2,
            labelCol: 4,
            wrapperCol: 20,
            labelAlign: 'left',
          },
          properties: createMemberSchema(item.elements),
        },
      },
    }
  })

  return {
    type: 'object',
    properties: {
      STEP_LAYOUT: {
        type: 'object',
        'x-component': 'step',
        'x-component-props': {
          style: {
            padding: '12px 16px',
            backgroundColor: '#FAFBFC',
          },
          // current: '{{currenStep}}',
          dataSource: [
            !validateId
              ? {
                  title: intl.formatMessage({ id: 'supplier.supplierQuery.applysupplier.step1' }),
                  name: 'step1',
                }
              : null,
            !validateId
              ? {
                  title: intl.formatMessage({ id: 'member.memberQuery.applyMember.step2' }),
                  name: 'step2',
                }
              : null,
            {
              title: intl.formatMessage({ id: 'member.memberQuery.applyMember.step3' }),
              name: 'step3',
            },
            {
              title: intl.formatMessage({ id: 'member.memberQuery.applyMember.step4' }),
              name: 'step4',
            },
            {
              title: intl.formatMessage({ id: 'member.memberQuery.applyMember.step5' }),
              name: 'step5',
            },
          ].filter(Boolean),
        },
      },
      ...(!validateId
        ? {
            step1: {
              type: 'object',
              properties: {
                agreement: {
                  type: 'object',
                  'x-component': 'Children',
                  'x-component-props': {
                    children: '{{ComingAgreement}}',
                  },
                },
              },
            },
            step2: {
              type: 'object',
              properties: {
                registerInfo: {
                  type: 'object',
                  'x-component': 'Children',
                  'x-component-props': {
                    children: '{{RegisterInfo}}',
                  },
                },
              },
            },
          }
        : {}),
      step3: depositSchema,
      step4: {
        type: 'object',
        properties: {
          INCOMING_INFO: {
            type: 'object',
            'x-component': 'FlagBox',
            'x-component-props': {
              title: intl.formatMessage({ id: 'member.memberQuery.applyMember.step3.qualities' }),
              wrapProps: {
                style: {
                  padding: '24px 16px',
                },
              },
            },
            properties: {
              qualities: {
                type: 'array',
                'x-component': 'QualitiesUploadFormItem',
              },
            },
          },
        },
      },
      step5: {
        type: 'object',
        properties: {
          submitSuccess: {
            type: 'object',
            'x-component': 'Children',
            'x-component-props': {
              children: '{{SubmitSuccess}}',
            },
          },
        },
      },
    },
  }
}

export default schema

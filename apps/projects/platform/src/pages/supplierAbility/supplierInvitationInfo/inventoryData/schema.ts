/* eslint-disable @typescript-eslint/consistent-type-imports */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { createMemberSchema, ElementType } from '../../utils'

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
        content: intl.formatMessage({
          id: 'supplier.invitationInfo.inventoryData.deposit.nothing',
          defaultMessage: '您当前无可变更的入库信息',
        }),
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
                  title: intl.formatMessage({
                    id: 'supplier.supplierQuery.applysupplier.step1',
                    defaultMessage: '供应商入库协议',
                  }),
                  name: 'step1',
                }
              : null,
            !validateId
              ? {
                  title: intl.formatMessage({
                    id: 'supplier.invitationInfo.inventoryData.step2',
                    defaultMessage: '确认注册信息',
                  }),
                  name: 'step2',
                }
              : null,
            {
              title: intl.formatMessage({
                id: 'supplier.invitationInfo.inventoryData.step3',
                defaultMessage: '填写入库信息',
              }),
              name: 'step3',
            },
            {
              title: intl.formatMessage({
                id: 'supplier.invitationInfo.inventoryData.step4',
                defaultMessage: '上传资质证明',
              }),
              name: 'step4',
            },
            {
              title: intl.formatMessage({ id: 'supplier.invitationInfo.inventoryData.step5', defaultMessage: '完成' }),
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
              title: intl.formatMessage({
                id: 'supplier.invitationInfo.inventoryData.step3.qualities',
                defaultMessage: '上传资质证明',
              }),
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

import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ExpertTypeMap, SpecialityTypeMap } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhuanjia' }),
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        userOrgName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshurusuoshu1' }),
          },
        },
        userJobTitle: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhiwei' }),
          },
        },
        speciality: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzezhuanye' }),
          },
          enum: Object.keys(SpecialityTypeMap).map((item) => ({
            label: SpecialityTypeMap[item],
            value: item,
          })),
        },
        qualification: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzige' }),
          },
        },
        title: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhuanye' }),
          },
        },
        type: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzezhuanjia1' }),
          },
          enum: Object.keys(ExpertTypeMap).map((item) => ({
            label: ExpertTypeMap[item],
            value: item,
          })),
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}

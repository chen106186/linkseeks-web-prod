import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
// import { TenderOutStateTexts } from '@/constants/procurement';
import { getInviteSubmitTenderOutStatus } from '@/pages/procurement/constants'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 招标查询列表高级筛选
 */
export const tableListSchema: any = () => {
  const TenderOutStateTexts = getInviteSubmitTenderOutStatus()

  return {
    type: 'object',
    properties: {
      inviteTenderCode: {
        type: 'string',
        'x-component': 'SearchFilter',
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhaobiao' }),
          align: 'flex-start',
        },
      },
      [FORM_FILTER_PATH]: {
        type: 'object',
        'x-component': 'flex-layout',
        'x-component-props': {
          inline: true,
          rowStyle: {
            justifyContent: 'start',
          },
          colStyle: {
            marginRight: 20,
          },
        },
        properties: {
          projectName: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingshurutoubiao1' }),
            },
          },
          submitTenderCode: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingshurutoubiao' }),
            },
          },
          openTenderTime: {
            type: 'string',
            'x-component': 'data',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.kaibiaokaishishi' }),
              showTime: true,
            },
          },
          submitTenderMemberName: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingshurutoubiao2' }),
            },
          },
          submitTenderOutStatusList: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzewaibu' }),
            },
            enum: TenderOutStateTexts.map((item) => ({
              label: item['message'],
              value: item['code'],
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
}

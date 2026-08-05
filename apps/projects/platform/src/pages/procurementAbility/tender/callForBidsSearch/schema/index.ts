import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getSubmitInviteTenderInStatus, getSubmitInviteTenderOutStatus } from '@/pages/procurement/constants'
import { getIntl } from '@linkseeks/i18n'
// import { TenderInStateTexts, TenderOutStateTexts } from '@/constants/procurement';
const intl = getIntl()

/**
 * 招标查询列表高级筛选
 */
export const tableListSchema: any = () => {
  const TenderInStateTexts = getSubmitInviteTenderInStatus()
  const TenderOutStateTexts = getSubmitInviteTenderOutStatus()

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
            justifyContent: 'flex-start',
            flexWrap: 'nowrap',
          },
          colStyle: {
            //改变间隔
            marginRight: 20,
          },
        },
        properties: {
          projectName: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhaobiao1' }),
            },
          },
          '[startTime,endTime]': {
            type: 'array',
            'x-component': 'DateRangePickerUnix',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'table.purchase.fabukaishishi' }),
                intl.formatMessage({ id: 'table.purchase.fabujieshushi' }),
              ],
            },
          },
          inviteTenderMemberName: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhaobiao2' }),
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
          submitTenderInStatusList: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzeneibu' }),
            },
            enum: TenderInStateTexts.map((item) => ({
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

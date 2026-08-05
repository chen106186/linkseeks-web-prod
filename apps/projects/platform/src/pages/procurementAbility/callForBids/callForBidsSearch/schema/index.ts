import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
// import { BidInStateTexts, BidOutStateTexts } from '@/constants/procurement';
import { getInviteTenderInStatus, getInviteTenderOutStatus } from '@/pages/procurement/constants'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/**
 * 招标查询列表高级筛选
 */
export const tableListSchema: any = () => {
  const BidInStateTexts = getInviteTenderInStatus()
  const BidOutStateTexts = getInviteTenderOutStatus()

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
          '[registerStartTime,registerEndTime]': {
            type: 'array',
            'x-component': 'DateRangePickerUnix',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'table.purchase.baomingkaishishi' }),
                intl.formatMessage({ id: 'table.purchase.baomingjieshushi' }),
              ],
            },
          },
          inviteTenderOutStatusList: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzewaibu' }),
            },
            enum: BidOutStateTexts.map((item) => ({
              label: item['message'],
              value: item['code'],
            })),
          },
          inviteTenderInStatusList: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzeneibu' }),
            },
            enum: BidInStateTexts.map((item) => ({
              label: item['message'],
              value: item['code'],
            })),
          },
          '[preCheckStartTime,preCheckEndTime]': {
            type: 'array',
            'x-component': 'DateRangePickerUnix',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'table.purchase.yushenkaishishi' }),
                intl.formatMessage({ id: 'table.purchase.yushenjieshushi' }),
              ],
            },
          },
          '[inviteTenderStartTime,inviteTenderEndTime]': {
            type: 'array',
            'x-component': 'DateRangePickerUnix',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'table.purchase.toubiaokaishishi' }),
                intl.formatMessage({ id: 'table.purchase.toubiaojieshushi' }),
              ],
            },
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

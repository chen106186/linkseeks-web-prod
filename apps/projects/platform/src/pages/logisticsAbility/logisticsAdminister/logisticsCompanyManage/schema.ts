import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getMemberManageRoleAll } from '@apps/apis'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const fetchData = () => {
  return new Promise((resolve) => {
    getMemberManageRoleAll({ roleTypeEnum: '1' })
      .then((res: any) => {
        resolve({
          data: res.data.map((item: any) => {
            return {
              name: item.roleName,
              state: item.roleId,
            }
          }),
        })
      })
      .catch((error) => {
        console.warn(error)
      })
  })
}

export const formSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT1: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 8,
        labelAlign: 'left',
      },
      properties: {
        cooperateType: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.hezuoleixing' }),
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.qingxuanzehezuoleixing' }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingxuanzehezuoleixing' }),
            },
          ],
        },
        code: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.wuliugongsidaimaping' }),
          visible: false,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.wuliugongsidaima' }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshuruwuliugongsidai' }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        companyMemberId: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.wuliugongsidaimaping' }),
          visible: false,
          'x-component-props': {
            disabled: true,
            addonAfter: '{{connectMember}}',
            placeholder: intl.formatMessage({ id: 'logistics.pingtaihuiyuanID' }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingxuanzepingtaihuiyuanID' }),
            },
          ],
        },
        name: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.wuliugongsimingcheng' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.zuichang60gezifu30ge' }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshuruwuliugongsiming' }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        remark: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.beizhu' }),
          'x-component': 'TextArea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.zuichang60gezifu30ge' }),
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
      },
    },
  },
}

export const logisticsSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.huiyuanmingcheng' }),
            align: 'flex-left',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
        },
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            roleId: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'logistics.xuanzehuiyuanjuese' }),
                fetchSearch: fetchData,
                style: {
                  width: 160,
                },
              },
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'logistics.chaxun' }),
          },
        },
      },
    },
  },
}

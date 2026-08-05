import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getLogisticsSelectListMemberCompanyQuery } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const fetchData = () => {
  return new Promise((resolve) => {
    getLogisticsSelectListMemberCompanyQuery()
      .then((res: any) => {
        resolve({
          data: res.data.map((item: any) => {
            return {
              name: item.name,
              state: item.id,
            }
          }),
        })
      })
      .catch((error) => {
        console.warn(error)
      })
  })
}

/** 快递单查询 */
export const LOGISTICSBILLQUERYSCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        logisticsOrderNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.wuliudanhao' }),
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
          //改变间隔
          marginRight: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
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
            companyId: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'logistics.wuliufuwushang' }),
                fetchSearch: fetchData,
                style: {
                  width: 160,
                },
              },
            },
            status: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'logistics.waibuzhuangtai' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            '[invoicesTimeStart,invoicesTimeEnd]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'logistics.kaishishijian' }),
                  intl.formatMessage({ id: 'logistics.jieshushijian' }),
                ],
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

/** 待提交物流单 */
export const WAITSBUMITLOGISTICSBILLSCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'controllerBtns',
        },
        logisticsOrderNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.wuliudanhao' }),
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
        },
        colStyle: {
          marginLeft: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
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
            relevanceOrderCode: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'logistics.duiyingdingdanhao' }),
              },
            },
            companyId: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'logistics.wuliufuwushang' }),
                className: 'fixed-ant-selected-down',
                fetchSearch: fetchData,
                style: {
                  width: 160,
                },
              },
            },
            status: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'logistics.waibuzhuangtai' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            '[invoicesTimeStart,invoicesTimeEnd]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'logistics.kaishishijian' }),
                  intl.formatMessage({ id: 'logistics.jieshushijian' }),
                ],
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

/** 外部状态颜色 */
export const EXTERNALSTATE_COLOR = (text) => {
  switch (Number(text)) {
    case 1:
    case 2:
      return 'processing'
    case 3:
      return 'error'
    case 4:
      return 'success'
    default:
      return 'default'
  }
}

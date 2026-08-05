import type { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const purchaseSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        requisitionNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.common.query.applyNo.placeholder',
              defaultMessage: '搜索',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'afterService.common.query.requisitionNo.tip',
              defaultMessage: '输入 请购单号 进行搜索',
            }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            applyAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.common.query.applyAbstract.placeholder',
                  defaultMessage: '申请单摘要',
                }),
                allowClear: true,
              },
            },
            consumerName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.common.query.consumerName.placeholder',
                  defaultMessage: '采购会员',
                }),
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'afterService.common.query.date.placeholder',
                  defaultMessage: '单据时间(全部)',
                }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'afterService.common.query.submit', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}

export const PurchaseContractListSchema: any = {
  type: 'object',
  properties: {
    requisitionNo: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder:
          intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.number' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        // inline: true,
        colStyle: {
          marginRight: 20,
        },

        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 10,
          },
        },
      },
      properties: {
        digest: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.digest' }),
          },
        },
        vendorMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.member' }),
          },
        },
        '[startDate,endDate]': {
          type: 'daterange',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'contract.qingshuru' }),
              intl.formatMessage({ id: 'contract.jieshushijian' }),
            ],
          },
        },
        department: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) +
              intl.formatMessage({ id: 'contract.purchase.department' }),
          },
        },
        requisitioner: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.purchase.people' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'contract.chaxun' }),
          },
        },
      },
    },
  },
}

export const MaterialListSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder:
          intl.formatMessage({ id: 'contract.qingshuru' }) +
          intl.formatMessage({ id: 'contract.purchase.materialNumber' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        // inline: true,
        colStyle: {
          marginRight: 20,
        },

        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 10,
          },
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.wuliaomingcheng' }),
          },
        },
        type: {
          type: 'string',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.guigexinghao' }),
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'CustomCategorySearch',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.pinlei' }),
            showSearch: true,
            notFoundContent: null,
            // style: { width: '145px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder:
              intl.formatMessage({ id: 'contract.qingshuru' }) + intl.formatMessage({ id: 'contract.pinpai' }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            // style: { width: '145px' },
            searchValue: null,
            dataoption: [],
          },
        },

        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'contract.chaxun' }),
          },
        },
      },
    },
  },
}

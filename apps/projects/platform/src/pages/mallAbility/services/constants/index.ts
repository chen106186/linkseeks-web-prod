import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
/**
 * 商城环境选项
 * 适用环境: 0.全部 1.WEB 2.H5 3.小程序 4.APP
 */
export const ENVIRONMENT_OPTIONS = [
  {
    key: '0',
    label: intl.formatMessage({
      id: 'mall.environment.all',
      defaultMessage: '全部',
    }),
  },
  {
    key: '1',
    label: 'WEB',
  },
  {
    key: '2',
    label: 'H5',
  },
  {
    key: '3',
    label: intl.formatMessage({
      id: 'mall.environment.mini.programe',
      defaultMessage: '小程序',
    }),
  },
  {
    key: '4',
    label: 'APP',
  },
]

export const MALL_STATUS_TYPE = {
  default: {
    name: intl.formatMessage({
      id: 'common.button.default',
      defaultMessage: '默认',
    }),
    background: '#EBF9F6',
    color: '#00A98F',
  },
  deactivate: {
    name: intl.formatMessage({
      id: 'shop.template.btn.stop',
      defaultMessage: '停用',
    }),
    background: '#F5F6F7',
    color: '#5C626A',
  },
}

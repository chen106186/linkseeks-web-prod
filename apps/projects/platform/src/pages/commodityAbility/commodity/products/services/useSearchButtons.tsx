import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useControl } from './useControl'
import { useProduct } from './context'
import { useWebIntl } from '@apps/locales'

export const useSearchButtons = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { handleMenuClick } = useControl()
  const { setImportModal } = useProduct()

  const searchButtons = [
    {
      children: intl.formatMessage({ id: 'commodity.products.controllerBtns.button.1' }),
      type: 'primary',
      icon: 'add',
      key: 'add',
      onClick: () => history.push('/commodityAbility/commodity/products/add'),
    },
    {
      children: translate('web.resource.commodity.daorushangpin'),
      onClick: () => setImportModal(true),
    },
    {
      children: translate('web.resource.commodity.daorushangyou'),
      more: true,
      onClick: () => handleMenuClick({ key: '0' }),
    },
    {
      children: intl.formatMessage({ id: 'commodity.products.modal.title.1' }),
      more: true,
      onClick: () => handleMenuClick({ key: '2' }),
    },
    {
      children: intl.formatMessage({ id: 'commodity.products.menuMore.2' }),
      more: true,
      onClick: () => handleMenuClick({ key: '3' }),
    },
    {
      children: intl.formatMessage({ id: 'commodity.products.menuMore.3' }),
      more: true,
      onClick: () => handleMenuClick({ key: '4' }),
    },
    {
      children: intl.formatMessage({ id: 'commodity.products.menuMore.4' }),
      more: true,
      onClick: () => handleMenuClick({ key: '1' }),
    },
    {
      children: translate('web.resource.commodity.piliangshenhe'),
      more: true,
      onClick: () => handleMenuClick({ key: '9' }),
    },
    {
      children: translate('web.resource.commodity.daochushanpinerweima'),
      more: true,
      onClick: () => handleMenuClick({ key: '5' }),
    },
    {
      children: intl.formatMessage({ id: 'commodity.products.menuMore.6' }),
      more: true,
      onClick: () => handleMenuClick({ key: '6' }),
    },
    // {
    //   children: translate("web.resource.commodity.daochuquanbu"),
    //   more: true,
    //   onClick: () => handleMenuClick({ key: '8' }),
    // },
  ]

  return {
    searchButtons,
  }
}

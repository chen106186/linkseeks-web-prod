/**
 * @Description 获取加入进货单/购物车名称 hook
 */
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'

const useJmpHome = () => {
  const { userStore } = useStores()
  const { shopAndSite } = userStore

  const intl = useIntl()

  const is2B = shopAndSite?.property === 1
  const is2C = shopAndSite?.property === 2

  const getCartAddName = () => {
    // if (is2C) {
    //   return intl.formatMessage({ id: 'cart.2C.add', defaultMessage: '加入购物车' })
    // }
    // if (is2B) {
    //   return intl.formatMessage({ id: 'cart.2B.add', defaultMessage: '加入进货单' })
    // }
    // return ''
    // 暂时默认全部是加入购物车
    return intl.formatMessage({ id: 'cart.2C.add', defaultMessage: '加入购物车' })
  }

  const getCartType = () => {
    // if (is2C) {
    //   return intl.formatMessage({ id: 'cart.2C', defaultMessage: '购物车' })
    // }
    // if (is2B) {
    //   return intl.formatMessage({ id: 'cart.2B', defaultMessage: '购物车' })
    // }
    return intl.formatMessage({ id: 'cart.2C', defaultMessage: '购物车' })
  }

  return {
    is2B,
    is2C,
    cartAddName: getCartAddName(),
    cartType: getCartType(),
  }
}

export default useJmpHome

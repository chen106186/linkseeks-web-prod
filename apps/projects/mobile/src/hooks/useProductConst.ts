import { useIntl } from '@linkseeks/i18n'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'

const useProductConst = () => {
  const intl = useIntl()
  /**
   * 配送方式文本
   */
  const DELIVERY_TYPE_TEXT: { [key: number]: string } = {
    [DELIVERY_TYPE_ENUM.LOGISTICS]: intl.formatMessage({
      id: 'consts.product.DELIVERY_TYPE_LOGISTICS',
      defaultMessage: '物流',
    }),
    [DELIVERY_TYPE_ENUM.SELF_PICKUP]: intl.formatMessage({
      id: 'consts.product.DELIVERY_TYPE_SELF_PICKUP',
      defaultMessage: '自提',
    }),
    [DELIVERY_TYPE_ENUM.NO_DELIVERY]: intl.formatMessage({
      id: 'consts.product.DELIVERY_TYPE_NO_DELIVERY',
      defaultMessage: '无须配送',
    }),
    [DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF]: intl.formatMessage({
      id: 'consts.product.DELIVERY_TYPE_LOGISTICS_AND_SELF',
      defaultMessage: '物流+自提',
    }),
  }

  /**
   * 配送方式文本_2
   */
  const DELIVERY_TYPE_TEXT_2: { [key: number]: string } = {
    [DELIVERY_TYPE_ENUM.LOGISTICS]: intl.formatMessage({
      id: 'consts.product.DELIVERY_TYPE_LOGISTICS2',
      defaultMessage: '自行寄回',
    }),
    [DELIVERY_TYPE_ENUM.SELF_PICKUP]: intl.formatMessage({
      id: 'consts.product.DELIVERY_TYPE_SELF_PICKUP2',
      defaultMessage: '上门取货',
    }),
    [DELIVERY_TYPE_ENUM.NO_DELIVERY]: intl.formatMessage({
      id: 'consts.product.DELIVERY_TYPE_NO_DELIVERY2',
      defaultMessage: '无须配送',
    }),
  }

  return {
    DELIVERY_TYPE_TEXT,
    DELIVERY_TYPE_TEXT_2,
  }
}

export default useProductConst

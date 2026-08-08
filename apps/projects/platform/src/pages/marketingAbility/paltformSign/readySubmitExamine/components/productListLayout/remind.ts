import { getIntl } from '@linkseeks/i18n'

export type RemindLayoutProps = {
  /** name */
  name?: string
  /** 商品类型 */
  value?: number
  /** 区分选择商品的类型 */
  type?: string
  /** 弹窗标题 */
  modalTitle?: string
  /** 选择商品按钮名称 */
  buttonTitle?: string
  /** 列表标题 */
  listTitle?: string
  /** 列表label */
  label?: { [key: number]: string }
  /** 提醒 */
  message?: { [key: number]: string }
}
export const remindLayout = (int, giveType?, giftType?) => {
  console.log(int, giveType, giftType, 'int, giveType?, giftType?')
  const intl = getIntl()
  const give =
    giveType === 1
      ? `${intl.formatMessage({ id: 'paltformSign.top-up' })}`
      : `${intl.formatMessage({ id: 'paltformSign.BuyGoods' })}`
  const gift =
    giftType === 1
      ? `${intl.formatMessage({ id: 'paltformSign.goods' })}`
      : `${intl.formatMessage({ id: 'paltformSign.coupon' })}`
  switch (int) {
    case 6:
      return {
        name: 'giveValue',
        value: giftType,
        type: 'limitValue',
        modalTitle: intl.formatMessage({
          id: 'paltformSign.MANE_ZENG',
          defaultMessage: `设置赠品-${give}赠${gift}`,
          data1: give,
          data2: gift,
        }),
        buttonTitle: intl.formatMessage({
          id: 'paltformSign.MANE_ZENG1',
          defaultMessage: `添加赠送${gift}`,
          data: gift,
        }),
        listTitle: `${give}${intl.formatMessage({ id: 'marketingAbility.zeng' })}${gift}`,
        label: {
          1: `${intl.formatMessage({ id: 'paltformSign.preferentialThreshold' })}`,
          2:
            giveType === 1
              ? `${intl.formatMessage({ id: 'paltformSign.yuan' })}`
              : `${intl.formatMessage({ id: 'paltformSign.a' })}`,
          3:
            giftType === 1
              ? `${intl.formatMessage({ id: 'paltformSign.freeGoods' })}`
              : `${intl.formatMessage({ id: 'paltformSign.coupons' })}`,
          4: `${intl.formatMessage({ id: 'paltformSign.giveTheNumber' })}`,
          5: `${intl.formatMessage({ id: 'paltformSign.buy' })}`,
          6: '',
        },
        message: {
          1:
            giveType === 1
              ? `${intl.formatMessage({ id: 'paltformSign.pleaseSelectACommodity' })}`
              : `${intl.formatMessage({ id: 'paltformSign.pleaseSelectTheCoupons' })}`,
          2:
            giveType === 1
              ? `${intl.formatMessage({ id: 'paltformSign.pleaseSetTheGoods' })}`
              : `${intl.formatMessage({ id: 'paltformSign.pleaseSetTheCoupons' })}`,
          3:
            giveType === 1
              ? `${intl.formatMessage({ id: 'paltformSign.pleaseSelectACommodity' })}`
              : `${intl.formatMessage({ id: 'paltformSign.pleaseSelectTheCoupons' })}`,
          4: `${intl.formatMessage({ id: 'paltformSign.pleaseEnterADiscountThreshold' })}`,
          5: `${intl.formatMessage({ id: 'paltformSign.pleaseEnterANumber' })}`,
        },
      }
    case 13: {
      return {
        name: 'swapValue',
        value: 1,
        type: 'limitValue',
        modalTitle: intl.formatMessage({
          id: 'paltformSign.FULL_EXCHANGE',
          defaultMessage: `设置换购商品-${give}换购商品`,
          data: give,
        }),
        buttonTitle: `${intl.formatMessage({ id: 'paltformSign.addBuyGoods' })}`,
        listTitle: intl.formatMessage({
          id: 'paltformSign.FULL_EXCHANGE1',
          defaultMessage: `${give}换购商品`,
          data: give,
        }),
        label: {
          1: `${intl.formatMessage({ id: 'paltformSign.redemptionThreshold' })}`,
          2:
            giveType === 1
              ? `${intl.formatMessage({ id: 'paltformSign.yuan' })}`
              : `${intl.formatMessage({ id: 'paltformSign.a' })}`,
          3: `${intl.formatMessage({ id: 'paltformSign.buyGoods' })}`,
          4: `${intl.formatMessage({ id: 'paltformSign.buyTheNumber' })}`,
          5: intl.formatMessage({ id: 'paltformSign.fill' }),
          6: `${intl.formatMessage({ id: 'paltformSign.buyTheUnitPrice' })}`,
        },
        message: {
          1: `${intl.formatMessage({ id: 'paltformSign.pleaseChooseToBuyGoods' })}`,
          2: `${intl.formatMessage({ id: 'paltformSign.pleaseSetUpForGoods' })}`,
          3: `${intl.formatMessage({ id: 'paltformSign.pleaseChooseToBuyGoods' })}`,
          4: `${intl.formatMessage({ id: 'paltformSign.pleaseEnterTheRedemptionThreshold' })}`,
          5: `${intl.formatMessage({ id: 'paltformSign.pleaseNumber' })}`,
        },
      }
    }
    case 15:
      return {
        name: 'groupValue',
        value: 1,
        type: 'groupPrice',
        modalTitle: `${intl.formatMessage({ id: 'paltformSign.setTheCollocationOfGoods' })}`,
        buttonTitle: `${intl.formatMessage({ id: 'paltformSign.chooseGoods' })}`,
        listTitle: `${intl.formatMessage({ id: 'paltformSign.packageIsTie-inMerchandise' })}`,
        label: {
          1: `${intl.formatMessage({ id: 'paltformSign.packagePrice' })}`,
          2: `${intl.formatMessage({ id: 'paltformSign.yuan' })}`,
          3: `${intl.formatMessage({ id: 'paltformSign.withGoods' })}`,
          4: `${intl.formatMessage({ id: 'paltformSign.matchTheNumberOf' })}`,
          5: '',
          6: '',
        },
        message: {
          1: `${intl.formatMessage({ id: 'paltformSign.pleaseSelectAMatchGoods' })}`,
          2: `${intl.formatMessage({ id: 'paltformSign.pleaseSetTheMatchGoods' })}`,
          3: `${intl.formatMessage({ id: 'paltformSign.pleaseSelectAMatchGoods' })}`,
          4: `${intl.formatMessage({ id: 'paltformSign.pleaseEnterThePackagePrice' })}`,
          5: `${intl.formatMessage({ id: 'paltformSign.pleaseNumberCollocation' })}`,
        },
      }
  }
}

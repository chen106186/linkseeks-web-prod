import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Space, Tooltip } from 'antd'
import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/** * 活动类型 */
export enum ACTIVITYTYPE {
  /** 特价促销 */
  SALE = 1,
  /** 直降促销 */
  DOWNSALE,
  /** ${intl.formatMessage({ id: 'paltformSign.foldMoney' })}扣促销 */
  DISCOUNT,
  /** 满量促销 */
  FULLCAPACITY,
  /** 满额促销 */
  FULFILTHEQUOTA,
  /** 赠送促销 */
  PRESENTED,
  /** 多件促销 */
  EXCESSIVEPARTS,
  /** 组合促销 */
  GROUPS,
  /** 拼团 */
  TOURDIY,
  /** 抽奖 */
  LOTTERY,
  /** 砍价 */
  BARGAIN,
  /** 秒杀 */
  SECKILL,
  /** 换购 */
  GIFT,
  /** 预售 */
  PRESELL,
  /** 套餐 */
  SETMEAL,
  /** 试用 */
  TRYOUT,
}
/** 活动类型文字 */
export const ACTIVITYTYPENAME = {
  1: `${intl.formatMessage({ id: 'paltformSign.noSales' })}`,
  2: `${intl.formatMessage({ id: 'paltformSign.straightDownThePromotion' })}`,
  3: `${intl.formatMessage({ id: 'paltformSigniscountSalesPromotion' })}`,
  4: `${intl.formatMessage({ id: 'paltformSign.fullAmountOfThePromotion' })}`,
  5: `${intl.formatMessage({ id: 'paltformSign.quotaPromotion' })}`,
  6: `${intl.formatMessage({ id: 'paltformSign.giftPromotion' })}`,
  7: `${intl.formatMessage({ id: 'paltformSign.moreThanAPromotion' })}`,
  8: `${intl.formatMessage({ id: 'paltformSign.combinationOfPromotion' })}`,
  9: `${intl.formatMessage({ id: 'paltformSign.spellGroup' })}`,
  10: `${intl.formatMessage({ id: 'paltformSign.luckyDraw' })}`,
  11: `${intl.formatMessage({ id: 'paltformSign.bargaining' })}`,
  12: `${intl.formatMessage({ id: 'paltformSign.secondsKill' })}`,
  13: `${intl.formatMessage({ id: 'paltformSign.buy' })}`,
  14: `${intl.formatMessage({ id: 'paltformSign.openToBooking' })}`,
  15: `${intl.formatMessage({ id: 'paltformSign.package' })}`,
  16: `${intl.formatMessage({ id: 'paltformSign.theTrial' })}`,
}
const lotteryNumType = {
  1: `${intl.formatMessage({ id: 'paltformSignaily' })}`,
  2: `${intl.formatMessage({ id: 'paltformSign.onceAWeek' })}`,
  3: `${intl.formatMessage({ id: 'paltformSign.aMonth' })}`,
  4: `${intl.formatMessage({ id: 'paltformSign.thePeriodOfActivity' })}`,
}
/** 活动类型 */
export const GeneralEffect = (int, data) => {
  switch (Number(int)) {
    case 1:
    case 2:
    case 3:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {data.allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'paltformSign.theOriginalPriceToBuy' })}`
                  : `${intl.formatMessage({ id: 'paltformSign.notBuy' })}`,
            },
          ],
        },
      ]
    case 4:
    case 5:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.fill' })}${
                int === 4
                  ? `${intl.formatMessage({ id: 'paltformSign.theAmount' })}`
                  : `${intl.formatMessage({ id: 'paltformSign.theForehead' })}`
              }${intl.formatMessage({ id: 'paltformSign.saleType' })}`,
              extra: (
                <>
                  {int === 4 && data.type === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.fullAmountMinus' })} />
                  )}
                  {int === 4 && data.type === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.fullAmount' })} />
                  )}
                  {int === 5 && data.type === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.quotaReduction' })} />
                  )}
                  {int === 5 && data.type === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.fullFold' })} />
                  )}
                </>
              ),
            },
            {
              label: (
                <>
                  {int === 4 && data.type === 1 && `${intl.formatMessage({ id: 'paltformSign.fullAmountMinus' })}`}
                  {int === 4 && data.type === 2 && `${intl.formatMessage({ id: 'paltformSign.fullAmount' })}`}
                  {int === 5 && data.type === 1 && `${intl.formatMessage({ id: 'paltformSign.quotaReduction' })}`}
                  {int === 5 && data.type === 2 && `${intl.formatMessage({ id: 'paltformSign.fullFold' })}`}
                </>
              ),
              extra: (
                <>
                  {int === 4 && data.type === 1 && (
                    <Space direction="vertical">
                      {data.ladderBOList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'paltformSign.fill' })} ${item.key} ${intl.formatMessage({
                          id: 'paltformSign.indivual',
                        })}, ${intl.formatMessage({ id: 'paltformSign.reduce' })} ${Number(item.value).toFixed(
                          2,
                        )} ${intl.formatMessage({ id: 'paltformSign.yuan' })}`}</div>
                      ))}
                    </Space>
                  )}
                  {int === 4 && data.type === 2 && (
                    <Space direction="vertical">
                      {data.ladderBOList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'paltformSign.fill' })} ${item.key} ${intl.formatMessage({
                          id: 'paltformSign.indivual',
                        })}, ${intl.formatMessage({ id: 'paltformSign.give' })} ${item.value} ${intl.formatMessage({
                          id: 'paltformSign.foldMoney',
                        })}`}</div>
                      ))}
                    </Space>
                  )}
                  {int === 5 && data.type === 1 && (
                    <Space direction="vertical">
                      {data.ladderBOList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'paltformSign.fill' })} ${Number(item.key).toFixed(
                          2,
                        )} ${intl.formatMessage({ id: 'paltformSign.yuan' })}, ${intl.formatMessage({
                          id: 'paltformSign.reduce',
                        })} ${Number(item.value).toFixed(2)} ${intl.formatMessage({ id: 'paltformSign.yuan' })}`}</div>
                      ))}
                    </Space>
                  )}
                  {int === 5 && data.type === 2 && (
                    <Space direction="vertical">
                      {data.ladderBOList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'paltformSign.fill' })} ${Number(item.key).toFixed(
                          2,
                        )} ${intl.formatMessage({ id: 'paltformSign.yuan' })}, ${intl.formatMessage({
                          id: 'paltformSign.give',
                        })} ${item.value} ${intl.formatMessage({ id: 'paltformSign.foldMoney' })}`}</div>
                      ))}
                    </Space>
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {data.allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({
                      id: 'paltformSign.accordingToTheIndividualPurchaseEnjoyTheHighestDiscount',
                    })}`
                  : `${intl.formatMessage({ id: 'paltformSign.notBuy' })}`,
            },
          ],
        },
      ]
    case 6:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.giftPromotionType' })}`,
              extra: (
                <>
                  {data.giveType === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.giveFull' })} />
                  )}
                  {data.giveType === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.buyGoodsGive' })} />
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {data.allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.giftType' })}`,
              extra: (
                <>
                  {data.giftType === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.sendGoods' })} />
                  )}
                  {data.giftType === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.aGiftCoupon' })} />
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({
                      id: 'paltformSign.accordingToTheIndividualPurchaseEnjoyTheHighestDiscount',
                    })}`
                  : `${intl.formatMessage({ id: 'paltformSign.notBuy' })}`,
            },
          ],
        },
      ]
    case 7:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.preferentialRules' })}`,
              extra: (
                <Space direction="vertical">
                  {data.ladderBOList.map((item) => (
                    <div>{`${intl.formatMessage({ id: 'paltformSign.fill' })} ${item.discount} ${intl.formatMessage({
                      id: 'paltformSign.jian',
                    })}, ${intl.formatMessage({ id: 'paltformSign.give' })} ${item.num} ${intl.formatMessage({
                      id: 'paltformSign.foldMoney',
                    })}`}</div>
                  ))}
                </Space>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {data.allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({
                      id: 'paltformSign.accordingToTheIndividualPurchaseEnjoyTheHighestDiscount',
                    })}`
                  : `${intl.formatMessage({ id: 'paltformSign.notBuy' })}`,
            },
          ],
        },
      ]
    case 8:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.preferentialRules' })}`,
              extra: `${intl.formatMessage({ id: 'paltformSign.Optional' })} ${data.num} ${intl.formatMessage({
                id: 'paltformSign.jian',
              })}, ${intl.formatMessage({ id: 'paltformSign.pay' })} ${data.price} ${intl.formatMessage({
                id: 'paltformSign.yuan',
              })}`,
            },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {data.allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'paltformSign.theOriginalPriceToBuy' })}`
                  : `${intl.formatMessage({ id: 'paltformSign.notBuy' })}`,
            },
          ],
        },
      ]
    case 9:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.theNumberOfClusters' })}`,
              extra: `${data.assembleNum} 人`,
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.cloudsOfTime' })}`,
              extra: data.assembleTime
                ? formatTimeString(data.assembleTime, 'YYYY-MM-DD HH:mm')
                : `${intl.formatMessage({ id: 'paltformSig.nontLimit' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.userTuxedoLimit' })}`,
              extra: data.joinAssembleNum
                ? `${data.joinAssembleNum} ${intl.formatMessage({ id: 'paltformSign.times' })}`
                : `${intl.formatMessage({ id: 'paltformSig.nontLimit' })}`,
            },
          ],
        },
      ]
    case 10:
      return [
        {
          col: [
            { label: `${intl.formatMessage({ id: 'paltformSignrawType' })}`, extra: '' },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.lotteryNumber' })}`,
              extra: `${lotteryNumType[data.lotteryNumType]}限制${data.lotteryNum}${intl.formatMessage({
                id: 'paltformSign.times',
              })}`,
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
      ]
    case 11:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.everyTimeTheAmountOfBargaining' })}`,
              extra: (
                <>
                  {data.type === 1 && (
                    <Space direction="vertical">
                      <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.aRandomAmount' })} />
                      <div>{`${intl.formatMessage({ id: 'paltformSign.RandomAmountRange' })}${Number(
                        data.randomStartPrice,
                      ).toFixed(2)} ${intl.formatMessage({ id: 'paltformSign.yuan' })} ～ ${Number(
                        data.randomEndPrice,
                      ).toFixed(2)} ${intl.formatMessage({ id: 'paltformSign.yuan' })}`}</div>
                    </Space>
                  )}
                  {data.type === 2 && (
                    <Space direction="vertical">
                      <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.fixedAmount' })} />
                      <div>{`${intl.formatMessage({ id: 'paltformSign.every' })}${intl.formatMessage({
                        id: 'paltformSign.times',
                      })}${intl.formatMessage({ id: 'paltformSign.Bargaining' })}${Number(data.restrictPrice).toFixed(
                        2,
                      )} ${intl.formatMessage({ id: 'paltformSign.yuan' })}`}</div>
                    </Space>
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.userLimitNumberOf' })}`,
              extra: `${intl.formatMessage({ id: 'paltformSign.SameUserLimit' })} ${
                data.restrictNum
              } ${intl.formatMessage({ id: 'paltformSign.times' })}`,
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
      ]
    case 12:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSignailySecondsToKillTime' })}`,
              extra: (
                <>
                  {formatTimeString(data.startTime, 'HH:mm:ss')}~{formatTimeString(data.endTime, 'HH:mm:ss')}
                </>
              ),
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'paltformSign.theOriginalPriceToBuy' })}`
                  : `${intl.formatMessage({ id: 'paltformSign.notBuy' })}`,
            },
          ],
        },
      ]
    case 13:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.buyType' })}`,
              extra: (
                <>
                  {data.swapType === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.fullRedemption' })} />
                  )}
                  {data.swapType === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'paltformSign.buyGoods' })} />
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'paltformSign.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {data.allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({
                      id: 'paltformSign.accordingToTheIndividualPurchaseEnjoyTheHighestDiscount',
                    })}`
                  : `${intl.formatMessage({ id: 'paltformSign.notBuy' })}`,
            },
          ],
        },
      ]
    case 14:
      return [
        {
          col: [
            { label: `${intl.formatMessage({ id: 'paltformSign.theDepositPaymentTime' })}`, extra: '' },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [{ label: `${intl.formatMessage({ id: 'paltformSign.balancePaymentPaymentTime' })}`, extra: '' }],
        },
        {
          col: [{ label: `${intl.formatMessage({ id: 'paltformSign.startTheDeliveryTime' })}`, extra: '' }],
        },
      ]
    case 15:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'paltformSign.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'paltformSign.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'paltformSign.notAllowTheStack' })}`,
            },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
      ]
    case 16:
      return [
        {
          col: [
            { label: `${intl.formatMessage({ id: 'paltformSign.extractingUserTime' })}`, extra: '' },
            { label: `${intl.formatMessage({ id: 'paltformSign.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [{ label: `${intl.formatMessage({ id: 'paltformSign.endOfTheTrialTime' })}`, extra: '' }],
        },
      ]
  }
}

/** 活动商品columns */
export const Columns = (int) => {
  switch (Number(int)) {
    case 1:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: '',
          dataIndex: '',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
        },
        {
          title: (
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'paltformSign.activityPriceSaidMallDirectlyToTheCommoditiesPriceToSell',
              })}
            >
              {intl.formatMessage({ id: 'paltformSign.activityPrice' })}
              <QuestionCircleOutlined />
            </Tooltip>
          ),
          key: 'activityPrice',
          dataIndex: 'activityPrice',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
        },
      ]
  }
}

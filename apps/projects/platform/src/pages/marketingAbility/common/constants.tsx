import React from 'react'
import { Space, Tooltip, Typography } from 'antd'
import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/** * 活动类型 */
export enum ACTIVITYTYPE {
  /** 特价促销 */
  SALE = 1,
  /** 直降促销 */
  DOWNSALE,
  /** ${intl.formatMessage({ id: 'marketingAbility.zhe' })}扣促销 */
  DISCOUNT,
  /** ${intl.formatMessage({ id: 'marketingAbility.man' })}量促销 */
  FULLCAPACITY,
  /** ${intl.formatMessage({ id: 'marketingAbility.man' })}额促销 */
  FULFILTHEQUOTA,
  /** 赠送促销 */
  PRESENTED,
  /** 多${intl.formatMessage({ id: 'marketingAbility.jian' })}促销 */
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
  1: `${intl.formatMessage({ id: 'marketingAbility.noSales' })}`,
  2: `${intl.formatMessage({ id: 'marketingAbility.straightDownThePromotion' })}`,
  3: `${intl.formatMessage({ id: 'marketingAbility.discountSalesPromotion' })}`,
  4: `${intl.formatMessage({ id: 'marketingAbility.fullAmountOfThePromotion' })}`,
  5: `${intl.formatMessage({ id: 'marketingAbility.quotaPromotion' })}`,
  6: `${intl.formatMessage({ id: 'marketingAbility.giftPromotion' })}`,
  7: `${intl.formatMessage({ id: 'marketingAbility.moreThanAPromotion' })}`,
  8: `${intl.formatMessage({ id: 'marketingAbility.combinationOfPromotion' })}`,
  9: `${intl.formatMessage({ id: 'marketingAbility.spellGroup' })}`,
  10: `${intl.formatMessage({ id: 'marketingAbility.luckyDraw' })}`,
  11: `${intl.formatMessage({ id: 'marketingAbility.bargaining' })}`,
  12: `${intl.formatMessage({ id: 'marketingAbility.secondsKill' })}`,
  13: `${intl.formatMessage({ id: 'marketingAbility.buy' })}`,
  14: `${intl.formatMessage({ id: 'marketingAbility.openToBooking' })}`,
  15: `${intl.formatMessage({ id: 'marketingAbility.package' })}`,
  16: `${intl.formatMessage({ id: 'marketingAbility.theTrial' })}`,
}
const lotteryNumType = {
  1: `${intl.formatMessage({ id: 'marketingAbility.daily' })}`,
  2: `${intl.formatMessage({ id: 'marketingAbility.onceAWeek' })}`,
  3: `${intl.formatMessage({ id: 'marketingAbility.aMonth' })}`,
  4: `${intl.formatMessage({ id: 'marketingAbility.thePeriodOfActivity' })}`,
}
/** 活动类型 */
export const GeneralEffect = (int, data) => {
  const allowActivity = data?.allowActivity ? data.allowActivity : []
  switch (Number(int)) {
    case 1:
    case 2:
    case 3:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'marketingAbility.theOriginalPriceToBuy' })}`
                  : `${intl.formatMessage({ id: 'marketingAbility.doNotBuy' })}`,
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
              label: `${intl.formatMessage({ id: 'marketingAbility.man' })}${
                int === 4
                  ? intl.formatMessage({ id: 'marketingAbility.theAmount' })
                  : intl.formatMessage({ id: 'marketingAbility.theForehead' })
              }${intl.formatMessage({ id: 'marketingAbility.cuxiaoleixing' })}`,
              extra: (
                <>
                  {int === 4 && data.type === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.fullAmountMinus' })} />
                  )}
                  {int === 4 && data.type === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.fullAmount' })} />
                  )}
                  {int === 5 && data.type === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.quotaReduction' })} />
                  )}
                  {int === 5 && data.type === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.fullFold' })} />
                  )}
                </>
              ),
            },
            {
              label: (
                <>
                  {int === 4 && data.type === 1 && `${intl.formatMessage({ id: 'marketingAbility.fullAmountMinus' })}`}
                  {int === 4 && data.type === 2 && `${intl.formatMessage({ id: 'marketingAbility.fullAmount' })}`}
                  {int === 5 && data.type === 1 && `${intl.formatMessage({ id: 'marketingAbility.quotaReduction' })}`}
                  {int === 5 && data.type === 2 && `${intl.formatMessage({ id: 'marketingAbility.fullFold' })}`}
                </>
              ),
              extra: (
                <>
                  {int === 4 && data.type === 1 && (
                    <Space direction="vertical">
                      {data.ladderList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'marketingAbility.man' })} ${item.key} ${intl.formatMessage({
                          id: 'marketingAbility.ge',
                        })}, ${intl.formatMessage({ id: 'marketingAbility.jiandelete' })} ${Number(item.value).toFixed(
                          2,
                        )} ${intl.formatMessage({ id: 'marketingAbility.yuan' })}`}</div>
                      ))}
                    </Space>
                  )}
                  {int === 4 && data.type === 2 && (
                    <Space direction="vertical">
                      {data.ladderList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'marketingAbility.man' })} ${item.key} ${intl.formatMessage({
                          id: 'marketingAbility.ge',
                        })}, ${intl.formatMessage({ id: 'marketingAbility.da' })} ${
                          item.value / 10
                        } ${intl.formatMessage({ id: 'marketingAbility.zhe' })}`}</div>
                      ))}
                    </Space>
                  )}
                  {int === 5 && data.type === 1 && (
                    <Space direction="vertical">
                      {data.ladderList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'marketingAbility.man' })} ${Number(item.key).toFixed(
                          2,
                        )} ${intl.formatMessage({ id: 'marketingAbility.yuan' })}, ${intl.formatMessage({
                          id: 'marketingAbility.jiandelete',
                        })} ${Number(item.value).toFixed(2)} ${intl.formatMessage({
                          id: 'marketingAbility.yuan',
                        })}`}</div>
                      ))}
                    </Space>
                  )}
                  {int === 5 && data.type === 2 && (
                    <Space direction="vertical">
                      {data.ladderList.map((item) => (
                        <div>{`${intl.formatMessage({ id: 'marketingAbility.man' })} ${Number(item.key).toFixed(
                          2,
                        )} ${intl.formatMessage({ id: 'marketingAbility.yuan' })}, ${intl.formatMessage({
                          id: 'marketingAbility.da',
                        })} ${item.value / 10} ${intl.formatMessage({ id: 'marketingAbility.zhe' })}`}</div>
                      ))}
                    </Space>
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'marketingAbility.accordingIndividualPurchaseHighestDiscount' })}`
                  : `${intl.formatMessage({ id: 'marketingAbility.doNotBuy' })}`,
            },
          ],
        },
      ]
    case 6:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.giftPromotionType' })}`,
              extra: (
                <>
                  {data.giveType === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.giveFull' })} />
                  )}
                  {data.giveType === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.buyGoodsGive' })} />
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.giftType' })}`,
              extra: (
                <>
                  {data.giftType === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.sendGoods' })} />
                  )}
                  {data.giftType === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.aGiftCoupon' })} />
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'marketingAbility.accordingIndividualPurchaseHighestDiscount' })}`
                  : `${intl.formatMessage({ id: 'marketingAbility.doNotBuy' })}`,
            },
          ],
        },
      ]
    case 7:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.preferentialRules' })}`,
              extra: (
                <Space direction="vertical">
                  {!isEmpty(data.ladderList) &&
                    data.ladderList.map((item) => (
                      <div>{`${intl.formatMessage({ id: 'selfManagement.di' })} ${item.num} ${intl.formatMessage({
                        id: 'marketingAbility.jian',
                      })}, ${intl.formatMessage({ id: 'marketingAbility.da' })} ${
                        item.discount / 10
                      } ${intl.formatMessage({ id: 'marketingAbility.zhe' })}`}</div>
                    ))}
                </Space>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'marketingAbility.accordingIndividualPurchaseHighestDiscount' })}`
                  : `${intl.formatMessage({ id: 'marketingAbility.doNotBuy' })}`,
            },
          ],
        },
      ]
    case 8:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.preferentialRules' })}`,
              extra: `${intl.formatMessage({ id: 'marketingAbility.renxuan' })} ${data.num} ${intl.formatMessage({
                id: 'marketingAbility.jian',
              })}, ${intl.formatMessage({ id: 'marketingAbility.fu' })} ${data.price} ${intl.formatMessage({
                id: 'marketingAbility.yuan',
              })}`,
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'marketingAbility.theOriginalPriceToBuy' })}`
                  : `${intl.formatMessage({ id: 'marketingAbility.doNotBuy' })}`,
            },
          ],
        },
      ]
    case 9:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.theNumberOfClusters' })}`,
              extra: `${data.assembleNum} ${intl.formatMessage({ id: 'marketingAbility.ren' })}`,
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.cloudsOfTime' })}`,
              extra: data.assembleTime
                ? `${data.assembleTime} ${intl.formatMessage({ id: 'marketingAbility.xiaoshi' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.limit' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.userTuxedoLimit' })}`,
              extra: data.joinAssembleNum
                ? `${data.joinAssembleNum} ${intl.formatMessage({ id: 'marketingAbility.ci' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.limit' })}`,
            },
          ],
        },
      ]
    case 10:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.drawType' })}`,
              extra: (
                <Space direction="vertical">
                  {data.lotteryType === 1 && (
                    <>
                      <StatusTag
                        type="default"
                        title={intl.formatMessage({ id: 'marketingAbility.ordersForLuckyDraw' })}
                      />
                      <Typography.Text>
                        {intl.formatMessage({ id: 'marketingAbility.dingdanjine' })}$
                        {intl.formatMessage({ id: 'marketingAbility.man' })} {data.orderPrice.toFixed(2)} $
                        {intl.formatMessage({ id: 'marketingAbility.yuan' })}
                        {intl.formatMessage({ id: 'marketingAbility.qiezhifuchenggonghoucanyu' })}
                      </Typography.Text>
                    </>
                  )}
                  {data.lotteryType === 2 && (
                    <>
                      <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.integralDraw' })} />
                      <Typography.Text>
                        {intl.formatMessage({ id: 'marketingAbility.mei' })}$
                        {intl.formatMessage({ id: 'marketingAbility.ci' })}
                        {intl.formatMessage({ id: 'marketingAbility.choujiangxiaohao' })} {data.integral}{' '}
                        {intl.formatMessage({ id: 'marketingAbility.jifen' })}
                      </Typography.Text>
                    </>
                  )}
                  {data.lotteryType === 3 && (
                    <>
                      <StatusTag
                        type="default"
                        title={intl.formatMessage({ id: 'marketingAbility.behaviorLottery' })}
                      />
                      <Typography.Text>
                        {intl.formatMessage({ id: 'marketingAbility.yonghuwancheng' })} “
                        {data.behavior === 1
                          ? `${intl.formatMessage({ id: 'marketingAbility.toApplyForMembership' })}`
                          : `${intl.formatMessage({ id: 'marketingAbility.signIn' })}`}
                        ” {intl.formatMessage({ id: 'marketingAbility.shicanyuchoujiang' })}
                      </Typography.Text>
                    </>
                  )}
                  {data.lotteryType === 4 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.activitiesDraw' })} />
                  )}
                </Space>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.lotteryNumber' })}`,
              extra: `${lotteryNumType[data.lotteryNumType]}${intl.formatMessage({ id: 'marketingAbility.xianzhi' })}${
                data.lotteryNum
              }${intl.formatMessage({ id: 'marketingAbility.ci' })}`,
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
      ]
    case 11:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.amountBargaining' })}`,
              extra: (
                <>
                  {data.type === 1 && (
                    <Space direction="vertical">
                      <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.aRandomAmount' })} />
                      <div>{`${intl.formatMessage({ id: 'marketingAbility.suijijinefanwei' })}${Number(
                        data.randomStartPrice,
                      ).toFixed(2)} ${intl.formatMessage({ id: 'marketingAbility.yuan' })} ～ ${Number(
                        data.randomEndPrice,
                      ).toFixed(2)} ${intl.formatMessage({ id: 'marketingAbility.yuan' })}`}</div>
                    </Space>
                  )}
                  {data.type === 2 && (
                    <Space direction="vertical">
                      <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.fixedAmount' })} />
                      <div>{`${intl.formatMessage({ id: 'marketingAbility.mei' })}${intl.formatMessage({
                        id: 'marketingAbility.ci',
                      })}${intl.formatMessage({ id: 'marketingAbility.kanjiajine' })}${Number(
                        data.restrictPrice,
                      ).toFixed(2)} ${intl.formatMessage({ id: 'marketingAbility.yuan' })}`}</div>
                    </Space>
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.userLimitNumberOf' })}`,
              extra: `${intl.formatMessage({ id: 'marketingAbility.tongyiyonghuxianzhi' })} ${
                data.restrictNum
              } ${intl.formatMessage({ id: 'marketingAbility.ci' })}`,
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
      ]
    case 12:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.dailySecondsToKillTime' })}`,
              extra: (
                <>
                  {formatTimeString(data.startTime, 'HH:mm:ss')}~{formatTimeString(data.endTime, 'HH:mm:ss')}
                </>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'marketingAbility.theOriginalPriceToBuy' })}`
                  : `${intl.formatMessage({ id: 'marketingAbility.doNotBuy' })}`,
            },
          ],
        },
      ]
    case 13:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.buyType' })}`,
              extra: (
                <>
                  {data.swapType === 1 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.fullRedemption' })} />
                  )}
                  {data.swapType === 2 && (
                    <StatusTag type="default" title={intl.formatMessage({ id: 'marketingAbility.buyGoods' })} />
                  )}
                </>
              ),
            },
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.overlayTheActivityType' })}`,
              extra: (
                <Space wrap>
                  {allowActivity.map((item, index) => (
                    <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                  ))}
                </Space>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.transfiniteRules' })}`,
              extra:
                data.exceedRule === 1
                  ? `${intl.formatMessage({ id: 'marketingAbility.accordingIndividualPurchaseHighestDiscount' })}`
                  : `${intl.formatMessage({ id: 'marketingAbility.doNotBuy' })}`,
            },
          ],
        },
      ]
    case 14:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.theDepositPaymentTime' })}`,
              extra: (
                <>
                  {format(data.depositPayStartTime, 'HH:mm:ss')}~{format(data.depositPayEndTime, 'HH:mm:ss')}
                </>
              ),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.balancePaymentPaymentTime' })}`,
              extra: (
                <>
                  {format(data.balancePaymentPayStartTime, 'HH:mm:ss')}~
                  {format(data.balancePaymentPayEndTime, 'HH:mm:ss')}
                </>
              ),
            },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.startTheDeliveryTime' })}`,
              extra: format(data.deliverTime, 'HH:mm:ss'),
            },
          ],
        },
      ]
    case 15:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.superpositionOfCoupons' })}`,
              extra: data.allowCoupon
                ? `${intl.formatMessage({ id: 'marketingAbility.allowTheStack' })}`
                : `${intl.formatMessage({ id: 'marketingAbility.doNotAllowTheStack' })}`,
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
      ]
    case 16:
      return [
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.extractingUserTime' })}`,
              extra: data.extractAttemptUserTime && format(data.extractAttemptUserTime, 'YYYY-MM-DD HH:mm:ss'),
            },
            { label: `${intl.formatMessage({ id: 'marketingAbility.activityDescription' })}`, extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: `${intl.formatMessage({ id: 'marketingAbility.endOfTheTrialTime' })}`,
              extra: data.attemptEndTime && format(data.attemptEndTime, 'YYYY-MM-DD HH:mm:ss'),
            },
          ],
        },
      ]
  }
}

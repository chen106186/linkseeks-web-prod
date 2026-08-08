import React from 'react'
import { Space } from 'antd'
import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'
import { isEmpty } from 'lodash'

/** * 活动类型 */
export enum ACTIVITYTYPE {
  /** 特价促销 */
  SALE = 1,
  /** 直降促销 */
  DOWNSALE,
  /** 折扣促销 */
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
  1: '特价促销',
  2: '直降促销',
  3: '折扣促销',
  4: '满量促销',
  5: '满额促销',
  6: '赠送促销',
  7: '多件促销',
  8: '组合促销',
  9: '拼团',
  10: '抽奖',
  11: '砍价',
  12: '秒杀',
  13: '换购',
  14: '预售',
  15: '套餐',
  16: '试用',
}
const lotteryNumType = {
  1: '每日',
  2: '每周',
  3: '每月',
  4: '活动期内',
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
              label: '叠加活动类型',
              extra: (
                <Space wrap>
                  {!isEmpty(data.allowActivity) &&
                    data.allowActivity.map((item, index) => (
                      <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                    ))}
                </Space>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: '叠加优惠券',
              extra: data.allowCoupon ? '允许叠加' : '不允许叠加',
            },
          ],
        },
        {
          col: [{ label: '超限规则', extra: data.exceedRule === 1 ? '原价购买' : '不可购买' }],
        },
      ]
    case 4:
    case 5:
      return [
        {
          col: [
            {
              label: `满${int === 4 ? '量' : '额'}促销类型`,
              extra: (
                <>
                  {int === 4 && data.type === 1 && <StatusTag type="default" title="满量减" />}
                  {int === 4 && data.type === 2 && <StatusTag type="default" title="满量折" />}
                  {int === 5 && data.type === 1 && <StatusTag type="default" title="满额减" />}
                  {int === 5 && data.type === 2 && <StatusTag type="default" title="满额折" />}
                </>
              ),
            },
            {
              label: (
                <>
                  {int === 4 && data.type === 1 && '满量减'}
                  {int === 4 && data.type === 2 && '满量折'}
                  {int === 5 && data.type === 1 && '满额减'}
                  {int === 5 && data.type === 2 && '满额折'}
                </>
              ),
              extra: (
                <>
                  {int === 4 && data.type === 1 && (
                    <Space direction="vertical">
                      {!isEmpty(data.ladderList) &&
                        data.ladderList.map((item) => (
                          <div>{`满 ${item.key} 个, 减 ${Number(item.value).toFixed(2)} 元`}</div>
                        ))}
                    </Space>
                  )}
                  {int === 4 && data.type === 2 && (
                    <Space direction="vertical">
                      {!isEmpty(data.ladderList) &&
                        data.ladderList.map((item) => <div>{`满 ${item.key} 个, 打 ${item.value / 10} 折`}</div>)}
                    </Space>
                  )}
                  {int === 5 && data.type === 1 && (
                    <Space direction="vertical">
                      {!isEmpty(data.ladderList) &&
                        data.ladderList.map((item) => (
                          <div>{`满 ${Number(item.key).toFixed(2)} 元, 减 ${Number(item.value).toFixed(2)} 元`}</div>
                        ))}
                    </Space>
                  )}
                  {int === 5 && data.type === 2 && (
                    <Space direction="vertical">
                      {!isEmpty(data.ladderList) &&
                        data.ladderList.map((item) => (
                          <div>{`满 ${Number(item.key).toFixed(2)} 元, 打 ${item.value / 10} 折`}</div>
                        ))}
                    </Space>
                  )}
                </>
              ),
            },
            {
              label: '叠加活动类型',
              extra: (
                <Space wrap>
                  {!isEmpty(data.allowActivity) &&
                    data.allowActivity.map((item, index) => (
                      <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                    ))}
                </Space>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [{ label: '叠加优惠券', extra: data.allowCoupon ? '允许叠加' : '不允许叠加' }],
        },
        {
          col: [{ label: '超限规则', extra: data.exceedRule === 1 ? '按个人限购最高级享受优惠' : '不可购买' }],
        },
      ]
    case 6:
      return [
        {
          col: [
            {
              label: '赠送促销类型',
              extra: (
                <>
                  {data.giveType === 1 && <StatusTag type="default" title="满额赠" />}
                  {data.giveType === 2 && <StatusTag type="default" title="买商品赠" />}
                </>
              ),
            },
            {
              label: '叠加活动类型',
              extra: (
                <Space wrap>
                  {!isEmpty(data.allowActivity) &&
                    data.allowActivity.map((item, index) => (
                      <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                    ))}
                </Space>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: '赠品类型',
              extra: (
                <>
                  {data.giftType === 1 && <StatusTag type="default" title="赠商品" />}
                  {data.giftType === 2 && <StatusTag type="default" title="赠优惠卷" />}
                </>
              ),
            },
            { label: '叠加优惠券', extra: data.allowCoupon ? '允许叠加' : '不允许叠加' },
          ],
        },
        {
          col: [{ label: '超限规则', extra: data.exceedRule === 1 ? '按个人限购最高级享受优惠' : '不可购买' }],
        },
      ]
    case 7:
      return [
        {
          col: [
            {
              label: '优惠规则',
              extra: (
                <Space direction="vertical">
                  {!isEmpty(data.ladderList) &&
                    data.ladderList.map((item) => <div>{`第 ${item.num} 件, 打 ${item.discount / 10} 折`}</div>)}
                </Space>
              ),
            },
            {
              label: '叠加活动类型',
              extra: (
                <Space wrap>
                  {!isEmpty(data.allowActivity) &&
                    data.allowActivity.map((item, index) => (
                      <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                    ))}
                </Space>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [{ label: '叠加优惠券', extra: data.allowCoupon ? '允许叠加' : '不允许叠加' }],
        },
        {
          col: [{ label: '超限规则', extra: data.exceedRule === 1 ? '按个人限购最高级享受优惠' : '不可购买' }],
        },
      ]
    case 8:
      return [
        {
          col: [
            { label: '优惠规则', extra: `任选 ${data.num} 件, 付 ${data.price} 元` },
            {
              label: '叠加活动类型',
              extra: (
                <Space wrap>
                  {!isEmpty(data.allowActivity) &&
                    data.allowActivity.map((item, index) => (
                      <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                    ))}
                </Space>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [{ label: '叠加优惠券', extra: data.allowCoupon ? '允许叠加' : '不允许叠加' }],
        },
        {
          col: [{ label: '超限规则', extra: data.exceedRule === 1 ? '原价购买' : '不可购买' }],
        },
      ]
    case 9:
      return [
        {
          col: [
            { label: '成团人数', extra: `${data.assembleNum} 人` },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [{ label: '成团时间', extra: data.assembleTime ? `${data.assembleTime} 小时` : '不限制' }],
        },
        {
          col: [{ label: '用户参团限制', extra: data.joinAssembleNum ? `${data.joinAssembleNum} 次` : '不限制' }],
        },
      ]
    case 10:
      return [
        {
          col: [
            { label: '抽奖类型', extra: '' },
            { label: '抽奖次数', extra: `${lotteryNumType[data.lotteryNumType]}限制${data.lotteryNum}次` },
            { label: '活动描述', extra: data.describe },
          ],
        },
      ]
    case 11:
      return [
        {
          col: [
            {
              label: '每次砍价金额',
              extra: (
                <>
                  {data.type === 1 && (
                    <Space direction="vertical">
                      <StatusTag type="default" title="随机金额" />
                      <div>{`随机金额范围：${Number(data.randomStartPrice).toFixed(2)} 元 ～ ${Number(
                        data.randomEndPrice,
                      ).toFixed(2)} 元`}</div>
                    </Space>
                  )}
                  {data.type === 2 && (
                    <Space direction="vertical">
                      <StatusTag type="default" title="固定金额" />
                      <div>{`每次砍价金额：${Number(data.restrictPrice).toFixed(2)} 元`}</div>
                    </Space>
                  )}
                </>
              ),
            },
            { label: '用户限制次数', extra: `同一用户限制 ${data.restrictNum} 次` },
            { label: '活动描述', extra: data.describe },
          ],
        },
      ]
    case 12:
      return [
        {
          col: [
            {
              label: '每日秒杀时间段',
              extra: (
                <>
                  {formatTimeString(data.startTime, 'HH:mm:ss')}~{formatTimeString(data.endTime, 'HH:mm:ss')}
                </>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [{ label: '叠加优惠券', extra: data.allowCoupon ? '允许叠加' : '不允许叠加' }],
        },
        {
          col: [{ label: '超限规则', extra: data.exceedRule === 1 ? '原价购买' : '不可购买' }],
        },
      ]
    case 13:
      return [
        {
          col: [
            {
              label: '换购类型',
              extra: (
                <>
                  {data.swapType === 1 && <StatusTag type="default" title="满额换购" />}
                  {data.swapType === 2 && <StatusTag type="default" title="买商品换购" />}
                </>
              ),
            },
            {
              label: '叠加活动类型',
              extra: (
                <Space wrap>
                  {!isEmpty(data.allowActivity) &&
                    data.allowActivity.map((item, index) => (
                      <StatusTag key={`default_key_${index}`} type="default" title={ACTIVITYTYPENAME[item]} />
                    ))}
                </Space>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [{ label: '叠加优惠券', extra: data.allowCoupon ? '允许叠加' : '不允许叠加' }],
        },
        {
          col: [{ label: '超限规则', extra: data.exceedRule === 1 ? '按个人限购最高级享受优惠' : '不可购买' }],
        },
      ]
    case 14:
      return [
        {
          col: [
            {
              label: '定金支付时间',
              extra: (
                <>
                  {formatTimeString(data.depositPayStartTime, 'HH:mm:ss')}~
                  {formatTimeString(data.depositPayEndTime, 'HH:mm:ss')}
                </>
              ),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: '尾款支付时间',
              extra: (
                <>
                  {formatTimeString(data.balancePaymentPayStartTime, 'HH:mm:ss')}~
                  {formatTimeString(data.balancePaymentPayEndTime, 'HH:mm:ss')}
                </>
              ),
            },
          ],
        },
        {
          col: [{ label: '开始发货时间', extra: formatTimeString(data.deliverTime, 'HH:mm:ss') }],
        },
      ]
    case 15:
      return [
        {
          col: [
            { label: '叠加优惠券', extra: data.allowCoupon ? '允许叠加' : '不允许叠加' },
            { label: '活动描述', extra: data.describe },
          ],
        },
      ]
    case 16:
      return [
        {
          col: [
            {
              label: '抽取用户时间',
              extra: data.extractAttemptUserTime && formatTimeString(data.extractAttemptUserTime, 'YYYY-MM-DD HH:mm'),
            },
            { label: '活动描述', extra: data.describe },
          ],
        },
        {
          col: [
            {
              label: '试用结束时间',
              extra: data.attemptEndTime && formatTimeString(data.attemptEndTime, 'YYYY-MM-DD HH:mm'),
            },
          ],
        },
      ]
  }
}

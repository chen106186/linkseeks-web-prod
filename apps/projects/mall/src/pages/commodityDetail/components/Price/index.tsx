import React, { useMemo, useEffect, useState, useRef } from 'react'
import { Modal, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import isEmpty from 'lodash/isEmpty'
import cx from 'classnames'
import { MarketingTypeEnum } from '@/constants/marketing'
import { getWebIntl } from '@/utils/locales'
import { dateFormat, priceFormat, accMul } from '@apps/utils/src/format'
import { getOssUrlPath } from '@apps/constants'
import ImageBox from '@apps/components/src/web/ImageBox'
import { ProductInfoType, PriceInfoType, MarketingDetailType, GroupDetailType, CurrentSkuItemType } from '../../types'
import PriceTrend from '../PriceTrend'
import styles from './index.module.less'

interface CommodityPriceProps {
  /** 商品详情信息 */
  productInfo: ProductInfoType
  /** 商品价格阶梯 */
  commodityPriceInfo: PriceInfoType[]
  /** 商品详情活动标签 */
  marketingData: MarketingDetailType | undefined
  /** skuId */
  skuId: number | undefined
  /** sku数据 */
  currentSku: CurrentSkuItemType | undefined
  /** 商城id */
  mallId: number
  /** 是否含有活动 */
  hasActivity: boolean
  /** 会员权益折扣 */
  parameter: number | undefined
  /** 购买数量 */
  buyCount: number
  groupDetail?: GroupDetailType
  groupId?: number
  activityPrice: number
  type: number
}

/**
 * 获取和购买数量相差最小的区间价格
 */
export const getMaxCountRange = (priceInfo: PriceInfoType[], buyCount: number): PriceInfoType => {
  const priceList = [...priceInfo]
  const result = priceList.sort((a, b) =>
    Number(b.max) < Number(buyCount) && Number(buyCount) < Number(a.min) ? 1 : -1,
  )
  return result[0]
}

const CommodityPrice: React.FC<CommodityPriceProps> = (props) => {
  const {
    skuId,
    commodityPriceInfo,
    mallId,
    activityPrice,
    productInfo,
    marketingData,
    parameter,
    buyCount,
    hasActivity,
    currentSku,
    groupDetail,
  } = props
  const [groupEndTime, setGroupEndTime] = useState<string>()
  const [groupDetialEndTime, setGroupDetailEndTime] = useState<string>()
  const groupTimer = useRef<any>()
  const [taxModalVisible, setTaxModalVisible] = useState<boolean>(false)
  const translate = getWebIntl()

  useEffect(() => {
    if (groupDetail) {
      groupGroupCountTime(groupDetail.endTime)
    }
  }, [groupDetail])

  const groupGroupCountTime = (endTime: number) => {
    groupTimer.current = setInterval(() => {
      setGroupDetailEndTime(() => {
        return countDownTime(endTime, 2)
      })
    }, 1000)
  }

  const checkItemInRang = (item: any) => {
    if (Number(item.min) <= Number(buyCount) && Number(item.max) >= Number(buyCount)) {
      return true
    } else {
      const temp = commodityPriceInfo.filter((item) => {
        return Number(buyCount) >= Number(item.min) && Number(buyCount) <= Number(item.max)
      })
      if (isEmpty(temp)) {
        const nearItem = getMaxCountRange(commodityPriceInfo, buyCount)
        if (Number(nearItem.min) === Number(item.min)) {
          return true
        }
      }
      return false
    }
  }

  const getOriginalPice = useMemo(() => {
    if (commodityPriceInfo) {
      if (commodityPriceInfo.length > 1) {
        commodityPriceInfo.forEach((item) => {
          if (checkItemInRang(item)) {
            return item.price
          }
        })
      }
      return priceFormat(commodityPriceInfo[0]?.price)
    }
    return 0
  }, [commodityPriceInfo])

  // 判断是否秒杀且活动已开始
  const judegeShowOriginalPice = useMemo(() => {
    if (
      marketingData &&
      marketingData.tagDetailList.some((item) => item.activityType === MarketingTypeEnum.activity_type_12)
    ) {
      const skillInfo = marketingData.tagDetailList.filter(
        (item) => item.activityType === MarketingTypeEnum.activity_type_12,
      )[0]
      if (skillInfo) {
        const nowTime = new Date().getTime()
        if (skillInfo.startTime > nowTime) {
          return true
        }
      }
    }
    return false
  }, [marketingData])

  const replenishZero = (count: number) => {
    if (count < 10) {
      return `0${count}`
    }
    return count
  }

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [])

  const clearTimer = () => {
    if (groupTimer.current) {
      clearInterval(groupTimer.current)
      groupTimer.current = undefined
    }
  }

  const countDownTime = (endTime: number, type: number = 1) => {
    const nowTime = new Date().getTime()

    const lefttime = endTime - nowTime // 距离结束时间的毫秒数
    if (lefttime > 0) {
      const leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)) // 计算天数
      const lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24) // 计算小时数
      const leftm = Math.floor((lefttime / (1000 * 60)) % 60) // 计算分钟数
      const lefts = Math.floor((lefttime / 1000) % 60) // 计算秒数

      let ret = ''
      if (leftd > 0) {
        ret =
          replenishZero(leftd) +
          translate('web.common.tian') +
          ' ' +
          replenishZero(lefth) +
          ':' +
          replenishZero(leftm) +
          ':' +
          replenishZero(lefts) // 返回倒计时的字符串
      } else {
        ret = replenishZero(lefth) + ':' + replenishZero(leftm) + ':' + replenishZero(lefts) // 返回倒计时的字符串
      }
      if (type === 1) {
        return translate('web.resource.mall.juhuodongjieshushijian', { endTime: ret })
      }

      if (type === 3) {
        return `${dateFormat(new Date(endTime))} ${translate('web.resource.mall.julikaishihaisheng')}: ${ret}`
      }
      return translate('web.resource.mall.endtimehoujieshu', { endTime: ret })
    } else {
      return translate('web.resource.mall.huodongyijieshu')
    }
  }

  const groupCountTime = (endTime: number, isSkill = false) => {
    groupTimer.current = setInterval(() => {
      setGroupEndTime(() => {
        return countDownTime(endTime, isSkill ? 3 : 1)
      })
    }, 1000)
  }

  const getActivityTag = useMemo(() => {
    if (marketingData && marketingData.tagDetailList) {
      const showTagList = [
        MarketingTypeEnum.activity_type_1,
        MarketingTypeEnum.activity_type_2,
        MarketingTypeEnum.activity_type_3,
        MarketingTypeEnum.activity_type_8,
      ]
      let tag = ''
      marketingData.tagDetailList.forEach((item) => {
        if (showTagList.includes(item.activityType)) {
          // 特价促销/直降促销/折扣促销
          tag = item?.preferentialTag
          if (item.endTime && !groupTimer.current) {
            groupCountTime(item.endTime)
          }
          return
        } else if (item.activityType === MarketingTypeEnum.activity_type_12) {
          tag = item?.preferentialTag
          // 秒杀活动 - 判断活动是否开始
          const nowTime = new Date().getTime()
          const _nowDate = dateFormat(new Date(), 'YYYY-MM-DD')
          let _seckillStartTime = new Date(
            `${_nowDate}${dateFormat(new Date(marketingData.seckillStartTime)).slice(10)}`,
          ).getTime()
          let _seckillEndTime = new Date(
            `${_nowDate}${dateFormat(new Date(marketingData.seckillEndTime)).slice(10)}`,
          ).getTime()
          if (groupTimer.current) {
            clearInterval(groupTimer.current)
            groupTimer.current = null
          }
          if (item.startTime < nowTime) {
            if (nowTime > _seckillEndTime) {
              //当前时间大于当天本轮秒杀时间
              _seckillStartTime = _seckillStartTime + 24 * 60 * 60 * 1000
              groupCountTime(_seckillStartTime, true)
            } else if (nowTime >= _seckillStartTime && nowTime <= _seckillEndTime) {
              //秒杀进行中
              groupCountTime(_seckillEndTime)
            } else if (nowTime < _seckillStartTime) {
              groupCountTime(_seckillStartTime, true)
            }
          } else {
            groupCountTime(item.startTime, true)
          }
          return
        } else if (item.activityType === MarketingTypeEnum.activity_type_9) {
          // 拼团活动
          tag = item?.preferentialTagDesc
          if (!groupTimer.current && item.endTime && !groupDetail) {
            groupCountTime(item.endTime)
          }
          return
        } else {
          tag = item?.preferentialTag
        }
      })
      return tag
    }
    return ''
  }, [marketingData, activityPrice])

  const hasSubUnit = useMemo(() => {
    return productInfo.subUnitName && currentSku?.priceRate
  }, [productInfo, currentSku])

  /**
   * 计算商品副单位价格
   * @returns
   */
  const _subUnitPrice = (price: number) => {
    if (currentSku?.priceRate && price) {
      return accMul(price, currentSku?.priceRate / 100)
    }
    return 0
  }

  /**
   * 商品进口税=商品单价/价格策略价*税率（此处需考虑若该用户有会员折扣，需再乘以会员折扣；但不用考虑营销活动价格）
   * 获取税费
   */
  const taxFee = useMemo(() => {
    if (productInfo.taxRate && commodityPriceInfo && commodityPriceInfo.length > 0) {
      const priceInfo = commodityPriceInfo[0]
      return priceInfo.price * (productInfo.taxRate / 100) * (parameter || 1)
    }
    return 0
  }, [productInfo, commodityPriceInfo, parameter])

  return (
    <div className={styles.prompt_goods_wrap}>
      <div className={styles.prompt_goods}>
        {hasActivity ? (
          <>
            <div className={styles.activity_header}>
              <div className={styles.activity_container}>
                <div className={styles.activity_tag}>{getActivityTag}</div>
                <div className={styles.activity_right}>
                  {
                    // 拼团活动-拼团信息显示
                    groupDetail && (
                      <>
                        <div className={styles.activity_group_info}>
                          <div className={styles.activity_group_info_member_list}>
                            {groupDetail.itemList && groupDetail.itemList.length > 0 && (
                              <div className={styles.activity_group_info_member_list_item}>
                                <ImageBox
                                  width={24}
                                  height={24}
                                  src={groupDetail.itemList[0].logo || `${getOssUrlPath('/Images/default_logo.png')}`}
                                />
                              </div>
                            )}
                            {groupDetail.itemList && groupDetail.itemList.length > 1 && (
                              <div className={cx(styles.activity_group_info_member_list_item, styles.more)}>
                                {groupDetail.num > 2 && (
                                  <div className={styles.member_count}>+{groupDetail.num - 2}</div>
                                )}
                                <ImageBox width={24} height={24} src={groupDetail.itemList[1].logo} />
                              </div>
                            )}
                          </div>
                          <span>
                            {translate('web.resource.mall.jinshengcountgeminge', {
                              count: groupDetail.assembleNum - groupDetail.num,
                            })}
                          </span>
                        </div>
                        <div className={styles.activity_end_time}>{groupDetialEndTime}</div>
                      </>
                    )
                  }
                  {groupEndTime && !groupDetail && <div className={styles.activity_end_time}>{groupEndTime}</div>}
                </div>
              </div>
            </div>
            <div className={styles.prompt_goods_price} style={{ paddingTop: 16 }}>
              <div className={styles.prompt_goods_price_item}>
                <div className={cx(styles.label, styles.mprice)}>{translate('web.resource.mall.huodongjiage')}</div>
              </div>
              <div className={styles.prompt_goods_price_list}>
                <div
                  className={cx(styles.prompt_goods_price_list_item, styles.ladder_price, styles.active)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <div className={styles.price} style={{ marginRight: 8 }}>
                    <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                    {judegeShowOriginalPice ? getOriginalPice : priceFormat(activityPrice)}
                  </div>
                  {!judegeShowOriginalPice && priceFormat(activityPrice) !== getOriginalPice && (
                    <div className={cx(styles.price, styles.delete_line)}>
                      <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                      {getOriginalPice}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.prompt_goods_price}>
            <div className={styles.prompt_goods_price_item}>
              {productInfo?.isMemberPrice && (
                <div className={cx(styles.label, styles.mprice)}>{translate('web.resource.mall.huiyuanjiage')}</div>
              )}
              {!productInfo?.isMemberPrice ? (
                <div className={cx(styles.label, styles.price)}>{translate('web.resource.mall.price')}</div>
              ) : (
                <div className={cx(styles.label, styles.price)}>&nbsp;</div>
              )}
              {/* 副单位价格 */}
              {hasSubUnit ? (
                <div className={cx(styles.label, styles.count)}>{translate('web.resource.mall.fudanweijiage')}</div>
              ) : null}
              {/* 数量 */}
              <div className={cx(styles.label, styles.count)}>
                {translate('web.resource.mall.shuliang')}({productInfo?.unitName})
              </div>
            </div>
            <div className={styles.prompt_goods_price_list}>
              {skuId ? (
                commodityPriceInfo &&
                commodityPriceInfo.map((item, index) => (
                  <div
                    className={cx(
                      styles.prompt_goods_price_list_item,
                      styles.ladder_price,
                      commodityPriceInfo.length > 0 && checkItemInRang(item) ? styles.active : '',
                    )}
                    key={`prompt_goods_price_list_item_${index}`}
                  >
                    {productInfo?.isMemberPrice && (
                      <div className={styles.price}>
                        <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                        {priceFormat(item.price * (parameter ? parameter : 1))}
                      </div>
                    )}
                    <div className={cx(styles.price, productInfo?.isMemberPrice ? styles.delete_line : {})}>
                      <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                      {priceFormat(item.price)}
                    </div>
                    {/* 副单位价格 */}
                    {hasSubUnit ? (
                      <div className={styles.subPrice}>
                        <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                        {_subUnitPrice(item.price)} /{productInfo.subUnitName}
                      </div>
                    ) : null}
                    <div className={styles.count}>
                      {item.range === '0-0' ? translate('web.resource.mall.buxian') : item.range}
                    </div>
                  </div>
                ))
              ) : (
                <div className={cx(styles.prompt_goods_price_list_item)}>
                  {productInfo?.isMemberPrice && (parameter || parameter === 0) && (
                    <div className={styles.price}>
                      <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                      {productInfo?.min !== productInfo?.max
                        ? `${priceFormat(productInfo?.min * parameter)} ~ ${priceFormat(productInfo?.max * parameter)}`
                        : priceFormat(productInfo?.min * parameter)}
                    </div>
                  )}
                  <div className={styles.member_price}>
                    <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                    {productInfo?.min !== productInfo?.max
                      ? `${priceFormat(productInfo?.min)} ~ ${priceFormat(productInfo?.max)}`
                      : priceFormat(productInfo?.min)}
                  </div>
                  {hasSubUnit ? (
                    <div className={styles.subPrice}>
                      <i className={styles.price_symbol}>{translate('web.common.currencySymbol')}</i>
                      {_subUnitPrice(activityPrice)} /{productInfo.subUnitName}
                    </div>
                  ) : null}
                  {/* 数量 */}
                  <div className={styles.count}>{translate('web.resource.mall.buxian')}</div>
                </div>
              )}
            </div>
          </div>
        )}
        {productInfo?.isCrossBorder && (
          <div className={cx(styles.prompt_goods_price, styles.tax)}>
            <div className={styles.prompt_goods_price_item}>
              <div className={styles.label}>{translate('web.resource.mall.jinkoushui')}</div>
            </div>
            <div className={styles.prompt_goods_price_list} style={{ alignItems: 'center' }}>
              {productInfo?.taxRate === 0 ? (
                <span>{translate('web.resource.mall.shangpinyibaoshui')}</span>
              ) : (
                <div>
                  {translate('web.resource.mall.jinkoushuiyuji')}
                  {translate('web.common.currencySymbol')}
                  <span>{taxFee}</span>
                </div>
              )}
              <QuestionCircleOutlined
                className={styles.taxrate_question_icon}
                style={{ marginLeft: 4 }}
                translate={undefined}
                onClick={() => setTaxModalVisible(true)}
              />
            </div>
          </div>
        )}
      </div>
      {/* 价格走势 */}
      {skuId && (
        <PriceTrend
          selectCommodityId={skuId}
          commodityPriceInfo={commodityPriceInfo}
          id={productInfo.id}
          mallId={mallId}
        />
      )}
      <Modal
        open={taxModalVisible}
        centered
        title={translate('web.resource.mall.shuifeishuoming')}
        onCancel={() => setTaxModalVisible(false)}
        className={styles.taxModal}
        footer={
          <Button onClick={() => setTaxModalVisible(false)} type="primary" className={styles.taxConfirmBtn}>
            {translate('web.resource.mall.wozhidaole')}
          </Button>
        }
      >
        <div className={styles.taxModal_line}>
          <label className={styles.taxModal_line_label}>{translate('web.resource.mall.shangpinjinkoushui')}</label>
          {productInfo?.taxRate === 0 ? (
            <div className={styles.taxModal_line_brief}>
              <div className={styles.taxModal_line_brief_line}>
                <span>{translate('web.resource.mall.ninsuogoumaideshangpinyibaohankuajingdianshang')}</span>
              </div>
            </div>
          ) : (
            <div className={styles.taxModal_line_brief}>
              <div className={styles.taxModal_line_brief_line}>
                <span>{translate('web.resource.mall.yuji')}</span>
                <span>
                  {translate('web.common.currencySymbol')} {taxFee}
                </span>
              </div>
              <div className={cx(styles.taxModal_line_brief_line, styles.sub_text)}>
                <span>{translate('web.resource.mall.shijijiesuanshuifeiyitijiaodingdanshi')}</span>
              </div>
            </div>
          )}
        </div>
        {productInfo?.taxRate !== 0 && (
          <div className={styles.taxModal_line}>
            <label className={styles.taxModal_line_label}>{translate('web.resource.mall.jinkoushuishuilv')}</label>
            <div className={styles.taxModal_line_brief}>
              <div className={styles.taxModal_line_brief_line}>
                <span>{productInfo?.taxRate}%</span>
              </div>
              <div className={cx(styles.taxModal_line_brief_line, styles.sub_text)}>
                <span>{translate('web.resource.mall.zhongguohaiguanguiding')}</span>
              </div>
            </div>
          </div>
        )}
        <div className={styles.taxModal_line}>
          <label className={styles.taxModal_line_label}>{translate('web.resource.mall.jinkoushuijisuan')}</label>
          <div className={styles.taxModal_line_brief}>
            <div className={styles.taxModal_line_brief_line}>
              <span>{translate('web.resource.mall.shangpinwanshuijiage')}</span>
            </div>
            <div className={cx(styles.taxModal_line_brief_line, styles.sub_text)}>
              <span>{translate('web.resource.mall.shangpinwanshuijiagebaohanyunfei')}</span>
            </div>
          </div>
        </div>
        <div className={styles.taxModal_line}>
          <label className={styles.taxModal_line_label}>{translate('web.resource.mall.jinkoushuiguiding')}</label>
          <div className={styles.taxModal_line_brief}>
            <div className={styles.taxModal_line_brief_line}>
              <span>{translate('web.resource.mall.jiaoyixiane')}</span>
            </div>
            <div className={cx(styles.taxModal_line_brief_line, styles.sub_text)}>
              <span>{translate('web.resource.mall.gerendanbijiaoyixianzhirenminbi')}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CommodityPrice

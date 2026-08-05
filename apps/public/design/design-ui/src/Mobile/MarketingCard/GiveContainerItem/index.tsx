import React, { useMemo } from 'react'
import { Tabs, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../../locale/types/mobile'

import DetailItem, { DetailItemProps } from '../DetailItem'
import GoodsItem from '../GoodsItem'
import GiveContainerItemCoupon from '../GiveContainerItemCoupon'

const { TabPane } = Tabs

interface GiveContainerItemProps extends DetailItemProps {
  childType: 'goods' | 'coupons'
}

const GiveContainerItem: React.FC<GiveContainerItemProps> = (
  props: GiveContainerItemProps,
) => {
  const {
    detail,
    containStyle,
    isnull = true,
    childType,
    className = '',
    ...other
  } = props

  const renderComponent = (
    locale: MobileLocale,
    lang: (
      key: keyof MobileLocale,
      defaultMessage: string,
      options: any,
    ) => string,
  ) => {
    const _leftTag = () => {
      if (childType === 'goods') {
        return locale['mobile.marketing.gift.goods']
      }
      return locale['mobile.marketing.gift.coupon']
    }

    const _needBtn = () => (childType === 'goods' ? false : true)

    const _returnTitle = (limitValue: number) => {
      if (childType === 'goods') {
        return lang('mobile.coupon.gift.condition', '满${count}件赠送', {
          count: limitValue,
        })
      }
      return lang('mobile.coupon.receive.condition', '满${price}元获赠', {
        price: limitValue,
      })
    }

    const _children = () => {
      if (childType === 'goods') {
        return (
          detail?.goodsSubsidiaryGroupList &&
          detail?.goodsSubsidiaryGroupList.map((item: any) => {
            const _showNum = item.goodsSubsidiaryGroupDetailsList.filter(
              (child: any) => child.num > 1,
            )
            return {
              ...item,
              showNum: _showNum.length > 0,
            }
          })
        )
      }
      return (
        detail?.giveCouponList &&
        detail?.giveCouponList.map((item: any) => {
          const _couponList: any[] = []
          item.list.forEach((child: any) => {
            for (let i = 0; i < child.num; i++) {
              _couponList.push({ ...child })
            }
          })
          return {
            ...item,
            couponList: _couponList,
          }
        })
      )
    }

    const _renderChildren = (list: any, showNum?: boolean) => {
      if (childType === 'goods') {
        return list?.map((item: any, index: any) => (
          <Col span={8} key={`goods_${index}`}>
            <GoodsItem
              isnull={false}
              img={item.productImgUrl}
              className=""
              info={lang('mobile.original.price', '原价${price}元', {
                price: item.price,
              })}
              num={showNum ? item.num : 0}
              direction="column"
            />
          </Col>
        ))
      }
      return list?.map((item: any, index: any) => (
        <Col span={7} key={`goods_${index}`}>
          <GiveContainerItemCoupon {...item} />
        </Col>
      ))
    }

    const _discountPrice = () => {
      if (detail?.discountPrice) {
        const _text = detail?.discountPrice?.split('.')
        return (
          <span
            className={
              styles[
                `lingxi-marketingCard-GiveContainerItem-bottom-left-discountPrice`
              ]
            }
          >
            ¥<span>{_text[0]}</span>.{_text[1]}
          </span>
        )
      } else {
        return null
      }
    }

    if (isnull) {
      return (
        <div
          className={cx(
            styles['lingxi-marketingCard-GiveContainerItem-null'],
            className,
          )}
          {...other}
        >
          <PlusOutlined />
        </div>
      )
    } else {
      return (
        <div
          className={cx(
            styles['lingxi-marketingCard-GiveContainerItem'],
            className,
          )}
          {...other}
        >
          <DetailItem
            tag={_needBtn() ? '' : locale['mobile.marketing.main.goods']}
            tagStyle={_needBtn() ? {} : { background: '#EF3346' }}
            containStyle={{ padding: 12 }}
            detail={detail}
            detailType="give"
            leftTag={_leftTag()}
            needBtn={_needBtn()}
            isnull={false}
          />
          <Tabs defaultActiveKey="0">
            {_children()?.map((item: any, index: any) => {
              return (
                <TabPane tab={_returnTitle(item.limitValue)} key={index}>
                  <div style={{ overflowX: 'scroll' }}>
                    <Row gutter={12} wrap={false}>
                      {_renderChildren(
                        childType === 'goods'
                          ? item.goodsSubsidiaryGroupDetailsList
                          : item.couponList,
                        item?.showNum,
                      )}
                    </Row>
                  </div>
                </TabPane>
              )
            })}
          </Tabs>
          {!_needBtn() ? (
            <div
              className={
                styles[`lingxi-marketingCard-GiveContainerItem-bottom`]
              }
            >
              <div
                className={
                  styles[`lingxi-marketingCard-GiveContainerItem-bottom-left`]
                }
              >
                {_discountPrice()}
                <span
                  className={
                    styles[
                      `lingxi-marketingCard-GiveContainerItem-bottom-left-originalPrice`
                    ]
                  }
                >
                  {detail?.originalPrice ? `¥${detail?.originalPrice}` : null}
                </span>
              </div>
              <div
                className={
                  styles[`lingxi-marketingCard-GiveContainerItem-bottom-right`]
                }
              >
                {locale['mobile.marketing.btn.buy']}
              </div>
            </div>
          ) : null}
        </div>
      )
    }
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default GiveContainerItem

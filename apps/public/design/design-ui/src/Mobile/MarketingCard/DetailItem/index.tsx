import React, { useMemo } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../../locale/types/mobile'

import useCountDown from '../hooks/useCountDown'

interface DetailItemDetailProps {
  img: any
  title: string
  // 折扣价
  discountPrice?: string
  // 原价
  originalPrice?: string | number
  // 结束时间
  endTime?: number
  // 剩余人数
  people?: number
  // 已购数量
  buy?: number
  [key: string]: any
}

export interface DetailItemProps {
  // 商品详情
  detail: DetailItemDetailProps
  // 展示类型
  detailType: 'collage' | 'package' | 'give'
  // 容器样式
  containStyle?: React.CSSProperties
  // 图片tag
  tag?: string
  // 图片tag样式
  tagStyle?: React.CSSProperties
  // 是否为空状态
  isnull?: boolean
  // left tag
  leftTag?: string
  // needBtn
  needBtn?: boolean
  className?: string
}

const DetailItem: React.FC<DetailItemProps> = (props: DetailItemProps) => {
  const {
    detail,
    detailType = 'collage',
    containStyle,
    tag,
    tagStyle,
    isnull = true,
    leftTag,
    needBtn,
    className = '',
    ...other
  } = props

  const [hour, minute] = useCountDown(
    detail?.endTime || new Date().getTime() / 1000,
  )

  const _discountPrice = useMemo(() => {
    const _text = detail?.discountPrice?.split('.')
    if (_text && _text.length > 0) {
      return (
        <span
          className={
            styles[`lingxi-marketingCard-detailItem-detail-money-discountPrice`]
          }
        >
          ¥<span>{_text?.[0]}</span>.{_text?.[1]}
        </span>
      )
    } else {
      return null
    }
  }, [detail?.discountPrice])

  const renderComponent = (locale: MobileLocale) => {
    const _infoLeft = () => {
      if (detailType === 'collage' && detail?.label) {
        return (
          <div className={styles['people_tag']}>
            {detail?.label}
            {/* {lang('mobile.unit.people.regiment', '${count}人团', { count: detail?.label })} */}
          </div>
        )
      }
      if (detailType === 'package') {
        return (
          <>
            {locale['mobile.marketing.robbed']}
            <span>{detail?.buy}</span>
            {locale['mobile.unit.piece']}
          </>
        )
      }
      if (detailType === 'give') {
        return <div className={styles['giveTag']}>{leftTag}</div>
      }
      return null
    }

    if (isnull) {
      return (
        <div
          className={cx(
            styles['lingxi-marketingCard-detailItem-null'],
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
          className={cx(styles['lingxi-marketingCard-detailItem'], className)}
          style={containStyle ? { ...containStyle } : {}}
          {...other}
        >
          <div className={styles[`lingxi-marketingCard-detailItem-img`]}>
            <img src={detail.img} />
            {tag ? (
              <div
                className={styles[`lingxi-marketingCard-detailItem-img-tag`]}
                style={tagStyle ? { ...tagStyle } : {}}
              >
                {tag}
              </div>
            ) : null}
          </div>
          <div className={styles[`lingxi-marketingCard-detailItem-detail`]}>
            <div
              className={styles[`lingxi-marketingCard-detailItem-detail-title`]}
            >
              {detail.title}
            </div>
            <div
              className={styles[`lingxi-marketingCard-detailItem-detail-info`]}
            >
              <div
                className={
                  styles[`lingxi-marketingCard-detailItem-detail-info-left`]
                }
              >
                {_infoLeft()}
              </div>
            </div>
            <div
              className={styles[`lingxi-marketingCard-detailItem-detail-money`]}
            >
              {_discountPrice}
              {detail?.originalPrice ? (
                <span
                  className={
                    styles[
                      `lingxi-marketingCard-detailItem-detail-money-originalPrice`
                    ]
                  }
                >
                  ¥{detail?.originalPrice}
                </span>
              ) : null}
              {needBtn ? (
                <div
                  className={
                    styles[`lingxi-marketingCard-detailItem-detail-money-btn`]
                  }
                >
                  {locale['mobile.commodity.buybtn']}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default DetailItem

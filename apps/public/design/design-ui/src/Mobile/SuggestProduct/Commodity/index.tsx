import React, { CSSProperties, useMemo } from 'react'
import cx from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { priceFormat } from '../../../utils/numberFomat'

import { MobileLocale } from '../../../locale/types/mobile'
import CustomizeTag from '../../CustomizeTag'
import { getWebIntl } from '@apps/locales'
// https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/nGaV968raNZPqwd/inspect

type TagType = Omit<React.ComponentProps<typeof CustomizeTag>, 'children'>
type WithNameType = TagType & { name: string }

interface Iprops {
  /** 2种模式，分别对应设计图的3种商品样式  */
  mode: 'horizontal' | 'vertical'
  /** 商品名 */
  name?: string
  /** 商品图片 */
  image?: string
  /* 标签 */
  tags?: string[] | WithNameType[] | null
  /** 折扣价, 当自定义footer 时该属性没用 */
  discountPrice?: number
  /** 原价, 当自定义footer 时该属性没用 */
  originalPrice?: number | null
  /** 已售出, 当自定义footer 时该属性没用 */
  sold?: number | null
  /** 购买button, 当自定义footer 时该属性没用 */
  buyBtn?: boolean
  buyBtnText?: string
  buyBtnType?: 'danger' | 'purple'
  /** 进度条内容 */
  progress?: React.ReactNode
  /** 自定义footer */
  footer?: React.ReactNode | null
  /** 自定义customerPrice */
  customerPrice?: true
  /** 是否是empty */
  empty?: boolean
  style: CSSProperties
  className?: any
  crossorigin?: '' | 'anonymous' | 'use-credentials' | undefined
  priceType?: number
}

const Commodity: React.FC<Iprops> = (props: Iprops) => {
  const translate = getWebIntl()
  const renderComponent = (locale: MobileLocale) => {
    const {
      mode,
      name,
      image,
      tags,
      discountPrice,
      originalPrice,
      sold,
      footer,
      buyBtn,
      buyBtnText = locale['mobile.commodity.buybtn'],
      buyBtnType,
      progress,
      empty = false,
      style,
      className,
      customerPrice,
      crossorigin,
      priceType = 1,
      ...other
    } = props
    /** class 前缀， 应该写个provider */
    const prefix = 'lingxi'
    const offPrice = () => discountPrice?.toString().split('.')

    const renderPriceItem = (record: any) => {
      switch (record?.cashPriceType) {
        case 1:
          if (record.specification === 2 && record.min !== record.max) {
            return (
              <div className={styles['renderPriceItemBar']}>
                ¥
                <span className={styles['renderPriceItemFont']}>
                  {priceFormat(record?.min).split('.')[0]}
                </span>
                .{priceFormat(record?.min).split('.')[1] || '00'}- ¥
                <span className={styles.renderPriceItemFont}>
                  {priceFormat(record?.max).split('.')[0]}
                </span>
                .{priceFormat(record?.max).split('.')[1] || '00'}
              </div>
            )
          } else {
            return (
              <div className={styles['renderPriceItemBar']}>
                ¥
                <span className={styles['renderPriceItemFont']}>
                  {priceFormat(record?.min).split('.')[0]}
                </span>
                .{priceFormat(record?.min).split('.')[1] || '00'}
              </div>
            )
          }
        case 2:
          const _specification2 =
            record.specification === 2 &&
            record.minSidePrice !== record.maxSidePrice
              ? `${record.minSidePrice} - ${record.maxSidePrice} 积分`
              : `${record?.minSidePrice} 积分`
          return (
            <div className={styles['renderPriceItemBar']}>
              {_specification2}
            </div>
          )
        case 3:
          if (
            record.specification === 2 &&
            record.minSidePrice !== record.maxSidePrice &&
            record.min !== record.max
          ) {
            return (
              <div className={styles['renderPriceItemFlex']}>
                <div className={styles['renderPriceItemBar']}>
                  {`${record.minSidePrice} - ${record.maxSidePrice} 积分`}
                </div>
                <div className={styles['renderPriceItemBar']}>
                  ¥
                  <span className={styles['renderPriceItemFont']}>
                    {priceFormat(record?.min).split('.')[0]}
                  </span>
                  .{priceFormat(record?.min).split('.')[1] || '00'}- ¥
                  <span className={styles.renderPriceItemFont}>
                    {priceFormat(record?.max).split('.')[0]}
                  </span>
                  .{priceFormat(record?.max).split('.')[1] || '00'}
                </div>
              </div>
            )
          } else {
            return (
              <div className={styles['renderPriceItemBar']}>
                {record?.minSidePrice}
                积分 +
                <span className={styles.renderPriceItemFont}>
                  {priceFormat(record?.min).split('.')[0]}
                </span>
                .
                {record?.min
                  ? `¥ ${priceFormat(record?.min).split('.')[1] || '00'}`
                  : ''}
              </div>
            )
          }
        default:
          if (record.specification === 2 && record.min !== record.max) {
            return (
              <div className={styles['renderPriceItemBar']}>
                ¥
                <span className={styles['renderPriceItemFont']}>
                  {priceFormat(record?.min).split('.')[0]}
                </span>
                .{priceFormat(record?.min).split('.')[1] || '00'}- ¥
                <span className={styles.renderPriceItemFont}>
                  {priceFormat(record?.max).split('.')[0]}
                </span>
                .{priceFormat(record?.max).split('.')[1] || '00'}
              </div>
            )
          } else {
            return (
              <div className={styles['renderPriceItemBar']}>
                ¥
                <span className={styles['renderPriceItemFont']}>
                  {priceFormat(record?.min).split('.')[0]}
                </span>
                .{priceFormat(record?.min).split('.')[1] || '00'}
              </div>
            )
          }
      }
    }

    const renderPriceByType = (priceType: number, price: any) => {
      switch (priceType) {
        case 2:
          return (
            <div className={styles['goods-price-wrap']}>
              <span className={styles['ask-commodity-price-text']}>
                {translate('web.resource.mall.zaixianxunjia')}
              </span>
            </div>
          )
        case 3:
          return (
            <div className={styles['goods-price-wrap']}>
              <span className={styles['goods-price']}>{`${price} ${translate(
                'web.resource.mall.integral',
              )}`}</span>
            </div>
          )
        default:
          return (
            <div className={styles['goods-price-wrap']}>
              <span className={styles['goods-price-unit']}>
                {translate('web.common.currencySymbol')}
              </span>
              <span className={styles['goods-price']}>
                {priceFormat(price)}
              </span>
            </div>
          )
      }
    }

    const renderFooter = () => {
      if (footer || footer === null) {
        return footer
      }

      return (
        <div className={styles[`${prefix}-${mode}-info-footer`]}>
          <div className={styles['price']}>
            {/* {customerPrice && renderPriceItem(props)}
            {discountPrice && !customerPrice && (
              <div className={styles['off']}>
                ￥<span className={styles['scale']}>{offPrice()?.[0]}</span>.
                {offPrice()?.[1] || '00'}
              </div>
            )} */}
            {renderPriceByType(priceType, discountPrice)}

            {(originalPrice && (
              <s className={styles['originalPrice']}>￥{originalPrice}</s>
            )) ||
              (sold !== null && priceType !== 2 && (
                <div className={styles['soldOut']}>
                  {locale['mobile.commodity.sold']}
                  <span className={styles['sold']}>{sold}</span>
                  {locale['mobile.unit.piece']}
                </div>
              )) ||
              null}
          </div>
          {(buyBtn && (
            <div className={cx(styles['btn'], styles[`btn-${buyBtnType}`])}>
              <div>{buyBtnText}</div>
            </div>
          )) ||
            null}
        </div>
      )
    }

    const renderBody = () => {
      if (empty || (name === '' && image === '')) {
        return (
          <div className={cx(styles.empty, styles[`empty-${mode}`])}>
            <PlusOutlined style={{ color: '#CBCACD' }} />
          </div>
        )
      }

      return (
        <>
          <div className={cx(styles[`${prefix}-${mode}-imageContainer`])}>
            <img
              crossOrigin={crossorigin}
              src={image}
              className={styles[`${prefix}-${mode}-image`]}
            />
          </div>
          <div className={styles[`${prefix}-${mode}-info`]}>
            <div className={styles[`${prefix}-${mode}-info-name`]}>{name}</div>
            {tags && (
              <div className={styles[`${prefix}-${mode}-info-taglist`]}>
                {tags?.map((_item, index) => {
                  const isString = typeof _item === 'string'
                  if (isString) {
                    return <CustomizeTag key={index}>{_item}</CustomizeTag>
                  }
                  return (
                    <CustomizeTag {..._item} key={index}>
                      {(_item as WithNameType).name}
                    </CustomizeTag>
                  )
                })}
              </div>
            )}
            {progress}
            {renderFooter()}
          </div>
        </>
      )
    }

    return (
      <div
        className={cx(
          styles[`${prefix}-${mode}`],
          styles[`${prefix}-contianer`],
          className,
        )}
        style={style}
        {...other}
      >
        {renderBody()}
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

Commodity.defaultProps = {
  name: '',
  image: '',
  sold: null,
  originalPrice: null,
  tags: null,
  buyBtn: true,
  buyBtnType: 'danger',
  progress: null,
  style: {},
}

export default Commodity

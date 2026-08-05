import React, { CSSProperties, useMemo } from 'react'
import cx from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import { getWebIntl } from '@apps/locales'
import { priceFormat } from '../../utils/numberFomat'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'
import CustomizeTag from '../CustomizeTag'
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
  priceType?: number
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
  /** 是否是empty */
  empty?: boolean
  style?: CSSProperties
  crossorigin?: '' | 'anonymous' | 'use-credentials' | undefined
}

const Commodity: React.FC<Iprops> = (props: Iprops) => {
  const { discountPrice } = props
  /** class 前缀， 应该写个provider */
  const prefix = 'lingxi'
  const offPrice = () => discountPrice?.toString().split('.')
  const translate = getWebIntl()

  const renderComponent = (locale: MobileLocale) => {
    const {
      mode,
      name,
      image,
      tags,
      originalPrice,
      sold,
      footer,
      buyBtn,
      buyBtnText = locale['mobile.commodity.buybtn'],
      buyBtnType,
      progress,
      empty = false,
      style,
      crossorigin,
      priceType = 1,
    } = props

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
            {renderPriceByType(priceType, discountPrice)}

            {(originalPrice && (
              <s className={styles['originalPrice']}>
                {locale['mobile.currency']}
                {originalPrice}
              </s>
            )) ||
              (sold !== null && (
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
        )}
        style={style}
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

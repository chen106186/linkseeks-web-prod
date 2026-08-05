import React, { useRef, useState, useEffect } from 'react'
import { Carousel } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { COMMODITY_TYPE } from '@/constants'
import { arrayGroupsByCount, getNameByPriceType } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import { LAYOUT_TYPE } from '@/types/global'
import { numFormat, priceFormat } from '@apps/utils/src/format'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface BrowseRecordsPropsType {
  priceType: COMMODITY_TYPE | undefined
  dataList: any
  layoutType: LAYOUT_TYPE
}

const BrowseRecords: React.FC<BrowseRecordsPropsType> = (props) => {
  const { priceType = 1, dataList } = props
  const [list, setList] = useState<any>([])
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const actionRef = useRef<any>()

  useEffect(() => {
    if (dataList) {
      setList(arrayGroupsByCount(dataList, 3))
    }
  }, [dataList])

  const showPriceByType = (info: any) => {
    if (info) {
      switch (info.priceType) {
        case COMMODITY_TYPE.inquiry:
          return (
            <div className={styles.inquiry_price}>
              <label>{translate('web.resource.mall.zaixianxunjia')}</label>
            </div>
          )
        case COMMODITY_TYPE.integral:
          return (
            <div className={cx(styles.product_price, styles.integral)}>
              {info.min === info.max
                ? `${numFormat(info.min)}${translate('web.resource.mall.integral')}`
                : `${numFormat(info.min)}~${numFormat(info.max)}${translate('web.resource.mall.integral')}`}
            </div>
          )
        case COMMODITY_TYPE.prompt:
          return (
            <div className={styles.product_price}>
              {translate('web.common.currencySymbol')}
              {priceFormat(info.min)}
            </div>
          )
        default:
          return null
      }
    }
    return null
  }

  return priceType && list.length > 0 ? (
    <div className={styles.browse_records}>
      <div className={styles.browse_records_title}>
        <span className={styles.browse_records_title_line}></span>
        <span className={styles.browse_records_title_text}>{translate('web.resource.mall.maijiahaizaikan')}</span>
        <span className={styles.browse_records_title_line}></span>
      </div>
      <div className={styles.carousel_wrap}>
        <Carousel ref={actionRef}>
          {list &&
            list.map((item: any[], index: number) => (
              <div key={`product_list_${index}`} className={styles.browse_records_product_list}>
                {item.map((childItem, childIndex) => (
                  <div
                    key={`browse_records_product_list_item_${childIndex}`}
                    className={styles.browse_records_product_list_item}
                  >
                    <a
                      href={linkPrefix(
                        `/shop/${childItem.storeId}/${getNameByPriceType(childItem.priceType)}/detail/${childItem.id}`,
                      )}
                      title={childItem.name}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className={styles.product_img_box}>
                        <ImageBox width={110} height={110} src={childItem.mainPic} />
                      </div>
                      {showPriceByType(childItem)}
                    </a>
                  </div>
                ))}
              </div>
            ))}
        </Carousel>
        {list.length > 1 && (
          <>
            <LeftOutlined
              translate={undefined}
              className={cx(styles.common_arrow_btn, styles.prev)}
              onClick={() => actionRef.current.prev()}
            />
            <RightOutlined
              translate={undefined}
              className={cx(styles.common_arrow_btn, styles.next)}
              onClick={() => actionRef.current.next()}
            />
          </>
        )}
      </div>
    </div>
  ) : null
}

export default BrowseRecords

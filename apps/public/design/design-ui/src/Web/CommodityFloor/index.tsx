import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { RightOutlined } from '@ant-design/icons'
import { NAV_TYPE } from '@apps/design-ui/constants'
import ImageBox from '@apps/components/src/web/ImageBox'
import { getWebIntl } from '@apps/locales'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { FloorLineLocale } from '../../locale/types/floorline'
import Goods, { CommodityItemType } from './goods'
import { jumpByType } from '../../utils'
import { reloadDataSourceFn } from '../../utils/dataSource'
import styles from './index.less'

export interface SubNavItemType {
  sort: number
  type: NAV_TYPE
  name: string
  value?: string
  valueText?: string
}

interface IProps {
  title?: string
  /** 更多好货跳转类型 */
  moreType?: NAV_TYPE
  /** 更多好货跳转内容 */
  moreValue?: string
  /** 更多好货跳转内容 */
  moreValueText?: string
  /** 上下边距 */
  verticalMargin?: number
  /** 楼层图片 */
  floorImg?: string
  /** 二级入口配置 */
  subNavList?: SubNavItemType[]
  /**
   * 显示的商品数量
   */
  showCount?: number
  commodityList: CommodityItemType[]
  className?: string
  linkdisable?: boolean
  /** 是否显示销量 */
  showSold?: boolean
  /** 价格币种 */
  moneyText?: string
  isStore?: boolean
  /** 重新请求数据源 */
  reloadDataSource?: boolean
  reloadParam?: any
}

const CommodityFloor: React.FC<IProps> = (props) => {
  const {
    className,
    title,
    floorImg,
    subNavList,
    linkdisable,
    moreValue,
    moreType,
    verticalMargin = 8,
    commodityList,
    showSold,
    moneyText,
    showCount = 8,
    isStore = false,
    reloadDataSource = false,
    reloadParam,
    ...others
  } = props
  const translate = getWebIntl()
  const [dataSource, setDataSource] = useState<CommodityItemType[]>(
    commodityList || [],
  )

  useEffect(() => {
    if (!reloadDataSource) {
      setDataSource(commodityList || [])
    }
  }, [commodityList])

  useEffect(() => {
    const reload = () => {
      reloadDataSourceFn(reloadParam, dataSource).then((result) => {
        setDataSource(result)
      })
    }
    if (reloadDataSource) {
      reload()
    }
  }, [])

  const classNameString = cx(styles['commodity-floor'], className)

  return (
    <LocaleReceiver componentName="FloorLine">
      {(locale: FloorLineLocale) => (
        <div
          className={classNameString}
          style={{
            marginTop: verticalMargin,
            marginBottom: verticalMargin,
          }}
          {...others}
        >
          <div className={styles.floor_line_container}>
            <div className={styles.floor_line_name}>
              <span className={styles.floor_line_name_text}>{title}</span>
              <div className={styles.floor_line_name_subnav}>
                {subNavList &&
                  subNavList.length > 0 &&
                  subNavList.map((item, navIndex: number) => (
                    <div
                      className={styles.floor_line_name_subnav_item}
                      key={`${item.name}-${navIndex}`}
                      onClick={() => {
                        jumpByType(
                          { type: item.type, value: item.value },
                          linkdisable,
                          '_blank',
                        )
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
              </div>
              <span
                onClick={() => {
                  jumpByType(
                    { type: moreType, value: moreValue },
                    linkdisable,
                    '_blank',
                  )
                }}
                className={cx(
                  styles.floor_line_more,
                  !linkdisable ? styles.link : '',
                )}
              >
                {translate('web.resource.mall.gengduohaohuo' as never)}{' '}
                <RightOutlined />
              </span>
            </div>
            <div className={styles.floor_line_body}>
              {floorImg ? (
                <ImageBox
                  wrapperClassName={styles['commodity-floor-banner']}
                  src={floorImg}
                  height={showCount === 8 ? 600 : 300}
                  width={240}
                  resizeMode="cover"
                />
              ) : linkdisable ? (
                <div className={styles['commodity-floor-banner-null']}>
                  <span>{locale['floor.img']}</span>
                </div>
              ) : null}
              <Goods
                goodsList={dataSource}
                showSold={showSold}
                moneyText={moneyText}
                linkdisable={linkdisable}
                isStore={isStore}
                showCount={showCount}
              />
            </div>
          </div>
        </div>
      )}
    </LocaleReceiver>
  )
}

export default CommodityFloor

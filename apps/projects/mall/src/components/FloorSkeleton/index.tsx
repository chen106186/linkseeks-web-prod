import React from 'react'
import { Skeleton } from 'antd'
import cx from 'classnames'
import { LAYOUT_TYPE } from '@/types/global'
import styles from './index.module.less'

interface FloorSkeletonPropsType {
  type: LAYOUT_TYPE.joint | LAYOUT_TYPE.shop | LAYOUT_TYPE.own
}

const FloorSkeleton: React.FC<FloorSkeletonPropsType> = (props) => {
  const { type } = props

  const dataList = Array.apply({}, new Array(9))
  const goodsList = Array.apply({}, new Array(10))
  const brandList = Array.apply({}, new Array(6))
  const shopList = Array.apply({}, new Array(5))

  const renderSkeleton = () => {
    switch (type) {
      case LAYOUT_TYPE.joint:
        return (
          <div className={styles.floor_line}>
            <div className={styles.floor_line_container}>
              <div className={styles.floor_line_name}>
                <span className={styles.floor_line_name_text}>
                  <Skeleton.Button style={{ width: 200 }} active />
                </span>
                <span className={styles.floor_line_more}>
                  <Skeleton.Button style={{ width: 200 }} active />
                </span>
              </div>
              <div className={styles.floor_line_body}>
                <div className={styles.floor_line_horizontal}>
                  <section className={styles['floor-line-category']}>
                    <Skeleton.Button active className={styles.skeleton_image} />
                  </section>
                  <div className={styles.floor_line_vertical}>
                    <section className={styles['floor-line-header']}>
                      <div className={styles['floor-line-header-count-info']}>
                        <div className={styles['floor-line-header-count-info-item']}>
                          <Skeleton.Button style={{ width: 150 }} active />
                        </div>
                        <div className={styles['floor-line-header-count-info-item']}>
                          <Skeleton.Button style={{ width: 150 }} active />
                        </div>
                        <section className={styles['floor-line-banner']}>
                          <Skeleton.Button active className={styles.skeleton_image} />
                        </section>
                      </div>
                    </section>
                    <div className={styles.floor_line_horizontal}>
                      <section className={styles['floor-line-goods']}>
                        <div className={styles.goods_list}>
                          {goodsList.map((_, index) => (
                            <div key={`goods_list_item_${index}`} className={styles.goods_list_item}>
                              <div className={styles.goods_img}>
                                <Skeleton.Button active className={styles.skeleton_image} />
                              </div>
                              <div className={styles.goods_name}>
                                <Skeleton.Button active style={{ width: 120, height: 24 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                      <section className={styles['floor-line-shop']}>
                        <div className={styles.shop_title}>
                          <Skeleton.Button active style={{ width: 120, height: 24 }} />
                        </div>
                        <div className={styles.shop_list}>
                          {shopList.map((_, index) => (
                            <div key={`shop_list_item-${index}`} className={styles.shop_list_item}>
                              <div className={styles.shop_logo}>
                                <Skeleton.Avatar active />
                              </div>
                              <div className={styles.shop_name}>
                                <Skeleton.Button active style={{ width: 160, height: 24 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <section className={styles['floor-line-brand']}>
                  <div className={styles.brand_list}>
                    {brandList.map((_, index) => (
                      <div className={styles.brand_list_item} key={`brand_list_item_${index}`}>
                        <div className={styles.brand_img_box}>
                          <Skeleton.Button active className={styles.skeleton_image} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )
      case LAYOUT_TYPE.shop:
        return (
          <div className={styles.shop_floor_line}>
            <div className={styles.floor_line_container}>
              <div className={styles.floor_line_name}>
                <span className={styles.floor_line_name_text}>
                  <Skeleton.Button style={{ width: 200 }} active />
                </span>
                <span className={styles.floor_line_more}>
                  <Skeleton.Button style={{ width: 200 }} active />
                </span>
              </div>
              <div className={styles.floor_line_body}>
                <section className={styles['shop-floor-line-category']}>
                  <Skeleton.Button active className={styles.skeleton_image} />
                </section>
                <section className={styles['shop-floor-line-goods']}>
                  <div className={styles.goods_list}>
                    <div className={cx(styles.goods_list_item, styles.empty)}></div>
                    {dataList &&
                      dataList.map((_, index) => (
                        <div key={`goods_list_item_${index}`} className={styles.goods_list_item}>
                          <div className={styles.goods_img}>
                            <Skeleton.Button active className={styles.skeleton_image} />
                          </div>
                          <div className={styles.goods_name}>
                            <Skeleton.Input active style={{ width: 200 }} />
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderSkeleton()
}

export default FloorSkeleton

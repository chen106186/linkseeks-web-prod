import { Skeleton } from 'antd'
import React from 'react'
import styles from './index.module.less'

const Loading: React.FC = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.activityImage}>
        <Skeleton.Input style={{ width: '100%', height: '416px' }} active={true} />
      </div>

      <div className={styles.coupon}>
        <div className={styles.couponContainer}>
          {[1, 2, 3, 4].map((_item) => {
            return (
              <div className={styles.couponItem} key={_item}>
                <Skeleton.Input style={{ width: '100%', height: '118px' }} active={true} />
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.commodity}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Skeleton.Input style={{ width: '120px', height: '30px' }} active={true} />
          </div>
          <div className={styles.cardBody}>
            {[1, 2, 3, 4, 5].map((_item) => {
              return (
                <div className={styles.commodityItem} key={_item}>
                  <Skeleton.Input style={{ width: '100%', height: '118px' }} active={true} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {[1, 2, 3, 4].map((_item) => {
        return (
          <div className={styles.commodity} key={_item}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Skeleton.Input style={{ width: '120px', height: '30px' }} active={true} />
              </div>
              <div className={styles.cardBody}>
                {[1, 2, 3, 4, 5].map((_item) => {
                  return (
                    <div className={styles.commodityItem} key={_item}>
                      <div className={styles.commodityImage}>
                        <Skeleton.Input style={{ width: '100%', height: '200px' }} active={true} />
                      </div>
                      <div className={styles.commodityInfo}>
                        <div className={styles.skeletonItem}>
                          <Skeleton.Input style={{ width: '108px', height: '16px' }} active={true} />
                        </div>
                        <div className={styles.skeletonItem}>
                          <Skeleton.Input style={{ width: '64px', height: '16px' }} active={true} />
                        </div>
                        <div className={styles.skeletonItem}>
                          <Skeleton.Input style={{ width: '166px', height: '16px' }} active={true} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Loading

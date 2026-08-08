import React from 'react'
import cx from 'classnames'
import { View, Text, Icons } from '@apps/mobile-ui'
import { Image } from '@tarojs/components'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

const Products = (props: any) => {
  const {
    dataSource: { upperMemberName, logo, currentPoint, sumReturnMoney, upperMemberId, upperRoleId },
  } = props
  const intl = useIntl()

  const handleJump = () => {
    Router.navigateTo('members/shop', {
      memberId: upperMemberId,
      roleId: upperRoleId,
    })
  }
  return (
    <View className={styles['card-bg-color']}>
      <View className={styles['card-column']} onClick={handleJump}>
        <View
          style={{
            background: `no-repeat url(${logo})`,
            backgroundSize: '100%',
            backgroundPosition: '0 50%',
          }}
        >
          <View className={styles['blur_view']}>
            <View className={styles['card-padding']} style={{ backgroundColor: 'rgba(0,0,0,0.24)' }}>
              <View className={styles['card-row']}>
                <View className={styles['image-container']}>
                  {logo ? (
                    <Image src={`${logo}`} className={styles['img']} />
                  ) : (
                    <Icons name="Mine" size={48} color="#FFFFFF" />
                  )}
                </View>
                <View>
                  <Text className={styles['font-black3']}>{upperMemberName}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className={cx(styles['card-padding'], styles['card-row'], styles['card-bottom'])}>
          <View className={cx(styles['card-column'], styles['card-bottom-num'])}>
            <View>
              <Text className={styles['fontBlack2']}>
                {intl.formatMessage({ id: 'card.myCardBag.products.currentPoint', defaultMessage: '可用积分' })}
              </Text>
            </View>
            <View className={styles['margins']}>
              <Text className={styles['font-black1']}>
                {currentPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
          </View>
          <View className={cx(styles['card-column'], styles['card-bottom-num'])}>
            <View>
              <Text className={styles['font-black2']}>
                {intl.formatMessage({ id: 'card.myCardBag.products.sumReturnMoney', defaultMessage: '累计返现' })}
              </Text>
            </View>
            <View className={styles['margins']}>
              <Text className={styles['font-black1']}>
                {sumReturnMoney
                  // ?.toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Products

import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Icons } from '@apps/mobile-ui'
import { setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import InfoCard from '@/components/InfoCard'
import { COLOR, PRIMARY } from '@/constants/theme'
import styles from './index.module.scss'

const mock = [
  { id: 1, name: '现货采购合同模板' },
  { id: 2, name: '询价采购合同模板' },
]

const OrderContractTemplate = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const [chooseId, setChooseId] = useState<number>()

  useEffect(() => {
    setNavigationBarTitle({
      title: intl.formatMessage({ id: 'order.selectElectronicContractTemplate', defaultMessage: '选择电子合同模板' }),
    })
  }, [])

  return (
    <View className={styles['container']}>
      <View className={styles['choose-wrap']}>
        {mock.map((item) => (
          <InfoCard
            key={item.id}
            title={item.name}
            subtitle={
              item.id === chooseId ? (
                <Icons name="CheckFill" color={COLOR[PRIMARY]} />
              ) : (
                <View className={styles['circle-box']}>
                  <View className={styles['circle']} />
                </View>
              )
            }
            onCardClick={() => setChooseId(item.id)}
          />
        ))}
      </View>
      <View className={styles['btn-wrap']} style={{ paddingBottom: pxTransform(safeBottomHeight || 6) }}>
        <View className={styles['btn']}>
          {intl.formatMessage({ id: 'order:order.generateContract', defaultMessage: '生成合同' })}
        </View>
      </View>
    </View>
  )
}

export default OrderContractTemplate

import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Switch } from '@apps/mobile-ui'
import { setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import InfoCard from '@/components/InfoCard'
import TextIcon from '@/components/TextIcon'
import { COLOR, MAIN_TEXT, PRIMARY } from '@/constants/theme'
import Router from '@/utils/router'
import styles from './index.module.scss'

const OrderContract = () => {
  const intl = useIntl()
  const [isUse, setIsUse] = useState<boolean>(false)

  useEffect(() => {
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'order.electronicContract', defaultMessage: '电子合同' }) })
  }, [])

  return (
    <View className={styles['container']}>
      <InfoCard
        title={intl.formatMessage({ id: 'order.isUse', defaultMessage: '是否使用' })}
        subtitle={<Switch checked={isUse} onChange={(value) => setIsUse(value)} color={COLOR[PRIMARY]} />}
      />
      {isUse && (
        <>
          <InfoCard
            title={intl.formatMessage({ id: 'order.contractTemplate', defaultMessage: '合同模板' })}
            subtitle={
              <TextIcon
                text="现货采购合同模板V1.0"
                iconSize={16}
                customTextStyle={{ fontSize: pxTransform(14), color: COLOR[MAIN_TEXT] }}
              />
            }
            customHeaderStyle={{ padding: `${pxTransform(6)} 0` }}
            onCardClick={() => Router.navigateTo('root/orderExamine/orderContractTemplate')}
          />
          <InfoCard
            title={intl.formatMessage({ id: 'order.uploadElectronicContract', defaultMessage: '上传电子合同' })}
          />
        </>
      )}
    </View>
  )
}

export default OrderContract

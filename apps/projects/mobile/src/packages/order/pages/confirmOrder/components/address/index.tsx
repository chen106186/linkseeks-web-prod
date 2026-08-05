import React from 'react'
import { View, Text, Image, Icons } from '@apps/mobile-ui'
import Label from '@/components/Label'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import { THEME_COLORS } from '@/constants/theme'
import styles from './index.module.scss'

const location = getOssUrlPath('/miniprogram/assets/images/location.png')
const Dashed = getOssUrlPath('/miniprogram/assets/images/dashed.png')

interface Iprops {
  addressInfo: {
    fullAddress: string
    id: number
    phone: string
    receiverName: string
    isDefault: number
  } | null
  handleSelectAddress?: null | ((addressItem: any) => void)
  hasOtherAddress?: boolean
}

const Address = (props: Iprops) => {
  const intl = useIntl()
  const { addressInfo, handleSelectAddress, hasOtherAddress } = props
  const handleAddress = () => {
    if (addressInfo === null && hasOtherAddress === false) {
      Router.navigateTo('basicSetting/addressAdd', {
        active: '0',
        handleSelectAddress: '',
        // events: {
        //   handleSelectAddress:handleSelectAddress
        // }
      })
      return
    }
    Router.navigateTo('basicSetting/addressList', {
      handleSelectAddress: '',
    })
  }
  return (
    <MellowCard className={styles['mellow-card-body-warp']}>
      <View className={styles['address-card']} onClick={handleAddress}>
        <Image src={location} className={styles['img']} />
        <View className={styles['address-value']}>
          {addressInfo && addressInfo.receiverName ? (
            <View className={styles['address-info']}>
              <View className={styles['name-and-phone']}>
                <Text className={styles['name']}>{addressInfo.receiverName}</Text>
                <Text className={styles['phone']}>{addressInfo.phone}</Text>
                {(addressInfo.isDefault && (
                  <View>
                    <Label
                      type="primary"
                      className={styles['tag']}
                      name={intl.formatMessage({ id: 'confirmOrder_components_address_labelName' })}
                    />
                  </View>
                )) ||
                  null}
              </View>
              <Text className={styles['address-detail']}>{addressInfo.fullAddress}</Text>
            </View>
          ) : (
            <Text className={styles['address-text']}>
              {intl.formatMessage({ id: 'confirmOrder_components_address_addressText' })}
            </Text>
          )}
          <Icons name="ChevronRight" size={16} color={THEME_COLORS.textSecondary} />
        </View>
        <Image src={Dashed} className={styles['dashed']} />
      </View>
    </MellowCard>
  )
}

Address.defaultProps = {
  handleSelectAddress: null,
  hasOtherAddress: true,
}

export default Address

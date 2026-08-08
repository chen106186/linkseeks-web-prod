import React from 'react'
import { getCurrentInstance, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { themeLayout } from '@/constants/theme'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import AddressCard from '@/components/AddressCard'
import Router from '@/utils/router'

export interface AddressValue {
  /**
   * 数据id
   */
  id: number
  /**
   * 完整地址
   */
  fullAddress: string
  /**
   * 是否是默认地址
   */
  isDefault: boolean
  /**
   * 手机号码
   */
  phone: string
  /**
   * 邮编
   */
  postalCode: number
  /**
   * 收件人
   */
  receiverName: string
  /**
   * 固话
   */
  tel: number
}

interface IProps {
  /**
   * 是否可以编辑
   */
  isEdit?: boolean
  /**
   * 是否展示标题
   */
  showTitle?: boolean
  /**
   * 地址数据
   */
  address: AddressValue
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 地址改变触发
   */
  onChange?: (value: AddressValue) => void
}

const RepairAddress: React.FC<IProps> = (props: IProps) => {
  const params = getCurrentInstance().preloadData as any

  const { isEdit, address, customStyle, onChange } = props

  const intl = useIntl()

  const handleJump = () => {
    // 跳转
    preload({
      ...params,
      addressList: (value: AddressValue) => {
        if (onChange) {
          onChange(value)
        }
      },
    })
    Router.navigateTo('basicSetting/addressList')
  }

  return (
    <MellowCard
      style={customStyle}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Cell>
        <Cell.Item
          title={intl.formatMessage({
            id: 'repairRecords.components.repairAddress.address',
            defaultMessage: '维修地址',
          })}
          value={
            address.id
              ? ''
              : intl.formatMessage({
                  id: 'repairRecords.components.repairAddress.address.placeholder',
                  defaultMessage: '请选择',
                })
          }
          onPress={handleJump}
          hasArrow={isEdit}
          clickable={isEdit}
          customHeadStyle={{
            alignItems: 'flex-start',
            borderBottomWidth: 1,
            borderBottomColor: '#F5F6F7',
          }}
          label={
            address.id ? (
              <AddressCard
                data={{
                  id: address.id,
                  name: address.receiverName,
                  phoneNum: address.phone,
                  fullAddress: address.fullAddress,
                }}
                customStyle={{
                  paddingTop: pxTransform(themeLayout['padding-s']),
                }}
              />
            ) : null
          }
        />
      </Cell>
    </MellowCard>
  )
}

RepairAddress.defaultProps = {
  isEdit: false,
  showTitle: true,
  customStyle: {},
  onChange: undefined,
}

export default RepairAddress

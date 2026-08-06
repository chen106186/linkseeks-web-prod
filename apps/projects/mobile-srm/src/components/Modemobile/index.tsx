import React, { useState } from 'react'
import { View, Text, Image, ActionSheet } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { useTelCode } from '@apps/services'
import { getOssUrlPath } from '@apps/constants'
import './index.scss'

const Tick = getOssUrlPath('/miniprogram/assets/images/tick.png')

interface Iprops {
  /**
   * 显示隐藏
   *
   * */
  toggle: boolean
  /**
   * 取消
   *
   * */
  onClose: (value: any) => void
  /**
   * 确认
   *
   * */
  onConfirm: (value: any) => void
}
interface CountryListIprops {
  label: string
  value: string
  phoneLength: number
}

const ModeMobileView = (props: Iprops) => {
  const intl = useIntl()
  const { toggle, onConfirm, onClose } = props
  const [actIndex, setActIndex] = useState<number>(0)
  const { telColOptions } = useTelCode()

  const onCountryItem = (item: CountryListIprops, index: number) => {
    setActIndex(index)
    onConfirm(item)
  }
  const Close = () => {
    onClose({ toggle: false })
  }

  if (!toggle) {
    return null
  }

  return (
    <ActionSheet isOpened={toggle} onClose={() => Close()} customContainerStyle="customHeight">
      <View className="content">
        <View className="title">
          {intl.formatMessage({ id: 'user.xuanzeguojiadiqu', defaultMessage: '选择国家/地区' })}
        </View>
      </View>
      <View className="countryList">
        {telColOptions.map((item, index: number) => (
          <View className="countryItem" key={item.value} onClick={() => onCountryItem(item, index)}>
            <View>
              <Text className={actIndex === index ? 'name' : 'text'}>{item.label}</Text>
            </View>
            <View className="countryRight">{actIndex === index && <Image className="ItemIcon" src={Tick} />}</View>
          </View>
        ))}
      </View>
    </ActionSheet>
  )
}
ModeMobileView.defaultProps = {
  areaList: [],
  toggle: false,
}
export default ModeMobileView

import React, { Fragment, useMemo, useState } from 'react'
import { View, Text, ActionSheet } from '@apps/mobile-ui'
import { useCountryCodeList } from '@apps/services'
import { useMobileIntl } from '@apps/locales'
import { ActionsItem } from '@apps/mobile-ui/packages/types/action-sheet'
import './index.scss'

interface Iprops {
  value?: any
  onChange?(value: any): void
}

const ModeCountryCode = (props: Iprops) => {
  const { value, onChange } = props
  const [visible, setVisible] = useState<boolean>(false)
  const { countryCodeList, defaultCountryCode, getCountryCode } = useCountryCodeList()
  const translate = useMobileIntl()

  const countryCode = useMemo(() => {
    if (value) {
      return getCountryCode(value)
    }
  }, [value, getCountryCode, defaultCountryCode])

  const handleClose = () => {
    setVisible(false)
  }

  const onCountryItem = (item: ActionsItem | undefined) => {
    onChange && onChange(item?.value)
    handleClose()
  }

  const actions: ActionsItem[] = useMemo(() => {
    if (countryCodeList && countryCodeList.length > 0) {
      return countryCodeList.map((item) => ({
        name: item.label,
        value: item.value as any,
      }))
    }
    return []
  }, [countryCodeList])

  return (
    <Fragment>
      <View className="countryCode" onClick={() => setVisible(true)}>
        {countryCode?.label ? (
          <Text className="countryCodeText">{countryCode?.label}</Text>
        ) : (
          <Text className="placeholder">{translate('mobile.common.qingxuanzeguojiabianma')}</Text>
        )}
      </View>
      <ActionSheet
        title={translate('mobile.common.xuanzeguanjiadiqu')}
        isOpened={visible}
        onClose={handleClose}
        actions={actions}
        onSelect={(_, item) => onCountryItem(item)}
        cancelText={translate('mobile.common.cancel')}
      />
    </Fragment>
  )
}
ModeCountryCode.defaultProps = {
  areaList: [],
  toggle: true,
}
export default ModeCountryCode

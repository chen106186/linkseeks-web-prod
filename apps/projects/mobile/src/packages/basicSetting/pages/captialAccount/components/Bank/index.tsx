import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, ScrollView, SearchBar } from '@apps/mobile-ui'
import { getPayAllInPayGetBankList } from '@apps/apis'
import Popup from '../../../../../../components/Popup'
import styles from './index.module.scss'

interface Iprops {
  // 显示控制
  Visible: boolean
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onConfirm?: (item: any, allMap?: any) => void
}

const Bank: React.FC<Iprops> = (props: Iprops) => {
  const { Visible, onClose, onConfirm } = props
  const [BankList, setBankList] = useState([])
  const intl = useIntl()
  const [keyword, setKeyword] = useState('')

  const onChangeKeyWord = (value) => {
    setKeyword(value)
  }

  const getBankList = async () => {
    const res = await getPayAllInPayGetBankList()
    if (res.code === 1000) {
      setBankList(res.data)
    }
  }
  useEffect(() => {
    getBankList()
  }, [])

  const handleSelect = (item: any) => {
    onConfirm && onConfirm(item)
    onClose && onClose()
  }

  return (
    <Popup
      visible={Visible}
      onClose={() => {
        onClose && onClose()
      }}
      onClickOverlay={() => {
        onClose && onClose()
      }}
      closeable={false}
    >
      <View className={styles.title}>
        {intl.formatMessage({ id: 'pay.qingxuanzeyinhang', defaultMessage: '请选择银行' })}
      </View>
      <SearchBar value={keyword} onChange={onChangeKeyWord} />
      <ScrollView className={styles.BankList}>
        {BankList.filter((v: any) => v?.name.includes(keyword)).map((item: any) => (
          <View onClick={() => handleSelect(item)} key={item.id}>
            <View className={styles.BankListItem}>
              <View className={styles.BankName}>{item.name}</View>
            </View>
          </View>
        ))}
      </ScrollView>
    </Popup>
  )
}
export default Bank

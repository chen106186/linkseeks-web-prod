import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image, Icons, Input, ScrollView, Button } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import cs from 'classnames'
import styles from './index.module.scss'
import Popup from '@/components/Popup'
import { useStatusBarHeight, useSafeArea } from '@apps/mobile-services'

interface Iprops {
  visible: boolean
  categoryList: any[]
  onReset?: () => void
  onConfirm?: (event: any) => void
  onClose: () => void
}

const FilterPopup: React.FC<Iprops> = (props: Iprops) => {
  const { visible, categoryList, onReset, onConfirm, onClose } = props
  const intl = useIntl()
  const { statusBarHeight } = useStatusBarHeight()
  const { safeBottomHeight } = useSafeArea()
  const [keyword, setKeyword] = useState<string>('')
  const [categoryId, setCategoryId] = useState<number>(0)

  return (
    <Popup
      visible={visible}
      position="right"
      round={false}
      closeOnClickOverlay={false}
      closeable={false}
      customStyle={{ background: 'transparent' }}
    >
      <View className={styles['wrapper']} onClick={onClose}>
        <View
          className={styles['header']}
          style={{ paddingTop: statusBarHeight }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Icons className={styles['back']} name="ChevronLeft" size={24} onClick={onClose} />
          <View className={styles['search-box']}>
            <Icons name="Search" size={24} color="#C8CACD" />
            <Input
              className={styles['input']}
              value={keyword}
              placeholder={intl.formatMessage({ id: 'communityGroupBuy.list.shucai', defaultMessage: '蔬菜' })}
              placeholderStyle="color: #C8CACD;"
              onChange={(value) => {
                setKeyword(String(value))
              }}
            />
          </View>
        </View>
        <View
          className={styles['content']}
          style={{ paddingBottom: pxTransform(safeBottomHeight) }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <ScrollView scrollY className={styles['list']}>
            <View className={styles['list-content']}>
              <View className={styles['list-content-title']}>
                {intl.formatMessage({
                  id: 'communityGroupBuy.list.pinlei',
                  defaultMessage: '品类',
                })}
              </View>
              <View className={styles['list-content-tags']}>
                {categoryList?.map((item, index) => (
                  <View
                    key={index.toString()}
                    className={cs(styles['item'], categoryId === item.id && styles.selected)}
                    onClick={() => {
                      setCategoryId(item.id)
                    }}
                  >
                    {item.name}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          <View className={styles['buttons']}>
            <Button
              className={styles['cancel']}
              onClick={() => {
                setKeyword('')
                setCategoryId(0)
                onReset?.()
                onClose()
              }}
            >
              {intl.formatMessage({
                id: 'communityGroupBuy.list.chongzhi',
                defaultMessage: '重置',
              })}
            </Button>
            <Button
              className={styles['confirm']}
              onClick={() => {
                onConfirm?.({
                  productName: keyword,
                  categoryId,
                })
                onClose()
              }}
            >
              {intl.formatMessage({
                id: 'communityGroupBuy.list.queding',
                defaultMessage: '确定',
              })}
            </Button>
          </View>
        </View>
      </View>
    </Popup>
  )
}

export default FilterPopup

import React from 'react'
import { View, Image, Text, Toast } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

export interface dataSourceProps {
  label: string
  extra?: React.ReactNode
  isTitle?: boolean
  isCopy?: boolean
  viewStyle?: boolean
  flexDirection?: boolean
  vertical?: boolean
}

interface ListProps {
  dataSource: dataSourceProps[]
  paddingHorizontal?: number
  color?: string
}

const List = (props: ListProps) => {
  const { dataSource, color } = props
  const intl = useIntl()
  const clipboard = (data: any) => {
    console.log(data, '复制')
    // Clipboard.setString(data)
    Toast.show({ title: intl.formatMessage({ id: 'order.fuzhichenggong', defaultMessage: '复制成功' }) })
  }

  const disable = () => {
    let flag = true
    const data = [...dataSource]
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].extra) {
        flag = true
        break
      } else {
        flag = false
      }
    }
    return flag
  }
  return (
    <>
      {disable() && (
        <View>
          {dataSource.map((item: dataSourceProps, index: number) => (
            <View style={{ flex: 1, flexDirection: 'column' }} key={`tabItem-${index + 1}`}>
              {(item.isTitle || item.extra) && (
                <View>
                  <View className={styles['tabItem']}>
                    {item.label && (
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: item.isTitle ? '#252D37' : '#5C626A',
                            fontWeight: item.isTitle ? 900 : 400,
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    )}
                    {item.extra && !item.viewStyle && (
                      <View style={{ flex: 2, textAlign: 'right' }}>
                        {
                          // style={style.textStyle}
                          // numberOfLines={2}
                          item.flexDirection ? item.extra : <View className={styles['textStyle']}>{item.extra}</View>
                        }
                        {/* style={style.viewStyle} */}
                        {item.isCopy && <View />}
                        {item.isCopy && (
                          // onPress={() => clipboard(item.extra)}
                          // style={style.textCopyStyle}
                          <Text>{intl.formatMessage({ id: 'order.fuzhi', defaultMessage: '复制' })}</Text>
                        )}
                      </View>
                    )}
                    {item.extra && item.viewStyle && <View style={{ flex: 2 }}>{item.extra}</View>}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </>
  )
}
export default List

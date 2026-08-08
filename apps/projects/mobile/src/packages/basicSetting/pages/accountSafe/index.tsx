import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import cx from 'classnames'
import { pxTransform, useDidShow, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView, Modal, Image } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import useAccountSafe from './services/hooks/useAccountSafe'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
const sing = getOssUrlPath('/miniprogram/assets/images/sign.png')
const starImg = getOssUrlPath('/miniprogram/assets/images/star.png')
const starWhite = getOssUrlPath('/miniprogram/assets/images/star-white.png')
const AccountSafe: React.FC = () => {
  const intl = useIntl()
  const {
    toggle,
    name,
    fraction,
    passScore,
    star,
    end,
    data,
    tips,
    handleJump,
    getUserInfo,
    getSecurity,
    setToggle,
    setConfirm,
  } = useAccountSafe()
  usePageInit()
  useDidShow(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.zhanghuanquan', defaultMessage: '账户安全' }) })
    getUserInfo()
    getSecurity()
  })
  return (
    <View className={styles['page']}>
      <ScrollView className={styles['safe-container']}>
        <View className={styles['user']}>
          <Text className={styles['user-name']}>{name}</Text>
          {/* sign */}
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Text className={styles['slogen']}>
              {intl.formatMessage({
                id: 'user.duofangweibaohunidezhang',
                defaultMessage: '多方位保护你的账号安全',
              })}
            </Text>
            <Image
              src={sing}
              style={{
                width: pxTransform(13),
                height: pxTransform(13),
                marginLeft: pxTransform(5),
              }}
            />
          </View>
          <View
            className={cx(
              styles['safe-score'],
              fraction >= passScore ? styles['safe-score-full'] : styles['safe-score-low'],
            )}
          >
            <View>
              <Text className={styles['score']}>{fraction}</Text>
              <View className={styles['tips']}>
                <Text className={styles['tips-text']}>
                  {fraction === 100
                    ? intl.formatMessage({
                        id: 'user.zhanghaoxinxiyiquanbutian',
                        defaultMessage: '账号信息已全部填完',
                      })
                    : intl.formatMessage({
                        id: 'user.dangzhanghaoxinxiweibuquan',
                        defaultMessage: '当账号信息未补全',
                      })}
                </Text>
                <Text className={styles['tips-text']}>
                  {fraction === 100
                    ? intl.formatMessage({
                        id: 'user.ruyouwentiqingjishixiu',
                        defaultMessage: '如有问题请及时修改',
                      })
                    : intl.formatMessage({
                        id: 'user.zhanghaoxinxiweiquanbutian',
                        defaultMessage: '账号信息未全部填完 请完善信息',
                      })}
                </Text>
              </View>
            </View>
            <View className={styles['rating']}>
              {new Array(star).fill(1).map((item: any, index: number) => {
                return (
                  <Image
                    key={index}
                    src={starWhite}
                    style={{
                      width: pxTransform(16),
                      height: pxTransform(16),
                    }}
                  />
                )
              })}
              {new Array(end).fill(1).map((item: any, index: number) => {
                return (
                  <Image
                    key={index}
                    src={starImg}
                    style={{
                      width: pxTransform(16),
                      height: pxTransform(16),
                    }}
                  />
                )
              })}
            </View>
          </View>
        </View>
        <View className={styles['section']}>
          {data.map((item: any) => (
            <View
              onClick={() => handleJump(item.dataIndex, item.value)}
              key={item.icon}
              className={styles['height-light']}
            >
              <View className={styles['select-item']}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    src={item.icon}
                    style={{
                      marginTop: pxTransform(5),
                      width: pxTransform(24),
                      height: pxTransform(24),
                    }}
                  />
                  <Text className={styles['title']}>{item.title}</Text>
                </View>
                <View className={styles['extra-side']}>
                  <Text className={styles['extra-title']}>{item.value}</Text>
                  <Icons name="ChevronRight" size={14} color="#91959B" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* 模态框 */}
      <Modal
        className={styles['account-model']}
        title={tips}
        confirmText={intl.formatMessage({
          id: 'user.shezhi',
          defaultMessage: '设置',
        })}
        cancelText={intl.formatMessage({
          id: 'user.quxiao',
          defaultMessage: '取消',
        })}
        isOpened={toggle}
        onClose={() => {
          setToggle(false)
        }}
        onCancel={() => {
          setToggle(false)
        }}
        onConfirm={() => {
          setConfirm()
          setToggle(false)
        }}
      />
    </View>
  )
}
export default GlobalWrapper(AccountSafe)

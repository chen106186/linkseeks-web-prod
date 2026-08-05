import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { pxTransform, showModal, showToast } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, ScrollView, Modal, Toast } from '@apps/mobile-ui'
import { localeLng } from '@/constants/locales'
import { LANGUAGE, APP_VERSION } from '@/constants/storage'
import useStores from '@/store/useStores'
import { getAsyncStorage, setAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import Popup from '@/components/Popup'
import { getManageContentNoticeFindAllByColumnType, getMemberLogOut } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useLanguage } from '@apps/domains'
import { getOssUrlPath } from '@apps/constants'
import { IS_WEB } from '@/constants'
import { useMobileIntl } from '@apps/locales'
import { updateLocalesFile } from '@/utils/locales'
const iconRight = getOssUrlPath('/miniprogram/assets/images/icon-right.svg')
import useJmpHome from '@/hooks/useJmpHome'

const AccountSettings = () => {
  const intl = useIntl()
  const { jmpDefaultHome } = useJmpHome()
  const translate = useMobileIntl()
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [version, setVersion] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const {
    userStore: { userInfo, removeUserInfo },
    confirmOrderStore: { clearAll },
  } = useStores()
  const { languageList } = useLanguage()

  // const [SettingsList, setKeySettingsList] = useState<any>({
  //   cell1: [],
  //   cell2: [],
  // })
  const [size, setsize] = useState('25.88MB')
  const [contents, setcontents] = useState([])
  const [localeVisible, setLocaleVisible] = useState<boolean>(false)
  const [locale, setLocale] = useState<any>(localeLng[0].lng)
  usePageInit()
  const logOut = async () => {
    await getMemberLogOut()
  }
  const handleLogout = async () => {
    logOut()
    removeUserInfo()
    clearAll()
    Toast.show({
      title: intl.formatMessage({
        id: 'user.tuichuchenggong',
        defaultMessage: '退出成功',
      }),
    })
    Router.redirectTo('user/login')
  }
  const jmpP = (item: any) => {
    if (item.url === 'WebViewInfo') {
      Router.navigateTo('basicSetting/webView', {
        columnType: '6',
      })
      return
    }
    if (item.url) {
      Router.navigateTo(item.url)
      return
    }
    if (item.name === '清除本地缓存') {
      setToggle(true)
      return
    }
    if (item?.isLocale) {
      setLocaleVisible(true)
    }
  }
  /* 协议 */
  const findAllByColumnType = () => {
    getManageContentNoticeFindAllByColumnType({
      columnType: '2',
    }).then((res: any) => {
      if (res.code === 1000) {
        let WebView: any = {}
        res.data.map((item: any) => {
          if (
            item.title ===
            intl.formatMessage({
              id: 'user.yinsizhengce',
              defaultMessage: '隐私政策',
            })
          ) {
            WebView = item
          }
          return {}
        })
        setcontents(WebView)
      }
    })
  }
  const setConfirm = () => {
    setToggle(false)
    setsize('0.0MB')
  }
  const handleChangeLng = async (item) => {
    if (item.key === locale) {
      showToast({ title: '当前已经是了～请尝试切换其他语言', icon: 'none', duration: 2500 })
      return
    }
    showModal({
      title: '温馨提示',
      content: `是否确认切换当前语言为 ${item.language} ?`,
      success: async (res) => {
        if (res.confirm) {
          await updateLocalesFile(item.key)
          intl.i18n.changeLanguage(item?.key, () => {
            setAsyncStorage(LANGUAGE, item)
            setLocaleVisible(false)
            setLocale(item?.key)
            // 跳转首页
            jmpDefaultHome()
          })
        } else if (res.cancel) {
          setLocaleVisible(false)
          showToast({ title: '取消切换语言', icon: 'none', duration: 2500 })
        }
      },
    })
  }
  const currentLanguage = useMemo(
    () => languageList.find((item) => item.key === locale)?.language || '',
    [languageList, locale],
  )
  const SettingsList = useMemo(() => {
    return {
      cell1: [
        {
          name: intl.formatMessage({
            id: 'user.zhanghuanquan',
            defaultMessage: '账户安全',
          }),
          url: 'basicSetting/accountSafe',
        },
        {
          name: intl.formatMessage({
            id: 'user.shouhuodizhi',
            defaultMessage: '收货地址',
          }),
          url: 'basicSetting/addressList',
        },
        {
          name: intl.formatMessage({
            id: 'user.fapiaotaitou',
            defaultMessage: '发票抬头',
          }),
          url: 'basicSetting/invoiceList',
        },
        {
          name: intl.formatMessage({
            id: 'user.bangzhuxinxi',
            defaultMessage: '帮助信息',
          }),
          url: 'basicSetting/HelpCenter',
        },
        {
          name: intl.formatMessage({
            id: 'user.yinsizhengce',
            defaultMessage: '隐私政策',
          }),
          url: 'WebViewInfo',
        },
      ],
      cell2: [
        {
          name: intl.formatMessage({
            id: 'user.dangqianyuyan',
            defaultMessage: '当前语言',
          }),
          key: currentLanguage,
          islike: false,
          isLocale: true,
        },
        {
          name: intl.formatMessage({
            id: 'user.dangqianbanben',
            defaultMessage: '当前版本',
          }),
          key: version,
          islike: false,
        },
        // {
        //   name: '清除本地缓存',
        //   key: '25.88M',
        //   islike: false,
        // },
      ],
    }
  }, [locale, version, languageList])
  const getLanguage = async () => {
    const language = await getAsyncStorage(LANGUAGE)
    if (language) {
      setLocale(language?.key)
    } else {
      setLocale(languageList[0].key)
    }
  }
  useEffect(() => {
    if (languageList && languageList.length > 0) {
      getLanguage()
    }
  }, [languageList])
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.zhanghushezhi', defaultMessage: '账户设置' }) })
    findAllByColumnType()
    async function getVersion() {
      const res = await getAsyncStorage(APP_VERSION)
      setVersion(res)
    }
    getVersion()
  }, [])
  const userTypeLink = () => {
    const user: any = userInfo
    if (user.userType === 1) {
      Router.navigateTo('basicSetting/memberInfo')
    } else {
      Router.navigateTo('basicSetting/userInfo')
    }
  }
  return (
    <View className={styles['main']}>
      <ScrollView
        style={{
          padding: pxTransform(9),
          flex: 1,
          height: '100%',
        }}
      >
        <View className={styles['head']} onClick={userTypeLink}>
          <View className={styles['section']}>
            <View className={styles['left']}>
              <View className={styles['name']}>
                <Text className={styles['text']}>{userInfo?.userName}</Text>
                <Text className={styles['phone']}>{userInfo?.phone}</Text>
              </View>
            </View>
            {(loading && <View className={cx(styles['img'], styles['loading'])}></View>) || (
              <View className={styles['right']}>
                <Image
                  className={styles['img']}
                  src={userInfo?.logo ? userInfo?.logo : getOssUrlPath(`/Images/icon.png`)}
                />
                <Image className={styles['icon-right']} src={iconRight} />
              </View>
            )}
          </View>
        </View>
        <View className={styles['settings-list']}>
          <View className={styles['settings-list-item']}>
            {SettingsList.cell1.map(
              (
                item: {
                  name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
                },
                index: number,
              ) => (
                <View key={index} onClick={() => jmpP(item)}>
                  <View className={styles['cell']}>
                    <Text className={styles['cell-text']}>{item.name}</Text>
                    <Image className={styles['icon-right']} src={iconRight} />
                  </View>
                </View>
              ),
            )}
          </View>

          <View className={styles['settings-list-item']}>
            {SettingsList.cell2.map(
              (
                item: {
                  name: {} | null | undefined
                  islike: any
                  key: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
                },
                index: number,
              ) => (
                <View key={index} onClick={() => jmpP(item)}>
                  <View className={styles['cell']}>
                    <Text className={styles['cell-text']}>{item.name}</Text>
                    {item.islike ? (
                      <Image className={styles['icon-right']} src={iconRight} />
                    ) : (
                      <Text className={styles['cell-text']}>{item.name === '清除本地缓存' ? size : item.key}</Text>
                    )}
                  </View>
                </View>
              ),
            )}
          </View>
        </View>
        <View className={styles['settings-foot']} onClick={() => handleLogout()}>
          <Text>
            {intl.formatMessage({
              id: 'user.tuichudenglu',
              defaultMessage: '退出登录',
            })}
          </Text>
        </View>
      </ScrollView>

      {/* 模态框 */}
      <Modal
        title={intl.formatMessage({
          id: 'user.quedingyaoqingchubendihuan',
          defaultMessage: '确定要清除本地缓存吗？',
        })}
        isOpened={toggle}
        onConfirm={setConfirm}
        onCancel={() => {
          setToggle(false)
        }}
        cancelText={intl.formatMessage({
          id: 'user.quxiao',
          defaultMessage: '取消',
        })}
        confirmText={intl.formatMessage({
          id: 'user.queren',
          defaultMessage: '确认',
        })}
        className={styles['account-model']}
      />
      <Popup
        title={translate('mobile.resource.basicSetting.yuyanshezhi')}
        visible={localeVisible}
        onClose={() => setLocaleVisible(false)}
      >
        <View className={styles['localeBox']}>
          {languageList.map((item) => (
            <View className={styles['localeBoxItem']} key={item?.key} onClick={() => handleChangeLng(item)}>
              {item?.language}
            </View>
          ))}
        </View>
      </Popup>
    </View>
  )
}
export default GlobalWrapper(AccountSettings)

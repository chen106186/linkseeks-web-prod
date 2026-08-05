import React, { useState, useEffect } from 'react'
import { Dropdown, Space } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { localesStorage } from '@linkseeks/storage'
import gou from '../../assets/imgs/gou.png'
import { CaretDownOutlined } from '@ant-design/icons'
import { TOP_DOMAIN_NO_PORT } from '@/constants/domain'
import '../styles/SelectLang.less'
import { LANG_ICON_MAP, SelectLangList } from '@/constants'
import { authService } from '@apps/services'
import { LanguageInfo, useLanguage } from '@apps/domains'

interface countryItem {
  name: string
  key: string
  icon: string
}

const SelectLang: React.FC = () => {
  const intl = useIntl()
  // 此处暂时无接口， 对接接口后需用枚举类型做补充
  const [currentLangKey, setCurrentLangKey] = useState<string>('cn')
  const { languageList } = useLanguage()

  useEffect(() => {
    setCurrentLangKey(intl.i18n.language)
  }, [])

  useEffect(() => {
    // 如果当前语言不在语言列表中，则把第一个设为默认语音
    if (languageList && languageList.length > 0) {
      const currentLang = languageList.find((item) => item.key === currentLangKey)
      console.log(currentLang, currentLangKey, intl.i18n.language, 'currentLang')
      if (!currentLang) {
        setLang(languageList[0])
      }
    }
  }, [languageList, currentLangKey])

  const setLang = async (langItem: LanguageInfo) => {
    setCurrentLangKey(langItem.key)
    localesStorage.setItem(langItem.key, { domain: TOP_DOMAIN_NO_PORT })
    intl.i18n.changeLanguage(langItem.key)
    // 需要刷新用户信息
    await authService.refreshAuth()
    window.location.reload()
  }

  const renderCurrentLang = () => {
    let currentLang: countryItem | Record<string, any> = {}
    languageList.map((item) => {
      if (item.key === currentLangKey) {
        currentLang = item
      }
    })

    return (
      <Space style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} size={5}>
        {LANG_ICON_MAP[currentLang.key] && (
          <img src={LANG_ICON_MAP[currentLang.key]} style={{ width: 24, height: 17 }} />
        )}
        <span>{currentLang?.language}</span>
        <CaretDownOutlined />
      </Space>
    )
  }

  const getItems = () => {
    return languageList.map((v) => {
      return {
        label: (
          <Space onClick={() => setLang(v)} style={{ display: 'flex', alignItems: 'center' }}>
            {currentLangKey === v.key ? (
              <img src={gou} style={{ width: 20, height: 20 }} />
            ) : (
              <div style={{ width: 20, height: 20 }}></div>
            )}
            {LANG_ICON_MAP[v.key] && <img src={LANG_ICON_MAP[v.key]} style={{ width: 24, height: 17 }} />}
            <span>{v.language}</span>
          </Space>
        ),
        key: v.key,
      }
    })
  }

  return (
    <Dropdown menu={{ items: getItems() }} placement="bottomRight" className="selectLangBox">
      {renderCurrentLang()}
    </Dropdown>
  )
}

export default SelectLang

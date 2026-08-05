import React, { useEffect, useState } from 'react'
import { Dropdown, Space } from 'antd'
import { CaretDownOutlined, CheckOutlined } from '@ant-design/icons'
import { useLanguage } from '@apps/domains/language/useLanguage'
import { localesStorage } from '@linkseeks/storage'
import { TOP_DOMAIN_NO_PORT } from '@/constants'
import { LANG_ICON_MAP } from '@/constants'
import styles from './index.module.less'

type LanguageInfo = any

const SelectLang: React.FC = () => {
  const [currentLangKey, setCurrentLangKey] = useState<string>(localesStorage.getItem() || 'zh-CN')
  const { languageList } = useLanguage()

  useEffect(() => {
    if (languageList && languageList.length > 0) {
      // 如果当前语言不在语言列表中，则把第一个设为默认语音
      if (languageList && languageList.length > 0) {
        if (!languageList.find((item) => item.key === currentLangKey)) {
          setLang(languageList[0])
        }
      }
    }
  }, [languageList])

  const setLang = (langItem: LanguageInfo) => {
    setCurrentLangKey(langItem.key)
    localesStorage.setItem(langItem.key, { domain: TOP_DOMAIN_NO_PORT })
    window.location.reload()
  }

  const renderCurrentLang = () => {
    let currentLang: LanguageInfo | Record<string, any> = {}
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
              <CheckOutlined className={styles.selected} />
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
    <Dropdown menu={{ items: getItems() }} placement="bottomRight" className={styles.selectLangBox}>
      {renderCurrentLang()}
    </Dropdown>
  )
}

export default SelectLang

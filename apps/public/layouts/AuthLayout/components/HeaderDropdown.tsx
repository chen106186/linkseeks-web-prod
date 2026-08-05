import React, { useState, useEffect } from 'react'
import { Dropdown, Space, Menu } from 'antd'
// import { localesStorage } from '@linkseeks/storage'
import { useTranslation } from '@linkseeks/i18n'
import gou from '@apps/asserts/images/gou.png'
import { ArrowDownIcon } from '@linkseeks/icons'
import styles from '../styles/SelectLang.less'
import { getCommodityLanguageGetLanguagePage } from '@apps/apis'

interface countryItem {
  name: string
  key: string
  icon: string
}

const HeaderDropdown: React.FC = () => {
  // 此处暂时无接口， 对接接口后需用枚举类型做补充
  // @todo 未兼容完成
  // const locales = localesStorage.getItem()
  const locales = 'zh-CN'
  const translate = useTranslation()
  const [currentLangKey, setCurrentLangKey] = useState<string>(locales || 'zh-CN')

  const [langList, setLangList] = useState<countryItem[]>([])

  const fetchLangList = async () => {
    try {
      const { code, data } = await getCommodityLanguageGetLanguagePage()
      if (code === 1000 && data.data) {
        const list = data.data.map((item) => ({ name: item.name, key: item.nameEn, icon: '' }))

        setLangList(list)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchLangList()

    translate.i18n.changeLanguage(locales)
    setCurrentLangKey(locales || (currentLangKey as string))
  }, [])

  const setLang = (langItem: countryItem) => {
    // @todo 似乎没有作用
    // localesStorage.removeItem({ path: '/', domain: getTopDomainByHost(TOP_DOMAIN_NO_PORT, true) })
    // @todo 未兼容完成
    // localesStorage.setItem(langItem.key, { domain: getTopDomain(location.hostname) })
    window.location.reload()
  }
  const menuHeaderDropdown = (
    <Menu selectedKeys={[]}>
      {langList.map((v) => (
        <Menu.Item key={v.key} onClick={() => setLang(v)}>
          <Space>
            {currentLangKey === v.key ? (
              <img src={gou} style={{ width: 20, height: 20 }} />
            ) : (
              <div style={{ width: 20, height: 20 }}></div>
            )}
            <img src={v.icon} style={{ width: 24, height: 17 }} />
            <span>{v.name}</span>
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  )

  const renderCurrentLang = () => {
    let currentLang: any = {}
    langList.map((item) => {
      if (item.key === currentLangKey) {
        currentLang = item
      }
    })
    return (
      <Space style={{ cursor: 'pointer' }} size={5}>
        <img src={currentLang?.icon} style={{ width: 24, height: 17 }} />
        <span>{currentLang?.name}</span>
        <ArrowDownIcon />
      </Space>
    )
  }

  return (
    <Dropdown overlay={menuHeaderDropdown} placement="bottomRight" className={styles['select-lang-box']}>
      {renderCurrentLang()}
    </Dropdown>
  )
}

export default HeaderDropdown

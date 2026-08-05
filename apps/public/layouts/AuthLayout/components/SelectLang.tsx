import React, { useState, useEffect } from 'react'
import { Dropdown, Space, Menu } from 'antd'
import ChinaImg from '../../../mockStatic/china.png'
import gou from '../../../mockStatic/gou.png'
import { CaretDownOutlined } from '@ant-design/icons'
import { GlobalConfig } from '../../global/config'
import korenImg from '../../../mockStatic/koren.png'
import us from '../../../mockStatic/us.png'

import styles from '../styles/SelectLang.less'
import { SelectLangList } from '@/constants'

interface countryItem {
  name: string
  key: string
  icon: string
}

const SelectLang: React.FC = () => {
  // 此处暂时无接口， 对接接口后需用枚举类型做补充
  const [currentLangKey, setCurrentLangKey] = useState<string>('cn')
  useEffect(() => {
    console.log(getLocale(), 'locale')
    setCurrentLangKey(getLocale())
  }, [])

  const setLang = (langItem: countryItem) => {
    setLocale(langItem.key, true)
  }

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]}>
      {SelectLangList.siteList.map((v) => (
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

  // useEffect(() => {
  //   function getLang() {
  //     getLange
  //   }
  // }, [])

  const renderCurrentLang = () => {
    let currentLang: countryItem
    SelectLangList.siteList.map((item) => {
      if (item.key === currentLangKey) {
        currentLang = item
      }
    })
    return (
      <Space style={{ cursor: 'pointer' }} size={5}>
        <img src={currentLang?.icon} style={{ width: 24, height: 17 }} />
        <span>{currentLang?.name}</span>
        <CaretDownOutlined />
      </Space>
    )
  }

  return (
    <Dropdown overlay={menuHeaderDropdown} placement="bottomRight" className={styles['selectLangBox']}>
      {renderCurrentLang()}
    </Dropdown>
  )
}

export default SelectLang

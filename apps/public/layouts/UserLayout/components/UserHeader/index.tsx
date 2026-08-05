import { Dropdown } from '@linkseeks/ui'
import logo from './logo.png'
import style from './index.less'
import { useLanguage } from '@apps/domains'
import LanguageItem from './LanguageItem'
import { ArrowDownFillIcon } from '@linkseeks/icons'

const UserHeader = () => {
  const { language, languageList, setLanguage } = useLanguage()

  const handleLocale = ({ key }) => {
    setLanguage(key)
  }

  const items = languageList.map((v) => ({
    label: <LanguageItem img={v?.img} language={v?.language} />,
    key: v.key,
    onClick: handleLocale,
  }))

  return (
    <header className={style['header']}>
      <div className={style['content']}>
        <div className={style['logo']}>
          <img src={logo} />
          <span className="h4">欢迎注册</span>
        </div>
        <div className={style['language-title-box']}>
          <Dropdown menu={{ items }}>
            <LanguageItem
              icon={<ArrowDownFillIcon size={20} className={style['language-down-icon']} />}
              img={language?.img}
              language={language?.language}
              className={style['language-title']}
            />
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default UserHeader

import { Button, Space } from '@linkseeks/ui'
import cx from 'classnames'
import style from './index.less'

const LanguageItem = ({ img, language, ...props }) => {
  const { className, icon, ...resetProps } = props
  return (
    <div className={cx(className, style['language-item'])} {...resetProps}>
      <img src={img} className={style['language-logo']} />
      {language}
      {icon}
    </div>
  )
}

export default LanguageItem

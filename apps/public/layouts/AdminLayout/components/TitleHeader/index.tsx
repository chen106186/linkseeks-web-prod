import style from './index.less'
import { useTitle } from './useTitle'

interface TitleHeaderProps {}

const TitleHeader = (props: TitleHeaderProps) => {
  const title = useTitle()
  return (
    <div className={style['header']}>
      <span className={style['header-title']}>{title}</span>
    </div>
  )
}

export default TitleHeader

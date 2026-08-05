import style from './index.less'
import { useTitle } from './useTitle'

interface TitleHeaderProps {}

const TitleHeader = (props: TitleHeaderProps) => {
  const title = useTitle()
  return (
    <div className={style['header']}>
      <h6>{title}</h6>
    </div>
  )
}

export default TitleHeader

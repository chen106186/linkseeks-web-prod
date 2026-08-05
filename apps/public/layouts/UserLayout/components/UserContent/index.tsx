import { Outlet } from '@linkseeks/router-core'
import style from './index.less'

const UserContent = ({ children }) => {
  return (
    <div className={style['content']}>
      <Outlet />
    </div>
  )
}

export default UserContent

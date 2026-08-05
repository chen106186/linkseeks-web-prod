import { ReactNode } from 'react'
import UserContent from './components/UserContent'
import UserFooter from './components/UserFooter'
import UserHeader from './components/UserHeader'

interface UserLayoutProps {
  children?: ReactNode
}

const UserLayout = (props: UserLayoutProps) => {
  const { children } = props
  return (
    <div>
      <UserHeader />
      <UserContent>{children}</UserContent>
      <UserFooter />
    </div>
  )
}

export default UserLayout

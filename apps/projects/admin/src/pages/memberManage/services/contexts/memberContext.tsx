import { useSetState } from '@linkseeks/hooks'
import { createContext, useContext } from 'react'

const MemberContext = createContext<any>({})

export const MemberProvider = (props) => {
  const [memberMaintainInfo, setMemberMaintainInfo] = useSetState<any>({})
  const values = {
    memberMaintainInfo,
    setMemberMaintainInfo,
  }
  return <MemberContext.Provider value={values}>{props.children}</MemberContext.Provider>
}

export const useMemberInfo = () => {
  return useContext(MemberContext)
}

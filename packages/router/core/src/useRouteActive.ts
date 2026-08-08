import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

const useRouteActive = () => {
  const location = useLocation()
  const [activeCode, setActiveCode] = useState('')

  useEffect(() => {
    const pathname = location.pathname
    const code = pathname.split('/')[1]
    if (activeCode !== code) {
      setActiveCode(code)
    }
  }, [location.pathname, activeCode])

  return {
    activeCode,
    setActiveCode,
  }
}

export default useRouteActive

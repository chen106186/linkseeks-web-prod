import { useLocation } from '@linkseeks/router-core'

const events = {}
export const useEvent = () => {
  const { pathname } = useLocation()
  const register = (callback) => {
    events[pathname] = callback
  }

  const get = (key) => register[key]

  const emit = () => {
    register[pathname].call(null)
  }

  return {
    register,
    get,
    emit,
  }
}

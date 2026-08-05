import { getLoginDomainFn, getRegisterDomainFn } from '@/constants/domain'

const useDomainPath = (locationPath: string) => {
  return {
    LOGIN_DOMAIN: getLoginDomainFn(locationPath),
    REGISTER_DOMAIN: getRegisterDomainFn(locationPath),
  }
}

export default useDomainPath

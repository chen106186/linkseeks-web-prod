import { useMenu } from '@apps/layouts/useMenu'
import { useLocation, useRouter } from '@linkseeks/router-core'

export const useTitle = () => {
  const { pathname } = useLocation()
  const { routeHashMaps } = useRouter()

  return routeHashMaps[pathname]?.title
}

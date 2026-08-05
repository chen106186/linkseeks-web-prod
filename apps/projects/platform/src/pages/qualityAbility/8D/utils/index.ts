import { authService } from '@apps/services'

export const getAuthInfo = () => {
  const { roles, memberRoleId } = authService.getAuth()
  return roles.find((item) => item.roleId === memberRoleId)
}

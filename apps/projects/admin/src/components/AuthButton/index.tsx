export interface AuthButtonProps {
  btnCode?: string
  menuCode: string
  children: any
}
/**
 * 按钮权限
 * @param {String} menuCode 页面标识
 * @param {String} btnCode 按钮标识
 */
const AuthButton = (props: AuthButtonProps) => {
  const {
    children,
    btnCode, // 按钮标识
    menuCode, // 按钮页面标识
  } = props
  const userBtn = require('../../../config/router.config.json')
  const path = menuCode.split('.')[0]
  const AuthRoutes = userBtn.filter((item: any) => item.path === `/${path}`)
  const AuthButton = AuthRoutes[0].routes
  const AuthCode: any = []
  for (let i = 0; i < AuthButton.length; i++) {
    if (AuthButton[i].btns.length != 0) {
      for (let j = 0; j < AuthButton[i].btns.length; j++) {
        if (AuthButton[i].btns[j].path === menuCode) {
          AuthCode.push(AuthButton[i].btns[j])
          break
        }
      }
    }
  }
  console.log(AuthCode, 'AuthCode')

  const _authorityBtn = () => {
    // 本地开发时传的特殊标识，直接开放权限
    if (btnCode === 'DevTest') return true
    for (let i = 0; i < AuthCode.length; i++) {
      if (menuCode) {
        // 是否有页面标识
        // 找到该页面标识的按钮权限数据,并匹配权限按钮是否勾选
        if (AuthCode[i].path === menuCode) {
          return true
        }
      }
      continue
    }
    return false
  }
  return _authorityBtn() ? children : null
}
export default AuthButton

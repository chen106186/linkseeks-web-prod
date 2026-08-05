import React from 'react'

// 从pass平台获取所有菜单列表的集合
const authList = []

/**
 * @description 对组件级别进行权限控制，只有当传入的preId复合存在authList中，才显示
 * 
 */
export const AuthWrapper = (props) => {
  const { preId, children } = props

  const result = authList.includes(preId)
  
  return result ? children : null
}

export default AuthWrapper
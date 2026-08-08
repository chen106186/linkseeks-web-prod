import { useMemo } from 'react'
import { useMenu } from '../../../useMenu'

const getSelectedKey = (pathname: string) => {
  let path = ''
  return pathname
    .split('/')
    .filter((segment) => segment !== '')
    .reduce((prev, next) => {
      path += '/' + next
      prev.push(path)
      return prev
    }, [] as string[])
}
export const useSlideMenu = () => {
  const { menuData, pathname, activeCode } = useMenu()

  // 默认选中的菜单项，由于不会同时打开多个，所以当前访问的路径是什么则打开的也是什么
  const defaultSelectedKeys = useMemo(() => getSelectedKey(pathname), [pathname])
  const slideTitle = useMemo(() => menuData.find((v) => v.code === activeCode)?.title, [activeCode, menuData])
  return {
    defaultSelectedKeys,
    slideTitle,
  }
}

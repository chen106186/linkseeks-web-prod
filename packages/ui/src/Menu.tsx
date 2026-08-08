import { Menu as AntdMenu, MenuProps as AntdMenuProps } from 'antd'
const Menu = (props: AntdMenuProps) => {
  return <AntdMenu className="ui-menu" {...props} />
}

export default Menu

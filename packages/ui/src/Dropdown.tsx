import { Dropdown as AntdDropdown, DropdownProps as AntdDropdownProps } from 'antd'
const Dropdown = (props: AntdDropdownProps) => {
  return <AntdDropdown className="ui-dropdown" {...props} />
}

Dropdown.Button = AntdDropdown.Button
export default Dropdown

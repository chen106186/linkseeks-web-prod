import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { AuthButton, AuthBlock } from '@apps/components'

/**
 * 表格行操作
 * 操作显示或隐藏受控接口返回字段
 * 操作按钮大于两项 显示更多
 */

type IButtonTextFieldMap = Record<string, boolean>
type IOperationHandler = Record<string, any>
type IButtonPermissionsMap = Record<string, string>
export interface TableOperationProps {
  /** 按钮文本和字段值映射 */
  buttonTextFieldMap: IButtonTextFieldMap
  /** 按钮文本和操作函数映射 */
  operationHandler: IOperationHandler
  /** 按钮权限code和操作文本映射 */
  buttonPermissionsMap?: IButtonPermissionsMap
  /** 菜单父级关联code */
  menuCode?: string
}

const TableOperation: React.FC<TableOperationProps> = (props) => {
  const { buttonTextFieldMap, operationHandler, buttonPermissionsMap = null, menuCode = null } = props
  const intl = useIntl()

  const filterButtonTextFieldMap = {}
  Object.keys(buttonTextFieldMap).forEach((key) => {
    if (buttonTextFieldMap[key]) {
      filterButtonTextFieldMap[key] = buttonTextFieldMap[key]
    }
  })

  const keyNames = Object.keys(filterButtonTextFieldMap)

  return (
    <>
      {Object.values(buttonTextFieldMap).filter(Boolean).length > 2 ? (
        <>
          <AuthButton type="custom" code={(buttonPermissionsMap && buttonPermissionsMap[keyNames[0]]) || ''}>
            <Button type="link" onClick={operationHandler[keyNames[0]]}>
              {keyNames[0]}
            </Button>
          </AuthButton>

          <Dropdown
            overlay={
              <AuthBlock
                codeArray={keyNames.slice(1, keyNames.length).map((item) => buttonPermissionsMap?.[item] ?? '')}
                render={(codeList) => {
                  return (
                    <Menu>
                      {codeList?.map((code, index) => {
                        const _item =
                          (buttonPermissionsMap &&
                            Object.keys(buttonPermissionsMap as any).find(
                              (item) => buttonPermissionsMap[item] === code,
                            )) ||
                          ''
                        return (
                          <Menu.Item key={`menuItem${index}`}>
                            <Button type="link" onClick={operationHandler[_item]}>
                              {_item}
                            </Button>
                          </Menu.Item>
                        )
                      })}
                    </Menu>
                  )
                }}
              />
            }
          >
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              {intl.formatMessage({ id: 'components.gengduo' })} <CaretDownOutlined />
            </a>
          </Dropdown>
        </>
      ) : (
        keyNames.map((item, i) =>
          buttonTextFieldMap[item] ? (
            <AuthButton
              type="custom"
              code={(buttonPermissionsMap && buttonPermissionsMap[item]) || ''}
              key={`btnItem${i}`}
            >
              <Button type="link" onClick={operationHandler[item]}>
                {item}
              </Button>
            </AuthButton>
          ) : null,
        )
      )}
    </>
  )
}

TableOperation.defaultProps = {}

export default TableOperation

import { getMemberMenuConfigGetMenuConfigList } from '@apps/apis'
import { useToggle } from '@linkseeks/hooks'
import { Form, Tooltip } from '@linkseeks/ui'
import { useState, createContext, useContext, useRef } from 'react'

const MessageName = ({ menuNameList }) => {
  return (
    <Tooltip
      title={menuNameList.map((v) => (
        <p key={v.language}>
          {v.language}: {v.value}
        </p>
      ))}
    >
      {menuNameList?.[0]?.value}
    </Tooltip>
  )
}

const transform = (data) => {
  data.forEach((v) => {
    v.name = <MessageName menuNameList={v.menuNameList} />
    if (v.children) {
      transform(v.children)
    }
  })
  return data
}
export const useMenuList = (source) => {
  const formRef = useRef<any>({})
  const treeRef = useRef<any>({})
  const [buttonList, setButtonList] = useState<any[]>([])
  const [interfaceList, setInterfaceList] = useState<any[]>([])
  const [selectButton, setSelectButton] = useState<any>(null)
  const [buttonVisible, buttonToggle] = useToggle(false)
  const [interfaceVisible, interfaceToggle] = useToggle(false)

  const [buttonFormInstance] = Form.useForm()
  const [buttonFormStatus, setButtonFormStatus] = useState('')
  const request = async () => {
    const { data } = (await getMemberMenuConfigGetMenuConfigList({ source })) || []
    return { data: transform(data) }
  }

  const handleButtonToggle = (type?, value?) => {
    if (type === 'edit') {
      buttonFormInstance.setFieldsValue(value)
    } else if (type === 'add') {
      buttonFormInstance.resetFields()
    }
    setButtonFormStatus(type)
    buttonToggle()
  }
  return {
    formRef,
    treeRef,
    buttonList,
    setButtonList,
    interfaceList,
    setInterfaceList,
    selectButton,
    setSelectButton,
    buttonVisible,
    handleButtonToggle,
    interfaceVisible,
    interfaceToggle,
    requestTreeData: request,
    source,
    buttonFormStatus,
    setButtonFormStatus,
    buttonFormInstance,
  }
}

type MenuContextProps = ReturnType<typeof useMenuList>
export const MenuContext = createContext<MenuContextProps>({} as any)

export const useMenuContext = () => useContext(MenuContext)

export const MenuTabProvider = (props) => {
  const contextValues = useMenuList(props.source)
  return <MenuContext.Provider value={contextValues}>{props.children}</MenuContext.Provider>
}

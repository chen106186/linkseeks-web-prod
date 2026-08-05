import { useControllableValue, useToggle } from '@linkseeks/hooks'
import { createContext, useContext, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { SortableContext, arrayMove } from '@linkseeks/tools'
export enum CONTENT_TYPE {
  TEXT = 1,
  PICTURE,
  VIDEO,
}
export interface ContentProp {
  id?: string
  type: CONTENT_TYPE
  content?: string
  url?: string
  linkType?: 1 | 2
  link?: string
}
const ProductDetailContext = createContext<ReturnType<typeof initContext>>({} as any)

export const useProductDetailContext = () => useContext(ProductDetailContext)

interface charInstance {
  // 添加文字时的内容
  charContent: string

  initValue: string

  // 操作时激活的id, 有id表示编辑，没有则是新增
  activeId: string
}

interface photoInstance {}

const createId = () => {
  return v4()
}

const initContext = (props) => {
  // const [contentArea, setContentArea] = useState<any[]>([])
  const [contentArea, setContentArea] = useControllableValue<ContentProp[]>(props, { defaultValue: [] })
  const [charVisible, charToggle] = useToggle()
  const [photoVisible, photoToggle] = useToggle()
  const [photoAttr, setPhotoAttr] = useState<any>({})

  const photoRef = useRef<photoInstance>({})
  const charRef = useRef<charInstance>({} as charInstance)

  const handleChangeContent = (content: any) => {
    setContentArea(content)
  }
  return {
    contentArea,
    addContentArea(dispatch: ContentProp | ContentProp[]) {
      handleChangeContent([
        ...contentArea,
        ...(Array.isArray(dispatch)
          ? dispatch.map((v) => Object.assign({ id: createId() }, v))
          : [Object.assign({ id: createId() }, dispatch)]),
      ])
    },
    editContentArea(dispatch: ContentProp) {
      const newArr = [...contentArea]
      const id = charRef.current.activeId
      const target = newArr.find((v) => v.id === id) || {}
      Object.assign(target, dispatch)
      handleChangeContent(newArr)
    },
    removeContentArea(id: string) {
      handleChangeContent(contentArea.filter((v) => v.id !== id))
    },
    /**
     * 区域交换
     */
    moveContentArea(oldIndex: number, newIndex: number) {
      handleChangeContent(arrayMove(contentArea, oldIndex, newIndex))
    },
    photoRef,
    charRef,
    charToggle,
    charVisible,
    photoVisible,
    photoToggle,
    photoAttr,
    setPhotoAttr,
  }
}

export const ProductDetailProvider = ({ onChange, value, children }: any) => {
  const values = initContext({ onChange, value })

  return <ProductDetailContext.Provider value={values}>{children}</ProductDetailContext.Provider>
}

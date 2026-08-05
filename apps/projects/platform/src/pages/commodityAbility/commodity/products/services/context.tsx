import { GetProductCommodityGetShopResponse } from '@apps/apis'
import { Form } from '@linkseeks/ui'
import { useRowSelectionTableCtl } from '@/hooks/useRowSelectionTable'
import { createContext, useContext, useRef, useState } from 'react'
import { ModalFormTable, StandardFormTable } from '@apps/components'

const ProductContext = createContext<ProductContextProps>({} as any)

interface ProductData {
  row?: {
    /**
     * 商品id
     */
    id: number
  }
}
const initProductValue = () => {
  const [upModal, setUpModal] = useState(false)
  const [uppId, setUpId] = useState<number>()
  const [upSelModal, setUpSelModal] = useState(false)
  const [downSelModal, setDownSelModal] = useState(false)
  const [isUp, setIsUp] = useState(1) // 1上0下架状态
  const [upDownModal, setUpDownModal] = useState<boolean>(false)
  const [shopsOption, setShopsOption] = useState<GetProductCommodityGetShopResponse>([])
  const [currentOptionRow, setCurrentOptionRow] = useState<any>()
  const [upForm] = Form.useForm()
  // 上游供应商品表格控制
  const importProductTableRef = ModalFormTable.useTableRef()
  // 商品列表表格控制
  const mainTableRef = StandardFormTable.useTableRef()

  // 查看上游供应商品
  const previewUpperTableRef = ModalFormTable.useTableRef()

  // 在操作数据过程中，需要储存起来的一些固定数据
  const productDataRef = useRef<ProductData>({})
  const refDraft = useRef<any>({})
  const [importModal, setImportModal] = useState(false)
  const [modalStep, setModalStep] = useState(0)
  const [exceptionCheck, setExceptionCheck] = useState(false) // 默认无异常
  const [exceptionContent, setExceptionContent] = useState<string>()
  const ref = useRef<any>({})
  const [loading, setLoading] = useState(false)
  const [deleteBatchModal, setDeleteBatchModal] = useState(false)
  const [importBathValue, setImportBathValue] = useState(undefined)
  const [importBathLoading, setImportBathLoading] = useState(false)
  const [importBathData, setImportBathData] = useState<any>([])
  const upperRef = useRef<any>({})
  const [exportLoading, setExportLoading] = useState<boolean>(false)
  const [exportQrcodeModal, setExportQrcodeModal] = useState<boolean>(false)
  const [exportVisible, setExportVisible] = useState<boolean>(false)
  const [isBatch, setIsBatch] = useState<boolean>(false) // 是否批量上下架操作
  const currentCtrlRef = useRef<useRowSelectionTableCtl>()
  const [isDisabledOKbtn, setIsDisabledOKbtn] = useState<boolean>(false)
  const [giudeVisible, setGiudeVisible] = useState<boolean>(false)
  const shopIdRef = useRef<any>()
  const [giudeStep, setGiudeStep] = useState<number>(1)
  const [inconformityProductIds, setInconformityProductIds] = useState<number[]>([])
  const [draftDrawerVisible, setDraftDrawerVisible] = useState<boolean>(false)

  return {
    upModal,
    setUpModal,
    uppId,
    setUpId,
    upSelModal,
    setUpSelModal,
    downSelModal,
    setDownSelModal,
    isUp,
    setIsUp,
    upDownModal,
    setUpDownModal,
    shopsOption,
    setShopsOption,
    currentOptionRow,
    setCurrentOptionRow,
    upForm,
    importProductTableRef,
    refDraft,
    importModal,
    setImportModal,
    modalStep,
    setModalStep,
    exceptionCheck,
    setExceptionCheck,
    exceptionContent,
    setExceptionContent,
    ref,
    loading,
    setLoading,
    deleteBatchModal,
    setDeleteBatchModal,
    importBathValue,
    setImportBathValue,
    importBathLoading,
    setImportBathLoading,
    importBathData,
    setImportBathData,
    upperRef,
    exportLoading,
    setExportLoading,
    exportQrcodeModal,
    setExportQrcodeModal,
    exportVisible,
    setExportVisible,
    isBatch,
    setIsBatch,
    currentCtrlRef,
    isDisabledOKbtn,
    setIsDisabledOKbtn,
    giudeVisible,
    setGiudeVisible,
    shopIdRef,
    giudeStep,
    setGiudeStep,
    inconformityProductIds,
    setInconformityProductIds,
    draftDrawerVisible,
    setDraftDrawerVisible,

    mainTableRef,
    previewUpperTableRef,
    productDataRef,
  }
}

export type ProductContextProps = ReturnType<typeof initProductValue>

export const useProduct = () => useContext(ProductContext)

export const ProductProvider = ({ children }) => {
  const initValue = initProductValue()
  return <ProductContext.Provider value={initValue}>{children}</ProductContext.Provider>
}

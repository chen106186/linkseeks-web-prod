import { useState } from 'react'

export type UploadCommodityType =
  | 'uploadProduct'
  | 'uploadProductLog'
  | 'uploadImage'
  | 'uploadImageLog'
  | 'downloadTemplate'
  | 'downloadDirectory'

export const useImportModal = () => {
  const [importDrawVisible, setImportDrawVisible] = useState<boolean>(false)
  const [drawTitle, setDrawTitle] = useState<string>()
  const [optionType, setOptionType] = useState<UploadCommodityType>()

  return {
    importDrawVisible,
    drawTitle,
    optionType,
    setImportDrawVisible,
    setDrawTitle,
    setOptionType,
  }
}

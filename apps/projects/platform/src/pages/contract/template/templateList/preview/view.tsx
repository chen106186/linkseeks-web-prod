import React, { useEffect, useState } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getContractContractTemplateExamplePreview,
  postContractContractTemplatePreviewContract,
  postSupportFileConvertPdfPreview,
} from '@apps/apis'
import { Spin } from '@linkseeks/ui'

const ContractTemplatePrevew: React.FC = () => {
  const { fileName, fileUrl, id } = usePageStatus()
  const [fileBase64, setFileBase64] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  const previewFile = async () => {
    if (fileName && fileUrl) {
      setLoading(true)
      await postSupportFileConvertPdfPreview(
        {
          fileName: fileName,
          fileUrl: fileUrl,
        },
        { ctlType: 'none' },
      )
        .then((res) => {
          if (res.code === 1000) {
            setFileBase64(res.data.fileBase64)
          }
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
        })
    } else if (id) {
      setLoading(true)
      await postContractContractTemplatePreviewContract(
        {
          id: Number(id),
        },
        { ctlType: 'none' },
      )
        .then((res) => {
          if (res.code === 1000) {
            setFileBase64(res.data.contractBase64)
          }
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
        })
    }
  }

  const previewExample = () => {
    setLoading(true)
    getContractContractTemplateExamplePreview()
      .then((res) => {
        setFileBase64(res.data.contractBase64)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if ((fileName && fileUrl) || id) {
      previewFile()
    } else {
      previewExample()
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {fileBase64 && !loading ? (
        <iframe style={{ width: '100%', height: '100%' }} src={fileBase64}></iframe>
      ) : (
        <div style={{ textAlign: 'center', paddingTop: 230 }}>
          <Spin />
        </div>
      )}
    </div>
  )
}

export default ContractTemplatePrevew

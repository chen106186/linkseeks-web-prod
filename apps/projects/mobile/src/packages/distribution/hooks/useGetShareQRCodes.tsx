import { useEffect, useRef, useState } from 'react'
import { postPayWeChatMobileGetWxaCodeUnLimit } from '@apps/apis'

type QrCodePage = {
	key: string
	pagePath: string
	getScene: (params: {
		code?: string
		account?: string
		ac?: string
		commodityId?: number | string
		property?: number
		isSelf?: boolean | number
		shopId?: number
	}) => string
	requiredParams?: readonly (keyof UseGetShareQRCodesProps)[]
}

type UseGetShareQRCodesProps = {
	code?: string
	account?: string
	ac?: string
	commodityId?: number | string
	property?: number
	isSelf?: boolean
	shopId?: number
	pages: QrCodePage[]
	onSuccess?: (data: Record<string, string>) => void
}

async function getQrCode(page: string, scene: string): Promise<string> {
  try {
    const res = await postPayWeChatMobileGetWxaCodeUnLimit({ page, scene })
    if (res.code === 1000 && res.data) {
      return `data:image/png;base64,${res.data}`
    }
    return ''
  } catch (err) {
    console.error(`二维码生成失败: ${page}`, err)
    return ''
  }
}

export default function useGetShareQRCodes({
	 code,
	 account,
	 ac,
	 commodityId,
	 property,
	 isSelf,
	 shopId,
	 pages,
	 onSuccess,
}: UseGetShareQRCodesProps) {
  const [qrLoading, setQrLoading] = useState(false)
  const [qrMap, setQrMap] = useState<Record<string, string>>({})
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (!pages.length || hasFetchedRef.current) return

    const paramMap = { code, account, ac, commodityId, property, isSelf, shopId }
    const allParamsEmpty = Object.values(paramMap).every(v => v === undefined || v === null)
    if (allParamsEmpty) return

    hasFetchedRef.current = true
    const fetch = async () => {
      setQrLoading(true)
      const resultMap: Record<string, string> = {}

      await Promise.all(
        pages.map(async ({ key, pagePath, getScene, requiredParams = [] }) => {
          const hasAllRequired = requiredParams.every(param => paramMap[param] !== undefined && paramMap[param] !== null)
          if (!hasAllRequired) {
            console.warn(`跳过二维码生成：${key}，缺少必要参数`, requiredParams)
            return
          }

          const scene = getScene(paramMap)
          const base64 = await getQrCode(pagePath, scene)
          resultMap[key] = base64
        })
      )

      setQrMap(resultMap)
      setQrLoading(false)

      if (onSuccess) {
        onSuccess(resultMap)
      }
    }

    fetch()
  }, [code, account, ac, commodityId, property, isSelf, shopId, pages])

  return {
    qrLoading,
    qrMap,
  }
}

import { NAV_TYPE } from '../constants'

type TARGET_TYPE = '_blank' | '_parent' | '_self' | '_top'

export const openLink = (
  link: string,
  disabled = false,
  target: TARGET_TYPE = '_self',
) => {
  if (!disabled && !!link) {
    const el = document.createElement('a')
    el.href = link
    el.target = target
    el.click()
  }
}

/**
 * 对数组进行分组
 * @param array 数组数据
 * @param count 每组的数量
 */
export const arrayGroupsByCount = (array: any, count: number) => {
  let index = 0
  const newArray: any[] = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += count)))
  }
  return newArray
}

export const getUrlMemberId = (url: string) => {
  const regex = /^\/(\d+)(\/|$)/
  const tempParam = url.match(regex)
  if (tempParam) {
    const param = tempParam[1] as unknown as string
    if (param) {
      return Number(param)
    }
  }
  return undefined
}

const getBasePath = (url: string) => {
  // 添加对纯数字路径的特殊处理
  if (/^\/\d+\/?$/.test(url)) {
    return ''
  }

  const match = url.match(/^(\/?[^\/]*)\/\d+.*$/)
  return match?.[1]
}

const getUrlStoreId = (url: string) => {
  const regex = /\/shop\/(\d+)$/
  const tempParam = url.match(regex)
  return tempParam?.[1] ? Number(tempParam[1]) : undefined
}

export const getPrefixUrl = (filterShop = false) => {
  const pathname =
    typeof window !== 'undefined'
      ? window.location.pathname === '/'
        ? ''
        : window.location.pathname
      : ''
  const basePath = getBasePath(pathname)

  if (pathname.indexOf('shop') > -1 && !filterShop) {
    const storeId = getUrlStoreId(pathname)
    return storeId ? `${basePath}/${storeId}` : ''
  } else {
    const memberId = getUrlMemberId(pathname)
    return memberId ? `${basePath}/${memberId}` : ''
  }
}

export const jumpByType = (
  item: {
    type?: NAV_TYPE
    value?: string
  },
  disabled = false,
  target: '_blank' | '_self' | '_parent' | '_top',
) => {
  const prefixUrl = getPrefixUrl()
  const isShop = prefixUrl.indexOf('shop') > -1

  if (!disabled) {
    switch (item.type) {
      case NAV_TYPE.mallHome:
        openLink(prefixUrl, disabled, target)
        break
      case NAV_TYPE.commodity:
        openLink(`${prefixUrl}/commodity`, disabled, target)
        break
      case NAV_TYPE.inquiry:
        openLink(`${prefixUrl}/inquiry`, disabled, target)
        break
      case NAV_TYPE.integral:
        openLink(`${prefixUrl}/integral`, disabled, target)
        break
      case NAV_TYPE.aboutus:
        openLink(`${prefixUrl}/about`, disabled, target)
        break
      case NAV_TYPE.info:
        openLink(`${!isShop ? prefixUrl : ''}/info`, disabled, target)
        break
      case NAV_TYPE.category:
        openLink(`${prefixUrl}/commodity/${item.value}`, disabled, target)
        break
      case NAV_TYPE.commodityDetail:
        openLink(
          `${prefixUrl}/commodity/detail/${item.value}`,
          disabled,
          target,
        )
        break
      case NAV_TYPE.customLink:
        if (item.value) {
          openLink(item.value, disabled, target)
        }
        break
      case NAV_TYPE.keyword:
        openLink(
          `${prefixUrl}/commodity?keyword=${item.value}`,
          disabled,
          target,
        )
        break
      case NAV_TYPE.marketing:
        openLink(
          `${!isShop ? prefixUrl : ''}/activity/${item.value}`,
          disabled,
          target,
        )
        break
      case NAV_TYPE.askPurchase:
        openLink(
          `${!isShop ? prefixUrl : ''}/askPurchase/${item.value}`,
          disabled,
          target,
        )
      case NAV_TYPE.stores:
        openLink(`${!isShop ? prefixUrl : ''}/stores`, disabled, target)
      case NAV_TYPE.cpecialPage:
        openLink(
          `${!isShop ? prefixUrl : ''}/cpecialPage/${item.value}`,
          disabled,
          target,
        )
      default:
        break
    }
  }
}

export const getFileTypeFromExtension = (fileName: any) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
  const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm']

  const extension = fileName.split('.').pop().toLowerCase()

  if (imageExtensions.includes(extension)) {
    return 'image'
  } else if (videoExtensions.includes(extension)) {
    return 'video'
  } else {
    return 'unknown'
  }
}

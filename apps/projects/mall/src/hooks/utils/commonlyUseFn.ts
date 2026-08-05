import {
  getProductShopOftenSelectGetOftenSelect,
  getProductShopOftenSelectGetOftenSelectList,
  GetProductShopOftenSelectGetOftenSelectListResponseDetail,
  GetProductShopOftenSelectGetOftenSelectResponse,
  postProductShopOftenSelectDeleteOftenSelect,
} from '@apps/apis'

/** 获取常用筛选 */
export const fetchCommonlyUseList = (): Promise<GetProductShopOftenSelectGetOftenSelectListResponseDetail[]> => {
  return new Promise((resolve) => {
    const param: any = {
      current: 1,
      pageSize: 50,
    }
    getProductShopOftenSelectGetOftenSelectList(param)
      .then((res) => {
        if (res.code === 1000) {
          resolve(res.data.data || [])
        } else {
          resolve([])
        }
      })
      .catch(() => {
        resolve([])
      })
  })
}

/** 删除常用筛选 */
export const deleteCommonlyUse = (id: number) => {
  return new Promise((resolve) => {
    postProductShopOftenSelectDeleteOftenSelect({ id }).then((res) => {
      resolve(true)
    })
  })
}

/** 获取常用筛选url */
export const getCommonlyUsedUrl = (id: number, pathname: string, filter: string | undefined) => {
  return new Promise((resolve, reject) => {
    getProductShopOftenSelectGetOftenSelect({ id: String(id) }).then((res) => {
      if (res.code === 1000) {
        const data: GetProductShopOftenSelectGetOftenSelectResponse = res.data
        let url = pathname
        if (filter) {
          url = url.replace(`/${filter}`, '')
        }

        if (data.customerCategoryId) {
          url += `/${data.customerCategoryName}`
        }
        if (data.brandId) {
          if (url.match(/[/]c\d{1,}/)) {
            url += `_b${data.brandId}`
          } else {
            url += `/b${data.brandId}`
          }
        }

        if (data.customerAttributeList) {
          let temp: string[] = []
          for (let i = 0; i < data.customerAttributeList.length; i++) {
            const item = data.customerAttributeList[i]
            const attrValIds = item.customerAttributeValueList.map((item) => item.id).join(',')
            temp.push(`${item.id}-${attrValIds}`)
          }
          const attr = temp.join(';')
          if (url.indexOf('?') > -1) {
            url += `&attr=${attr}`
          } else {
            url += `?attr=${attr}`
          }
        }

        if (data.cityCode) {
          if (url.indexOf('?') > -1) {
            url += `&cityCode=${data.cityCode}`
          } else {
            url += `?cityCode=${data.cityCode}`
          }
        }

        if (data.provinceCode) {
          if (url.indexOf('?') > -1) {
            url += `&provinceCode=${data.provinceCode}`
          } else {
            url += `?provinceCode=${data.provinceCode}`
          }
        }

        if (data.priceType) {
          if (url.indexOf('?') > -1) {
            url += `&priceTypeList=${data.priceType}`
          } else {
            url += `?priceTypeList=${data.priceType}`
          }
        }

        if (data.min) {
          if (url.indexOf('?') > -1) {
            url += `&min=${data.min}`
          } else {
            url += `?min=${data.min}`
          }
        }

        if (data.max) {
          if (url.indexOf('?') > -1) {
            url += `&max=${data.max}`
          } else {
            url += `?max=${data.max}`
          }
        }

        resolve(url)
      } else {
        reject()
      }
    })
  })
}

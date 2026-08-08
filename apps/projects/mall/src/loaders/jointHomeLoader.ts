import { GetManageSeoByTypeResponse, getManageSeoByType } from '@apps/apis'

export interface JointHomeLoaderReturn {
  seoInfo: GetManageSeoByTypeResponse | undefined
}

const getMallSeo = async (): Promise<GetManageSeoByTypeResponse | undefined> => {
  try {
    if (import.meta.env.SSR) {
      const manageApi = await import('@/service/manageApi')
      const { data } = await manageApi.getManageSeoByType({ type: '2' })
      return data
    } else {
      const { data } = await getManageSeoByType({ type: '2' })
      return data
    }
  } catch (error) {
    return undefined
  }
}

export default async () => {
  const seoInfo = await getMallSeo()

  return {
    seoInfo,
  }
}

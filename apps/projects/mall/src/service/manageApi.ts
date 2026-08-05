import { IApiRequest, get } from '@/utils/request'
import { GetManageSeoByTypeRequest, GetManageSeoByTypeResponse } from '@apps/apis'

/**
 * 接口 [根据类型获取↗](http://47.115.168.121:3000/project/1473/interface/api/194242) 的 **请求函数**
 *
 * @分类 [平台后台 - SEO优化 - SEO设置↗](http://47.115.168.121:3000/project/1473/interface/api/cat_24118)
 * @请求头 `GET /manage/seo/byType`
 */
export const getManageSeoByType = async (params?: GetManageSeoByTypeRequest, config?: IApiRequest) => {
  return get<GetManageSeoByTypeResponse>('/manage/seo/byType', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

export default {
  getManageSeoByType,
}

import { getMemberUserPage, postMemberManageLowerProviderPage } from '@apps/apis'
import { getProductCommodityCommonGetCommodityListByBuyer, getProductMaterielGetMaterielSupplyList } from '@apps/apis'

export const fetchOrderApi = {
  /** 弹窗获取商品列表 */
  async getProductList(params) {
    const { data } = await getProductCommodityCommonGetCommodityListByBuyer(params, { useCache: true, ttl: 10 * 1000 })
    return data
  },

  /** 获取下架服务提供者会员列表 */
  async getMemberListByMemberName(params) {
    const { data } = await postMemberManageLowerProviderPage({ ...params }, { ctlType: 'none' })
    return data
  },

  /** 请购单物料 获取商品货品列表 */
  // async getPurchaseRequesitionMaterielList(params) {
  //   params.materialGroupId = params.materialGroupId  ? params.materialGroupId?.pop() :''
  //   const { data } = await getProductMaterielGetMaterielList(params)
  //   return data
  // },

  // async getPurchaseRequesitionMaterielList(params) {

  //   params.materialGroupId = params.materialGroupId  ? params.materialGroupId?.pop() :''
  //   const { data } = await getProductMaterielGetMaterielByMemberList(params)
  //   return data
  // },

  /** 查询请购人 */
  async getMemberUserPageList(params) {
    const { data } = await getMemberUserPage(params)
    return data
  },

  /** 查询物料货源清单的供应商(列表) */
  async getProductGoodsGetGoodsSupply(params) {
    const { data } = await getProductMaterielGetMaterielSupplyList(params)
    return data
  },
}

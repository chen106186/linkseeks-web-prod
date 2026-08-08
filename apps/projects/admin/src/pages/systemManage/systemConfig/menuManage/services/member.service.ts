import { BaseService, BUSINESS_SOURCE_ENUMS } from '@apps/domains'
import {
  getMemberMenuConfigGetMenuConfigList,
  getMemberMenuConfigGetMenuConfigDetails,
  postMemberMenuConfigDeleteMenu,
  postMemberMenuConfigUpdateMenu,
  postMemberMenuConfigAddMenu,
  postMemberMenuConfigAddButton,
  postMemberMenuConfigMenuResort,
} from '@apps/apis'

/**
 * 系统设置中会员菜单逻辑
 */
class MemberMenuService extends BaseService {
  /**
   * 同步会员服务
   */
  async asyncSystemMenu(source: BUSINESS_SOURCE_ENUMS) {}

  /**
   * 获取菜单列表
   */
  async getMenuList(source: BUSINESS_SOURCE_ENUMS) {
    try {
      const { data } = await getMemberMenuConfigGetMenuConfigList({ source })
      return {
        data,
      }
    } catch (err) {
      return {
        data: [],
      }
    }
  }

  /**
   * 获取菜单详情
   * @param id 菜单id
   */
  async getMenuDetail(node) {
    const { data } = await getMemberMenuConfigGetMenuConfigDetails({
      id: node.id,
    })
    return {
      data: data,
    }
  }

  /**
   * 删除某个菜单
   */
  async deleteMenu(id: any) {
    const {} = await postMemberMenuConfigDeleteMenu({
      id,
    })
  }

  /**
   * 修改菜单
   */
  async updateMenu(params: any) {
    const {} = await postMemberMenuConfigUpdateMenu({
      ...params,
      menuId: params.id,
      source: params.source,
    })
  }

  /**
   * 新增菜单
   */
  async addMenu(params: any) {
    const { data } = await postMemberMenuConfigAddMenu({
      name: params.name,
      path: params.path,
      // 如果传入了id， 则为当前节点增加子节点， 如果没有传入id，则是在根节点新增
      parentId: params.parentId || 0,
      source: params.source,
    })

    return data
  }

  /**
   * 新增按钮
   */
  async addButtons(params: any) {
    const { data } = await postMemberMenuConfigAddButton({
      id: params.id,
      buttons: params.buttons.map((v) => ({
        ...v,
        code: v.path,
        key: v.path,
      })),
    })
  }

  /**
   * 菜单重排序，通过拖拽
   * 要注意 如果是没有父节点id的，也就是虚拟节点，此时是没有经过后端，则不需要调接口
   * @param parentId 父节点id， 若是根节点则传入0
   * @param childIdList 子节点列表
   */
  async menuReorder(parentId: number, childIdList: number[]) {
    await postMemberMenuConfigMenuResort({
      parentId,
      childIdList,
    })
  }

  /**
   * 根据按钮id获取接口列表
   * @param id 按钮id
   */
  async getInterfaceList(id: number) {
    return {
      data: [
        {
          path: '/mock1',
          id: 1,
        },
        {
          path: '/mock2',
          id: 2,
        },
      ],
    }
  }

  /**
   * 设置接口列表
   * @param id 按钮id
   * @param interfaceList 接口列表
   */
  async setInterfaceList(id: number, interfaceList: any[]) {
    return {}
  }
}

export default new MemberMenuService()

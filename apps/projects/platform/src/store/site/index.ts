import { observable } from 'mobx'
import { ISiteModule } from '@/module/siteModule'
// import { LAYOUT_TYPE } from '@/constants'
import { getEnv } from '@apps/utils'
type CurrentLayoutType = {
  layoutType: string
  mallLink: string
}

const sessionCurrentLayout = sessionStorage.getItem('currentLayout')

class SiteStore implements ISiteModule {
  // 可在根目录下的demo.js修改数据
  @observable public siteId: number = import.meta.env.OUT_SITEID // 站点id
  @observable public siteUrl: string | undefined = getEnv('SITE_URL') // 站点域名
  @observable public mallTemplateInfo: any = {} // 企业商城模板id
  @observable public commodityTemplateInfo: any = {}
  // @observable public currentLayoutInfo: CurrentLayoutType = sessionCurrentLayout
  //   ? JSON.parse(sessionCurrentLayout)
  //   : { layoutType: LAYOUT_TYPE.mall, mallLink: '/' }

  // /**
  //  * 保存当前商城类型
  //  */
  // public saveCurrentLayout = (layoutInfo: CurrentLayoutType) => {
  //   this.currentLayoutInfo = layoutInfo
  //   sessionStorage.setItem('currentLayout', JSON.stringify(this.currentLayoutInfo))
  // }
}

export default SiteStore

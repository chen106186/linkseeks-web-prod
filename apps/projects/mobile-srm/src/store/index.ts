import RootStore from './rootStore'

const rootStore = new RootStore()
/**
 * 这里只做根Store的导出
 * 预留以后可能会出现 额外的Store
 */
const Store = {
  ...rootStore,
}

export default Store

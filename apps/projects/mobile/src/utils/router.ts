import RouterManager from '@apps/mobile-services/utils/router'
import { mergeRouter, RouterKeys } from '@/routes'

const Router = new RouterManager<RouterKeys>()

Router.init(mergeRouter)

export default Router

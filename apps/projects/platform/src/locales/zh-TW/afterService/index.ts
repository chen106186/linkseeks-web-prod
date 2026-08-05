import common from './common'
import returnApplication from './returnApplication'
import returnManage from './returnManage'
import exchangeApplication from './exchangeApplication'
import exchangeManage from './exchangeManage'
import repairApplication from './repairApplication'
import repairManage from './repairManage'
import components from './components'
import constants from './constants'

export default {
  ...common,
  ...returnApplication,
  ...returnManage,
  ...exchangeApplication,
  ...exchangeManage,
  ...repairApplication,
  ...repairManage,
  ...components,
  ...constants,
}

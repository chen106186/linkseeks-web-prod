import { useGlobalConext } from '@/context/globalProvider'
import { LAYOUT_TYPE } from '@/types/global'
import JointHome from '@/pages/jointHome'
import OwnHome from '@/pages/ownHome'
import SrmHome from '@/pages/srm/home'
import PlatformHome from '@/pages/platformHome'
import LogisticsHome from '@/pages/logisticsHome'
import ProcessHome from '@/pages/processHome'

const HomeLayout = () => {
  const { layoutType } = useGlobalConext()

  const renderHome = () => {
    if (layoutType === LAYOUT_TYPE.own) {
      return <OwnHome />
    } else if (layoutType === LAYOUT_TYPE.joint) {
      return <JointHome />
    } else if (layoutType === LAYOUT_TYPE.srm) {
      return <SrmHome />
    } else if (layoutType === LAYOUT_TYPE.mainPortal) {
      return <PlatformHome />
    } else if (layoutType === LAYOUT_TYPE.logistics) {
      return <LogisticsHome />
    } else if (layoutType === LAYOUT_TYPE.process) {
      return <ProcessHome />
    } else {
      return null
    }
  }

  return renderHome()
}

export default HomeLayout

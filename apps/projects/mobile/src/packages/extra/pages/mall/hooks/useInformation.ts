import { useEffect, useState } from 'react'
import { getManageMobileMemberInformationMobileList, getManageMobileInformationMobileList } from '@apps/apis'
import useStores from '@/store/useStores'

const useInformation = () => {
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [dataList, setDataList] = useState<any[]>()
  const [current] = useState<number>(1)
  const [pageSize] = useState<number>(50)

  const fetchInformation = () => {
    const param: any = {
      current,
      pageSize,
      sortType: 2,
      recommendLabel: '2,3',
    }

    let getFn
    if (shopAndSite?.isSelf) {
      param.memberId = shopAndSite.memberId
      param.roleId = shopAndSite.memberRoleId
      getFn = getManageMobileMemberInformationMobileList
    } else {
      getFn = getManageMobileInformationMobileList
    }
    getFn &&
      getFn(param).then((res) => {
        if (res.code === 1000) {
          setDataList(res.data.data)
          // if (res.data.data && res.data.data.length > 0) {
          //   // 获取滚动项的高度
          //   createSelectorQuery()
          //     .select('#informationTitle_0')
          //     .boundingClientRect((rect) => {
          //       if (rect) {
          //         rect.height && setInfoRectHeight(rect.height)
          //         startScrollAnimate(res.data.data, rect.height || infoRectHeight)
          //       }
          //     })
          //     .exec()
          // }
        }
      })
  }

  useEffect(() => {
    fetchInformation()
  }, [])

  return {
    infoList: dataList,
  }
}

export default useInformation

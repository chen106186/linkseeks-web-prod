import React, { useState, useEffect } from 'react'
import Category from '@/pages/srm/components/Category'
import AlbumCarousel from '@/pages/srm/components/AlbumCarousel'
import RightSuspension from '@/pages/srm/components/RightSuspension'
import {
  getProductCustomerGetMemberCustomerCategoryTree,
  getPurchaseInviteTenderGetInviteTenderListByDoorWeb,
  getPurchasePurchaseInquirySearchSourceList,
  getPurchaseBiddingSearchSourceList,
} from '@apps/apis'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import Banner from './components/Banner'
import PurchaseModular from './components/PurchaseModular'
import CompanyMessage from './components/CompanyMessage'
import CompanyBrief from './components/CompanyBrief'
import CompanyAlbum from './components/CompanyAlbum'
import ShopInquiryCardModular from './components/PurchaseModular/ShopInquiryCardModular'
import { PAGETYPES } from './components/InquiryCard'
import styles from './index.module.less'
import { LAYOUT_TYPE } from '@/types/global'

const ShopIndex: React.FC = (): JSX.Element => {
  const { mallInfo, shopInfo, userInfo, currentCity } = useGlobalConext()
  const [categoryList, setCategoryList] = useState<any>([])
  const [inviteTenderList, setInviteTenderList] = useState<any>([{}])
  const [purchaseInquiry, setPurchaseInquiry] = useState<any>([{}])
  const [purchaseList, setPurchaseList] = useState<any>([{}])
  const [loading, setLoading] = useState<boolean>(true)
  const [HonorPics, setHonorPics] = useState<any>([])

  const shopId = 0

  const initCategoryData = (list: any, parentKey?: string, parentName?: string) => {
    if (!list) {
      return []
    }
    const result: any = list.map((item: any) => {
      let cid = `c${item.id}`
      let treeName = item.name
      if (parentKey) {
        cid = `${parentKey}_${cid}`
        treeName = `${parentName} ${treeName}`
      }

      const newItem: any = {
        title: item.name,
        name: item.name,
        treeName: treeName,
        key: cid,
        id: item.id,
        parentId: cid,
        brandList: item.brandList,
      }
      if (item.children && item.children.length > 0) {
        newItem.children = initCategoryData(item.children, cid, treeName)
      }
      return newItem
    })
    return result
  }

  /**
   * 获取商品品类树
   */
  const getCategoryTree = () => {
    const param: any = {
      memberId: shopInfo?.memberId,
      memberRoleId: shopInfo?.roleId,
    }
    getProductCustomerGetMemberCustomerCategoryTree(param).then((res) => {
      if (res.code === 1000) {
        let desc = initCategoryData(res.data)
        setCategoryList(desc)
      }
    })
  }
  /**
   * 查询招标列表--采购门户
   */
  const getInviteTenderListByWeb = () => {
    const par: any = {
      current: '1',
      pageSize: '10',
      memberId: shopInfo?.memberId,
      memberRoleId: shopInfo?.roleId,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    const headers = {
      type: mallInfo ? mallInfo.type : '0',
      shopId: mallInfo ? mallInfo.id + '' : '0',
    }
    getPurchaseInviteTenderGetInviteTenderListByDoorWeb(par, { headers })
      .then((res) => {
        if (res.code === 1000) {
          if (res.data.data) {
            setInviteTenderList(res.data.data)
          } else {
            setInviteTenderList([])
          }
        }
      })
      .catch(() => {
        setInviteTenderList([])
      })
  }

  /**
   * 获取采购询价列表
   */
  const fnGetSourceListByEnterpriseWeb = () => {
    const param: any = {
      current: '1',
      pageSize: '10',
      memberId: shopInfo?.memberId,
      memberRoleId: shopInfo?.roleId,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      // overdue: 1
    }
    const headers = {
      type: mallInfo ? mallInfo.type : '1',
      shopId: mallInfo ? mallInfo.id + '' : '1',
    }
    getPurchasePurchaseInquirySearchSourceList(param, { headers })
      .then((res) => {
        if (res.code === 1000) {
          if (res.data.data) {
            setPurchaseInquiry(res.data.data)
          } else {
            setPurchaseInquiry([])
          }
        }
      })
      .catch(() => {
        setPurchaseInquiry([])
      })
  }

  /**
   * 获取采购竞价列表
   */
  const fnGetPurchaseList = () => {
    let data: any = {
      current: '1',
      pageSize: '10',
      memberId: shopInfo?.memberId,
      memberRoleId: shopInfo?.roleId,
      // provinceCode: currentCity?.provinceCode,
      // cityCode: currentCity?.cityCode,
    }
    const headers = {
      type: mallInfo ? mallInfo.type : '0',
      shopId: mallInfo ? mallInfo.id + '' : '0',
    }
    getPurchaseBiddingSearchSourceList(data, { headers })
      .then((res: any) => {
        if (res.data.data) {
          setPurchaseList(res.data.data)
        } else {
          setPurchaseList([])
        }
      })
      .catch(() => {
        setPurchaseList([])
      })
  }

  const fnResetImg = () => {
    const honorPicsDescArr = shopInfo?.honorPics.map((item: any) => {
      let obj = {
        url: item,
        width: '238px',
        height: '161px',
      }
      return obj
    }) as any[]
    setHonorPics([...honorPicsDescArr])
  }

  useEffect(() => {
    Promise.all([
      getInviteTenderListByWeb(),
      fnGetSourceListByEnterpriseWeb(),
      fnGetPurchaseList(),
      getCategoryTree(),
    ]).then(() => {
      setLoading(false)
      fnResetImg()
    })
  }, [])

  return (
    <HelmetProvider title={`${shopInfo?.memberName}`} description={'采购门户'} keyword={'采购门户'}>
      <div className={styles.container}>
        <RightSuspension userInfo={userInfo} mallInfo={mallInfo} shopInfo={shopInfo} isShop={true} />
        <div className={styles.horizontalWrap}>
          <Category
            categoryList={categoryList}
            shopUrlParam={String(shopInfo?.id)}
            shopId={shopId}
            type={LAYOUT_TYPE.shopIndex}
          />
          <div className={styles['banner-warp']}>
            <Banner
              slideshowBOList={shopInfo ? shopInfo.slideshowList || [] : []}
              companyPics={shopInfo ? shopInfo.advertPics || [] : []}
            />
          </div>
          {shopInfo && (
            <div className={styles['user-message-warp']}>
              <CompanyMessage
                purchaseAmount={shopInfo.purchaseAmount}
                purchaseNum={shopInfo.purchaseNum}
                inquiryNum={shopInfo.inquiryNum}
                inviteTenderNum={shopInfo.inviteTenderNum}
                biddingNum={shopInfo.biddingNum}
                companyTitle={shopInfo ? shopInfo.memberName : ''}
              />
            </div>
          )}
        </div>
        <div className={`${styles['message-center']}`}>
          {purchaseInquiry.length !== 0 && (
            <ShopInquiryCardModular
              isSign={userInfo && userInfo.userId ? true : false}
              modular={'采购询价'}
              messageList={purchaseInquiry}
              loading={loading}
              pageType={PAGETYPES.INQUIRY_ORDER}
            ></ShopInquiryCardModular>
          )}
          {inviteTenderList.length !== 0 && (
            <PurchaseModular
              isSign={userInfo && userInfo.userId ? true : false}
              modular={'采购招标'}
              messageList={inviteTenderList}
              loading={loading}
              pageType={PAGETYPES.TENDER_ORDER}
            ></PurchaseModular>
          )}
          {purchaseList.length !== 0 && (
            <ShopInquiryCardModular
              isSign={userInfo && userInfo.userId ? true : false}
              modular={'采购竞价'}
              messageList={purchaseList}
              loading={loading}
              pageType={PAGETYPES.BIDDING_ORDER}
            ></ShopInquiryCardModular>
          )}
        </div>
        <div className={`${styles['message-block']} ${styles['message-center-brief']}`}>
          <div className={`${styles['message-center']}`}>
            <CompanyBrief
              brief={shopInfo ? shopInfo.describe : ''}
              address={shopInfo ? shopInfo.areas : ''}
              money={shopInfo ? shopInfo.registeredCapital : ''}
              years={shopInfo ? shopInfo.registerYears : ''}
              mainManagement={shopInfo ? shopInfo.mainCategory : ''}
            ></CompanyBrief>
          </div>
        </div>
        {shopInfo && shopInfo.companyPics.length > 0 && (
          <div className={`${styles['message-block']}`} style={{ backgroundColor: '#ffffff', paddingBottom: '48px' }}>
            <div className={`${styles['message-center']}`}>
              <CompanyAlbum shopInfoId={shopInfo.id} companyImgList={shopInfo ? shopInfo.companyPics : []} />
            </div>
          </div>
        )}
        {HonorPics.length > 0 && (
          <div className={`${styles['message-block']} ${styles['message-center-brief']}`}>
            <div className={`${styles['message-center']}`}>
              <AlbumCarousel
                albumTitle={'荣誉资质'}
                albumImg={HonorPics || []}
                cuttingNumber={3}
                albumWidth={'100%'}
              ></AlbumCarousel>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  )
}

export default ShopIndex

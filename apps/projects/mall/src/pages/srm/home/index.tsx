import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { HomeLayoutLoaderReturn } from '@/loaders/homeLayoutLoader'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import Category from '@/pages/srm/components/Category'
import InquiryCardModular from './components/PurchaseModular/InquiryCardModular'
import PurchaseModular from './components/PurchaseModular'
import Banner from './components/Banner'
import UserMessage from './components/UserMessage'
import { PAGETYPES } from './components/InquiryCard'
import Publicity from './components/Publicity'
import useSrmHome from './hooks'
import styles from './index.module.less'

const SrmHome: React.FC = () => {
  const { mallInfo, userInfo } = useGlobalConext()
  const { seoInfo } = useLoaderData() as HomeLayoutLoaderReturn
  const { loading, inviteTenderList, purchaseInquiry, purchaseList, categoryList } = useSrmHome()
  const translate = getWebIntl()

  return (
    <HelmetProvider
      title={seoInfo?.title || mallInfo?.name || ''}
      keyword={seoInfo?.keywords || mallInfo?.name || ''}
      description={seoInfo?.description || mallInfo?.name || ''}
    >
      <div className={styles.container}>
        <div className={styles.horizontalWrap}>
          <Category categoryList={categoryList} />
          <div className={styles['banner-warp']}>
            <Banner />
          </div>
          <div className={styles['user-message-warp']}>
            <UserMessage />
          </div>
        </div>
        <div className={styles['publicity-warp']}>
          <Publicity />
        </div>
        <div>
          {
            <InquiryCardModular
              modular={translate('web.resource.order.caigouxunjia')}
              topBorderColor="#00a98f"
              loading={loading}
              isSign={userInfo && userInfo.userId ? true : false}
              messageList={purchaseInquiry}
              pageType={PAGETYPES.INQUIRY_ORDER}
            />
          }
          {
            <PurchaseModular
              modular={translate('web.resource.order.caigouzhaobiao')}
              topBorderColor="#2266EE"
              loading={loading}
              isSign={userInfo && userInfo.userId ? true : false}
              messageList={inviteTenderList}
              shopId={String(mallInfo?.id)}
              pageType={PAGETYPES.TENDER_ORDER}
            />
          }
          {
            <InquiryCardModular
              modular={translate('web.resource.order.caigoujingjia')}
              topBorderColor="#EA8000"
              loading={loading}
              isSign={userInfo && userInfo.userId ? true : false}
              messageList={purchaseList}
              pageType={PAGETYPES.BIDDING_ORDER}
            />
          }
        </div>
      </div>
    </HelmetProvider>
  )
}

export default SrmHome

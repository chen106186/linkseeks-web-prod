import React from 'react'
import { ImageBox } from '@apps/components'
import { Tag } from '@linkseeks/ui'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import type { GetCommodityWebStoreWebStoreDetailResponse } from '@apps/apis'
import styles from './index.less'

interface StoreInfoTitleProps {
  storeInfo: GetCommodityWebStoreWebStoreDetailResponse | undefined
}

const StoreInfoTitle: React.FC<StoreInfoTitleProps> = ({ storeInfo }) => (
  <div className={styles['shop-adorn-title']}>
    <ImageBox width={32} height={32} src={storeInfo?.logo || defaultLogo} />
    <span className={styles['shop-adorn-title-name']}>{storeInfo?.name}</span>
    <Tag color="#EBF9F6" style={{ color: '#00A98F' }}>
      ID: {storeInfo?.id}
    </Tag>
  </div>
)

export default StoreInfoTitle

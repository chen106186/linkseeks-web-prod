import React from 'react'
import { Input } from 'antd'
import { ImageBox } from '@apps/components'
import deleteIcon from './delete_icon.png'
import styles from './index.less'

export interface MerchantItem {
  id: number
  describe: string
  customerCategoryName: string
  mainCategory: string
  registerYears: number
  avgTradeCommentStar: number
  areas: string
  memberId: string
  memberRoleId: number
  memberName: string
  logo: string
}

interface BrandItemPropsType {
  dataInfo: MerchantItem
  onChange: (val: string, item: MerchantItem) => void
  onDelete: (item: MerchantItem) => void
}

const ShopItem: React.FC<BrandItemPropsType> = (props) => {
  const { dataInfo, onChange, onDelete } = props

  return (
    <div className={styles.brand_item}>
      <div className={styles.brand_item_imgbox}>
        <div className={styles.brand_item_logo}>
          <ImageBox width={80} height={80} src={dataInfo.logo} />
        </div>
      </div>
      <div className={styles.brand_item_info}>
        <div className={styles.brand_item_info_name}>
          <span>{dataInfo.memberName}</span>
          <img onClick={() => onDelete(dataInfo)} className={styles.delete_icon} src={deleteIcon} />
        </div>
        <Input.TextArea
          value={dataInfo.describe}
          placeholder="店铺描述，不超过22个汉字"
          className={styles.text_area}
          onChange={(e) => onChange(e.target.value, dataInfo)}
          maxLength={22}
        />
      </div>
    </div>
  )
}

export default ShopItem

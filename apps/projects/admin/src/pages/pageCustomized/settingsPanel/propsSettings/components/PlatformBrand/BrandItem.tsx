import React from 'react'
import { Input } from 'antd'
import { ImageBox } from '@apps/components'
import deleteIcon from './delete_icon.png'
import styles from './index.less'

export interface BrandItemType {
  brandId: number
  brandLogo: string
  brandName: string
  describe: string
  shopId: number
}

interface BrandItemPropsType {
  dataInfo: BrandItemType
  onChange: (val: string, item: BrandItemType) => void
  onDelete: (item: BrandItemType) => void
}

const BrandItem: React.FC<BrandItemPropsType> = (props) => {
  const { dataInfo, onChange, onDelete } = props

  return (
    <div className={styles.brand_item}>
      <div className={styles.brand_item_imgbox}>
        <div className={styles.brand_item_logo}>
          <ImageBox width={80} height={80} src={dataInfo.brandLogo} />
        </div>
      </div>
      <div className={styles.brand_item_info}>
        <div className={styles.brand_item_info_name}>
          <span>{dataInfo.brandName}</span>
          <img onClick={() => onDelete(dataInfo)} className={styles.delete_icon} src={deleteIcon} />
        </div>
        <Input.TextArea
          value={dataInfo.describe}
          placeholder="品牌描述，不超过20个汉字"
          className={styles.text_area}
          onChange={(e) => onChange(e.target.value, dataInfo)}
          maxLength={20}
        />
      </div>
    </div>
  )
}

export default BrandItem

import React from 'react'
import { Input } from 'antd'
import { ImageBox } from '@apps/components'
import { ProcessItemType } from './index'
import deleteIcon from './delete_icon.png'
import styles from './index.less'

interface SelectItemType {
  dataInfo: ProcessItemType
  onChange: (val: string, item: ProcessItemType) => void
  onDelete: (item: ProcessItemType) => void
}

const SelectItem: React.FC<SelectItemType> = (props) => {
  const { dataInfo, onChange, onDelete } = props

  return (
    <div className={styles.select_item}>
      <div className={styles.select_item_imgbox}>
        <div className={styles.select_item_logo}>
          <ImageBox width={80} height={80} src={dataInfo.logo} />
        </div>
      </div>
      <div className={styles.select_item_info}>
        <div className={styles.select_item_info_name}>
          <span>{dataInfo.memberName}</span>
          <img onClick={() => onDelete(dataInfo)} className={styles.delete_icon} src={deleteIcon} />
        </div>
        <Input.TextArea
          value={dataInfo.describe}
          placeholder="加工企业介绍，不超过16个汉字"
          className={styles.text_area}
          onChange={(e) => onChange(e.target.value, dataInfo)}
          maxLength={16}
        />
      </div>
    </div>
  )
}

export default SelectItem

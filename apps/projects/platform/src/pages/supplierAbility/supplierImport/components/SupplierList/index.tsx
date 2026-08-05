import React from 'react'
import Item from './item'
import { GetMemberSupplierAbilityMaintenancePlatformQueryByCategoryResponseDetail } from '@apps/apis'
import styles from './index.less'

interface SupplierListProps {
  source: GetMemberSupplierAbilityMaintenancePlatformQueryByCategoryResponseDetail[]
  itemOnClick: (memberId: number, roleId: number) => Promise<void>
}

const SupplierList: React.FC<SupplierListProps> = (props) => {
  const { source = [], itemOnClick } = props

  return (
    <div className={styles.supplier_list}>
      {source.map((item, index) => (
        <Item key={`${item.memberId}_${index}`} data={item} onClick={itemOnClick} />
      ))}
    </div>
  )
}

export default SupplierList

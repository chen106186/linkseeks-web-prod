import React, { useState } from 'react'
import { ImageBox } from '@apps/components'
import { Button } from 'antd'
import { CategoryIcon } from '@linkseeks/icons'
import defaultAvatar from '@/assets/imgs/default_avatar.svg'
import { GetMemberSupplierAbilityMaintenancePlatformQueryByCategoryResponseDetail } from '@apps/apis'
import styles from './index.less'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
interface SupplierItemProps {
  data: GetMemberSupplierAbilityMaintenancePlatformQueryByCategoryResponseDetail
  onClick: (memberId: number, roleId: number) => Promise<void>
}

const SupplierItem: React.FC<SupplierItemProps> = (props) => {
  const { data, onClick } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const translate = useWebIntl()
  const mainBusiness = data.mainBusiness ? data.mainBusiness.split('|') : []

  const _onClick = async () => {
    if (onClick) {
      setConfirmLoading(true)
      await onClick(data.memberId, data.roleId)
      setTimeout(() => {
        setConfirmLoading(false)
      }, 200)
    }
  }

  return (
    <div className={styles.supplier_list_item}>
      <div className={styles.supplier_list_item_main}>
        <div className={styles.supplier_list_item_line}>
          <div className={styles.supplier_logo}>
            <ImageBox width={48} height={48} round={4} src={data.logo || defaultAvatar} />
          </div>
          <div>
            <div className={styles.supplier_name}>{data.memberName}</div>
            <div className={styles.supplier_details}>
              <span>
                {translate('web.resource.member.zhuceziben')}：{data.registeredCapital}
              </span>
              <span>
                {translate('web.resource.member.hangye')}：{data.business}
              </span>
              <span>
                {translate('web.resource.member.suozaidiqu')}：{data.registerArea}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.main_category_list}>
          <label>
            <CategoryIcon className={styles.main_category_icon} />
            {translate('web.resource.member.zhuying')}：
          </label>
          {mainBusiness.map((itemBusiness) => (
            <span key={itemBusiness}>{itemBusiness}</span>
          ))}
        </div>
      </div>
      <AuthButton type="custom" code="invite">
        <Button loading={confirmLoading} type="primary" onClick={_onClick}>
          {translate('web.resource.member.lijiyaoqing')}
        </Button>
      </AuthButton>
    </div>
  )
}

export default SupplierItem

import React, { useState, useEffect } from 'react'
import { CaretDownOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import { getMemberAbilityInfoApplyCondition } from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import StarRate from '@/components/StarRate'
import quality from './quality.png'
import styles from './index.module.less'

const ShopTop: React.FC = (props) => {
  const { shopInfo, mallInfo, userInfo } = useGlobalConext()
  const [MemberMessage, setMemberMessage] = useState<any>({})

  /**
   * 是否会员
   */
  const fnGetUserStatus = () => {
    if (!shopInfo?.memberId) {
      return
    }
    let obj: any = {
      upperMemberId: shopInfo?.memberId,
      upperRoleId: shopInfo?.roleId,
      shopType: 2,
    }
    getMemberAbilityInfoApplyCondition(obj).then((res) => {
      setMemberMessage(res.data)
    })
  }

  const content = (
    <ul className={styles['shop-card-warp']}>
      <li className={styles['shop-card-item']}>
        <div>
          <span className={styles['shop-card-title']}>企业实名:</span>
          <span className={styles['shop-card-authentication']}>{shopInfo?.status ? ' 已通过会员认证' : '未认证'}</span>
        </div>
        <div>
          <span className={styles['shop-card-title']}>注册资本:</span>
          <span className={styles['shop-card-content']}>{shopInfo?.registeredCapital || '-'}</span>
        </div>
      </li>
      <li className={styles['shop-card-item']}>
        <div>
          <span className={styles['shop-card-title']}>满意度:</span>
          <span className={styles['shop-card-content']}>
            <StarRate value={shopInfo?.avgTradeCommentStar || 0} showValue={false} />
          </span>
        </div>
        <div>
          <span className={styles['shop-card-title']}>成立日期:</span>
          <span className={styles['shop-card-content']}>{shopInfo?.establishmentDate || '-'}</span>
        </div>
      </li>
      <li className={styles['shop-card-item']}>
        <div>
          <span className={styles['shop-card-title']}>所在地区:</span>
          <span className={styles['shop-card-content']}>{shopInfo?.registerArea || '-'}</span>
        </div>
      </li>
      <li className={styles['shop-card-item-second']}>
        <span className={styles['shop-card-title-second']}>累计采购询价:</span>
        <span>{shopInfo?.inquiryNum}次</span>
      </li>
      <li className={styles['shop-card-item-second']}>
        <span className={styles['shop-card-title-second']}>累计招标次数:</span>
        <span>{shopInfo?.inviteTenderNum}次</span>
      </li>
      <li className={styles['shop-card-item-second']}>
        <span className={styles['shop-card-title-second']}>累计竞价次数:</span>
        <span>{shopInfo?.biddingNum}次</span>
      </li>
      <li className={styles['shop-card-item-second']}>
        <span className={styles['shop-card-title-second']}>累计采购全部:</span>
        <span>¥{shopInfo?.purchaseAmount}</span>
      </li>
      {MemberMessage.show && (
        <li>
          <div className={styles['shop-card-btn']}>
            申请成为入库供应商
            {MemberMessage.validateId ? (
              <a
                href={`${MEMBER_CENTER_URL}/supplierAbility/profile/memberQuery/detail?validateId=${MemberMessage.validateId}`}
                className="all-jump"
              ></a>
            ) : (
              <a
                href={`${MEMBER_CENTER_URL}/supplierAbility/profile/memberQuery/applyMember?upperMemberId=${shopInfo?.memberId}&upperRoleId=${shopInfo?.roleId}`}
                className="all-jump"
              ></a>
            )}
          </div>
        </li>
      )}
    </ul>
  )

  useEffect(() => {
    if (userInfo) {
      fnGetUserStatus()
    }
  }, [shopInfo, userInfo])

  return (
    <div className={styles['company-man']}>
      <div style={{ position: 'relative' }}>
        <img src={mallInfo?.logoUrl} alt="" className={styles['logn-img']} />
        <a href={`/shopIndex/${shopInfo?.id}`} className="all-jump"></a>
      </div>
      <div className={styles['company-logo']}>
        <img src={shopInfo?.logo} alt="" className={styles['company-logo']} />
        <a href={`/shopIndex/${shopInfo?.id}`} className="all-jump"></a>
      </div>
      <ul>
        <li className={styles['company-title']}>
          <Popover content={content}>
            {shopInfo ? shopInfo.memberName : ''}
            <CaretDownOutlined className={styles['company-icon']} />
          </Popover>
        </li>
        <li>
          <img src={quality} alt="" />
          <span className={styles['quality-tips']}>{shopInfo ? shopInfo.creditPoint : '-'}</span>
        </li>
      </ul>
    </div>
  )
}

export default ShopTop

import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { getLoginDomainFn, getRegisterDomainFn, MEMBER_CENTER_URL } from '@/constants/domain'
import { useGlobalConext } from '@/context/globalProvider'
import { LinkTo } from '@/utils'
import IconFont from '@/utils/iconfont'
import defaultAvatar from './default_avatar.png'
import styles from './index.module.less'

const UserMessage: React.FC = () => {
  const { userInfo, url } = useGlobalConext()
  const [identitySelect, setidentitySelect] = useState(1) // 1供货商  2采购商
  const translate = getWebIntl()

  // 注册域名
  const REGISTER_DOMAIN = getRegisterDomainFn(url)

  // 登录域名
  const LOGIN_DOMAIN = getLoginDomainFn(url)

  const fnChangeIdentity = (type: number) => {
    if (userInfo) {
      return
    }
    setidentitySelect(type)
  }
  useEffect(() => {
    if (userInfo) {
      if (userInfo.memberRoleType == 1) {
        setidentitySelect(1)
      } else {
        setidentitySelect(2)
      }
    }
  }, [userInfo])

  return (
    <div className={styles['user-message-warp']}>
      <div className={styles['user-welcome-warp']}>
        <div className={styles['user-icon-warp']}>
          <img src={userInfo?.logo || defaultAvatar} alt="" />
        </div>
        {!userInfo && (
          <>
            <div className={styles['user-welcome-tips']}>
              Hi，{translate('web.resource.mall.huanyinglaidaoqiyecaigou')}
            </div>
            <div className={styles['user-btn-warp']}>
              <Button type="primary" className={styles['user-btn']} onClick={() => LinkTo(LOGIN_DOMAIN)}>
                {translate('web.resource.mall.login')}
              </Button>
              <Button type="primary" className={styles['user-btn']} onClick={() => LinkTo(REGISTER_DOMAIN)}>
                {translate('web.resource.mall.register')}
              </Button>
            </div>
          </>
        )}
        {userInfo && userInfo.userId && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles['user-name']}>{userInfo?.memberName}</div>
            <div>
              <div className={styles['user-type']}>
                {userInfo.memberRoleType == 1
                  ? translate('web.resource.member.gongyingshang')
                  : translate('web.resource.mall.caigoushang')}
              </div>
            </div>
            <Button type="primary" onClick={() => LinkTo(MEMBER_CENTER_URL)}>
              {translate('web.resource.mall.jinruhuiyuanzhongxin')}
            </Button>
          </div>
        )}
      </div>
      {!userInfo ? (
        <div className={styles['identity-warp']}>
          <div
            onClick={() => {
              fnChangeIdentity(1)
            }}
            className={`${styles['identity-item']} ${identitySelect == 1 ? styles['identity-item-select'] : ''}`}
          >
            {translate('web.resource.mall.woshigongyingshang')}
          </div>
          <div
            onClick={() => {
              fnChangeIdentity(2)
            }}
            className={`${styles['identity-item']} ${identitySelect == 2 ? styles['identity-item-select'] : ''}`}
          >
            {translate('web.resource.mall.woshicaigoushang')}
          </div>
        </div>
      ) : (
        <div className={styles['identity-warp']} style={{ height: 32 }} />
      )}
      {identitySelect == 1 && (
        <div className={styles['user-operation-warp']}>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-offer" style={{ fontSize: 28 }} className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.baojia')}</div>
            <a href={`${MEMBER_CENTER_URL}/procurementAbility/offter/inquiry`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-supply" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.toubiao')}</div>
            <a href={`${MEMBER_CENTER_URL}/procurementAbility/tender/tenderSearch`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-default" style={{ fontSize: 28 }} className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.jingjia')}</div>
            <a href={`${MEMBER_CENTER_URL}/procurementAbility/onlineBid/search`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-shop" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.hetongxietong')}</div>
            <a href={`${MEMBER_CENTER_URL}/contract/coordination/coordinationList`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-integral" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.dingdanxietong')}</div>
            <a href={`${MEMBER_CENTER_URL}/orderAbility/saleOrder/orderList`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-contract_2" style={{ fontSize: 28 }} className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.hetonglvyue')}</div>
            <a href={`${MEMBER_CENTER_URL}/contract/coordination/implement`} className="all-jump"></a>
          </div>
        </div>
      )}

      {identitySelect === 2 && (
        <div className={styles['user-operation-warp']}>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-offer" style={{ fontSize: 28 }} className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.xunjia')}</div>
            <a href={`${MEMBER_CENTER_URL}/procurementAbility/purchaseInquiry/inquiry`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-supply" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.zhaobiao')}</div>
            <a href={`${MEMBER_CENTER_URL}/procurementAbility/callForBids/callForBidsSearch`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-default" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.jingjia')}</div>
            <a href={`${MEMBER_CENTER_URL}/procurementAbility/purchaseBid/search`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-shop" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.hetongguanli')}</div>
            <a href={`${MEMBER_CENTER_URL}/contract/manage/QueryList`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-integral" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.dingdanzhixing')}</div>
            <a href={`${MEMBER_CENTER_URL}/orderAbility/purchaseOrder/orderList`} className="all-jump"></a>
          </div>
          <div className={styles['user-operation-item']}>
            <div className={styles['operation-icon-warp']}>
              <IconFont type="icon-contract_2" className={styles['operation-icon']} />
            </div>
            <div>{translate('web.resource.mall.hetongzhixing')}</div>
            <a href={`${MEMBER_CENTER_URL}/contract/contractexecution/contractexecutionList`} className="all-jump"></a>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMessage

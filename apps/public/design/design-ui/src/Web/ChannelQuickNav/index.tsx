import React from 'react'
import { Select } from 'antd'
import contactIcon from './contact_icon.png'
import styles from './index.less'
import ShopCredit from '../../components/ShopCredit'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import StarRate from '../StarRate'
import { QuickNavLocal } from '../../locale/types/quicknav'

interface QuickNavPropsType {
  channelInfo: any
  userRoles: any
  name?: string
  advertList: any
}

const ChannelQuickNav: React.FC<QuickNavPropsType> = (props) => {
  const { channelInfo } = props

  const renderComponent = (locale: QuickNavLocal) => {
    const getDate = (value: string) => {
      if (value) {
        const temp = value.split('日')
        if (temp.length > 0) {
          return `${temp[0]}${locale['unit.day']}`
        }
      }
      return null
    }

    return channelInfo ? (
      <div className={styles.quikc_nav}>
        <div className={styles.quikc_nav_right}>
          <div className={styles.member_card}>
            <div className={styles.shop_header_info}>
              <div className={styles.shop_header_info_logo}>
                <img src={channelInfo.logo} />
              </div>
              <div className={styles.shop_header_info_content}>
                <div className={styles.shop_header_info_content_name}>
                  <span>{channelInfo.memberName}</span>
                </div>
                <div className={styles.shop_header_info_content_about}>
                  <ShopCredit creditPoint={channelInfo.creditPoint || 0} />
                </div>
              </div>
            </div>
            <div className={styles.shop_info_list}>
              <div className={styles.shop_info_list_item}>
                <div className={styles.label}>
                  {locale['registeredCapital']}：
                </div>
                <div className={styles.breif}>
                  {channelInfo.registeredCapital || ''}
                </div>
              </div>
              <div className={styles.shop_info_list_item}>
                <div className={styles.label}>
                  {locale['establishmentDate']}：
                </div>
                <div className={styles.breif}>
                  {getDate(channelInfo.establishmentDate)}
                </div>
              </div>
              <div className={styles.shop_info_list_item}>
                <div className={styles.label}>
                  {locale['business.license']}：
                </div>
                <div className={styles.breif}>
                  <span className={styles.certified}>
                    {channelInfo.businessLicence
                      ? `[${locale['certified']}]`
                      : `[${locale['not.certified']}]`}
                  </span>
                </div>
              </div>
              <div className={styles.shop_info_list_item}>
                <div className={styles.label}>
                  {locale['avgTradeCommentStar']}：
                </div>
                <div className={styles.breif}>
                  <StarRate value={channelInfo.avgTradeCommentStar || 0} />
                </div>
              </div>
              <div className={styles.shop_info_list_item}>
                <div className={styles.label}>{locale['contact']}：</div>
                <div className={styles.breif}>
                  <div className={styles.contact_box}>
                    <div className={styles.contact_icon}>
                      <img src={contactIcon} />
                    </div>
                    <div className={styles.contack_text}>
                      {locale['contact.us']}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.change_role_box}>
              <div className={styles.change_role_box_title}>
                {locale['change.role']}
              </div>
              <Select
                className={styles.change_role_box_select}
                placeholder={locale['member.role']}
              />
              <Select
                className={styles.change_role_box_select}
                placeholder={locale['superior.channel']}
              />
            </div>
          </div>
        </div>
      </div>
    ) : null
  }

  return (
    <LocaleReceiver componentName="QuickNav">{renderComponent}</LocaleReceiver>
  )
}

export default ChannelQuickNav

import React, { useState, useEffect } from 'react'
import { Affix, Tooltip, Image, BackTop } from 'antd'
import { CommentOutlined, AppstoreOutlined, HistoryOutlined, UpOutlined } from '@ant-design/icons'
// import { toChatRoom } from '@/utils/im';
// import { INFO_CENTER_URL } from '@/constants';
import app from './app.svg'
import message from './message.svg'
import { getManageAppDownloadLinkFind } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  userInfo: any
  mallInfo: any
  isShop?: boolean
}

function RightSuspension(props: Props) {
  const { userInfo, mallInfo, isShop = false } = props
  const [top] = useState(200)
  const translate = getWebIntl()

  const fnGetDownloadUrl = () => {
    getManageAppDownloadLinkFind()
      .then((res: any) => {
        // if (res.data.data) {
        //     text = <QRCode value={`${res.data.data}`} size={160} />
        // }
      })
      .catch(() => {
        console.log('报错了')
      })
  }
  /**
   * 跳转IM
   */
  const fnToChatRoom = () => {
    if (userInfo) {
      // toChatRoom(userInfo.memberId, mallInfo.type)
    }
  }

  return (
    <div className={styles['affix-main']}>
      <div className="ant-affix-right">
        <Affix offsetTop={top} style={{ right: 0 }}>
          <ul className={styles['affix-warp']}>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{'全部公示'}</div>
              <a href={isShop ? '/procurementPublicityShop' : '/procurementPublicity'} className="all-jump"></a>
            </li>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{'采购询价'}</div>
              <a href={isShop ? '/procurementSourcing' : '/purchaseInquiry?priceTypeList=1'} className="all-jump"></a>
            </li>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{'采购招标'}</div>
              <a href={isShop ? '/procurementBidding' : '/purchaseBidding?priceTypeList=2'} className="all-jump"></a>
            </li>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{'采购竞价'}</div>
              <a href={isShop ? '/procurementCompete' : '/purchaseCompete?priceTypeList=3'} className="all-jump"></a>
            </li>
            {/* {
              !isShop && (
                <li className={styles['icon-warp']}>
                  <div className={styles['icon-text']}>
                    {getMessage('locales.hangqingzixun', '行情资讯')}
                  </div>
                  <a href={INFO_CENTER_URL} className='all-jump'></a>
                </li>
              )
            } */}
            <li className={styles['icon-warp']} onClick={fnToChatRoom} style={{ marginTop: '16px' }}>
              {/* <CommentOutlined className={styles['icon-affix']} translate={undefined} /> */}
              <img src={message} alt="" className={styles['icon-affix']} />
              <div>{'客服'}</div>
            </li>

            {/* <li className={styles['icon-warp']} onClick={fnToChatRoom} style={{borderBottom:'0'}}>
                        <HistoryOutlined className={styles['icon-affix']} translate={undefined} />
                        <div>历史</div>
                    </li> */}
            <li>
              <BackTop>
                <div className={styles['icon-warp']} style={{ borderBottom: '0', borderTop: '1px solid #F4F5F7' }}>
                  <UpOutlined className={styles['icon-affix']} translate={undefined} />
                </div>
              </BackTop>
            </li>
          </ul>
        </Affix>
      </div>
    </div>
  )
}

export default RightSuspension

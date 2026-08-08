import React from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import useDomainPath from '@/hooks/useDomainPath'
import { Button } from 'antd'
import fee from './fee.png'
import accurate from './accurate.png'
import extension from './extension.png'
import push from './push.png'
import styles from './index.module.less'

const Settle: React.FC = () => {
  const { pathname } = useGlobalConext()
  const { REGISTER_DOMAIN } = useDomainPath(pathname)

  return (
    <div className={styles['settle-main']}>
      <div className={styles['settle-warp']}>
        <ul className={styles['settle-left']}>
          <li className={styles['settle-title']}>欢迎入驻</li>
          <li className={styles['settle-content']}>
            平台提供加工需求精准匹配推送，线上线下推广团队助加工企业精准获取海量商机，提供优质线上运营服务，欢迎实力加工企业入驻。
          </li>
          <li>
            <Button className={styles['apply-btn']}>
              立即申请
              <a className="all-jump" href={REGISTER_DOMAIN}></a>
            </Button>
          </li>
        </ul>
        <ul className={styles['settle-right']}>
          <li className={styles['settle-item']}>
            <img src={fee} alt="" />
            <div className={styles['settle-item-title']}>免费入驻</div>
            <div className={styles['settle-item-tips']}>企业免费入驻</div>
            <div>平台不收入驻费</div>
          </li>
          <li className={styles['settle-item']}>
            <img src={push} alt="" />
            <div className={styles['settle-item-title']}>平台推送</div>
            <div className={styles['settle-item-tips']}>平台供需对接</div>
            <div>主动推送物流供需信息</div>
          </li>
          <li className={styles['settle-item']}>
            <img src={extension} alt="" />
            <div className={styles['settle-item-title']}>全渠道退推广</div>
            <div className={styles['settle-item-tips']}>平台专业推广团队</div>
            <div>线上线下全渠道推广</div>
          </li>
          <li className={styles['settle-item']}>
            <img src={accurate} alt="" />
            <div className={styles['settle-item-title']}>精准流量获客</div>
            <div className={styles['settle-item-tips']}>平台精准流量支持</div>
            <div>获取海量优质商机</div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Settle

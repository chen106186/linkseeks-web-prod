import React from 'react'
import { Typography, Tooltip } from 'antd'
import { LinkOutlined } from '@ant-design/icons'

import styles from './index.less'

export interface MsgItemPrpos {
  rank?: number
  data?: any
}

const MsgItem: React.FC<MsgItemPrpos> = (props: any) => {
  const { data, rank } = props
  const rankNumber = Number(rank) + 1

  return (
    <div className={styles.msgItem}>
      <div className={styles.msgItemRow} style={{ alignItems: 'center' }}>
        <div className={styles.badge}>{rankNumber}</div>
        <Tooltip placement="top" title={data.memberName}>
          <div className={styles.titleTop}>{data.memberName}</div>
        </Tooltip>
      </div>
      <div className={styles.msgItemRow}>
        <div className={styles.label}>联系人姓名：</div>
        <div className={styles.title}>{data.contacts}</div>
      </div>
      <div className={styles.msgItemRow}>
        <div className={styles.label}>联系人手机：</div>
        <div className={styles.title}>{data.tel.replace(/^(.{3})(.*)(.{4})$/, '$1 $2 $3')}</div>
      </div>
      <div className={styles.msgItemRow}>
        <div className={styles.label}>电子邮箱：</div>
        <Tooltip placement="top" title={data.mail}>
          <div className={styles.title}>{data.mail}</div>
        </Tooltip>
      </div>
      <div className={styles.msgItemRow}>
        <div className={styles.label}>联系地址：</div>
        <Tooltip placement="top" title={data.address}>
          <div className={styles.title}>{data.address}</div>
        </Tooltip>
      </div>
      <div className={styles.msgItemRow}>
        <div className={styles.label}>报名文件：</div>
        <div className={styles.files}>
          {data.enclosureUrls
            ? data.enclosureUrls.map((item, index) => {
                return (
                  <Typography.Link
                    style={{ display: 'block', paddingBottom: '8px' }}
                    target="_blank"
                    href={item.url}
                    key={`Typography_${item.name}_${index}`}
                  >
                    <LinkOutlined />
                    {item.name}
                  </Typography.Link>
                )
              })
            : '-'}
        </div>
      </div>
    </div>
  )
}

export default MsgItem

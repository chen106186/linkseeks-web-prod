import { useIntl } from '@linkseeks/i18n'
import React, { useState } from 'react'
import { Progress } from 'antd'
import style from './index.less'

const ActivityTypeLayout = () => {
  const [dataSource, setDataSource] = useState([1, 2, 3, 4])
  const intl = useIntl()
  return (
    <div className={style.list_box}>
      <div className={style.list_items} style={{ width: dataSource.length * 320 + 'px' }}>
        {dataSource.map((item) => (
          <div className={style.list_item_row} key={item}>
            <span className={style.list_item_tag}>{intl.formatMessage({ id: 'marketingAbility.tejiacuxiao' })}</span>
            <div className={style.list_item_title}>
              {intl.formatMessage({ id: 'marketingAbility.2020nian9yuetejiacuxiao' })}
            </div>
            <div className={style.list_item_date}>2020-09-01 10:00:00 ~ 2020-10-01 10:00:00</div>
            <Progress percent={80} format={(percent) => percent + '%'} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default ActivityTypeLayout

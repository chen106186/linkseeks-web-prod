import React, { useEffect, useRef, useState } from 'react'
import empty from '@/assets/imgs/empty.png'
import { Button } from 'antd'
import { getWebIntl } from '@/utils/locales'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'
import { LinkTo } from '@/utils'

const TIMEOUT = 5

const Expired: React.FC = () => {
  const translate = getWebIntl()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [count, setCount] = useState<number>(TIMEOUT)
  const { linkPrefix } = useLink()

  const jump = () => {
    LinkTo(linkPrefix())
  }

  useEffect(() => {
    if (count === 0) {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      jump()
    }
  }, [count])

  useEffect(() => {
    timer.current = setInterval(() => {
      setCount((prev) => prev - 1)
    }, 1000)
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src={empty} />
        <div className={styles.pityText}>{translate('web.resource.mall.henyihanbenhuodongyiguoqi')}</div>
        <div className={styles.tips}>
          <div>{translate('web.resource.mall.shangchengzhengzaijingxingqitahuodong')}</div>
          <div>
            {translate('web.resource.mall.xitongjiangzai')}
            <span className={styles.highlight}>{count}</span>
            {translate('web.resource.mall.miaohoufanhuihuodongyemian')}
          </div>
        </div>

        <Button type="primary" onClick={jump}>
          {translate('web.resource.mall.lijifanhui')}
        </Button>
      </div>
    </div>
  )
}

export default Expired

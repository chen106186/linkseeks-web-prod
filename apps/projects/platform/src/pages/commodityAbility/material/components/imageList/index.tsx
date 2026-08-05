import { ExclamationCircleFilled } from '@ant-design/icons'
import { PlusFillIcon } from '@linkseeks/icons'
import { Popover } from 'antd'
import React, { useMemo } from 'react'
import styles from './index.less'

interface Iprops {
  imageUrls: string[]
  old_urls?: string[]
  before?: boolean
}

const ImageList: React.FC<Iprops> = (props: Iprops) => {
  const { imageUrls, old_urls, before } = props
  const new_urls = useMemo(() => {
    if (before === undefined) {
      return imageUrls
    }
    if (before) {
      return old_urls
    }
    if (!old_urls) {
      return imageUrls?.map((v) => {
        return { url: v, change: 'add' }
      })
    } else {
      const n_u = []
      const old_urls_ = [...old_urls]
      imageUrls?.forEach((e, i) => {
        const old_i = old_urls_?.findIndex((v) => e === v)
        if (old_i === -1) {
          n_u.push({
            url: e,
            change: 'add',
          })
        } else {
          old_urls_.splice(old_i, 1)
          n_u.push({
            url: e,
          })
        }
        if (i === imageUrls.length - 1 && old_urls_.length) {
          old_urls_.forEach((v) => {
            n_u.push({
              url: v,
              change: 'del',
            })
          })
        }
      })
      return n_u
    }
  }, [before, imageUrls, old_urls])
  return (
    <div className={styles.img_body}>
      {new_urls?.map((key) => {
        return (
          <div key={key.url || key} className={styles['img_body-item']}>
            <img className={styles['img_body-item-img']} src={key.url || key} />
            {!before && key.change === 'del' && (
              <span className={styles['img_body-item-span']}>
                <Popover
                  content={
                    <div>
                      <ExclamationCircleFilled
                        style={{
                          fontSize: '16px',
                          color: '#E34D59',
                        }}
                      />
                      当前数据已删除
                    </div>
                  }
                >
                  <ExclamationCircleFilled className={styles['img_body-item-icon']} />
                </Popover>
              </span>
            )}

            {!before && key.change === 'add' && (
              <Popover
                content={
                  <div>
                    <PlusFillIcon
                      style={{
                        fontSize: '16px',
                        color: '#00A98F',
                      }}
                    />
                    当前数据为新数据
                  </div>
                }
              >
                <PlusFillIcon className={styles['img_body-item-icon']} style={{ right: 24, color: '#00A98F' }} />
              </Popover>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ImageList

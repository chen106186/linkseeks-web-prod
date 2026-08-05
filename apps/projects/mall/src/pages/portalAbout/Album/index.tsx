/**
 * 图片相册
 */
import React from 'react'
import styles from './index.module.less'

interface Props {
  albumTitle: string
  albumImg: Array<{}>
}

function Album(props: Props) {
  const { albumTitle, albumImg } = props
  return albumImg.length > 0 ? (
    <ul className={styles['album-main']}>
      <li className={styles['album-title']}>{albumTitle}</li>
      <li className={styles['album-img-warp']}>
        {albumImg.map((item: any, index: number) => {
          return (
            <img
              width={item.width ? item.width : ''}
              height={item.height ? item.height : ''}
              className={styles['album-img-item']}
              src={item.url}
              alt=""
              key={index + albumTitle}
            />
          )
        })}
      </li>
    </ul>
  ) : (
    <div></div>
  )
}

export default Album

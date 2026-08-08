import React from 'react'
import ImageBox from '@apps/components/src/web/ImageBox'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

interface ShopHeaderPropsType {
  title?: string
  logoUrl?: string
}

const CommonHeader: React.FC<ShopHeaderPropsType> = (props) => {
  const { title, logoUrl } = props
  const { linkPrefix } = useLink()

  return (
    <div className={styles.common_header}>
      <div className={styles.common_header_container}>
        <div className={styles.logo}>
          {logoUrl && (
            <a href={linkPrefix()}>
              <ImageBox width={145} height={50} src={logoUrl || ''} />
            </a>
          )}
        </div>
        <div className={styles.common_header_split}></div>
        <div className={styles.common_header_title}>{title}</div>
      </div>
    </div>
  )
}

export default CommonHeader

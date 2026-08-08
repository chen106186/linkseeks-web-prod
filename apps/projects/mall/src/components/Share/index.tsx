import React, { useEffect, useState } from 'react'
import IconFont from '@/utils/iconfont'
import { Tooltip } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import useLink from '@/hooks/useLink'
import QRCode from 'qrcode'
import styles from './index.module.less'

interface Props {
  title?: string
  id?: string
}

const Share: React.FC<Props> = (props) => {
  const { title = '', id } = props
  const { mallInfo } = useGlobalConext()
  const [codeUrl, setCodeUrl] = useState<string>()
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const urlPath = `${REQUEST_HEADER}${mallInfo?.url}.${TOP_DOMAIN}${linkPrefix(`/info/infoDetail/${id}`)}`

  const generateQrCode = (path: any) => {
    // 生成二维码
    QRCode.toDataURL(path)
      .then((url: any) => {
        setCodeUrl(url)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  useEffect(() => {
    generateQrCode(urlPath)
  }, [])

  const text = codeUrl && <img className={styles.code} src={codeUrl} />

  const sharetoqqzone = function (title: string, url: string, picurl: string) {
    var sharesinastring =
      'http://v.t.sina.com.cn/share/share.php?title=' +
      title +
      '&url=' +
      urlPath +
      '&content=utf-8&sourceUrl=' +
      urlPath +
      '&pic=' +
      picurl
    window.open(sharesinastring)
  }

  return (
    <ul className={styles['share-main']}>
      <li className={styles['share-text']}>{translate('web.common.share')}</li>
      <li className={`${styles['share-icon']} ${styles['share-icon-weChat']}`}>
        <Tooltip placement="left" title={text} style={{ backgroundColor: '#ffffff' }}>
          <IconFont type="icon-weixin" className={`${styles['detail-icon']}`} />
        </Tooltip>
      </li>
      <li
        className={`${styles['share-icon']} ${styles['share-icon-wei']}`}
        onClick={() => {
          sharetoqqzone(title, window.location.href, '')
        }}
      >
        <IconFont type="icon-weibo" className={`${styles['detail-icon']} ${styles['share-weibo']}`} />
        <IconFont type="icon-weibo-grey" className={`${styles['detail-icon']} ${styles['share-weibo-grey']}`} />
      </li>
    </ul>
  )
}

export default Share

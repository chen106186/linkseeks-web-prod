import React from 'react'
import { getWebIntl } from '@/utils/locales'
import { integrationTime } from '@/utils'
import styles from './index.module.less'

interface Props {
  resultTitle?: string
  releaseTime?: string
  content?: string
  winTenderAnnounceFile?: Array<any>
  winTenderNoticeFile?: Array<any>
}

const ProcurementResult: React.FC<Props> = (props) => {
  const {
    resultTitle = '-',
    releaseTime = '-',
    content = '-',
    winTenderAnnounceFile = [],
    winTenderNoticeFile = [],
  } = props
  const translate = getWebIntl()

  const fnGetContent = (content: string) => {
    const contentDesc = content.replace(/\n/g, '<br>')
    return contentDesc
  }

  return (
    <ul className={styles['result-main']}>
      <li className={styles['result-title']}>{resultTitle}</li>
      <li className={styles['margin-botton-24']}>
        <span className={styles['enterprises-key']}>{translate('web.resource.mall.fabushijian')}：</span>
        <span className={styles['enterprises-value']}>{integrationTime(releaseTime, 'YMD')}</span>
      </li>
      <li className={styles['result-content']}>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: fnGetContent(content) }}></li>
        </ul>
      </li>
      <li style={{ marginTop: '10px' }}>
        {winTenderAnnounceFile && winTenderAnnounceFile.length > 0 && (
          <div>
            {translate('web.resource.mall.zhongbiaogongshifujian')}:
            {winTenderAnnounceFile.map((item: any, index: number) => {
              return (
                <div key={index + item.name}>
                  <a target="_blank" href={item.url}>
                    {item.name}
                  </a>
                </div>
              )
            })}
          </div>
        )}
        {winTenderNoticeFile && winTenderNoticeFile.length > 0 && (
          <div>
            {translate('web.resource.mall.zhongbiaotongzhifujian')}:
            {winTenderNoticeFile.map((item: any, index: number) => {
              return (
                <div key={index + item.name}>
                  <a target="_blank" href={item.url}>
                    {item.name}
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </li>
    </ul>
  )
}

export default ProcurementResult

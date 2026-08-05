/**
 * 内嵌iframe的报表控件
 */
import React, { useEffect, useRef } from 'react'
import { authService } from '@apps/services'
import { encryptedByAES } from '@linkseeks/crypto'
import styles from './index.less'

export type StatementProps = {
  /**
   * 传参
   */
  params: Object
  /**
   * 是否显示顶部导航栏
   */
  standalone?: number
  /**
   * 内嵌链接
   */
  url: string
}

const Statement: React.FC<StatementProps> = ({ params, standalone = 2, url }) => {
  const ref = useRef<any>()
  const { memberId, memberRoleId } = authService.getAuth()
  const authParams = encryptedByAES(`${memberId},${memberRoleId}`, true)
  const constantLink = `${import.meta.env.OUT_STATEMENT_URL}${url}?standalone=${standalone}&tenantId=${authParams}`

  const ejectIframeSrouce = (source) => {
    const blobMe = URL['createObjectURL'](new Blob([''], { type: 'text/html' }))
    const elIframe = document['createElement']('iframe')
    elIframe.setAttribute('frameborder', '0')
    elIframe.setAttribute('width', '100%')
    elIframe.setAttribute('height', '100vh')
    elIframe.setAttribute('allowfullscreen', 'true')
    elIframe.setAttribute('webkitallowfullscreen', 'true')
    elIframe.setAttribute('mozallowfullscreen', 'true')
    elIframe.setAttribute('src', blobMe)
    const idOne = 'ls_' + Date.now()
    ref.current = idOne
    elIframe['setAttribute']('id', idOne)
    document.getElementById('statementIframe').appendChild(elIframe)
    document['getElementById'](idOne)['contentWindow']['document'].write(
      `<script type="text/javascript">location.href = "${source}"\<\/script\>`,
    )
  }

  useEffect(() => {
    ejectIframeSrouce(constantLink)
  }, [])

  useEffect(() => {
    document.getElementById(ref.current)['src'] = `${constantLink}&${Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&')}`
    // 重载iframe src
  }, [params])

  return <div className={styles.statementDashboard} id="statementIframe" />
}

export default Statement

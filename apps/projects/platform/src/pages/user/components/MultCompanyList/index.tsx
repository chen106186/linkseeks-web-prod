import React, { useState, useEffect, Fragment } from 'react'
import globalStyles from '@/global/styles/global.less'
import cx from 'classnames'

import defaultLogo from '@/assets/imgs/default_avatar.png'
import styles from './index.less'
import { Button } from '@linkseeks/ui'

const MultCompanyList = (props) => {
  const {
    multiAccInfoRespList = [],
    mult = false,
    setActiveUserId,
    activeUserId,
    handleSubmit,
    handleBack,
    submitText,
    backText,
    title,
  } = props

  const isActive = (userId) => {
    if (mult) {
      return activeUserId.includes(userId)
    } else {
      return activeUserId === userId
    }
  }

  const setUserId = (userId) => {
    if (mult) {
      const newArr = [...activeUserId]
      if (newArr.includes(userId)) {
        newArr.splice(newArr.indexOf(userId), 1)
      } else {
        newArr.push(userId)
      }
      setActiveUserId(newArr)
    } else {
      setActiveUserId(userId)
    }
  }
  return (
    <div className={cx(styles.loginWrap, globalStyles.content1024, styles.multWrapper)}>
      <h3>{title}</h3>
      <div className={styles.multListWrapper}>
        {multiAccInfoRespList?.map((v) => {
          return (
            <div
              onClick={() => setUserId(v.userId)}
              className={cx(styles.multItem, isActive(v.userId) && styles.active)}
            >
              <img src={v.logo || defaultLogo} />
              <div className={styles.multText}>{v.memberName}</div>
            </div>
          )
        })}
      </div>
      <Button type="primary" style={{ width: 328, marginBottom: 24 }} onClick={handleSubmit}>
        {submitText}
      </Button>
      <Button style={{ width: 328 }} onClick={handleBack}>
        {backText}
      </Button>
    </div>
  )
}

export default MultCompanyList

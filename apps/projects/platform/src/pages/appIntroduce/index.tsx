import React from 'react'
import { Helmet } from 'react-helmet'
import { getIntl } from '@linkseeks/i18n'
import Footer from './Footer'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.less'
const intl = getIntl()
const AppIntroduct = () => {
  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'components.lingxishangchengAPP' })}</title>
      </Helmet>
      <div className={styles.container}>
        <img src={getOssUrlPath('/irregular/5d3d8a435c374bde94f8f5ae7f06a43b1617092303577.jpg')} />
        <img src={getOssUrlPath('/irregular/41f31a237c9940638f25a0444d9b27771617092335578.jpg')} />
        <img src={getOssUrlPath('/irregular/3b213099019f4e5f9304f28380cede271617092341963.jpg')} />
        <img src={getOssUrlPath('/irregular/bda06469a676489a856758b023f8944f1617092338752.jpg')} />
        <img src={getOssUrlPath('/irregular/da9e63760ca64e91a7a5d43cf9d9ff501617092345542.jpg')} />
        <img src={getOssUrlPath('/irregular/54dffa25e12643cf9f006e5d37c575381617092348998.jpg')} />
      </div>
      <Footer />
    </>
  )
}

export default AppIntroduct

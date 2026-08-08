import React, { useState, useEffect, Fragment } from 'react'
import globalStyles from '@/global/styles/global.less'
import cx from 'classnames'
import { Row, Space, Carousel } from 'antd'
import { ImageBox } from '@apps/components'
import { Helmet } from 'react-helmet'
import TextLink from '@/components/TextLink'
import { ScanOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import ScanLoginWrap from '../components/ScanLoginWrap'
import { getManageContentImageFindAllByUseSceneAndPosition } from '@apps/apis'
import LoginWrap from './components/LoginWrap'
import qrCode from '@/assets/imgs/QR_Code.png'
import defaultLogo from '@/assets/imgs/default_avatar.png'
import styles from './index.less'
import { InitLoginContextProvider, useInitLoginContext } from './services/context'
import MultCompanyList from '../components/MultCompanyList'
import VerifyModal from '../components/VerifyModal'
import { useWebIntl } from '@apps/locales'
const intl = getIntl()
const User: React.FC = () => {
  const [isScanQrCode, setIsScanQrCode] = useState(false)
  const [sceneList, setSceneList] = useState<any>()
  const { redirect, source } = usePageStatus()
  const {
    multiAccountVisible,
    toggleMultiAccountVisible,
    validateSmsCode,
    multiAccInfoRespList,
    setActiveUserId,
    activeUserId,
    verifyForm,
    confirmLoading,
    checkAcountShow,
    setCheckAccountShow,
    checkAccountType,
    modalVisible,
    accountInfo,
    setModalVisible,
    handleStartSms,
    handleAdminVerify,
    handleSwitchCheckoutAccountType,
  } = useInitLoginContext()
  const translate = useWebIntl()
  const handleGuideLogin = (param: boolean) => {
    setIsScanQrCode(param)
  }

  const forgetPassword = () => {
    history.push('/user/forget')
    console.log(intl.formatMessage({ id: 'user.zhaohuimima' }))
  }

  useEffect(() => {
    fetchUseScene()
  }, [])

  const sortData = (data) => {
    let result = []
    if (data) {
      result = data.sort((a, b) => (b.sort > a.sort ? -1 : 1))
    }
    return result
  }

  const fetchUseScene = () => {
    const param: any = {
      useScene: 1,
      position: 1,
    }

    getManageContentImageFindAllByUseSceneAndPosition(param).then((res) => {
      if (res.code === 1000) {
        setSceneList(sortData(res.data))
      }
    })
  }

  const getRegisterUrl = () => {
    return `/user/register${redirect ? `?redirect=${redirect}` : ''}${
      source ? `${redirect ? '&' : '?'}source=${source}` : ''
    }`
  }

  return (
    <>
      {multiAccountVisible ? (
        <MultCompanyList
          multiAccInfoRespList={multiAccInfoRespList}
          setActiveUserId={setActiveUserId}
          activeUserId={activeUserId}
          handleSubmit={validateSmsCode}
          handleBack={toggleMultiAccountVisible}
          backText={translate('public.fanhuidenglu')}
          submitText={translate('public.login')}
          title={translate('public.duozhuti-jiance-denglu')}
        />
      ) : (
        <>
          <Helmet>
            <title>{intl.formatMessage({ id: 'user.yonghudenglu' })}</title>
          </Helmet>
          <div className={cx(styles.loginWrap, globalStyles.content1024)}>
            {sceneList && sceneList.length > 0 && (
              <div className={cx(styles.loginItem, styles.loginDesc)}>
                <div className={styles.adBox}>
                  <Carousel autoplay>
                    {sceneList &&
                      sceneList.map((item) => (
                        <ImageBox key={item.id} width={512} height={560} src={item.imageUrl} resizeMode="cover" />
                      ))}
                  </Carousel>
                </div>
              </div>
            )}
            <div className={cx(styles.loginItem, styles.loginCtl)}>
              <div className={styles.loginMain}>
                {isScanQrCode ? (
                  <>
                    <a onClick={() => handleGuideLogin(false)} className={styles.clickUsernameLogin}>
                      {intl.formatMessage({ id: 'user.shiyongzhanghaomimadenglu' })}
                    </a>
                    <ScanLoginWrap />
                    <div className={styles.scanTips}>
                      <ScanOutlined className={styles.scanIcon} />
                      <span>
                        {intl.formatMessage({ id: 'user.dakaiApp' })}
                        <br />
                        {intl.formatMessage({ id: 'user.saoyisaodenglu' })}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* <div className={styles.clickScanLogin} onClick={() => handleGuideLogin(true)}>
                      <img src={qrCode} />
                    </div> */}
                    <h2>{intl.formatMessage({ id: 'user.huanyingnin' })}</h2>
                    <LoginWrap />
                    <Row justify="end" style={{ marginTop: 16 }}>
                      <Space size={32}>
                        <TextLink>
                          <Link to={getRegisterUrl()} className={styles.link}>
                            {intl.formatMessage({ id: 'user.mianfeizhuce' })}
                          </Link>
                        </TextLink>
                        <TextLink>
                          <a onClick={forgetPassword} className={styles.link}>
                            {intl.formatMessage({ id: 'user.wangjimima' })}
                          </a>
                        </TextLink>
                      </Space>
                    </Row>
                  </>
                )}
              </div>
              {/* <Row className={'thirdLogin'} align='middle' justify='center'>
            <Col>其他方式登录
            <a title="微登录"><img src={wechat} alt="微信登录" /></a>
              <a title="QQ登录"><img src={qq} alt="QQ登录" /></a>
              <a title="支付宝登录"><img src={alipay} alt="支付宝登录" /></a>
            </Col>
          </Row> */}
            </div>
          </div>
        </>
      )}
      <VerifyModal
        visible={modalVisible}
        setVisible={setModalVisible}
        form={verifyForm}
        onOk={handleAdminVerify}
        onCancel={() => setModalVisible(false)}
        onSmsSend={handleStartSms}
        account={checkAcountShow}
        type={checkAccountType}
        confirmLoading={confirmLoading}
        accountInfo={accountInfo}
        onCheckTypeChange={handleSwitchCheckoutAccountType}
      />
    </>
  )
}

export default () => {
  return (
    <InitLoginContextProvider>
      <User />
    </InitLoginContextProvider>
  )
}

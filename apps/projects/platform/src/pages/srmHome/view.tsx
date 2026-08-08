/**
 * SRM采购商首页
 */
import React, { useCallback, useMemo, useReducer } from 'react'
import { Row, Col, Tooltip, Spin, Badge, message } from 'antd'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { observer, inject } from 'mobx-react'
import MellowCard from '@/components/MellowCard'
import themeConfig from '@apps/config/lingxi.theme.config'
import WelcomeCard from './components/WelcomeCard'
import MessageList from './components/MessageList'
import TodoCard from './components/TodoCard'
import RecentlyVisited from './components/RecentlyVisited'
import IntroduceRow from './components/IntroduceRow'
import PurchaseOrderAnalysis from './components/PurchaseOrderAnalysis'
import SupplierAnalysis from './components/SupplierAnalysis'
import styles from './index.less'
import Icon, { QuestionCircleOutlined } from '@ant-design/icons'
import { authService } from '@apps/services'
import { getEnableMultiTenancy } from '@/utils/auth'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import StatusTag from '@/components/StatusTag'
import { ReactComponent as DefaultAvatar } from '@/assets/imgs/default_avatar.svg'
import { postMemberMainpageLogoAdd } from '@apps/apis'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { useGlobal } from '@apps/container'
const paddingMd = parseInt(themeConfig['@padding-md'])

function reducer(state, action) {
  switch (action.type) {
    case 'uploading':
      return { ...state, loading: true }
    case 'done':
      return { ...state, loading: false, logo: action.payload.url }
    default:
      throw new Error()
  }
}

const SRMHome: React.FC<any> = (props) => {
  const EDIT_USER_URL = '/editMySelf'
  const USER_CENTER_URL = '/supplierAbility/profile/memberQuery'
  const intl = useIntl()
  const userAuth = authService.getAuth()
  const enableMultiTenancy = getEnableMultiTenancy()
  const currentRole = userAuth?.roles?.filter((item) => item.memberRoleId === userAuth.memberRoleId)
  const isVerifyFail = useMemo(() => [2, 4].includes(userAuth.validateStatus), [userAuth])
  const [state, dispatch] = useReducer(reducer, { loading: false, logo: userAuth?.logo })
  const { setAvatar } = useGlobal()
  const STATUS_COLOR: ('default' | 'processing' | 'error' | 'success')[] = [
    'default',
    'processing',
    'error',
    'success',
    'error',
  ]
  const renderUserLevelAndScore = () => {
    if (enableMultiTenancy) {
      return null
    }
    return (
      <>
        {(userAuth.levelTag && (
          <div className={styles.level}>
            {intl.formatMessage({ id: 'home.userCenter.level' })}：{' '}
            <StatusTag type={'primary'} title={userAuth.levelTag} />
          </div>
        )) ||
          null}
        <div className={styles.score}>
          {intl.formatMessage({ id: 'home.userCenter.score' })}： <strong>{userAuth.score}</strong>
        </div>
      </>
    )
  }

  if (!userAuth) {
    return null
  }
  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
    if (!isJpgOrPng) {
      message.error(intl.formatMessage({ id: 'home.userCenter.error' }))
    }
    return isJpgOrPng
  }, [])

  const onFileChange = async (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      dispatch({ type: 'uploading' })
      return
    }
    if (info.file.status === 'done') {
      const logo = info.file.response.data
      const { code } = await postMemberMainpageLogoAdd({ logo: logo })
      if (code === 1000) {
        dispatch({ type: 'done', payload: { url: logo } })
        setAvatar(logo)
      }
    }
  }

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'home.title' })}>
      <Row gutter={[paddingMd, paddingMd]}>
        <Col span={24}>
          <Row gutter={[paddingMd, paddingMd]}>
            <Col span={18}>
              <Row gutter={[paddingMd, paddingMd]}>
                <Col span={24}>
                  <MellowCard
                    bodyStyle={{
                      padding: 0,
                    }}
                  >
                    <WelcomeCard />
                    <div className={styles.content}>
                      <Spin spinning={state.loading}>
                        <div className={styles.userLogo}>
                          <div className={styles.randomLogo}>
                            <UploadFiles
                              customizeItemRender={null}
                              beforeUpload={beforeUpload}
                              onChange={onFileChange}
                              showFiles={false}
                            >
                              {state.logo ? (
                                <img src={state.logo || ''} className={styles.logo} />
                              ) : (
                                <Icon component={() => <DefaultAvatar className={styles.logo} />} />
                              )}
                              <span className={styles.upload}>
                                {intl.formatMessage({ id: 'home.userCenter.upload' })}
                              </span>
                            </UploadFiles>
                          </div>
                        </div>
                      </Spin>
                      <div className={styles.infos}>
                        <div className={styles.user}>
                          <div className={styles.userStatus}>
                            <span className={styles.company}>{userAuth?.userName || userAuth?.memberName}</span>
                            <div className={styles.status}>
                              <div className={styles.roles}>
                                {currentRole &&
                                  currentRole.map((item, key) => {
                                    return (
                                      <div style={{ marginRight: '16px' }} key={key}>
                                        <StatusTag type={'success'} title={item.memberRoleName} />
                                      </div>
                                    )
                                  })}
                              </div>
                              <div style={{ marginTop: '13px' }}>
                                <Tooltip placement="top" title={userAuth.validateMsg || ''}>
                                  <Badge
                                    status={STATUS_COLOR[userAuth.validateStatus]}
                                    text={userAuth.validateStatusDesc}
                                  />
                                  {isVerifyFail && (
                                    <span style={{ marginLeft: '4px' }}>
                                      <QuestionCircleOutlined style={{ color: '#ccc', fontSize: '12px' }} />
                                    </span>
                                  )}
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          {isVerifyFail && (
                            <Link to={EDIT_USER_URL} className={styles.link}>
                              {intl.formatMessage({ id: 'home.userCenter.link' })}
                            </Link>
                          )}
                        </div>
                        <div className={styles.otherValues}>
                          <div className={styles.divider}>
                            {renderUserLevelAndScore()}
                            {userAuth?.urls?.includes(USER_CENTER_URL) && (
                              <Link to={USER_CENTER_URL} className={styles.link}>
                                {intl.formatMessage({ id: 'home.userCenter.userAuth.link' })}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </MellowCard>
                </Col>
                <Col span={24}>
                  <MellowCard
                    bodyStyle={{
                      padding: 0,
                      paddingTop: 16,
                    }}
                  >
                    <div style={{ marginTop: -paddingMd }}>
                      <TodoCard />
                    </div>
                  </MellowCard>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <div className={styles.compound}>
                <div className={styles['compound-head']}>
                  <MessageList />
                </div>
                <div className={styles['compound-foot']}>
                  <RecentlyVisited />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <IntroduceRow />
        </Col>
        <Col span={24}>
          <PurchaseOrderAnalysis />
        </Col>
        <Col span={24}>
          <SupplierAnalysis />
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
}

export default SRMHome

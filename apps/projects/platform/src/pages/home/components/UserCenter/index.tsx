import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import styles from './index.less'
import moment from 'moment'
import { Badge, message, Spin, Tooltip } from 'antd'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { authService } from '@apps/services'
import { getEnableMultiTenancy } from '@/utils/auth'
import StatusTag from '@/components/StatusTag'
import home_user from '@/assets/imgs/home_user.png'
import { observer, inject } from 'mobx-react'
import Icon, { QuestionCircleOutlined } from '@ant-design/icons'
import { ReactComponent as DefaultAvatar } from '@/assets/imgs/default_avatar.svg'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { postMemberMainpageLogoAdd, getManageInitConfigEnableMultiTenancy } from '@apps/apis'
import { useGlobal } from '@apps/container'

interface Iprops {}

// const LEVEL_IMAGE = [level1, level1, level2, level3, level4];
const EDIT_USER_URL = '/editMySelf'
const USER_CENTER_URL = '/customerAbility/profile/query'
const STATUS_COLOR: ('default' | 'processing' | 'error' | 'success')[] = [
  'default',
  'processing',
  'error',
  'success',
  'error',
]

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

const UserCenter: React.FC<Iprops> = (props) => {
  const intl = useIntl()
  const today = moment()
  const userAuth = authService.getAuth()
  const currentRole = userAuth?.roles?.filter((item) => item.memberRoleId === userAuth.memberRoleId)
  const [state, dispatch] = useReducer(reducer, { loading: false, logo: userAuth?.logo })
  const [enableMultiTenancy, setEnableMultiTenancy] = useState<boolean>(false)

  const { avatar, setAvatar } = useGlobal()
  if (!userAuth) {
    return null
  }

  const fetchEnableMultiTenancy = async () => {
    const res = await getManageInitConfigEnableMultiTenancy()
    if (res.code === 1000) {
      setEnableMultiTenancy(res.data)
    }
  }

  useEffect(() => {
    fetchEnableMultiTenancy()
  }, [])

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
        authService.setAuth({
          ...userAuth,
          logo,
        })
        setAvatar(logo)
      }
    }
  }

  const isVerifyFail = useMemo(() => [2, 4].includes(userAuth.validateStatus), [userAuth])

  const renderUserLevelAndScore = () => {
    return (
      <>
        {(userAuth?.levelTag && (
          <div className={styles.level}>
            {intl.formatMessage({ id: 'home.userCenter.level' })}：{' '}
            <StatusTag type={'primary'} title={userAuth?.levelTag} />
          </div>
        )) ||
          null}
        <div className={styles.score}>
          {intl.formatMessage({ id: 'home.userCenter.score' })}： <strong>{userAuth?.score || 0}</strong>
        </div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.infos}>
          <div className={styles.hi}>
            {enableMultiTenancy
              ? intl.formatMessage({ id: 'home.moreUser.welcome', defaultMessage: '欢迎使用供应链协同管理系统' })
              : `Hi, ${userAuth?.userName || userAuth?.memberName}! ${intl.formatMessage({
                  id: 'home.userCenter.wellcome',
                })}`}
          </div>
          <div className={styles.date}>
            {today.format(`YYYY-MM-DD`)} {intl.formatMessage({ id: `home.userCenter.day${today.day()}` })}
          </div>
        </div>
        <div className={styles.images}>
          <img src={home_user} />
        </div>
      </div>
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
                <span className={styles.upload}>{intl.formatMessage({ id: 'home.userCenter.upload' })}</span>
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
                    {!enableMultiTenancy && (
                      <Badge status={STATUS_COLOR[userAuth.validateStatus]} text={userAuth.validateStatusDesc} />
                    )}
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
    </div>
  )
}

// export default UserCenter
export default UserCenter

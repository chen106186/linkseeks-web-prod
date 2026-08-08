import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import React from 'react'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { CopyOutlined, DeleteOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Button, Space, Popconfirm, Typography, Switch } from 'antd'
import moment from 'moment'
import styles from './index.less'
import { enumName, WEB } from '@/constants/environment'
import StatusTag from '@/components/StatusTag'
import fixture from '@/assets/activity/fixture.png'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
// REQUEST_HEADER

const { Paragraph } = Typography
interface Iprops {
  templatePicUrl?: string
  title: string
  shopName: string
  memberId: number
  startTime: string
  endTime: string
  statusName: string
  id: number
  /** 商城子域名 */
  url: string
  // 是否是自营商城
  isSelf: 1 | 0 | number
  /**  1.WEB 2.H5 3.小程序 4.APP */
  environment: 1 | 2 | 3 | 4 | number
  onRemove?: ((id: number) => void) | null
  /** 1.待上线， 2已上线， 3进行中 4已下线 5已结束 */
  status: number
  onChangeStatus: ((id: number, status: number) => void) | null
}

const APP_FIXTURE_LINK = `/marketingAbility/marketingActivitiesManagement/activePage/fixtures`
const WEB_FIXTURE_LINK = `/marketingAbility/marketingActivitiesManagement/activePage/fixtures/web`

const PENDIGN_ONLINE = 1
const ONLINE = 2
/** 进行中 */
const IN_PROGRESS = 3
/** 下线 */
const OFFLINE = 4
/** 结束 */
const END = 5

const format = 'YYYY-MM-DD HH:mm:ss'

const ActiveItem: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const {
    title,
    shopName,
    startTime,
    endTime,
    memberId,
    statusName,
    templatePicUrl,
    id,
    onRemove,
    status,
    onChangeStatus,
    environment,
    url,
    isSelf,
  } = props

  const handleRemove = () => {
    onRemove?.(id)
  }

  const handleChangeStatus = () => {
    /** 上线 1，4  下线 2，3 */
    const statusMap = {
      [PENDIGN_ONLINE]: 1,
      [ONLINE]: 0,
      [IN_PROGRESS]: 0,
      [OFFLINE]: 1,
    } as const
    onChangeStatus?.(id, statusMap[status])
  }

  return (
    <div className={styles.section}>
      {/* <img className={styles.image} src={defaultLogo} /> */}
      <div className={styles.infoContainer}>
        <div className={styles.header}>
          <Link to={`/marketingAbility/marketingActivitiesManagement/activePage/edit?id=${id}`}>{title}</Link>
          <div className={styles.status}>
            <StatusTag type="success" title={statusName} />
          </div>
        </div>
        <div className={styles.info}>
          <div>
            <div className={styles.tags}>
              <Space>
                <StatusTag type="warning" title={enumName[environment] || ''} />
              </Space>
            </div>
            <div className={styles.mall}>
              <span className={styles.label}>{intl.formatMessage({ id: 'activityPage.suitMark' })}：</span>
              <span>{shopName}</span>
            </div>
            <div className={styles.time}>
              <span className={styles.startTime}>
                {intl.formatMessage({ id: 'activityPage.StartValidityPeriod' })}：
                {startTime && moment(startTime).format(format)}
              </span>
              <span>
                {intl.formatMessage({ id: 'activityPage.endValidityPeriod' })}：
                {endTime && moment(endTime).format(format)}
              </span>
            </div>
          </div>
          <div>
            <Space size={16}>
              {environment === WEB && status !== END && (
                <div className={styles.copyLink}>
                  <Paragraph
                    copyable={{
                      text:
                        `${REQUEST_HEADER}${url}.${TOP_DOMAIN}` + `${isSelf ? `/${memberId}` : ''}` + `/activity/${id}`,
                    }}
                  />
                </div>
              )}
              {([PENDIGN_ONLINE, IN_PROGRESS, ONLINE, OFFLINE].includes(status) && (
                // <Link to={`/marketingAbility/activityPages/management/edit?id=${id}`}>
                <Link to={`${environment === WEB ? WEB_FIXTURE_LINK : APP_FIXTURE_LINK}?id=${id}`}>
                  {/* <Button icon={<EditOutlined />}></Button> */}
                  <div className={styles.fixture}>
                    <img src={fixture} />
                    <div>
                      {intl.formatMessage({ id: 'activityPage.activityPageDecorate', defaultMessage: '活动页装修' })}
                    </div>
                  </div>
                </Link>
              )) ||
                null}
              {status === PENDIGN_ONLINE && (
                <Popconfirm
                  placement="topLeft"
                  title={intl.formatMessage({ id: 'activityPage.ifConfirmDelete' })}
                  onConfirm={handleRemove}
                  okText={intl.formatMessage({ id: 'common.button.confirm' })}
                  cancelText={intl.formatMessage({ id: 'common.button.cancel' })}
                >
                  <div className={styles.delete}>
                    <DeleteOutlined />
                  </div>
                </Popconfirm>
              )}
              {(status !== END && (
                <Switch checked={status === ONLINE || status === IN_PROGRESS} onChange={handleChangeStatus} />
                // <Button onClick={handleChangeStatus} icon={<PlayCircleOutlined />} type={ status === 1 ? 'primary' : 'default' }>{statusName}</Button>
              )) ||
                null}
            </Space>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveItem

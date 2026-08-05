import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Space, Popconfirm, Switch, Typography } from 'antd'
import { formatTimeString } from '@/utils'
import { EditAuthButton, AuthButton } from '@apps/components'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { Link } from '@linkseeks/router-core'
import styles from './index.less'
import { enumName, WEB } from '@/constants/const/environment'
import StatusTag from '@/components/StatusTag'
import defaultLogo from '@/assets/default_logo.jpg'

const { Paragraph } = Typography
interface Iprops {
  templatePicUrl?: string
  title: string
  shopName: string
  startTime: number
  endTime: number
  statusName: string
  id: number
  /** 商城子域名 */
  url: string
  /**  1.WEB 2.H5 3.小程序 4.APP */
  environment: 1 | 2 | 3 | 4 | number
  onRemove?: ((id: number) => void) | null
  /** 1.待上线， 2已上线， 3进行中 4已下线 5已结束 */
  status: number
  onChangeStatus: ((id: number, status: number) => void) | null
}

const APP_FIXTURE_LINK = `/marketingManage/marketing/activePage/fixtures/mobile`
const WEB_FIXTURE_LINK = `/marketingManage/marketing/activePage/fixtures`

const PENDIGN_ONLINE = 1
const ONLINE = 2
const IN_PROGRESS = 3
const OFFLINE = 4
const END = 5

const ActiveItem: React.FC<Iprops> = (props: Iprops) => {
  const {
    title,
    shopName,
    startTime,
    endTime,
    statusName,
    templatePicUrl,
    id,
    onRemove,
    status,
    onChangeStatus,
    environment,
    url,
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
    }
    onChangeStatus?.(id, statusMap[status])
  }

  return (
    <div className={styles.section}>
      {/* <img className={styles.image} src={defaultLogo} /> */}
      <div className={styles.infoContainer}>
        <div className={styles.header}>
          <EditAuthButton>
            <Link to={`/marketingManage/marketing/activePage/edit?id=${id}`}>{title}</Link>
          </EditAuthButton>
          <div className={styles.status}>
            <StatusTag type="success" title={statusName} />
          </div>
        </div>
        <div className={styles.info}>
          <div>
            <div className={styles.tags}>
              <Space>
                <StatusTag type="warnning" title={enumName[environment] || ''} />
              </Space>
            </div>
            <div className={styles.mall}>
              <span className={styles.label}>适用商城：</span>
              <span>{shopName}</span>
            </div>
            <div className={styles.time}>
              <span className={styles.startTime}>有效期开始：{startTime && formatTimeString(startTime)}</span>
              <span>有效期结束：{endTime && formatTimeString(endTime)}</span>
            </div>
          </div>
          <div>
            <Space size={16}>
              {environment === WEB && status !== END && (
                <div className={styles.copyLink}>
                  <Paragraph copyable={{ text: `${REQUEST_HEADER}${url}.${TOP_DOMAIN}/activity/${id}` }} />
                </div>
              )}
              <AuthButton type="custom" code="fixtures">
                {([PENDIGN_ONLINE, IN_PROGRESS, ONLINE, OFFLINE].includes(status) && (
                  <Link to={`${environment === WEB ? WEB_FIXTURE_LINK : APP_FIXTURE_LINK}?id=${id}`}>
                    {/* <Button icon={<EditOutlined />}></Button> */}
                    <div className={styles.fixture}>
                      {/* <img src={fixture}/> */}
                      <div>活动页装修</div>
                    </div>
                  </Link>
                )) ||
                  null}
              </AuthButton>
              <AuthButton type="custom" code="delete">
                {status === PENDIGN_ONLINE && (
                  <Popconfirm
                    placement="topLeft"
                    title={'是否确认删除？'}
                    onConfirm={handleRemove}
                    okText={'确定'}
                    cancelText={'取消'}
                  >
                    <div className={styles.delete}>
                      <DeleteOutlined />
                    </div>
                  </Popconfirm>
                )}
              </AuthButton>
              <AuthButton type="custom" code="status">
                {(status !== END && (
                  <Switch checked={status === ONLINE || status === IN_PROGRESS} onChange={handleChangeStatus} />
                  // <Button onClick={handleChangeStatus} icon={<PlayCircleOutlined />} type={ status === 1 ? 'primary' : 'default' }>{statusName}</Button>
                )) ||
                  null}
              </AuthButton>
            </Space>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveItem

import React from 'react'
import { COLLAGE_PROCESS, COLLAGE_SUCCESS } from '../../constants/collage'
import plus from '@/assets/icons/plus.png'
import classnames from 'classnames'
import default_logo from '@/assets/icons/default_logo.png'
import { getWebIntl } from '@apps/locales'
import CountDown from '../CountDown'
import styles from './index.module.less'

interface Iprops {
  /** 拼团状态 1 => 拼团中 2 => 拼团成功 3 => 拼团失败 */
  status: 1 | 2 | 3
  assembleNum: number
  itemList: {
    isMaster: number
    logo: string
    memberName: string
  }[]
  /** 是否在团里 */
  isJoin: boolean
  /** 剩余时间 */
  endTime: number
  onJumpHome?: () => void
  /** 参与拼团 */
  onJoinTeam?: () => void
  onRelauchTeam?: () => void
}

const translate = getWebIntl()

const STATUS_TEXT = [
  '',
  translate('web.resource.order.zhengzaipintuan'),
  translate('web.common.pinuanchenggong'),
  translate('web.common.pintuanshibai'),
]

const InTeamPeople: React.FC<Iprops> = (props: Iprops) => {
  const { status, assembleNum, itemList, onJumpHome, onJoinTeam, onRelauchTeam, endTime, isJoin } = props
  const newList = new Array(assembleNum).fill(1)
  const current = new Date().valueOf()
  const offset = Math.floor((endTime - current) / 1000)
  const renderPeople = (itemData: { logo: string; isMaster: number; memberName: string }) => {
    const temp = itemData.memberName.replace(/[\u4E00-\u9FA5]/g, 'AA')
    const splitName =
      temp.length <= 2
        ? itemData.memberName
        : `${itemData.memberName.substring(0, 1)}...${itemData.memberName.substring(
            itemData.memberName.length - 1,
            itemData.memberName.length,
          )}`
    return (
      <div className={styles['people-item-container']}>
        <div className={styles.imageContainer}>
          <img className={styles['people-item-logo']} src={itemData.logo || default_logo} alt="" />
          {(itemData.isMaster && (
            <div className={styles.master}>
              <span>{translate('web.resource.mall.tuanzhang')}</span>
            </div>
          )) ||
            null}
        </div>
        <div className={styles['people-item-name']}>{splitName}</div>
      </div>
    )
  }

  const renderEmpty = () => (
    <>
      <div className={styles['empty-people']}>
        <img src={plus} alt="add" className={styles['people-plus']} />
      </div>
    </>
  )

  const handleJumpHome = () => {
    onJumpHome?.()
  }

  const handleJoinTeam = () => {
    onJoinTeam?.()
  }

  const handleRelauchTeam = () => {
    onRelauchTeam?.()
  }

  const renderText = () => {
    if (status === COLLAGE_PROCESS) {
      return (
        <CountDown count={offset} format="HH:mm:ss">
          {(time, formatedData) => (
            <div>
              {translate('web.resource.mall.haicha')}
              <span className={styles.highlight}>{assembleNum - itemList.length}</span>
              {translate('web.resource.mall.renchengtuan')}，{formatedData.formatTimeString}
            </div>
          )}
        </CountDown>
      )
    }
    if (status === COLLAGE_SUCCESS) {
      return translate('web.resource.mall.ganxiexiaohuobandedinglixiangzhu')
    }
    return translate('web.resource.mall.pintuanshijianyiguo')
  }

  const renderFooter = () => {
    if (status === COLLAGE_PROCESS) {
      return (
        <>
          <div
            className={classnames(styles.btn, styles['btn-default'])}
            onMouseDown={handleJoinTeam}
            aria-hidden="true"
          >
            {translate('web.resource.mall.lijicantuan')}
          </div>
        </>
      )
    }
    if (status === COLLAGE_SUCCESS) {
      return (
        <>
          <div
            className={classnames(styles.btn, styles['btn-default'])}
            onMouseDown={handleJumpHome}
            aria-hidden="true"
          >
            {translate('web.resource.mall.qianwangshangchengshouye')}
          </div>
        </>
      )
    }
    return (
      <>
        <div
          className={classnames(styles.btn, styles['btn-success'])}
          onMouseDown={handleRelauchTeam}
          aria-hidden="true"
        >
          {translate('web.resource.mall.chongxinfaqipintuan')}
        </div>
        <div className={classnames(styles.btn, styles['btn-default'])} onMouseDown={handleJumpHome} aria-hidden="true">
          {translate('web.resource.mall.qianwangshangchengshouye')}
        </div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <div className={classnames(styles.status)}>{STATUS_TEXT[status]}</div>
      <div className={styles['status-tips']}>{renderText()}</div>

      <div className={styles['people-list']}>
        {newList.map((_item, index) => (
          <div className={styles['people-item']} key={index}>
            {index + 1 > itemList.length ? renderEmpty() : renderPeople(itemList[index])}
          </div>
        ))}
      </div>
      {renderFooter()}
    </div>
  )
}

export default InTeamPeople

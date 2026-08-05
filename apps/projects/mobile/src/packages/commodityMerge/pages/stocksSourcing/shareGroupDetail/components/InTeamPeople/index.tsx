import React from 'react'
import { View, Image, Icons, Text, CountDown } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { Button } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import classnames from 'classnames'
import styles from './index.module.scss'

interface Iprops {
  status: 1 | 2 | 3
  assembleNum: number
  isJoin: boolean
  itemList: {
    isMaster: number
    logo: string
    memberName: string
  }[]
  onRelaunch: () => void
  /** 参与拼团 */
  onJoinTeam: () => void
  /** 查看订单详情 */
  onViewOrder: () => void
  /** 回到首页 */
  onJumpHome: () => void
  /** 分享拼团 */
  // onShare: () => void
  endTime: number
}

const PROCESSING = 1
const SUCCESS = 2
const FAIL = 3

const InTeamPeople: React.FC<Iprops> = (props: Iprops) => {
  const { status, assembleNum, itemList, onViewOrder, onJoinTeam, onRelaunch, endTime, onJumpHome } = props
  const newList = new Array(assembleNum).fill(1)
  const current = new Date().valueOf()
  const offset = Math.floor((endTime - current) / 1000)
  const intl = useIntl()
  const STATUS_TEXT = [
    '',
    intl.formatMessage({ id: 'shareGroupDetail.process', defaultMessage: '正在拼团' }),
    intl.formatMessage({ id: 'shareGroupDetail.success', defaultMessage: '拼团成功' }),
    intl.formatMessage({ id: 'shareGroupDetail.fail', defaultMessage: '拼团失败' }),
  ]

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
      <View className={styles['people-item-container']}>
        <View className={styles.imageContainer}>
          <Image
            className={styles['people-item-logo']}
            src={itemData.logo || getOssUrlPath(`/Images/default_logo.png`)}
          />
          {(itemData.isMaster && (
            <View className={styles.master}>
              <Text className={styles['master-name']}>{intl.formatMessage({ id: 'shareGroupDetail.master' })}</Text>
            </View>
          )) ||
            null}
        </View>
        <View className={styles['people-item-name']}>{splitName}</View>
      </View>
    )
  }

  const renderEmpty = () => (
    <>
      <View className={styles['empty-people']}>
        {/* <Image src={plus} className={styles['people-plus']} /> */}
        <Icons name="Plus" size={14} color="#000" />
      </View>
    </>
  )

  const renderText = () => {
    if (status === 1) {
      return (
        <CountDown count={offset} format="HH:mm:ss">
          {(time, formatedData) =>
            time <= 0 ? (
              <View>{intl.formatMessage({ id: 'shareGroupDetail.isEnd', defaultMessage: '拼团已结束' })}</View>
            ) : (
              <View>
                {intl.formatMessage({ id: 'shareGroupDetail.haicha', defaultMessage: '还差' })}
                <Text className={styles.leftNum}>{assembleNum - itemList.length}</Text>
                {intl.formatMessage({ id: 'shareGroupDetail.renchengtuan', time: formatedData.formatTimeString })}
              </View>
            )
          }
        </CountDown>
      )
    }
    if (status === SUCCESS) {
      return <>{intl.formatMessage({ id: 'shareGroupDetail.thanks', defaultMessage: '感谢小伙伴的鼎力相助' })}</>
    }
    return <>{intl.formatMessage({ id: 'shareGroupDetail.timeout', defaultMessage: '拼团时间已过，人数未达到' })}</>
  }

  const goToUrl = (url: 'extra/mall/b2b') => {
    onJumpHome?.()
  }

  const handleViewOrder = () => {
    onViewOrder?.()
  }

  const handleJoinTeam = () => {
    onJoinTeam?.()
  }

  const handleRelanch = () => {
    onRelaunch?.()
  }

  const renderFooter = () => {
    if (status === PROCESSING) {
      return (
        <>
          <Button openType="share" className={classnames(styles['btn-share'], styles['btn-success'])}>
            {intl.formatMessage({ id: 'shareGroupDetail.invite', defaultMessage: '邀请好友拼团' })}
          </Button>
          <View className={classnames(styles.btn, styles['btn-default'])} onClick={handleJoinTeam}>
            {intl.formatMessage({ id: 'shareGroupDetail.joinTeam', defaultMessage: '立即参团' })}
          </View>
        </>
      )
    }
    if (status === SUCCESS) {
      return (
        <>
          <View className={classnames(styles.btn, styles['btn-success'])} onClick={handleViewOrder}>
            {intl.formatMessage({ id: 'shareGroupDetail.viewDetail', defaultMessage: '查看订单详情' })}
          </View>
          <View className={classnames(styles.btn, styles['btn-default'])} onClick={() => goToUrl('extra/mall/b2b')}>
            {intl.formatMessage({ id: 'shareGroupDetail.goHome', defaultMessage: '前往商城首页' })}
          </View>
        </>
      )
    }
    if (status === FAIL) {
      return (
        <>
          <View className={classnames(styles.btn, styles['btn-success'])} onClick={handleRelanch}>
            {intl.formatMessage({ id: 'shareGroupDetail.relauch', defaultMessage: '重新发起拼团' })}
          </View>
          <View className={classnames(styles.btn, styles['btn-default'])} onClick={() => goToUrl('extra/mall/b2b')}>
            {intl.formatMessage({ id: 'shareGroupDetail.goHome', defaultMessage: '前往商城首页' })}
          </View>
        </>
      )
    }
  }

  return (
    <View className={styles.container}>
      <View className={classnames(styles.status)}>{STATUS_TEXT[status]}</View>
      <View className={styles['status-tips']}>{renderText()}</View>

      <View className={styles['people-list']}>
        {newList.map((_item, index) => (
          <View className={styles['people-item']} key={index}>
            {index + 1 > itemList.length ? renderEmpty() : renderPeople(itemList[index])}
          </View>
        ))}
      </View>
      {renderFooter()}
    </View>
  )
}

export default InTeamPeople

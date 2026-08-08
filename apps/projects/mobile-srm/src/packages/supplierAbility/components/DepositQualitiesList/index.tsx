/*
 * @Description: 资质证明列表，受控组件
 */
import React, { useMemo } from 'react'
import { pxTransform, preload, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { themeLayout } from '@/constants/theme'
import Router from '@/utils/router'
import CollapseCard from '@/components/CollapseCard'
import Shuttle from '@/components/Shuttle'
import Empty from '@/components/Empty'
import CustomUpload from '../CustomUpload'
import './index.scss'

export type DepositQualitiesValueType = {
  /**
   * 文件地址
   */
  url: string
  /**
   * 文件名称
   */
  name: string
  /**
   * 到期日
   */
  expireDay?: string
  /**
   * 有效期
   */
  permanent?: number
  /**
   * 文件地址
   */
  lastUrl?: string
  /**
   * 文件名称
   */
  lastName?: string
  /**
   * 到期日
   */
  lastExpireDay?: string
  /**
   * 有效期
   */
  lastPermanent?: number
}[]

export interface DepositQualitiesListProps {
  /**
   * 值
   */
  value?: DepositQualitiesValueType
  /**
   * 资质证明改变触发事件
   */
  onChange?: (value: DepositQualitiesValueType) => void
  /**
   * 是否可编辑
   */
  editable?: boolean
  /**
   * 自定义渲染样式
   */
  customStyle?: React.CSSProperties
  /**
   * 是否展示 new，默认 false
   */
  showNew?: boolean
}

/**
 * 去掉 fileName 后边的 哈希值
 * @param fileName string
 */
function getFileName(fileName: string) {
  const [name, fileType] = fileName.split('.')
  if (name && name.length > 32) {
    return `${name.slice(0, name.length - 32 + 1)}.${fileType}`
  }
  return fileName
}

const DepositQualitiesList: React.FC<DepositQualitiesListProps> = (props: DepositQualitiesListProps) => {
  const { value, onChange, editable, customStyle, showNew } = props

  const params = getCurrentInstance().preloadData as any

  const handleJump = () => {
    preload({
      ...params,
      onConfirm: onChange,
      defaultValue: value?.map((item) => ({
        url: item.url,
        expireDay: item.expireDay,
        permanent: item.permanent === 1,
      })),
    })
    Router.navigateTo('supplierAbility/supplierDepositQualities/index')
  }

  const currentValue = useMemo(
    () =>
      value?.map((item) => {
        const isDeleteUrl = !item.url && item.lastUrl
        const atom = {
          name: item.name,
          url: item.url,
          permanent: item.permanent,
          expireDay: item.expireDay,
          isNewUrl: item.url && !item.lastUrl,
          isDeleteUrl,
        }
        if (isDeleteUrl) {
          atom.url = item.lastUrl!
          atom.permanent = item.lastPermanent
          atom.expireDay = item.lastExpireDay
        }
        return atom
      }),
    [value],
  )

  const lastValue = useMemo(
    () =>
      value
        ?.map((item) => ({
          name: item.lastName,
          url: item.lastUrl,
          permanent: item.lastPermanent,
          expireDay: item.lastExpireDay,
        }))
        .filter((item) => item.url),
    [value],
  )

  /**
   * 取出currentValue、lastValue一些字段，用于判断两个数组是否相等
   */
  const filterCurrentValue = useMemo(
    () =>
      currentValue?.map((val) => {
        const item = {
          name: val.name,
          url: val.url,
          permanent: val.permanent,
          expireDay: !val.permanent && val.expireDay,
        }
        return item
      }),
    [currentValue],
  )

  const filterLastValue = useMemo(
    () =>
      lastValue?.map((val) => {
        const item = {
          name: val.name,
          url: val.url,
          permanent: val.permanent,
          expireDay: !val.permanent && val.expireDay,
        }
        return item
      }),
    [lastValue],
  )

  return (
    <CollapseCard
      title="资质证明"
      extra={editable ? <Shuttle describe="添加证明" onJump={handleJump} /> : null}
      headStyle={{
        paddingRight: 0,
        paddingLeft: 0,
        marginRight: pxTransform(themeLayout['margin-s']),
        marginLeft: pxTransform(themeLayout['margin-s']),
      }}
      customContentStyle={{
        padding: 0,
      }}
      style={customStyle}
    >
      <View className="deposit-qualities-list">
        {showNew && currentValue?.length && JSON.stringify(filterCurrentValue) !== JSON.stringify(filterLastValue) && (
          <View className="deposit-qualities-active">(变更后)</View>
        )}
        {currentValue?.map((item, index) => (
          <View className="deposit-qualities-list-item" key={index}>
            {showNew && item.isNewUrl ? <View className="deposit-qualities-active">(新增)</View> : null}
            {showNew && item.isDeleteUrl ? <View className="deposit-qualities-active">(删除)</View> : null}
            <View
              className={classNames('deposit-qualities-list-item-content', {
                'deposit-qualities-list-item-content__delete': item.isDeleteUrl,
              })}
            >
              <View className="deposit-qualities-list-item-content-left">
                <View className="deposit-qualities-list-item-name">
                  {item.url ? getFileName(item.url.split('/').slice(-1)[0]) : ''}
                </View>
                <View className="deposit-qualities-list-item-date">
                  {item.permanent === 1 ? '长期有效' : `有效期：${item.expireDay}`}
                </View>
              </View>
              <View className="deposit-qualities-list-item-content-right">
                <CustomUpload value={item.url} disabled />
              </View>
            </View>
          </View>
        ))}
        {showNew && lastValue?.length && JSON.stringify(filterCurrentValue) !== JSON.stringify(filterLastValue) && (
          <View className="deposit-qualities-modify">
            <View className="deposit-qualities-modify-txt">(变更前)</View>
            {lastValue?.map((item, index) => (
              <View className="deposit-qualities-modify-list-item" key={index}>
                <View className="deposit-qualities-modify-list-item-content">
                  <View className="deposit-qualities-modify-list-item-content-left">
                    <View className="deposit-qualities-modify-list-item-name">
                      {item.url ? getFileName(item.url.split('/').slice(-1)[0]) : ''}
                    </View>
                    <View className="deposit-qualities-modify-list-item-date">
                      {item.permanent === 1 ? '长期有效' : `有效期：${item.expireDay}`}
                    </View>
                  </View>
                  <View className="deposit-qualities-modify-list-item-content-right">
                    <CustomUpload value={item.url} disabled />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        {!value || !value.length ? <Empty /> : null}
      </View>
    </CollapseCard>
  )
}

export default DepositQualitiesList

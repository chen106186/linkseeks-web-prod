import React from 'react'
import dayjs from 'dayjs'
import { Badge, Button, Dropdown, Space } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { RecordColumns } from '../../types'
import StatusAuthButton from '../../../AuthButton/StatusAuthButton'

interface RenderColumnItemProps {
  column: RecordColumns<any>
  value: any
  record: any
}
/**
 * 用来做一些特殊的column渲染
 */
const RenderColumnItem = (props: RenderColumnItemProps) => {
  const { column, value, record } = props
  const payload = column.formatPayload || {}
  const translate = useWebIntl()

  switch (column.format) {
    case 'Date': {
      return value
        ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        : translate('web.common.zanwushijian', { defaultMessage: '暂无时间' })
    }

    case 'Enabled': {
      /**
       * @param statusConfirm 因为状态通常是可点击的，那么这里是确认点击之后调用的方法，一般用于状态切换
       */
      const { statusConfirm } = payload
      return (
        <StatusAuthButton
          record={record}
          fieldNames="enabled"
          handleConfirm={() => statusConfirm && statusConfirm(record)}
        />
      )
    }

    case 'Control': {
      /**
       * @param controlList 按钮列表
       * @param hiddenBound 隐藏上限，默认是2，意味着当按钮列表出现2个以上的按钮，在2个之后的会被收纳到"更多"里面
       */
      const { controlList = [], hiddenBound = 2 } = payload
      const showControlList = controlList.filter((v) => (v.show ? v.show(record) : true))
      const hiddenLength = showControlList.length === hiddenBound + 1 ? hiddenBound + 1 : hiddenBound
      const visibleBtns = showControlList.slice(0, hiddenLength)
      const hiddenBtns = showControlList.slice(hiddenLength)

      const hiddenBtnItems = hiddenBtns
        .map((v) => {
          if (!v.show(record)) {
            return null
          }
          return {
            label: (
              <Button type="link-compact" {...v}>
                {v.children}
              </Button>
            ),
            key: v.key,
          }
        })
        .filter(Boolean)

      const handleDropdownClick = ({ key }) => {
        const btnConfig = hiddenBtns.find((v) => v.key === key)
        if (btnConfig?.onClick) {
          btnConfig.onClick(record)
        }
      }

      return (
        <Space>
          {visibleBtns.map((v) => {
            /**
             * @param show 由于按钮通常是需要被状态之类的参数控制是否显示，所以可以通过show字段控制, 默认会显示
             */
            const { show = () => true, onClick, ...buttonProps } = v
            const handleClick = (e) => {
              e.stopPropagation()
              onClick && onClick(record, e)
            }
            return show(record) ? <Button type="link-compact" {...buttonProps} onClick={handleClick} /> : null
          })}

          {hiddenBtns.length > 0 && hiddenBtnItems.length > 0 && (
            <Dropdown menu={{ items: hiddenBtnItems, onClick: handleDropdownClick }}>
              <Button type="link-compact">{translate('web.common.more', { defaultMessage: '更多' })}</Button>
            </Dropdown>
          )}
        </Space>
      )
    }

    case 'Status': {
      // colorField 颜色有时候不是和value一致，是其他字段，那么可以通过这个属性传递
      const { statusColors = [], statusLabels, colorField } = payload
      return (
        <Badge
          color={statusColors[colorField ? record[colorField] : value]}
          text={statusLabels ? statusLabels[value] : value}
        />
      )
    }
    default: {
      return value ?? ''
    }
  }
}

export default RenderColumnItem

import React, { Fragment, useEffect, useState, useRef } from 'react'
import { View, Text } from '@apps/mobile-ui'
import styles from './index.module.scss'

interface IProps {
  children: React.ReactElement
  options: {
    label: string
    visible: boolean
    onClick?: () => void
  }[]
}

const Popover: React.FC<IProps> = (props) => {
  const { children, options } = props
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const popoverRef = useRef<any>(null)

  const togglePopover = (e) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  const closePopover = (e) => {
    e.stopPropagation()
    setIsVisible(false)
  }

  return (
    <Fragment>
      {isVisible && <View className={styles['popover-mask']} onClick={closePopover} />}
      <View className={styles['popover-container']}>
        <View className={styles['popover-children']} onClick={togglePopover}>
          {children}
        </View>
        {isVisible && (
          <View className={styles['popover-content']} ref={popoverRef}>
            {options &&
              options.map(
                (optionsItem) =>
                  optionsItem.visible && (
                    <View
                      className={styles['popover-option-item']}
                      onClick={(e) => {
                        e.stopPropagation()
                        optionsItem.onClick?.()
                        togglePopover(e)
                      }}
                    >
                      {optionsItem.label}
                    </View>
                  ),
              )}
          </View>
        )}
      </View>
    </Fragment>
  )
}

export default Popover
